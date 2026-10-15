import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

router.use(requireAuth);

// GET all medications with completed dates
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const meds = await prisma.medication.findMany({
      where: { userId },
      include: { completions: true },
      orderBy: { createdAt: 'asc' }
    });

    const formatted = meds.map(m => ({
      id: m.id,
      name: m.name,
      dosage: m.dosage,
      time: m.time,
      repeat: m.repeatSchedule,
      notifications: m.notifications,
      completedDates: m.completions.map(c => c.completedDate.toISOString().split('T')[0])
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Database error fetching medications' });
  }
});

// ADD a new medication
router.post('/', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { name, dosage, time, repeat, notifications } = req.body;
  try {
    const created = await prisma.medication.create({
      data: {
        userId,
        name,
        dosage,
        time,
        repeatSchedule: repeat || 'Daily',
        notifications: notifications ?? true
      }
    });
    res.status(201).json({
      id: created.id,
      name: created.name,
      dosage: created.dosage,
      time: created.time,
      repeat: created.repeatSchedule,
      notifications: created.notifications,
      completedDates: []
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({ error: 'Failed to add medication' });
  }
});

// TOGGLE medication completion state for a date
router.post('/toggle', async (req: Request, res: Response) => {
  const { id, date } = req.body;
  const completedDateObj = new Date(date);
  try {
    const existing = await prisma.medicationCompletion.findUnique({
      where: {
        medicationId_completedDate: {
          medicationId: id,
          completedDate: completedDateObj
        }
      }
    });

    if (existing) {
      await prisma.medicationCompletion.delete({
        where: { id: existing.id }
      });
      res.json({ id, date, completed: false });
    } else {
      await prisma.medicationCompletion.create({
        data: {
          medicationId: id,
          completedDate: completedDateObj
        }
      });
      res.json({ id, date, completed: true });
    }
  } catch (error) {
    console.error('Error toggling medication:', error);
    res.status(500).json({ error: 'Failed to toggle medication state' });
  }
});

// UPDATE medication
router.put('/:id', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  const { name, dosage, time, repeat, notifications } = req.body;
  try {
    const existing = await prisma.medication.findFirst({
      where: { id, userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Medication not found or unauthorized' });
    }

    const updated = await prisma.medication.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(dosage !== undefined && { dosage }),
        ...(time !== undefined && { time }),
        ...(repeat !== undefined && { repeatSchedule: repeat }),
        ...(notifications !== undefined && { notifications })
      },
      include: { completions: true }
    });

    res.json({
      id: updated.id,
      name: updated.name,
      dosage: updated.dosage,
      time: updated.time,
      repeat: updated.repeatSchedule,
      notifications: updated.notifications,
      completedDates: updated.completions.map(c => c.completedDate.toISOString().split('T')[0])
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ error: 'Failed to update medication' });
  }
});

// DELETE medication
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  try {
    const existing = await prisma.medication.findFirst({
      where: { id, userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Medication not found or unauthorized' });
    }

    await prisma.medication.delete({
      where: { id }
    });

    res.json({ message: 'Medication deleted successfully', id });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ error: 'Failed to delete medication' });
  }
});

export default router;
