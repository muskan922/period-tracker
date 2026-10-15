import { Router, Request, Response } from 'express';
import { prisma } from '../db/db';
import { getUserIdFromReq } from '../utils/auth';
import { askFloraAI } from '../services/aiService';

const router = Router();

// POST /api/ai/chat
router.post('/chat', async (req: Request, res: Response) => {
  const { message, history, context } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  try {
    const userId = getUserIdFromReq(req);
    let userContext = context || {};

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (user) {
        userContext = {
          name: user.name,
          age: user.age,
          avgCycleLength: user.cycleLength,
          avgPeriodLength: user.periodLength,
          waterIntake: user.waterTarget,
          ...userContext
        };
      }
    }

    const aiResult = await askFloraAI(message.trim(), history || [], userContext);

    res.json({
      reply: aiResult.reply,
      source: aiResult.source,
      suggestedQuestions: aiResult.suggestedQuestions,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in Flora AI chat route:', error);
    res.status(500).json({ error: 'Failed to process AI response' });
  }
});

export default router;
