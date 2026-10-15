import type { CycleLog, UserProfile } from '../context/AppContext';

export interface PhaseInfo {
  name: 'Menstrual Phase' | 'Follicular Phase' | 'Ovulation Phase' | 'Luteal Phase';
  subtitle: string;
  emoji: string;
  day: number;
  colorClass: string;
  desc: string;
  phaseType: 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';
}

export interface DateRangeEstimate {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  label: string;     // e.g. "Oct 25 – Oct 28"
  daysRemaining?: number;
}

export interface FertileWindowEstimate {
  startDate: string;
  endDate: string;
  ovulationDate: string;
  label: string;
}

export interface CycleEngineResult {
  currentCycleDay: number;
  currentPhase: PhaseInfo;
  periodStartDate: string;
  periodEndDate: string;
  cycleLength: number;
  periodLength: number;
  averageCycleLength: number;
  averagePeriodLength: number;
  cycleVariability: number; // in days
  previousCycles: CycleLog[];
  nextPeriodEstimate: DateRangeEstimate;
  fertileWindowEstimate: FertileWindowEstimate;
}

// Helper to format Date to YYYY-MM-DD
export function formatDateYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to format Date Range to human string like "Oct 25 – Oct 28"
export function formatDateRangeLabel(startDateStr: string, endDateStr: string): string {
  try {
    const s = new Date(startDateStr + 'T00:00:00');
    const e = new Date(endDateStr + 'T00:00:00');
    const startMonth = s.toLocaleString('en-US', { month: 'short' });
    const endMonth = e.toLocaleString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${s.getDate()} – ${e.getDate()}`;
    }
    return `${startMonth} ${s.getDate()} – ${endMonth} ${e.getDate()}`;
  } catch {
    return `${startDateStr} – ${endDateStr}`;
  }
}

export function calculateCycleEngine(
  profile: Partial<UserProfile>,
  cyclesHistory: CycleLog[] = [],
  targetDateInput?: string | Date
): CycleEngineResult {
  const targetDate = targetDateInput
    ? typeof targetDateInput === 'string'
      ? new Date(targetDateInput + (targetDateInput.includes('T') ? '' : 'T00:00:00'))
      : targetDateInput
    : new Date();

  // 1. Determine sorted cycles (oldest to newest)
  const sortedCycles = [...cyclesHistory].sort(
    (a, b) => new Date(a.startDate + 'T00:00:00').getTime() - new Date(b.startDate + 'T00:00:00').getTime()
  );

  // 2. Calculate average cycle length & period duration from history
  let calculatedCycleLengthSum = 0;
  let cycleCount = 0;
  const cycleLengths: number[] = [];

  for (let i = 1; i < sortedCycles.length; i++) {
    const prevStart = new Date(sortedCycles[i - 1].startDate + 'T00:00:00').getTime();
    const currStart = new Date(sortedCycles[i].startDate + 'T00:00:00').getTime();
    const diffDays = Math.round((currStart - prevStart) / (1000 * 60 * 60 * 24));
    if (diffDays >= 15 && diffDays <= 60) {
      calculatedCycleLengthSum += diffDays;
      cycleLengths.push(diffDays);
      cycleCount++;
    }
  }

  const averageCycleLength = cycleCount > 0
    ? Math.round(calculatedCycleLengthSum / cycleCount)
    : profile.cycleLength || 28;

  // Calculate variability (standard deviation)
  let cycleVariability = 0;
  if (cycleLengths.length > 1) {
    const mean = averageCycleLength;
    const variance = cycleLengths.reduce((acc, len) => acc + Math.pow(len - mean, 2), 0) / cycleLengths.length;
    cycleVariability = Math.round(Math.sqrt(variance) * 10) / 10;
  }

  // Calculate average period duration
  let periodDurationSum = 0;
  let periodCount = 0;
  sortedCycles.forEach(c => {
    if (c.startDate && c.endDate) {
      const s = new Date(c.startDate + 'T00:00:00').getTime();
      const e = new Date(c.endDate + 'T00:00:00').getTime();
      const dur = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      if (dur >= 1 && dur <= 14) {
        periodDurationSum += dur;
        periodCount++;
      }
    }
  });

  const averagePeriodLength = periodCount > 0
    ? Math.round(periodDurationSum / periodCount)
    : profile.periodLength || 5;

  // 3. Determine the reference last period start date
  let lastStart = profile.lastPeriodStart
    ? new Date(profile.lastPeriodStart + (profile.lastPeriodStart.includes('T') ? '' : 'T00:00:00'))
    : new Date();

  // Find the most recent cycle start relative to targetDate
  const pastCycles = sortedCycles.filter(c => new Date(c.startDate + 'T00:00:00') <= targetDate);
  if (pastCycles.length > 0) {
    const mostRecent = pastCycles[pastCycles.length - 1];
    lastStart = new Date(mostRecent.startDate + 'T00:00:00');
  }

  // 4. Compute current cycle day
  const diffMs = targetDate.getTime() - lastStart.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let currentCycleDay = 1;
  if (diffDays >= 0) {
    currentCycleDay = (diffDays % averageCycleLength) + 1;
  } else {
    currentCycleDay = ((diffDays % averageCycleLength) + averageCycleLength) % averageCycleLength + 1;
  }

  // 5. Determine Current Phase dynamically from user's periodLength & cycleLength
  const ovulationDay = Math.max(12, Math.min(averageCycleLength - 14, Math.floor(averageCycleLength / 2)));
  let currentPhase: PhaseInfo;

  if (currentCycleDay <= averagePeriodLength) {
    currentPhase = {
      name: 'Menstrual Phase',
      subtitle: 'Rest & Replenish',
      emoji: '🩸',
      day: currentCycleDay,
      colorClass: 'bg-rose-100/90 text-rose-700 border-rose-300 dark:bg-rose-950/70 dark:text-rose-200 dark:border-rose-800/60',
      desc: 'Your period is active. Take rest, stay hydrated, and practice gentle self-care.',
      phaseType: 'Menstrual'
    };
  } else if (currentCycleDay <= ovulationDay - 2) {
    currentPhase = {
      name: 'Follicular Phase',
      subtitle: 'Energy & Fresh Focus',
      emoji: '🌱',
      day: currentCycleDay,
      colorClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-800/60',
      desc: 'Estrogen is steadily rising. Expect boosting energy levels, mental clarity, and creative drive.',
      phaseType: 'Follicular'
    };
  } else if (currentCycleDay <= ovulationDay + 1) {
    currentPhase = {
      name: 'Ovulation Phase',
      subtitle: 'Peak Radiance & Fertility',
      emoji: '🌸',
      day: currentCycleDay,
      colorClass: 'bg-amber-100/90 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-200 dark:border-amber-800/60',
      desc: 'Egg release window. Peak fertility, social confidence, and vitality.',
      phaseType: 'Ovulation'
    };
  } else {
    currentPhase = {
      name: 'Luteal Phase',
      subtitle: 'Cozy Reflection & Nurture',
      emoji: '🌙',
      day: currentCycleDay,
      colorClass: 'bg-purple-100/90 text-purple-800 border-purple-300 dark:bg-purple-950/70 dark:text-purple-200 dark:border-purple-800/60',
      desc: 'Progesterone peaks. Slow down, nourish your body with warm meals, and rest deeply.',
      phaseType: 'Luteal'
    };
  }

  // 6. Calculate Next Period Estimate dynamically
  const nextPeriodStartDateObj = new Date(lastStart.getTime() + (averageCycleLength * 24 * 60 * 60 * 1000));
  // If nextPeriodStart is already in the past relative to targetDate, advance by multiples of averageCycleLength
  while (nextPeriodStartDateObj <= targetDate) {
    nextPeriodStartDateObj.setDate(nextPeriodStartDateObj.getDate() + averageCycleLength);
  }

  const nextPeriodEndDateObj = new Date(nextPeriodStartDateObj.getTime() + ((averagePeriodLength - 1) * 24 * 60 * 60 * 1000));

  const nextPeriodStartStr = formatDateYMD(nextPeriodStartDateObj);
  const nextPeriodEndStr = formatDateYMD(nextPeriodEndDateObj);

  const daysRemaining = Math.ceil((nextPeriodStartDateObj.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));

  const nextPeriodEstimate: DateRangeEstimate = {
    startDate: nextPeriodStartStr,
    endDate: nextPeriodEndStr,
    label: formatDateRangeLabel(nextPeriodStartStr, nextPeriodEndStr),
    daysRemaining: Math.max(0, daysRemaining)
  };

  // 7. Calculate Fertile Window Estimate dynamically
  const ovulationDateObj = new Date(nextPeriodStartDateObj.getTime() - (14 * 24 * 60 * 60 * 1000));
  const fertileStartObj = new Date(ovulationDateObj.getTime() - (4 * 24 * 60 * 60 * 1000));
  const fertileEndObj = new Date(ovulationDateObj.getTime() + (1 * 24 * 60 * 60 * 1000));

  const fertileStartStr = formatDateYMD(fertileStartObj);
  const fertileEndStr = formatDateYMD(fertileEndObj);
  const ovulationStr = formatDateYMD(ovulationDateObj);

  const fertileWindowEstimate: FertileWindowEstimate = {
    startDate: fertileStartStr,
    endDate: fertileEndStr,
    ovulationDate: ovulationStr,
    label: formatDateRangeLabel(fertileStartStr, fertileEndStr)
  };

  const periodStartDate = formatDateYMD(lastStart);
  const periodEndDate = formatDateYMD(new Date(lastStart.getTime() + ((averagePeriodLength - 1) * 24 * 60 * 60 * 1000)));

  return {
    currentCycleDay,
    currentPhase,
    periodStartDate,
    periodEndDate,
    cycleLength: profile.cycleLength || 28,
    periodLength: profile.periodLength || 5,
    averageCycleLength,
    averagePeriodLength,
    cycleVariability,
    previousCycles: sortedCycles,
    nextPeriodEstimate,
    fertileWindowEstimate
  };
}
