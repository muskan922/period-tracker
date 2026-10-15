import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

router.use(requireAuth);

// GET all cycle logs for logged-in user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const cycles = await prisma.cycleLog.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' }
    });
    const formatted = cycles.map(c => ({
      id: c.id,
      startDate: c.startDate.toISOString().split('T')[0],
      endDate: c.endDate.toISOString().split('T')[0],
      flow: c.flow,
      pain: c.pain,
      symptoms: c.symptoms,
      notes: c.notes || ''
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching cycles:', error);
    res.status(500).json({ error: 'Database error fetching cycles' });
  }
});

// ADD a new cycle log for logged-in user
router.post('/', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { startDate, endDate, flow, pain, symptoms, notes } = req.body;
  try {
    const created = await prisma.cycleLog.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        flow: flow || 'Medium',
        pain: pain || 1,
        symptoms: symptoms || [],
        notes: notes || ''
      }
    });

    // Update user's lastPeriodStart if newer
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && (!user.lastPeriodStart || new Date(startDate) > user.lastPeriodStart)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastPeriodStart: new Date(startDate) }
      });
    }

    res.status(201).json({
      id: created.id,
      startDate: created.startDate.toISOString().split('T')[0],
      endDate: created.endDate.toISOString().split('T')[0],
      flow: created.flow,
      pain: created.pain,
      symptoms: created.symptoms,
      notes: created.notes
    });
  } catch (error) {
    console.error('Error adding cycle:', error);
    res.status(500).json({ error: 'Failed to save cycle log' });
  }
});

// DELETE a cycle log for logged-in user
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  try {
    await prisma.cycleLog.deleteMany({
      where: { id, userId }
    });
    res.json({ message: 'Cycle log deleted successfully', id });
  } catch (error) {
    console.error('Error deleting cycle:', error);
    res.status(500).json({ error: 'Failed to delete cycle log' });
  }
});

export default router;
