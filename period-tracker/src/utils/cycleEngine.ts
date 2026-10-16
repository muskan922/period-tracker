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

// Format Date to local YYYY-MM-DD string without timezone or DST drift
export function formatDateYMD(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse string or Date into a normalized local midnight Date object
export function parseDateOnly(dateInput?: string | Date): Date {
  if (!dateInput) {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  }
  if (dateInput instanceof Date) {
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate(), 0, 0, 0, 0);
  }
  const cleanStr = String(dateInput).split('T')[0];
  const parts = cleanStr.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  }
  const d = new Date(dateInput);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

// Compute difference in calendar days between two dates, immune to DST (23h / 25h) shifts
export function diffInDays(d1: Date, d2: Date): number {
  const u1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const u2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((u1 - u2) / (1000 * 60 * 60 * 24));
}

// Add calendar days to a Date object without DST hour degradation
export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  result.setDate(result.getDate() + days);
  return result;
}

// Format Date Range to human string like "Oct 25 – Oct 28"
export function formatDateRangeLabel(startDateStr: string, endDateStr: string): string {
  try {
    const s = parseDateOnly(startDateStr);
    const e = parseDateOnly(endDateStr);
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
  const targetDate = parseDateOnly(targetDateInput);

  // 1. Determine sorted cycles (oldest to newest)
  const sortedCycles = [...cyclesHistory].sort(
    (a, b) => parseDateOnly(a.startDate).getTime() - parseDateOnly(b.startDate).getTime()
  );

  // 2. Calculate average cycle length & period duration from history
  let calculatedCycleLengthSum = 0;
  let cycleCount = 0;
  const cycleLengths: number[] = [];

  for (let i = 1; i < sortedCycles.length; i++) {
    const prevStart = parseDateOnly(sortedCycles[i - 1].startDate);
    const currStart = parseDateOnly(sortedCycles[i].startDate);
    const diffDays = diffInDays(currStart, prevStart);
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
      const s = parseDateOnly(c.startDate);
      const e = parseDateOnly(c.endDate);
      const dur = diffInDays(e, s) + 1;
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
  let lastStart = parseDateOnly(profile.lastPeriodStart);

  // Find the most recent cycle start relative to targetDate
  const pastCycles = sortedCycles.filter(c => parseDateOnly(c.startDate) <= targetDate);
  if (pastCycles.length > 0) {
    const mostRecent = pastCycles[pastCycles.length - 1];
    lastStart = parseDateOnly(mostRecent.startDate);
  }

  // 4. Compute current cycle day (1-indexed)
  const diff = diffInDays(targetDate, lastStart);

  let currentCycleDay = 1;
  if (diff >= 0) {
    currentCycleDay = (diff % averageCycleLength) + 1;
  } else {
    currentCycleDay = ((diff % averageCycleLength) + averageCycleLength) % averageCycleLength + 1;
  }

  // 5. Determine Current Phase dynamically from user's periodLength & cycleLength
  // The luteal phase is typically ~14 days prior to menstruation
  const ovulationDay = Math.max(averagePeriodLength + 2, averageCycleLength - 14);
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
  let nextPeriodStartDateObj = addDays(lastStart, averageCycleLength);
  // If nextPeriodStart is already in the past relative to targetDate, advance by multiples of averageCycleLength
  while (nextPeriodStartDateObj <= targetDate) {
    nextPeriodStartDateObj = addDays(nextPeriodStartDateObj, averageCycleLength);
  }

  const nextPeriodEndDateObj = addDays(nextPeriodStartDateObj, averagePeriodLength - 1);

  const nextPeriodStartStr = formatDateYMD(nextPeriodStartDateObj);
  const nextPeriodEndStr = formatDateYMD(nextPeriodEndDateObj);

  const daysRemaining = Math.max(0, diffInDays(nextPeriodStartDateObj, targetDate));

  const nextPeriodEstimate: DateRangeEstimate = {
    startDate: nextPeriodStartStr,
    endDate: nextPeriodEndStr,
    label: formatDateRangeLabel(nextPeriodStartStr, nextPeriodEndStr),
    daysRemaining
  };

  // 7. Calculate Fertile Window Estimate dynamically (approx 5 days before ovulation to 1 day after)
  const ovulationDateObj = addDays(nextPeriodStartDateObj, -14);
  const fertileStartObj = addDays(ovulationDateObj, -4);
  const fertileEndObj = addDays(ovulationDateObj, 1);

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
  const periodEndDate = formatDateYMD(addDays(lastStart, averagePeriodLength - 1));

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

