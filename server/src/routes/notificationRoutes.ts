import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

router.use(requireAuth);

// GET all notifications for the user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    let notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Seed default notifications if user has none
    if (notifications.length === 0) {
      const defaultNotes = [
        { userId, text: 'AI Forecast: Your fertile window starts tomorrow. Stay hydrated 🌸', notificationType: 'ai', timeLabel: 'Luteal Phase', isRead: false },
        { userId, text: 'Reminder: Take Iron & Folic Acid pill at 08:30 AM.', notificationType: 'med', timeLabel: 'Luteal Phase', isRead: false },
        { userId, text: 'Dr. Evelyn Fontaine confirmed your appointment on Aug 3.', notificationType: 'app', timeLabel: 'Follicular Phase', isRead: true }
      ];

      for (const note of defaultNotes) {
        await prisma.notification.create({ data: note });
      }

      notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    }

    const formatted = notifications.map(n => ({
      id: n.id,
      text: n.text,
      type: n.notificationType,
      time: n.timeLabel,
      read: n.isRead,
      createdAt: n.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Database error fetching notifications' });
  }
});

// MARK ALL notifications as read
router.put('/read', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// CREATE a notification
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const { text, type, time } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Notification text is required' });
    }

    const created = await prisma.notification.create({
      data: {
        userId,
        text,
        notificationType: type || 'ai',
        timeLabel: time || 'Daily Update',
        isRead: false
      }
    });

    res.status(201).json({
      id: created.id,
      text: created.text,
      type: created.notificationType,
      time: created.timeLabel,
      read: created.isRead,
      createdAt: created.createdAt
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// DELETE a notification
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const { id } = req.params;

    await prisma.notification.deleteMany({
      where: { id, userId }
    });

    res.json({ message: 'Notification deleted', id });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
