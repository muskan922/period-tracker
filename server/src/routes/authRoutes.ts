import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { hashPassword, verifyPassword, generateToken, requireAuth } from '../utils/auth';

const router = Router();

function formatUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    age: user.age,
    cycleLength: user.cycleLength,
    periodLength: user.periodLength,
    lastPeriodStart: user.lastPeriodStart ? user.lastPeriodStart.toISOString().split('T')[0] : '2026-07-05',
    theme: user.theme,
    waterTarget: user.waterTarget,
    goals: ['Balance hormones naturally', 'Improve sleep quality', 'Log mood changes daily'],
    achievements: [
      { title: '10-Day Streak logged', date: '2026-07-20', icon: '✨' },
      { title: 'Hydration Target Met', date: '2026-07-25', icon: '💧' },
      { title: 'Perfect Sleep Cycle', date: '2026-07-27', icon: '🌙' }
    ],
    connectedDevices: ['Apple Watch', 'Apple Health'],
    notificationsEnabled: true
  };
}

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: 'insensitive'
        }
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      token,
      user: formatUser(user)
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// POST Signup
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Sanctuary Name is required' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: 'insensitive'
        }
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashPassword(password),
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        age: 26,
        cycleLength: 28,
        periodLength: 5,
        lastPeriodStart: new Date(),
        theme: 'vintage',
        waterTarget: 2500
      }
    });

    const token = generateToken({ id: newUser.id, email: newUser.email });

    res.status(201).json({
      message: 'Account created successfully',
      otpRequired: true,
      email: newUser.email,
      token,
      user: formatUser(newUser)
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

// POST Forgot Password
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: 'insensitive'
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    res.json({
      message: 'Passcode sent successfully',
      otpRequired: true,
      email: user.email
    });
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// POST Reset Password
router.post('/reset-password', async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: cleanEmail,
          mode: 'insensitive'
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashPassword(newPassword)
      }
    });

    const token = generateToken({ id: updatedUser.id, email: updatedUser.email });

    res.json({
      token,
      user: formatUser(updatedUser),
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// GET User Profile
router.get('/profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(formatUser(user));
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Database query error' });
  }
});

// UPDATE User Profile
router.put('/profile', requireAuth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { name, age, cycleLength, periodLength, lastPeriodStart, theme, waterTarget } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age }),
        ...(cycleLength !== undefined && { cycleLength }),
        ...(periodLength !== undefined && { periodLength }),
        ...(lastPeriodStart !== undefined && { lastPeriodStart: new Date(lastPeriodStart) }),
        ...(theme !== undefined && { theme }),
        ...(waterTarget !== undefined && { waterTarget }),
      }
    });

    res.json(formatUser(updated));
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
