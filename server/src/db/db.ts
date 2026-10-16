import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { hashPassword } from '../utils/auth';

dotenv.config();

export const prisma = new PrismaClient();

// Memory store fallback if needed
export const store = {
  users: [
    {
      id: 1,
      name: 'Emma Rose',
      email: 'emma@flora.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      age: 26,
      cycleLength: 28,
      periodLength: 5,
      lastPeriodStart: '2026-07-05',
      theme: 'vintage',
      waterTarget: 2500,
      goals: ['Balance hormones naturally', 'Improve sleep quality', 'Log mood changes daily'],
      achievements: [
        { title: '10-Day Streak logged', date: '2026-07-20', icon: '✨' },
        { title: 'Hydration Target Met', date: '2026-07-25', icon: '💧' },
        { title: 'Perfect Sleep Cycle', date: '2026-07-27', icon: '🌙' }
      ],
      connectedDevices: ['Apple Watch', 'Apple Health'],
      notificationsEnabled: true
    }
  ]
};

export async function initDatabase() {
  try {
    console.log('🌸 Connecting to PostgreSQL database via Prisma...');
    let emma = await prisma.user.findFirst({
      where: {
        email: {
          equals: 'emma@flora.com',
          mode: 'insensitive'
        }
      }
    });

    if (!emma) {
      console.log('🌱 Seeding demo user Emma Rose into PostgreSQL database...');
      emma = await prisma.user.create({
        data: {
          name: 'Emma Rose',
          email: 'emma@flora.com',
          passwordHash: hashPassword('flora123'),
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
          age: 26,
          cycleLength: 28,
          periodLength: 5,
          lastPeriodStart: new Date('2026-07-05'),
          theme: 'vintage',
          waterTarget: 2500
        }
      });

      // Seed sample cycle logs for Emma
      await prisma.cycleLog.createMany({
        data: [
          { userId: emma.id, startDate: new Date('2026-05-10'), endDate: new Date('2026-05-14'), flow: 'Medium', pain: 4, symptoms: ['Cramps', 'Headache'], notes: 'Normal cycle' },
          { userId: emma.id, startDate: new Date('2026-06-07'), endDate: new Date('2026-06-11'), flow: 'Heavy', pain: 6, symptoms: ['Cramps', 'Bloating', 'Fatigue'], notes: 'Heavy flow on day 2' },
          { userId: emma.id, startDate: new Date('2026-07-05'), endDate: new Date('2026-07-09'), flow: 'Medium', pain: 3, symptoms: ['Headache', 'Back Pain'], notes: 'Mild cramps' }
        ]
      });

      // Seed sample medications for Emma
      const med1 = await prisma.medication.create({
        data: { userId: emma.id, name: 'Iron & Folic Acid', dosage: '1 Capsule', time: '08:30 AM', repeatSchedule: 'Daily', notifications: true }
      });
      const med2 = await prisma.medication.create({
        data: { userId: emma.id, name: 'Evening Primrose Oil', dosage: '1000mg', time: '07:00 PM', repeatSchedule: 'Daily', notifications: true }
      });
      await prisma.medication.create({
        data: { userId: emma.id, name: 'Magnesium Bisglycinate', dosage: '200mg', time: '09:30 PM', repeatSchedule: 'Daily', notifications: false }
      });

      await prisma.medicationCompletion.createMany({
        data: [
          { medicationId: med1.id, completedDate: new Date('2026-07-27') },
          { medicationId: med1.id, completedDate: new Date('2026-07-28') },
          { medicationId: med2.id, completedDate: new Date('2026-07-27') }
        ]
      });
    } else if (emma.passwordHash === '$2a$10$abcdefghijklmnopqrstuv' || !emma.passwordHash.includes(':')) {
      await prisma.user.update({
        where: { id: emma.id },
        data: { passwordHash: hashPassword('flora123') }
      });
      console.log('✨ Updated demo user password hash to secure format.');
    }

    const postCount = await prisma.communityPost.count();
    if (postCount === 0) {
      // Seed sample community posts
      await prisma.communityPost.create({
        data: {
          id: 'p1',
          userId: emma.id,
          author: 'Wildflower_9',
          avatar: '🌸',
          title: 'Soothing Chamomile & Raspberry Leaf Tea Infusions',
          content: 'I have started drinking raspberry leaf tea exactly 5 days before my cycle begins, and it has reduced my pelvic cramps by at least half! Has anyone else tried this? I add a tiny bit of raw lavender honey and fresh mint leaves.',
          tags: ['Herbal Remedies', 'Cramp Relief', 'Self-Care'],
          likes: 42,
          liked: false,
          saved: true,
          timeAgo: '4 hours ago',
          comments: {
            create: [
              { id: 'c1', author: 'Lila_Bloom', avatar: '🍃', content: 'Yes! Raspberry leaf tea is a uterine tonic. Adding ginger also helps with period inflammation!', timeAgo: '2 hours ago' },
              { id: 'c2', author: 'TeaLover_2', avatar: '☕', content: 'Trying this tonight! Thanks for the tip, cramps have been tough this month.', timeAgo: '1 hour ago' }
            ]
          }
        }
      });
    }
    const notifCount = await prisma.notification.count({ where: { userId: emma.id } });
    if (notifCount === 0) {
      await prisma.notification.createMany({
        data: [
          { userId: emma.id, text: 'AI Forecast: Your fertile window starts tomorrow. Stay hydrated 🌸', notificationType: 'ai', timeLabel: 'Luteal Phase', isRead: false },
          { userId: emma.id, text: 'Reminder: Take Iron & Folic Acid pill at 08:30 AM.', notificationType: 'med', timeLabel: 'Luteal Phase', isRead: false },
          { userId: emma.id, text: 'Dr. Evelyn Fontaine confirmed your appointment on Aug 3.', notificationType: 'app', timeLabel: 'Follicular Phase', isRead: true }
        ]
      });
    }

    const apptCount = await prisma.appointment.count({ where: { userId: emma.id } });
    if (apptCount === 0) {
      await prisma.appointment.createMany({
        data: [
          { userId: emma.id, doctorName: 'Dr. Evelyn Fontaine', specialty: 'Holistic Gynecologist', appointmentDate: new Date('2026-08-03'), appointmentTime: '10:00 AM', notes: 'Discuss hormone blood test results & herbal cycle infusions.', synced: true },
          { userId: emma.id, doctorName: 'Dr. Sarah Lin', specialty: 'Endocrinologist', appointmentDate: new Date('2026-08-15'), appointmentTime: '02:30 PM', notes: 'Routine checkup for thyroid panel.', synced: false }
        ]
      });
    }

    console.log('✨ Prisma ORM initialized and connected successfully to PostgreSQL!');
  } catch (err: any) {
    console.warn('⚠️ Prisma DB initialization warning:', err.message);
  }
}


