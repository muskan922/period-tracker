import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

router.use(requireAuth);

// GET all mood logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const moods = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { logDate: 'desc' }
    });
    const formatted = moods.map(m => ({
      date: m.logDate.toISOString().split('T')[0],
      mood: m.mood,
      note: m.note || ''
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Database error fetching mood logs' });
  }
});

// UPSERT a mood log for a specific date
router.post('/', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { date, mood, note } = req.body;
  const logDateObj = new Date(date);
  try {
    const upserted = await prisma.moodLog.upsert({
      where: {
        userId_logDate: {
          userId,
          logDate: logDateObj
        }
      },
      update: {
        mood,
        note: note || ''
      },
      create: {
        userId,
        logDate: logDateObj,
        mood,
        note: note || ''
      }
    });

    res.status(201).json({
      date: upserted.logDate.toISOString().split('T')[0],
      mood: upserted.mood,
      note: upserted.note
    });
  } catch (error) {
    console.error('Error saving mood:', error);
    res.status(500).json({ error: 'Failed to save mood log' });
  }
});

export default router;
