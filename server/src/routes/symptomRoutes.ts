import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq, requireAuth } from '../utils/auth';

const router = Router();

router.use(requireAuth);

// GET all symptom logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromReq(req);
    const logs = await prisma.symptomLog.findMany({
      where: { userId },
      orderBy: { logDate: 'desc' }
    });
    const formatted = logs.map(l => ({
      date: l.logDate.toISOString().split('T')[0],
      cramps: l.cramps,
      bloating: l.bloating,
      headache: l.headache,
      acne: l.acne,
      backPain: l.backPain,
      waterIntake: l.waterIntake,
      sleepHours: l.sleepHours,
      weight: l.weight,
      exerciseMinutes: l.exerciseMinutes,
      energy: l.energy ?? 7,
      libido: l.libido ?? 3,
      journal: l.journal || undefined
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    res.status(500).json({ error: 'Database error fetching symptoms' });
  }
});

// UPSERT a daily symptom log
router.post('/', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { date, cramps, bloating, headache, acne, backPain, waterIntake, sleepHours, weight, exerciseMinutes, energy, libido, journal } = req.body;
  const logDateObj = new Date(date);
  try {
    const upserted = await prisma.symptomLog.upsert({
      where: {
        userId_logDate: {
          userId,
          logDate: logDateObj
        }
      },
      update: {
        ...(cramps !== undefined && { cramps }),
        ...(bloating !== undefined && { bloating }),
        ...(headache !== undefined && { headache }),
        ...(acne !== undefined && { acne }),
        ...(backPain !== undefined && { backPain }),
        ...(waterIntake !== undefined && { waterIntake }),
        ...(sleepHours !== undefined && { sleepHours }),
        ...(weight !== undefined && { weight }),
        ...(exerciseMinutes !== undefined && { exerciseMinutes }),
        ...(energy !== undefined && { energy }),
        ...(libido !== undefined && { libido }),
        ...(journal !== undefined && { journal }),
      },
      create: {
        userId,
        logDate: logDateObj,
        cramps: cramps || 0,
        bloating: bloating || 0,
        headache: headache || 0,
        acne: acne || 0,
        backPain: backPain || 0,
        waterIntake: waterIntake || 0,
        sleepHours: sleepHours || 7,
        weight: weight || 58.0,
        exerciseMinutes: exerciseMinutes || 0,
        energy: energy ?? 7,
        libido: libido ?? 3,
        journal: journal || null
      }
    });

    res.status(201).json({
      date: upserted.logDate.toISOString().split('T')[0],
      cramps: upserted.cramps,
      bloating: upserted.bloating,
      headache: upserted.headache,
      acne: upserted.acne,
      backPain: upserted.backPain,
      waterIntake: upserted.waterIntake,
      sleepHours: upserted.sleepHours,
      weight: upserted.weight,
      exerciseMinutes: upserted.exerciseMinutes,
      energy: upserted.energy ?? 7,
      libido: upserted.libido ?? 3,
      journal: upserted.journal || undefined
    });
  } catch (error) {
    console.error('Error saving symptom log:', error);
    res.status(500).json({ error: 'Failed to save symptom log' });
  }
});

// UPDATE Water Intake specifically
router.put('/water', async (req: Request, res: Response) => {
  const userId = getUserIdFromReq(req);
  const { date, amountMl } = req.body;
  const logDateObj = new Date(date);
  const waterAmount = Math.max(0, amountMl);
  try {
    const upserted = await prisma.symptomLog.upsert({
      where: {
        userId_logDate: {
          userId,
          logDate: logDateObj
        }
      },
      update: {
        waterIntake: waterAmount
      },
      create: {
        userId,
        logDate: logDateObj,
        waterIntake: waterAmount
      }
    });

    res.json({
      date: upserted.logDate.toISOString().split('T')[0],
      waterIntake: upserted.waterIntake
    });
  } catch (error) {
    console.error('Error updating water intake:', error);
    res.status(500).json({ error: 'Failed to update water intake' });
  }
});

export default router;
