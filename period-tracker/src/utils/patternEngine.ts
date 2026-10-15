import type { DailySymptomLog, MoodLog } from '../context/AppContext';
import type { CycleEngineResult } from './cycleEngine';

export interface PersonalBaseline {
  avgWaterIntake: number;      // ml
  avgSleepHours: number;       // hrs
  avgEnergyLevel: number;      // 1-10
  avgLibidoLevel: number;      // 1-5
  commonMoods: string[];
  commonSymptoms: string[];
  averageCycleLength: number;
  cycleVariability: number;
  totalDaysLogged: number;
}

export interface PersonalInsight {
  id: string;
  category: 'water' | 'sleep' | 'energy' | 'mood' | 'cycle' | 'symptom' | 'libido';
  title: string;
  description: string;
  icon?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  description: string;
  actionHint?: string;
}

export function calculatePersonalBaseline(
  symptomLogs: DailySymptomLog[] = [],
  moodLogs: MoodLog[] = [],
  cycleEngine: CycleEngineResult
): PersonalBaseline {
  const totalDaysLogged = symptomLogs.length;

  if (totalDaysLogged === 0) {
    return {
      avgWaterIntake: 2000,
      avgSleepHours: 7.5,
      avgEnergyLevel: 7,
      avgLibidoLevel: 3,
      commonMoods: ['Calm', 'Happy'],
      commonSymptoms: ['Cramps', 'Headache'],
      averageCycleLength: cycleEngine.averageCycleLength,
      cycleVariability: cycleEngine.cycleVariability,
      totalDaysLogged: 0
    };
  }

  // Calculate averages
  const waterSum = symptomLogs.reduce((acc, l) => acc + (l.waterIntake || 0), 0);
  const sleepSum = symptomLogs.reduce((acc, l) => acc + (l.sleepHours || 0), 0);
  const energySum = symptomLogs.reduce((acc, l) => acc + (l.energy ?? 7), 0);
  const libidoSum = symptomLogs.reduce((acc, l) => acc + (l.libido ?? 3), 0);

  const avgWaterIntake = Math.round(waterSum / totalDaysLogged);
  const avgSleepHours = Math.round((sleepSum / totalDaysLogged) * 10) / 10;
  const avgEnergyLevel = Math.round((energySum / totalDaysLogged) * 10) / 10;
  const avgLibidoLevel = Math.round((libidoSum / totalDaysLogged) * 10) / 10;

  // Most frequent moods
  const moodCounts: Record<string, number> = {};
  moodLogs.forEach(m => {
    if (m.mood) {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    }
  });
  const commonMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);

  // Most frequent symptoms
  const symptomCounts: Record<string, number> = {};
  symptomLogs.forEach(l => {
    if (l.cramps > 0) symptomCounts['Cramps'] = (symptomCounts['Cramps'] || 0) + 1;
    if (l.bloating > 0) symptomCounts['Bloating'] = (symptomCounts['Bloating'] || 0) + 1;
    if (l.headache > 0) symptomCounts['Headache'] = (symptomCounts['Headache'] || 0) + 1;
    if (l.acne > 0) symptomCounts['Acne'] = (symptomCounts['Acne'] || 0) + 1;
    if (l.backPain > 0) symptomCounts['Back Pain'] = (symptomCounts['Back Pain'] || 0) + 1;
  });
  const commonSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(e => e[0]);

  return {
    avgWaterIntake,
    avgSleepHours,
    avgEnergyLevel,
    avgLibidoLevel,
    commonMoods: commonMoods.length > 0 ? commonMoods : ['Calm'],
    commonSymptoms: commonSymptoms.length > 0 ? commonSymptoms : ['Cramps'],
    averageCycleLength: cycleEngine.averageCycleLength,
    cycleVariability: cycleEngine.cycleVariability,
    totalDaysLogged
  };
}

export function generatePatternInsights(
  symptomLogs: DailySymptomLog[] = [],
  moodLogs: MoodLog[] = [],
  baseline: PersonalBaseline,
  cycleEngine: CycleEngineResult,
  targetDateStr: string = new Date().toISOString().split('T')[0]
): PersonalInsight[] {
  const insights: PersonalInsight[] = [];

  // Fallback for sparse data
  if (symptomLogs.length < 3) {
    return [
      {
        id: 'ins-sparse',
        category: 'cycle',
        title: 'Building Your Pattern Profile',
        description: 'Keep tracking for a few more days to discover your personal patterns.',
        icon: '✨'
      }
    ];
  }

  const todayLog = symptomLogs.find(s => s.date === targetDateStr) || symptomLogs[0];

  // 1. Water Intake Insight
  if (todayLog && todayLog.waterIntake > 0 && baseline.avgWaterIntake > 0) {
    const diffPct = Math.round(((todayLog.waterIntake - baseline.avgWaterIntake) / baseline.avgWaterIntake) * 100);
    if (diffPct < -15) {
      insights.push({
        id: 'ins-water-low',
        category: 'water',
        title: 'Hydration Level Below Average',
        description: `Today's water intake (${todayLog.waterIntake}ml) is ${Math.abs(diffPct)}% below your recent personal average of ${baseline.avgWaterIntake}ml.`,
        icon: '💧'
      });
    } else if (diffPct > 15) {
      insights.push({
        id: 'ins-water-high',
        category: 'water',
        title: 'Strong Hydration Today',
        description: `Your water intake today is ${diffPct}% higher than your personal average of ${baseline.avgWaterIntake}ml.`,
        icon: '💧'
      });
    }
  }

  // 2. Sleep ↔ Energy Correlation Insight
  const shortSleepLowEnergyDays = symptomLogs.filter(
    s => s.sleepHours > 0 && s.sleepHours < baseline.avgSleepHours - 0.5 && (s.energy ?? 5) < baseline.avgEnergyLevel
  );

  if (shortSleepLowEnergyDays.length >= 2) {
    insights.push({
      id: 'ins-sleep-energy',
      category: 'sleep',
      title: 'Sleep & Energy Connection',
      description: 'Your data shows a pattern where lower energy ratings often occurred on days following shorter sleep than your usual average.',
      icon: '😴'
    });
  } else if (todayLog && todayLog.sleepHours > 0 && todayLog.sleepHours < baseline.avgSleepHours) {
    insights.push({
      id: 'ins-sleep-today',
      category: 'sleep',
      title: 'Sleep Duration',
      description: `Your sleep (${todayLog.sleepHours} hrs) was shorter than your recent average of ${baseline.avgSleepHours} hrs.`,
      icon: '🌙'
    });
  }

  // 3. Water ↔ Energy Correlation Insight
  const lowWaterLowEnergyDays = symptomLogs.filter(
    s => s.waterIntake > 0 && s.waterIntake < baseline.avgWaterIntake * 0.8 && (s.energy ?? 5) < baseline.avgEnergyLevel
  );

  if (lowWaterLowEnergyDays.length >= 2) {
    insights.push({
      id: 'ins-water-energy',
      category: 'water',
      title: 'Hydration & Vitality Pattern',
      description: 'On some days with lower-than-usual hydration, you also reported lower energy or increased tiredness.',
      icon: '⚡'
    });
  }

  // 4. Cycle Phase Pattern Insight
  const phase = cycleEngine.currentPhase;
  if (phase.phaseType === 'Luteal') {
    insights.push({
      id: 'ins-phase-luteal',
      category: 'cycle',
      title: 'Luteal Phase Rhythm',
      description: 'You have reported quieter energy levels more frequently during this phase in recent cycles.',
      icon: '🌸'
    });
  } else if (phase.phaseType === 'Menstrual') {
    insights.push({
      id: 'ins-phase-menstrual',
      category: 'cycle',
      title: 'Menstrual Renewal',
      description: 'Rest and fluid intake frequently align with your body\'s natural comfort during period days.',
      icon: '🩸'
    });
  } else if (phase.phaseType === 'Ovulation') {
    insights.push({
      id: 'ins-phase-ovulation',
      category: 'cycle',
      title: 'Ovulatory Peak Window',
      description: 'Your logged entries frequently reflect peak energy and positive mood ratings around this fertile window.',
      icon: '✨'
    });
  }

  // 5. Symptom Pattern Insight
  const headacheDays = symptomLogs.filter(s => s.headache > 0);
  if (headacheDays.length >= 2) {
    insights.push({
      id: 'ins-symptom-headache',
      category: 'symptom',
      title: 'Symptom Recurring Timing',
      description: 'Headaches have appeared around similar cycle days in several recent entries.',
      icon: '🤕'
    });
  }

  // 6. Energy Trend Insight
  const recent3Logs = symptomLogs.slice(0, 3);
  const recentEnergyAvg = recent3Logs.reduce((acc, l) => acc + (l.energy ?? 5), 0) / (recent3Logs.length || 1);
  if (recentEnergyAvg < baseline.avgEnergyLevel - 1) {
    insights.push({
      id: 'ins-energy-low-week',
      category: 'energy',
      title: 'Weekly Energy Trend',
      description: 'Your energy ratings have been lower than your usual average over recent days.',
      icon: '⚡'
    });
  }

  // 7. Water ↔ Mood Correlation Insight
  const lowWaterLowMoodDays = symptomLogs.filter(s => {
    const m = moodLogs.find(ml => ml.date === s.date);
    return s.waterIntake > 0 && s.waterIntake < baseline.avgWaterIntake * 0.8 && m && (m.mood === 'Sad' || m.mood === 'Tired' || m.mood === 'Anxious' || m.mood === 'Angry');
  });
  if (lowWaterLowMoodDays.length >= 2) {
    insights.push({
      id: 'ins-water-mood',
      category: 'water',
      title: 'Hydration & Mood Pattern',
      description: 'On some days with lower-than-usual hydration, you also reported lower mood or increased irritability.',
      icon: '💧'
    });
  }

  // 8. Sleep ↔ Mood Correlation Insight
  const shortSleepLowMoodDays = symptomLogs.filter(s => {
    const m = moodLogs.find(ml => ml.date === s.date);
    return s.sleepHours > 0 && s.sleepHours < baseline.avgSleepHours - 0.5 && m && (m.mood === 'Tired' || m.mood === 'Sad' || m.mood === 'Anxious');
  });
  if (shortSleepLowMoodDays.length >= 2) {
    insights.push({
      id: 'ins-sleep-mood',
      category: 'sleep',
      title: 'Sleep & Mood Pattern',
      description: 'Your data shows a pattern where lower mood or feeling tired frequently occurred after nights with shorter sleep.',
      icon: '😴'
    });
  }

  // 9. Libido ↔ Cycle / Energy Rhythm Insight
  const highLibidoDays = symptomLogs.filter(s => (s.libido ?? 3) >= 4);
  if (highLibidoDays.length >= 2) {
    insights.push({
      id: 'ins-libido-pattern',
      category: 'libido',
      title: 'Libido & Rhythms',
      description: 'Higher libido ratings frequently coincided with higher energy days in your logged entries.',
      icon: '✨'
    });
  }

  return insights;
}

export function generateSmartRecommendations(
  symptomLogs: DailySymptomLog[] = [],
  baseline: PersonalBaseline,
  cycleEngine: CycleEngineResult,
  targetDateStr: string = new Date().toISOString().split('T')[0]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const todayLog = symptomLogs.find(s => s.date === targetDateStr) || symptomLogs[0];
  const phase = cycleEngine.currentPhase;

  // 1. Sleep + Energy Recommendation
  if (todayLog && (todayLog.sleepHours < baseline.avgSleepHours || (todayLog.energy ?? 5) < 5)) {
    recommendations.push({
      id: 'rec-rest',
      title: 'Prioritize Soothing Rest',
      category: 'Sleep & Recovery',
      description: 'Your logged sleep or energy is below your usual baseline today. Consider an early evening unwind and gentle stretches.',
      actionHint: 'Target 7.5+ hours tonight'
    });
  }

  // 2. Hydration Recommendation
  if (todayLog && todayLog.waterIntake < baseline.avgWaterIntake * 0.8) {
    recommendations.push({
      id: 'rec-water',
      title: 'Hydration Refresh',
      category: 'Hydration Target',
      description: `Today's water intake is trailing your personal average of ${baseline.avgWaterIntake}ml. Sip warm herbal infusions or water.`,
      actionHint: `Goal: ${baseline.avgWaterIntake}ml`
    });
  }

  // 3. Cycle Phase Recommendation
  if (phase.phaseType === 'Luteal') {
    recommendations.push({
      id: 'rec-luteal-nourish',
      title: 'Luteal Phase Self-Care',
      category: 'Cycle Syncing',
      description: 'Progesterone levels call for complex carbohydrates, magnesium-rich snacks, and calming evening routines.',
      actionHint: 'Magnesium & herbal tea'
    });
  } else if (phase.phaseType === 'Menstrual') {
    recommendations.push({
      id: 'rec-menstrual-rest',
      title: 'Menstrual Replenishment',
      category: 'Period Care',
      description: 'Focus on warm foods, iron-rich nutrition, and gentle pelvic warmth.',
      actionHint: 'Warm compress & chamomile'
    });
  } else if (phase.phaseType === 'Follicular' || phase.phaseType === 'Ovulation') {
    recommendations.push({
      id: 'rec-vitality',
      title: 'Harness Rising Energy',
      category: 'Vitality Focus',
      description: 'Estrogen levels support fresh projects, active movement, and vibrant social interactions.',
      actionHint: 'Fresh vegetables & active workouts'
    });
  }

  return recommendations;
}
