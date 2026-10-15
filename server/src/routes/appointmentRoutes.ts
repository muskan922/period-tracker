import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

router.use(requireAuth);

// GET all appointments
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const apps = await prisma.appointment.findMany({
      where: { userId },
      orderBy: { appointmentDate: 'asc' }
    });
    const formatted = apps.map(a => ({
      id: a.id,
      doctorName: a.doctorName,
      specialty: a.specialty,
      date: a.appointmentDate.toISOString().split('T')[0],
      time: a.appointmentTime,
      notes: a.notes || '',
      synced: a.synced
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Database error fetching appointments' });
  }
});

// ADD appointment
router.post('/', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { doctorName, specialty, date, time, notes } = req.body;
  try {
    const created = await prisma.appointment.create({
      data: {
        userId,
        doctorName,
        specialty,
        appointmentDate: new Date(date),
        appointmentTime: time,
        notes: notes || '',
        synced: true
      }
    });

    res.status(201).json({
      id: created.id,
      doctorName: created.doctorName,
      specialty: created.specialty,
      date: created.appointmentDate.toISOString().split('T')[0],
      time: created.appointmentTime,
      notes: created.notes,
      synced: created.synced
    });
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).json({ error: 'Failed to add appointment' });
  }
});

// UPDATE appointment
router.put('/:id', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  const { doctorName, specialty, date, time, notes, synced } = req.body;
  try {
    const existing = await prisma.appointment.findFirst({
      where: { id, userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found or unauthorized' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(doctorName !== undefined && { doctorName }),
        ...(specialty !== undefined && { specialty }),
        ...(date !== undefined && { appointmentDate: new Date(date) }),
        ...(time !== undefined && { appointmentTime: time }),
        ...(notes !== undefined && { notes }),
        ...(synced !== undefined && { synced })
      }
    });

    res.json({
      id: updated.id,
      doctorName: updated.doctorName,
      specialty: updated.specialty,
      date: updated.appointmentDate.toISOString().split('T')[0],
      time: updated.appointmentTime,
      notes: updated.notes,
      synced: updated.synced
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// DELETE appointment
router.delete('/:id', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { id } = req.params;
  try {
    const existing = await prisma.appointment.findFirst({
      where: { id, userId }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found or unauthorized' });
    }

    await prisma.appointment.delete({
      where: { id }
    });

    res.json({ message: 'Appointment deleted successfully', id });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
