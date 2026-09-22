import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  Target,
  Sparkles,
  GlassWater,
  Award,
  AlertCircle,
  Clock,
  Heart,
  Moon,
  Zap,
  Activity,
  Info,
  TrendingUp,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

export const HydrationWellnessModule: React.FC = () => {
  const { profile, symptoms, updateWaterIntake, setWaterTarget } = useApp();

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Personalization: Target water intake in ML (default 2000ml if not set)
  const userTargetMl = profile.waterTarget && profile.waterTarget > 0 ? profile.waterTarget : 2000;
  const userTargetL = userTargetMl / 1000;

  // Custom Target State
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [customTargetInput, setCustomTargetInput] = useState<string>('');
  const [customAddInput, setCustomAddInput] = useState<string>('');

  // Selected date log
  const todayLog = symptoms.find(s => s.date === selectedDate);
  const currentWaterMl = todayLog ? todayLog.waterIntake : 0;
  const currentWaterL = currentWaterMl / 1000;

  // Calculate Hydration Score capped at 100%
  const rawScore = (currentWaterMl / userTargetMl) * 100;
  const hydrationScore = Math.min(100, Math.round(rawScore));

  // Remaining water to goal
  const remainingMl = Math.max(0, userTargetMl - currentWaterMl);
  const remainingL = (remainingMl / 1000).toFixed(2);

  // Vessels count
  const glassesConsumed = (currentWaterMl / 250).toFixed(1);
  const glassesGoal = Math.round(userTargetMl / 250);
  const bottlesConsumed = (currentWaterMl / 500).toFixed(1);
  const bottlesGoal = (userTargetMl / 500).toFixed(1);

  // Status breakdown based on requirements:
  // 0–39% → Low
  // 40–69% → Moderate
  // 70–89% → Good
  // 90–100% → Well Hydrated
  const getHydrationStatus = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Well Hydrated',
        badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40',
        ringColor: '#10b981',
        barGradient: ['#34d399', '#059669'],
        icon: Award,
        desc: 'Optimal hydration levels reached! Outstanding effort.'
      };
    } else if (score >= 70) {
      return {
        label: 'Good',
        badgeBg: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/40',
        ringColor: '#0ea5e9',
        barGradient: ['#38bdf8', '#0284c7'],
        icon: Droplet,
        desc: 'Solid hydration status. You are close to your optimal daily target!'
      };
    } else if (score >= 40) {
      return {
        label: 'Moderate',
        badgeBg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/40',
        ringColor: '#f59e0b',
        barGradient: ['#fbbf24', '#d97706'],
        icon: AlertCircle,
        desc: 'Moderate intake. Drink another bottle to keep your energy balanced.'
      };
    } else {
      return {
        label: 'Low',
        badgeBg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40',
        ringColor: '#f43f5e',
        barGradient: ['#f87171', '#dc2626'],
        icon: AlertCircle,
        desc: 'Hydration is low. Drink water soon to prevent cramps & head fog.'
      };
    }
  };

  const currentStatus = getHydrationStatus(hydrationScore);

  // Handlers for logging
  const handleAddWater = (amountMl: number) => {
    const newAmount = Math.max(0, currentWaterMl + amountMl);
    updateWaterIntake(selectedDate, newAmount);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const valInMl = parseInt(customAddInput, 10);
    if (!isNaN(valInMl) && valInMl > 0) {
      handleAddWater(valInMl);
      setCustomAddInput('');
    }
  };

  const handleSaveCustomTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const valInL = parseFloat(customTargetInput);
    if (!isNaN(valInL) && valInL > 0) {
      setWaterTarget(Math.round(valInL * 1000));
      setCustomTargetInput('');
      setIsEditingTarget(false);
    }
  };

  // Prepare 7-Day History Chart Data
  const last7DaysData = React.useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const foundLog = symptoms.find(s => s.date === dateStr);
      const waterMl = foundLog ? foundLog.waterIntake : 0;
      const waterL = parseFloat((waterMl / 1000).toFixed(2));
      const score = Math.min(100, Math.round((waterMl / userTargetMl) * 100));

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      data.push({
        date: dateStr,
        day: dayName,
        waterL,
        waterMl,
        score,
        status: getHydrationStatus(score).label
      });
    }
    return data;
  }, [symptoms, userTargetMl]);

  // Calculate 7-day average & consistency
  const avg7DayMl = Math.round(
    last7DaysData.reduce((acc, curr) => acc + curr.waterMl, 0) / 7
  );
  const avg7DayL = (avg7DayMl / 1000).toFixed(2);
  const isConsistentWeek = last7DaysData.filter(d => d.score >= 70).length >= 5;

  // Derive Menstrual Cycle Phase from profile lastPeriodStart and cycleLength
  const cycleInfo = React.useMemo(() => {
    const lastStart = new Date(profile.lastPeriodStart);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastStart.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) % (profile.cycleLength || 28);
    const currentDay = diffDays + 1;

    let phase = 'Follicular Phase';
    let phaseDesc = 'Estrogen is rising. Hydration supports metabolic vitality & cellular skin glow.';
    let recommendation = 'Aim for 2.0L - 2.5L water with citrus infusions.';

    if (currentDay <= (profile.periodLength || 5)) {
      phase = 'Menstrual Phase (Period)';
      phaseDesc = 'Uterine lining shedding occurs. Fluid loss is high.';
      recommendation = 'Hydrate frequently with warm electrolyte drinks to reduce pelvic cramps.';
    } else if (currentDay >= 12 && currentDay <= 16) {
      phase = 'Ovulatory Phase';
      phaseDesc = 'Peak fertility & LH surge. Cervical fluid production requires high hydration.';
      recommendation = 'Keep water close to optimize body temperature regulation and stamina.';
    } else if (currentDay > 16) {
      phase = 'Luteal Phase';
      phaseDesc = 'Progesterone increases water retention and bloating.';
      recommendation = 'Drinking steady water acts as a natural diuretic to reduce bloating and PMS headaches.';
    }

    return { currentDay, phase, phaseDesc, recommendation };
  }, [profile.lastPeriodStart, profile.cycleLength, profile.periodLength]);

  // Multi-Variable Correlation Inputs (Water + Sleep + Energy + Libido + Symptoms + Cycle History)
  const [sleepHours, setSleepHours] = useState<number>(todayLog?.sleepHours || 7.5);
  const [energyLevel, setEnergyLevel] = useState<'High' | 'Moderate' | 'Low'>('Moderate');
  const [libidoLevel, setLibidoLevel] = useState<'Normal' | 'High' | 'Low'>('Normal');
  const [crampSeverity, setCrampSeverity] = useState<number>(todayLog?.cramps || 2);

  // Generate General Wellness Insights based on multi-variable state
  const wellnessInsights = React.useMemo(() => {
    const insights: string[] = [];

    // Hydration specific relative insight
    if (isConsistentWeek) {
      insights.push("Your hydration has been consistent this week.");
    } else if (currentWaterMl < avg7DayMl * 0.8) {
      insights.push("Your hydration is lower than your usual level today.");
    } else {
      insights.push("Hydration is holding steady near your average daily baseline.");
    }

    // Period / Phase related insight
    if (cycleInfo.phase.includes('Menstrual')) {
      insights.push("Staying hydrated may support overall comfort during your period.");
    } else if (cycleInfo.phase.includes('Luteal')) {
      insights.push("Adequate fluid intake during your Luteal phase helps flush excess sodium and ease bloating.");
    } else {
      insights.push("Maintaining baseline hydration supports natural energy levels and skin cell elasticity.");
    }

    // Sleep + Hydration + Energy correlation
    if (sleepHours < 7 && currentWaterMl < userTargetMl * 0.7) {
      insights.push("Combining lower sleep with low water intake can worsen pre-period fatigue. Consider an early glass of water and rest.");
    } else if (sleepHours >= 7.5 && hydrationScore >= 70) {
      insights.push("Great synergy: Your solid sleep duration combined with good hydration optimizes cellular recovery.");
    }

    // Symptom connection (Cramps/Bloating)
    if (crampSeverity > 3) {
      insights.push("Warm herbal teas or electrolyte water can soothe uterine tissue contractions.");
    }

    return insights;
  }, [isConsistentWeek, currentWaterMl, avg7DayMl, cycleInfo.phase, sleepHours, userTargetMl, hydrationScore, crampSeverity]);

  // SVG Circular Gauge calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (hydrationScore / 100) * circumference;

  return (
    <section className="space-y-8 animate-fadeIn pt-4 font-body">
      {/* Module Title Banner */}
      <div className="relative overflow-hidden rounded-premium-2xl p-6 md:p-8 bg-gradient-to-r from-sky-600/10 via-indigo-500/10 to-purple-600/10 border border-sky-300/40 dark:border-sky-800/40 glass-card">
        <div className="absolute top-0 right-0 p-6 opacity-15 pointer-events-none">
          <Droplet className="w-36 h-36 text-sky-500 animate-pulse" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Menstrual Wellness & Hydration Tracker
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-darkText tracking-wide">
              Hydration & Wellness Dashboard 💧
            </h2>
            <p className="text-vintageText text-xs md:text-sm leading-relaxed">
              Track daily hydration percentage, calculate your personal hydration score, set custom daily targets, and explore how water intake supports overall cycle wellness.
            </p>
          </div>

          {/* Quick Target Settings Action */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => setIsEditingTarget(!isEditingTarget)}
              className="px-4 py-2.5 rounded-full bg-sky-600 text-white font-semibold text-xs shadow-soft-glow hover:bg-sky-700 transition-all flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              <span>Goal: {userTargetL.toFixed(1)} L / day</span>
              <Edit3 className="w-3 h-3 opacity-80" />
            </button>
          </div>
        </div>

        {/* Custom Target Chooser Dropdown */}
        {isEditingTarget && (
          <div className="mt-6 p-5 rounded-premium-xl bg-white/90 dark:bg-slate-900/90 border border-sky-300 shadow-xl space-y-4 animate-slideDown">
            <div className="flex justify-between items-center">
              <h4 className="font-heading text-sm font-bold text-darkText flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-500" />
                Customize Daily Water Goal (Liters)
              </h4>
              <button
                onClick={() => setIsEditingTarget(false)}
                className="text-xs text-vintageText hover:text-darkText"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {[1.5, 2.0, 2.2, 2.5, 3.0, 3.5].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    setWaterTarget(Math.round(val * 1000));
                    setIsEditingTarget(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                    Math.abs(val - userTargetL) < 0.05
                      ? 'bg-sky-500 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                      : 'bg-cream/40 dark:bg-slate-800/80 text-darkText border-sky-200 dark:border-slate-700 hover:border-sky-400'
                  }`}
                >
                  {val.toFixed(1)} L ({val * 1000} ml)
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveCustomTarget} className="flex items-center gap-3 pt-2">
              <span className="text-xs font-semibold text-darkText">Custom Target:</span>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="10"
                placeholder="e.g. 2.8"
                value={customTargetInput}
                onChange={e => setCustomTargetInput(e.target.value)}
                className="w-28 px-3 py-1.5 rounded-lg border border-sky-300 text-xs bg-white dark:bg-slate-800 text-darkText focus:ring-2 focus:ring-sky-400"
              />
              <span className="text-xs text-vintageText">Liters</span>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-colors"
              >
                Save
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Main Grid: Hydration Score & Gauges (Left) + Reminders & Quick Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Circular Progress Indicator & Score Dashboard */}
        <div className="lg:col-span-7 glass-card rounded-premium-xl p-6 space-y-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-borderPink/40">
            <div>
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                Daily Tracker & Score
              </span>
              <h3 className="font-heading text-lg font-bold text-darkText flex items-center gap-2">
                <GlassWater className="w-5 h-5 text-sky-500" />
                Today's Water Intake Overview
              </h3>
            </div>

            {/* Date Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(getTodayString())}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  selectedDate === getTodayString()
                    ? 'bg-sky-500 text-white shadow-soft-glow'
                    : 'bg-secondary/40 text-vintageText hover:bg-secondary/70'
                }`}
              >
                Today
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-borderPink/60 text-darkText cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            {/* SVG Circular Progress Gauge */}
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {/* Background Track */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="text-slate-200 dark:text-slate-800"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  {/* Animated Progress Ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={currentStatus.ringColor}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                  <span className="font-heading text-3xl font-extrabold text-darkText tracking-tight">
                    {hydrationScore}%
                  </span>
                  <span className="text-[10px] font-bold text-vintageText uppercase tracking-wider mt-0.5">
                    Hydration Score
                  </span>
                  <div className={`mt-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${currentStatus.badgeBg}`}>
                    {currentStatus.label}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-vintageText text-center mt-3 max-w-xs leading-tight">
                {currentStatus.desc}
              </p>
            </div>

            {/* Consumed Stats Breakdown */}
            <div className="space-y-4 bg-sky-50/50 dark:bg-slate-800/40 p-4 rounded-premium-lg border border-sky-100 dark:border-slate-800">
              {/* Consumed / Target */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-vintageText font-medium">Consumed Water</span>
                <span className="font-heading text-lg font-bold text-sky-600 dark:text-sky-400">
                  {currentWaterL.toFixed(2)} / {userTargetL.toFixed(1)} L
                </span>
              </div>

              {/* Remaining */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-vintageText font-medium">Remaining to Goal</span>
                <span className="text-xs font-bold text-darkText">
                  {remainingMl === 0 ? 'Goal Met! 🎉' : `${remainingL} L (${remainingMl} ml)`}
                </span>
              </div>

              {/* Glasses & Bottles counter */}
              <div className="pt-2 border-t border-sky-200/50 dark:border-slate-700/50 grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-sky-100 dark:border-slate-800">
                  <span className="text-base block select-none">🥛</span>
                  <span className="font-heading font-bold text-sm text-darkText">{glassesConsumed}</span>
                  <span className="text-[10px] text-vintageText block">/ {glassesGoal} glasses (250ml)</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-sky-100 dark:border-slate-800">
                  <span className="text-base block select-none">🍾</span>
                  <span className="font-heading font-bold text-sm text-darkText">{bottlesConsumed}</span>
                  <span className="text-[10px] text-vintageText block">/ {bottlesGoal} bottles (500ml)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Add Buttons Section */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-vintageText uppercase tracking-wider block">
              Quick Log Actions
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => handleAddWater(250)}
                className="p-3 rounded-premium-md border border-sky-200 dark:border-sky-800/60 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all text-center group"
              >
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300 block">+250 ml</span>
                <span className="text-[10px] text-vintageText block mt-0.5">🥛 Glass</span>
              </button>

              <button
                onClick={() => handleAddWater(500)}
                className="p-3 rounded-premium-md border border-sky-200 dark:border-sky-800/60 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-all text-center group"
              >
                <span className="text-xs font-bold text-sky-700 dark:text-sky-300 block">+500 ml</span>
                <span className="text-[10px] text-vintageText block mt-0.5">🍾 Bottle</span>
              </button>

              <button
                onClick={() => handleAddWater(-250)}
                className="p-3 rounded-premium-md border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all text-center group"
              >
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">-250 ml</span>
                <span className="text-[10px] text-vintageText block mt-0.5">↩ Adjust</span>
              </button>
            </div>

            {/* Custom ML Input */}
            <form onSubmit={handleCustomAdd} className="flex items-center gap-2 pt-1">
              <input
                type="number"
                step="50"
                min="1"
                placeholder="Custom amount (e.g. 350 ml)"
                value={customAddInput}
                onChange={e => setCustomAddInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-sky-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-800 text-darkText focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 text-white rounded-lg text-xs font-semibold hover:bg-sky-700 transition-colors shrink-0"
              >
                + Add Custom
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): 7-Day History Chart & Hydration Reminders */}
        <div className="lg:col-span-5 glass-card rounded-premium-xl p-6 space-y-6 flex flex-col justify-between">
          {/* 7-Day History Bar Chart */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-heading text-base font-bold text-darkText flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-sky-500" />
                7-Day Hydration History
              </h4>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                Avg: {avg7DayL} L / day
              </span>
            </div>

            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, Math.max(3.5, userTargetL + 0.5)]} />
                  <Tooltip
                    formatter={(value: any) => [`${value} Liters`, 'Water Consumed']}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <ReferenceLine y={userTargetL} stroke="#38bdf8" strokeDasharray="3 3" label={{ value: 'Goal', fill: '#0284c7', fontSize: 10, position: 'insideTopRight' }} />
                  <Bar dataKey="waterL" radius={[4, 4, 0, 0]}>
                    {last7DaysData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.waterL >= userTargetL ? '#10b981' : entry.waterL >= userTargetL * 0.7 ? '#38bdf8' : '#f43f5e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hydration Status Summary Table / Cards */}
          <div className="p-3.5 rounded-premium-lg bg-sky-50/60 dark:bg-slate-800/50 border border-sky-200/50 dark:border-slate-700/50 space-y-2">
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Hydration Status Thresholds
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-vintageText">0–39%:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-vintageText">40–69%:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span className="text-vintageText">70–89%:</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">Good</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-vintageText">90–100%:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Well Hydrated</span>
              </div>
            </div>
          </div>

          {/* Small Hydration Reminders */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-darkText flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-500" />
              Smart Hydration Reminders & Tips
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 text-purple-900 dark:text-purple-200 flex items-start gap-2.5">
                <span className="text-base select-none">🌅</span>
                <div>
                  <strong className="block font-semibold">Morning Kickstart:</strong>
                  Drink 1 glass (250ml) of warm water right upon waking to rehydrate your tissues.
                </div>
              </div>

              <div className="p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/50 text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
                <span className="text-base select-none">🍵</span>
                <div>
                  <strong className="block font-semibold">Cramp Relief Infusion:</strong>
                  Warm Chamomile or Ginger infusion supports muscle relaxation during menstrual cramps.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menstrual-Cycle Connection & Multi-Variable Wellness Section */}
      <div className="glass-card rounded-premium-2xl p-6 md:p-8 space-y-6 bg-gradient-to-b from-purple-50/40 via-sky-50/20 to-pink-50/30 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/60 border border-purple-200/50 dark:border-purple-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-purple-200/40 dark:border-purple-800/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              Menstrual Wellness Matrix
            </div>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-darkText mt-1">
              Hydration & Menstrual Wellness Correlation
            </h3>
            <p className="text-xs md:text-sm text-vintageText">
              Analyzing how <strong className="text-sky-600 dark:text-sky-400">Water Intake</strong> works alongside <strong className="text-purple-600 dark:text-purple-400">Sleep, Energy, Libido, Symptoms & Cycle History</strong> for holistic balance.
            </p>
          </div>

          {/* Current Cycle Phase Badge */}
          <div className="p-3 rounded-premium-lg bg-white dark:bg-slate-800 shadow-sm border border-purple-200 dark:border-purple-800 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-vintageText block">Current Cycle Phase</span>
            <span className="font-heading font-bold text-sm text-purple-700 dark:text-purple-300 block">
              {cycleInfo.phase} (Day {cycleInfo.currentDay})
            </span>
          </div>
        </div>

        {/* Multi-Variable Input & Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Water Intake */}
          <div className="p-4 rounded-premium-lg bg-white/80 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5" /> Water Intake
              </span>
              <span className="font-semibold text-darkText">{currentWaterL.toFixed(2)} L</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div style={{ width: `${hydrationScore}%` }} className="h-full bg-sky-500 rounded-full"></div>
            </div>
            <p className="text-[10px] text-vintageText">Target: {userTargetL.toFixed(1)} L / day</p>
          </div>

          {/* Sleep */}
          <div className="p-4 rounded-premium-lg bg-white/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5" /> Sleep Duration
              </span>
              <span className="font-semibold text-darkText">{sleepHours} hrs</span>
            </div>
            <input
              type="range"
              min="4"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={e => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5"
            />
            <p className="text-[10px] text-vintageText">Optimal: 7.5 - 9.0 hrs</p>
          </div>

          {/* Energy */}
          <div className="p-4 rounded-premium-lg bg-white/80 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Energy Level
              </span>
              <span className="font-semibold text-darkText">{energyLevel}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['Low', 'Moderate', 'High'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setEnergyLevel(lvl)}
                  className={`py-1 text-[10px] font-bold rounded ${
                    energyLevel === lvl
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-vintageText'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Libido */}
          <div className="p-4 rounded-premium-lg bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> Libido Level
              </span>
              <span className="font-semibold text-darkText">{libidoLevel}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['Low', 'Normal', 'High'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLibidoLevel(lvl)}
                  className={`py-1 text-[10px] font-bold rounded ${
                    libidoLevel === lvl
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-vintageText'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms */}
          <div className="p-4 rounded-premium-lg bg-white/80 dark:bg-slate-800/80 border border-purple-200 dark:border-slate-700 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" /> Cramps / Bloat
              </span>
              <span className="font-semibold text-darkText">{crampSeverity}/10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={crampSeverity}
              onChange={e => setCrampSeverity(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 cursor-pointer h-1.5"
            />
            <p className="text-[10px] text-vintageText">Adjust severity slider</p>
          </div>
        </div>

        {/* Combined General Wellness Insights Box */}
        <div className="p-5 rounded-premium-xl bg-white/90 dark:bg-slate-800/90 border-2 border-purple-300/60 dark:border-purple-700/60 shadow-md space-y-3">
          <h4 className="font-heading text-sm font-bold text-purple-950 dark:text-purple-200 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-purple-500 animate-pulse" />
            General Wellness Insights
          </h4>

          <div className="space-y-2.5">
            {wellnessInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-darkText">
                <span className="text-sky-500 text-base leading-none select-none">💧</span>
                <p className="leading-relaxed font-medium">"{insight}"</p>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-purple-100 dark:border-slate-700 flex items-start gap-2 text-[11px] text-vintageText italic">
            <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <p>
              <strong>Scientific Note:</strong> Water intake is a supporting lifestyle factor for comfort, energy, and bloating relief. Hydration score does NOT predict exact period start dates or alter biological cycle timing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
