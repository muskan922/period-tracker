import { GoogleGenAI } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UserHealthContext {
  name?: string;
  age?: number;
  currentCycleDay?: number;
  currentPhase?: string;
  avgCycleLength?: number;
  avgPeriodLength?: number;
  recentSymptoms?: string[];
  waterIntake?: number;
  sleepHours?: number;
}

// Fallback intelligent clinical responses when API key is not yet set
function getFallbackResponse(query: string, ctx?: UserHealthContext): { reply: string; suggestedQuestions: string[] } {
  const q = query.toLowerCase();
  const phase = ctx?.currentPhase || 'Luteal Phase';
  const day = ctx?.currentCycleDay || 22;
  const name = ctx?.name || 'Sanctuary Member';

  if (q.includes('cramp') || q.includes('pain') || q.includes('period pain')) {
    return {
      reply: `Dearest ${name}, pelvic cramps are primarily triggered by prostaglandins—hormone-like lipids that stimulate the uterine muscles to contract during your cycle.\n\nHere are gentle, holistic remedies proven to soothe pelvic cramps:\n1. 🍵 **Herbal Infusions:** Raspberry leaf tea acts as a natural uterine tonic, while warm ginger-chamomile tea helps suppress prostaglandins.\n2. 🌾 **Magnesium & Heat:** Apply a warm castor oil pack or hot water bottle to your lower abdomen. Taking 200–300mg of Magnesium Bisglycinate helps relax contracted muscle fibers.\n3. 🧘 **Restorative Postures:** Spend 10 minutes in Reclined Goddess Pose (Supta Baddha Konasana) or Child's Pose with a pillow under your hips.\n\n*Gentle Note: If your pain is debilitating or prevents daily activities, consider booking a consult with Dr. Evelyn in the Consultations tab to screen for conditions like endometriosis.*`,
      suggestedQuestions: [
        'Which teas work best for uterine cramps?',
        'Does magnesium help with period cramps?',
        'When should I see a doctor about pelvic pain?'
      ]
    };
  }

  if (q.includes('delay') || q.includes('late') || q.includes('irregular') || q.includes('missed')) {
    return {
      reply: `Hello ${name}. A delayed or irregular cycle can feel unsettling, but it is very common and usually a reflection of your body responding to acute environmental shifts.\n\nCommon reasons for a delayed cycle include:\n• **Elevated Cortisol (Stress):** High stress delays or suppresses the LH surge required for ovulation. If ovulation is delayed, your period shifts accordingly.\n• **Recent Illness or Travel:** Circadian rhythm shifts disrupt the hypothalamic-pituitary-ovarian (HPO) axis.\n• **Nutritional Shifts:** Sudden calorie restriction or intense exercise can trigger anovulatory cycles.\n• **Hormonal Imbalance (PCOS/Thyroid):** If cycles consistently fluctuate beyond 35 days.\n\n*Recommendation:* Track your morning basal body temperature and rest. If you are sexually active and more than 5 days late, taking a gentle home test or scheduling a telehealth checkup brings peace of mind.`,
      suggestedQuestions: [
        'How many days of delay is considered normal?',
        'Can stress alone cause a missed period?',
        'What symptoms indicate PCOS?'
      ]
    };
  }

  if (q.includes('luteal') || q.includes('pms') || q.includes('mood') || q.includes('anxious') || q.includes('irritab')) {
    return {
      reply: `Welcome to honoring your Luteal Phase, ${name} (Days 15–28).\n\nDuring this phase, progesterone rises and then drops just before your period, which temporarily dips serotonin levels in the brain. This is why you may experience mood sensitivity, desire for solitude, and cravings.\n\n**Sanctuary Guidance for PMS & Luteal Wellness:**\n• 🥑 **Complex Carbohydrates:** Sweet potatoes, brown rice, and oats boost serotonin production naturally.\n• 🌻 **Seed Cycling:** Incorporate 1 tbsp of ground sunflower seeds and sesame seeds daily to support healthy progesterone clearance.\n• 🕯️ **Slow Down:** This is your biological autumn. Reduce high-intensity workouts in favor of gentle pilates, yin yoga, and journaling in your Sanctuary Mood Journal.\n• 💧 **Hydration Target:** Drink at least 2,200ml of water to reduce pre-period fluid retention.`,
      suggestedQuestions: [
        'How does seed cycling work for PMS?',
        'What foods boost progesterone naturally?',
        'Why do I feel more tired before my period?'
      ]
    };
  }

  if (q.includes('ovulat') || q.includes('fertile') || q.includes('discharge') || q.includes('pregnant')) {
    return {
      reply: `Your Ovulation Window is the biological summer of your cycle, ${name}.\n\nAround Day 14 (for a typical 28-day cycle), Estrogen peaks, triggering a surge in Luteinizing Hormone (LH) that releases an egg.\n\n**Signs of Peak Fertility to Note in Your Logger:**\n• 🌸 **Cervical Fluid:** Clear, stretchy 'egg-white' cervical mucus.\n• ⚡ **Energy & Libido:** Highest natural vitality, confidence, and social energy of the month.\n• 🌡️ **Basal Temperature:** A slight temperature dip followed by a sustained 0.3°–0.5°C rise post-ovulation.\n\n*Whether you are tracking to conceive or syncing your creative work with high-energy phases, this is your body's peak vitality window!*`,
      suggestedQuestions: [
        'How long does the fertile window last?',
        'What is egg-white cervical mucus?',
        'How does basal body temperature confirm ovulation?'
      ]
    };
  }

  if (q.includes('food') || q.includes('diet') || q.includes('eat') || q.includes('seed cycling') || q.includes('tea')) {
    return {
      reply: `Hormonal nutrition is one of the most powerful gifts you can offer your body, ${name}.\n\n**Phase-Based Cycle Syncing Diet:**\n1. **Menstrual Phase (Days 1–5):** Warm, iron-rich comfort foods. Bone broth, lentils, beets, dark chocolate, and ginger tea.\n2. **Follicular Phase (Days 6–12):** Light, fresh, probiotic-rich meals. Sauerkraut, avocados, pumpkin & flax seeds (1 tbsp each daily).\n3. **Ovulatory Phase (Days 13–16):** Anti-inflammatory fiber and cruciferous vegetables (broccoli, Brussels sprouts) to assist the liver in metabolizing excess estrogen.\n4. **Luteal Phase (Days 17–28):** Magnesium-rich pumpkin seeds, sunflower seeds, leafy greens, and chamomile infusions.\n\nWould you like a customized grocery list for your current ${phase}?`,
      suggestedQuestions: [
        'Give me a grocery list for the Luteal phase',
        'How do I start seed cycling?',
        'What herbal infusions reduce bloating?'
      ]
    };
  }

  // Default comforting sanctuary response
  return {
    reply: `Hello ${name}. I am Flora, your holistic wellness companion. I can help you understand your cycle biology, decode symptoms, and synchronize your nutrition and rest.\n\nBased on your profile, you are currently around Day ${day} of your cycle (${phase}).\n\nHow is your body feeling today? You can ask me about cramp relief, hormonal nutrition, PMS mood fluctuations, or cycle predictions.`,
    suggestedQuestions: [
      'How can I naturally soothe period cramps?',
      'Why does my mood change before my period?',
      'What should I eat during my current cycle phase?',
      'How does sleep affect cycle regularity?'
    ]
  };
}

export async function askFloraAI(
  userPrompt: string,
  history: ChatMessage[] = [],
  context?: UserHealthContext
): Promise<{ reply: string; source: 'gemini' | 'knowledge-base'; suggestedQuestions: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const phase = context?.currentPhase || 'Luteal Phase';
      const day = context?.currentCycleDay || 22;
      const userName = context?.name || 'Sanctuary Member';

      const systemInstruction = `You are Flora, a gentle, compassionate, and highly knowledgeable holistic women's health and menstrual cycle AI guide inside the 'Flora Period Tracker & Sanctuary' application.
The member speaking to you is ${userName}.
Her current cycle status: Day ${day} of her menstrual cycle (${phase}).
Average cycle length: ${context?.avgCycleLength || 28} days.
Average period length: ${context?.avgPeriodLength || 5} days.
Baseline daily sleep: ${context?.sleepHours || 7.5} hours.
Baseline hydration: ${context?.waterIntake || 2500} ml.

Voice and Tone Guidelines:
- Soothing, elegant, vintage-botanical and deeply respectful of feminine biology.
- Evidence-based yet holistic (discuss hormones like estrogen and progesterone, nutrition like seed cycling and herbal infusions, and nervous system regulation).
- Keep explanations structured with bullet points or numbered tips when helpful.
- Provide a gentle, supportive clinical disclaimer when questions involve severe pain or medical emergencies.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      const replyText = response.text || '';
      if (replyText.trim()) {
        return {
          reply: replyText.trim(),
          source: 'gemini',
          suggestedQuestions: [
            'How can I support my hormones this week?',
            'What teas help with period bloating?',
            'Can you explain my cycle phase in more detail?'
          ]
        };
      }
    } catch (err: any) {
      console.warn('⚠️ Gemini API call failed or timed out, falling back to clinical engine:', err.message);
    }
  }

  // Fallback to rich, customized clinical engine
  const fallback = getFallbackResponse(userPrompt, context);
  return {
    ...fallback,
    source: 'knowledge-base'
  };
}
