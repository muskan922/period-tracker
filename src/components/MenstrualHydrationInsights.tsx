import React from 'react';
import { Heart, Sparkles, Droplet, Moon, Zap, Activity, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MenstrualHydrationInsightsProps {
  selectedDate: string;
}

export const MenstrualHydrationInsights: React.FC<MenstrualHydrationInsightsProps> = ({ selectedDate }) => {
  const { profile, symptoms } = useApp();

  const targetMl = profile.waterTarget && profile.waterTarget > 0 ? profile.waterTarget : 2000;
  const targetL = targetMl / 1000;

  const currentLog = symptoms.find(s => s.date === selectedDate);
  const currentWaterMl = currentLog ? currentLog.waterIntake : 0;
  const currentWaterL = currentWaterMl / 1000;

  // Calculate last 7 days average
  const last7DaysLogs = React.useMemo(() => {
    const today = new Date(selectedDate);
    const logs = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = symptoms.find(s => s.date === dateStr);
      if (found) logs.push(found);
    }
    return logs;
  }, [symptoms, selectedDate]);

  const avg7DayMl = last7DaysLogs.length > 0
    ? Math.round(last7DaysLogs.reduce((a, b) => a + b.waterIntake, 0) / last7DaysLogs.length)
    : 0;

  // Determine Menstrual Cycle Phase
  const cycleInfo = React.useMemo(() => {
    const lastStart = new Date(profile.lastPeriodStart);
    const targetDate = new Date(selectedDate);
    const diffTime = Math.abs(targetDate.getTime() - lastStart.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) % (profile.cycleLength || 28);
    const currentDay = diffDays + 1;

    let phase = 'Follicular Phase';
    if (currentDay <= (profile.periodLength || 5)) {
      phase = 'Menstrual Phase (Period)';
    } else if (currentDay >= 12 && currentDay <= 16) {
      phase = 'Ovulatory Phase';
    } else if (currentDay > 16) {
      phase = 'Luteal Phase';
    }

    return { currentDay, phase };
  }, [profile.lastPeriodStart, profile.cycleLength, profile.periodLength, selectedDate]);

  // Generate Pattern-based General Insights
  const insights = React.useMemo(() => {
    const list: string[] = [];

    // Consistency check
    const consistentDays = last7DaysLogs.filter(l => l.waterIntake >= targetMl * 0.75).length;
    if (consistentDays >= 5) {
      list.push("Your hydration has been consistent during this cycle.");
    } else if (currentWaterMl < avg7DayMl * 0.85 && avg7DayMl > 0) {
      list.push("Your water intake is lower than your usual level today.");
    } else {
      list.push("Hydration is holding steady near your average daily baseline.");
    }

    // Phase-based insight
    if (cycleInfo.phase.includes('Menstrual')) {
      list.push("Staying hydrated may support overall comfort during your period.");
    } else if (cycleInfo.phase.includes('Luteal')) {
      list.push("Drinking adequate water during your Luteal phase helps ease progesterone-related water retention & bloating.");
    } else {
      list.push("Maintaining consistent water intake supports stamina and joint fluid elasticity throughout your follicular window.");
    }

    // Sleep + Symptoms insight
    const sleep = currentLog?.sleepHours || 7.5;
    if (sleep >= 7.5 && currentWaterMl >= targetMl * 0.7) {
      list.push("Great balance: Combining optimal sleep with good hydration promotes natural hormone detoxification.");
    } else if (sleep < 7 && currentWaterMl < targetMl * 0.7) {
      list.push("Lower sleep paired with light water intake can increase pre-period fatigue.");
    }

    return list;
  }, [last7DaysLogs, targetMl, currentWaterMl, avg7DayMl, cycleInfo.phase, currentLog]);

  return (
    <div className="glass-card rounded-premium-xl p-6 md:p-8 space-y-5 bg-gradient-to-b from-primary/20 via-secondary/30 to-cream/30 border border-borderPink/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderPink/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/40 text-darkText text-xs font-bold mb-1 border border-borderPink/60">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Cycle Connection & Wellness Matrix
          </div>
          <h3 className="font-heading text-xl font-bold text-darkText">
            Hydration & Menstrual Wellness Patterns 🌸
          </h3>
          <p className="text-xs text-vintageText">
            Connecting water intake data with sleep, energy, symptoms & cycle history for holistic lifestyle insights.
          </p>
        </div>

        <div className="px-3 py-2 rounded-premium-lg bg-white/90 border border-borderPink/60 shrink-0 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-vintageText block">Cycle Phase</span>
          <span className="font-heading font-bold text-xs text-darkText block">
            {cycleInfo.phase} (Day {cycleInfo.currentDay})
          </span>
        </div>
      </div>

      {/* Multi-variable lifestyle snapshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-white/90 border border-borderPink/60 space-y-1 shadow-sm">
          <span className="text-vintageText flex items-center gap-1 text-[11px]">
            <Droplet className="w-3.5 h-3.5 text-accent" /> Water Consumed
          </span>
          <span className="font-heading font-bold text-darkText block">{currentWaterL.toFixed(2)} / {targetL.toFixed(1)} L</span>
        </div>

        <div className="p-3 rounded-lg bg-white/90 border border-borderPink/60 space-y-1 shadow-sm">
          <span className="text-vintageText flex items-center gap-1 text-[11px]">
            <Moon className="w-3.5 h-3.5 text-rosegold" /> Sleep Logged
          </span>
          <span className="font-heading font-bold text-darkText block">{currentLog?.sleepHours || 7.5} Hours</span>
        </div>

        <div className="p-3 rounded-lg bg-white/90 border border-borderPink/60 space-y-1 shadow-sm">
          <span className="text-vintageText flex items-center gap-1 text-[11px]">
            <Zap className="w-3.5 h-3.5 text-warning" /> Vitals Logged
          </span>
          <span className="font-heading font-bold text-darkText block">{currentLog?.exerciseMinutes || 30} mins active</span>
        </div>

        <div className="p-3 rounded-lg bg-white/90 border border-borderPink/60 space-y-1 shadow-sm">
          <span className="text-vintageText flex items-center gap-1 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-rose-500" /> Cramp Severity
          </span>
          <span className="font-heading font-bold text-darkText block">{currentLog?.cramps || 0} / 10</span>
        </div>
      </div>

      {/* Wellness Insights Output */}
      <div className="p-4 rounded-premium-lg bg-white/95 border border-borderPink/60 space-y-2.5 shadow-sm">
        <h4 className="text-xs font-bold text-darkText flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent" />
          General Wellness Insights
        </h4>

        <div className="space-y-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-darkText">
              <span className="text-accent font-bold select-none">•</span>
              <p className="leading-relaxed font-medium">"{insight}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 text-[11px] text-vintageText italic pt-1">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <p>
          <strong>Scientific Note:</strong> Water intake is a supporting lifestyle factor for body comfort, energy, and bloating relief. Hydration score does NOT predict exact period start dates or alter biological cycle timing.
        </p>
      </div>
    </div>
  );
};
