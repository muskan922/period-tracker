import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Hydration7DayChart } from '../components/Hydration7DayChart';
import { MenstrualHydrationInsights } from '../components/MenstrualHydrationInsights';
import { HydrationSmartReminderCard } from '../components/HydrationSmartReminderCard';
import {
  Droplet,
  Minus,
  Calendar,
  Target,
  Award,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Edit3,
  Check,
  GlassWater,
  X,
  PartyPopper,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const WaterTracker: React.FC = () => {
  const { profile, symptoms, updateWaterIntake, setWaterTarget } = useApp();

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const hasUserChosenTarget = Boolean(profile.waterTarget && profile.waterTarget > 0);
  const [isEditingTarget, setIsEditingTarget] = useState(!hasUserChosenTarget);
  const [customTargetInput, setCustomTargetInput] = useState<string>('');
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [editingRowDate, setEditingRowDate] = useState<string | null>(null);
  const [editingRowAmount, setEditingRowAmount] = useState<string>('');
  const [historyFilter, setHistoryFilter] = useState<'30days' | '7days' | 'achieved'>('30days');
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [hasDismissedCongrats, setHasDismissedCongrats] = useState<Record<string, boolean>>({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(7);

  const targetMl = profile.waterTarget && profile.waterTarget > 0 ? profile.waterTarget : 2000;
  const targetLiters = (targetMl / 1000).toFixed(1);

  // Find symptom log for selected date
  const selectedLog = symptoms.find(s => s.date === selectedDate);
  const currentWaterMl = selectedLog ? selectedLog.waterIntake : 0;
  const currentWaterLiters = (currentWaterMl / 1000).toFixed(2);

  // Remaining calculation
  const remainingMl = Math.max(0, targetMl - currentWaterMl);
  const remainingLiters = (remainingMl / 1000).toFixed(2);

  const rawProgressPercent = hasUserChosenTarget ? Math.round((currentWaterMl / targetMl) * 100) : 0;
  const progressPercent = Math.min(100, rawProgressPercent);

  // Check if target is achieved for selected date and show congrats modal
  useEffect(() => {
    if (hasUserChosenTarget && rawProgressPercent >= 100 && !hasDismissedCongrats[selectedDate]) {
      setShowCongratsModal(true);
    }
  }, [hasUserChosenTarget, rawProgressPercent, selectedDate, hasDismissedCongrats]);

  const handleDismissCongrats = () => {
    setShowCongratsModal(false);
    setHasDismissedCongrats(prev => ({ ...prev, [selectedDate]: true }));
  };

  const handleAddWater = (amountMl: number) => {
    const newAmount = Math.max(0, currentWaterMl + amountMl);
    updateWaterIntake(selectedDate, newAmount);
  };

  const handleSetCustomWater = (e: React.FormEvent) => {
    e.preventDefault();
    const valInLiters = parseFloat(customAmountInput);
    if (!isNaN(valInLiters) && valInLiters >= 0) {
      updateWaterIntake(selectedDate, Math.round(valInLiters * 1000));
      setCustomAmountInput('');
    }
  };

  const handleSaveTarget = (targetInLiters: number) => {
    if (targetInLiters > 0) {
      setWaterTarget(Math.round(targetInLiters * 1000));
      setIsEditingTarget(false);
    }
  };

  const handleSaveCustomTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const valInLiters = parseFloat(customTargetInput);
    if (!isNaN(valInLiters) && valInLiters > 0) {
      setWaterTarget(Math.round(valInLiters * 1000));
      setCustomTargetInput('');
      setIsEditingTarget(false);
    }
  };

  const handleSaveRowAmount = (date: string) => {
    const valInLiters = parseFloat(editingRowAmount);
    if (!isNaN(valInLiters) && valInLiters >= 0) {
      updateWaterIntake(date, Math.round(valInLiters * 1000));
    }
    setEditingRowDate(null);
    setEditingRowAmount('');
  };

  // Sort logs by date descending
  const sortedSymptoms = [...symptoms].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter 30 days data
  const last30DaysSymptoms = sortedSymptoms.slice(0, 30);
  const last7DaysSymptoms = sortedSymptoms.slice(0, 7);
  const achievedDaysSymptoms = sortedSymptoms.filter(s => s.waterIntake >= targetMl);

  let filteredTableLogs = last30DaysSymptoms;
  if (historyFilter === '7days') filteredTableLogs = last7DaysSymptoms;
  if (historyFilter === 'achieved') filteredTableLogs = achievedDaysSymptoms;

  // Reset page when filter or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [historyFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredTableLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredTableLogs.length);
  const paginatedTableLogs = filteredTableLogs.slice(startIndex, endIndex);

  // 30-Day Statistics calculation
  const totalWater30DaysMl = last30DaysSymptoms.reduce((acc, curr) => acc + curr.waterIntake, 0);
  const totalWater30DaysLiters = (totalWater30DaysMl / 1000).toFixed(1);
  const avgWaterMl = last30DaysSymptoms.length > 0 ? Math.round(totalWater30DaysMl / last30DaysSymptoms.length) : 0;
  const avgWaterLiters = (avgWaterMl / 1000).toFixed(2);
  const daysAchievedInMonth = last30DaysSymptoms.filter(s => s.waterIntake >= targetMl).length;

  // Calculate current streak
  let streak = 0;
  for (const log of sortedSymptoms) {
    if (log.waterIntake >= targetMl) {
      streak++;
    } else {
      break;
    }
  }

  // Format date helper
  const formatDateLabel = (dateStr: string) => {
    const today = getTodayString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';

    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
  };

  // Status badge using project theme colors:
  // 0–39% → Low
  // 40–69% → Moderate
  // 70–89% → Good
  // 90–100% → Well Hydrated
  const getStatusBadge = (ml: number) => {
    const pct = Math.round((ml / targetMl) * 100);
    if (pct >= 90) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
          <Award className="w-3.5 h-3.5" />
          Well Hydrated ({pct}%) 🎉
        </span>
      );
    } else if (pct >= 70) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-darkText border border-borderPink/70 flex items-center gap-1">
          <Droplet className="w-3.5 h-3.5 text-accent" />
          Good ({pct}%) 💧
        </span>
      );
    } else if (pct >= 40) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Moderate ({pct}%)
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          Low ({pct}%)
        </span>
      );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12 relative font-body">
      {/* Congratulations Celebration Modal Popup */}
      {showCongratsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A1D2B]/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative glass-card rounded-premium-xl max-w-md w-full p-8 text-center space-y-6 bg-gradient-to-b from-primary/30 via-secondary/20 to-cream/30 border-2 border-borderPink shadow-2xl animate-scaleUp overflow-hidden">
            {/* Confetti decoration */}
            <div className="absolute top-2 left-4 text-2xl animate-bounce">🎉</div>
            <div className="absolute top-4 right-6 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-4 left-6 text-2xl animate-bounce">💧</div>
            <div className="absolute bottom-2 right-4 text-2xl animate-pulse">🏆</div>

            <button
              onClick={handleDismissCongrats}
              className="absolute top-4 right-4 text-vintageText/60 hover:text-darkText transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Trophy Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-300 to-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
              <PartyPopper className="w-10 h-10 text-amber-950" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                Goal Reached! 🌟
              </span>
              <h2 className="font-heading text-2xl font-bold text-darkText">
                Congratulations, {profile.name}! 🎉
              </h2>
              <p className="text-vintageText text-sm leading-relaxed">
                You have reached your daily hydration goal of <span className="font-bold text-accent">{currentWaterLiters} Liters</span> for {formatDateLabel(selectedDate)}!
              </p>
            </div>

            <div className="p-4 rounded-premium-md bg-white/90 border border-borderPink text-xs text-darkText font-medium">
              💧 "Staying hydrated balances your hormone levels, improves skin texture, and prevents pre-period headaches!"
            </div>

            <button
              onClick={handleDismissCongrats}
              className="w-full py-3 rounded-full bg-gradient-to-r from-primary via-accent to-rosegold text-white font-bold text-sm shadow-soft-glow hover:opacity-95 transition-all"
            >
              Awesome! Continue Tracking 💧
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative glass-card rounded-premium-xl p-8 overflow-hidden bg-gradient-to-r from-primary/30 via-secondary/50 to-primary/20 border border-borderPink/60">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GlassWater className="w-48 h-48 text-accent" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/40 text-darkText border border-borderPink/60 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Hydration & Cycle Wellness Tracker
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-darkText">
            Daily Water Intake Tracker 💧
          </h1>
          <p className="text-vintageText text-sm leading-relaxed">
            Track daily water intake, customize target goals, view 7-day visual history, track your hydration streak, and discover general cycle wellness insights.
          </p>
        </div>
      </div>

      {/* 30-Day Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Target Card */}
        <div className="glass-card rounded-premium-lg p-6 flex items-center justify-between relative border border-borderPink/60 bg-white/90">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-vintageText/80 uppercase tracking-wider">Daily Target</p>
            {hasUserChosenTarget ? (
              <>
                <p className="font-heading text-2.5xl font-bold text-darkText">
                  {targetLiters} <span className="text-base font-normal text-vintageText">Liters / day</span>
                </p>
                <p className="text-xs text-vintageText">({targetMl} ml chosen by you)</p>
              </>
            ) : (
              <>
                <p className="font-heading text-xl font-bold text-amber-700">
                  Not Set Yet 🎯
                </p>
                <p className="text-xs text-amber-700">Choose your target below</p>
              </>
            )}
          </div>
          <button
            onClick={() => setIsEditingTarget(!isEditingTarget)}
            className="px-3 py-1.5 rounded-full bg-primary/40 text-darkText hover:bg-primary/70 transition-all text-xs font-semibold flex items-center gap-1.5 border border-borderPink/60"
          >
            <Target className="w-4 h-4 text-accent" />
            <span>{isEditingTarget ? 'Close' : 'Choose Target'}</span>
          </button>
        </div>

        {/* 1 Month Total Consumed */}
        <div className="glass-card rounded-premium-lg p-6 flex items-center justify-between border border-borderPink/60 bg-white/90">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-vintageText/80 uppercase tracking-wider">1 Month Total</p>
            <p className="font-heading text-2.5xl font-bold text-rosegold">
              {totalWater30DaysLiters} <span className="text-base font-normal text-vintageText">Liters</span>
            </p>
            <p className="text-xs text-vintageText">Total logged over 30 days</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center text-rosegold border border-borderPink/40">
            <GlassWater className="w-5 h-5" />
          </div>
        </div>

        {/* 30-Day Avg Intake Card */}
        <div className="glass-card rounded-premium-lg p-6 flex items-center justify-between border border-borderPink/60 bg-white/90">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-vintageText/80 uppercase tracking-wider">Monthly Avg</p>
            <p className="font-heading text-2.5xl font-bold text-accent">
              {avgWaterLiters} <span className="text-base font-normal text-vintageText">Liters</span>
            </p>
            <p className="text-xs text-vintageText">Average daily consumption</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-primary/30 flex items-center justify-center text-accent border border-borderPink/40">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Hydration Streak Card */}
        <div className="glass-card rounded-premium-lg p-6 flex items-center justify-between border border-borderPink/60 bg-white/90">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-vintageText/80 uppercase tracking-wider">Hydration Streak</p>
            <p className="font-heading text-2.5xl font-bold text-rose-500 flex items-center gap-1.5">
              <span>🔥 {streak}</span>
              <span className="text-base font-normal text-vintageText">Days</span>
            </p>
            <p className="text-xs text-vintageText">{daysAchievedInMonth} days achieved this month</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-200/40">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Target Chooser Section */}
      {isEditingTarget && (
        <div className="glass-card rounded-premium-xl p-6 border-2 border-borderPink/80 bg-secondary/30 space-y-5 animate-slideDown">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-heading text-lg font-bold text-darkText flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                Choose Daily Water Target (Liters)
              </h3>
              <p className="text-xs text-vintageText">Select a preset target or enter a custom amount in Liters.</p>
            </div>
            <button
              onClick={() => setIsEditingTarget(false)}
              className="text-xs font-semibold text-vintageText hover:text-darkText"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {[1.0, 1.5, 2.0, 2.2, 2.5, 3.0, 3.5, 4.0].map(val => (
              <button
                key={val}
                onClick={() => handleSaveTarget(val)}
                className={`py-3 px-3 rounded-premium-md text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 ${Math.abs(val - parseFloat(targetLiters)) < 0.05
                    ? 'bg-accent text-white border-accent shadow-md ring-2 ring-primary'
                    : 'bg-white text-darkText border-borderPink/60 hover:border-accent hover:bg-primary/20'
                  }`}
              >
                <span>{val.toFixed(1)} L</span>
                <span className="text-[10px] opacity-80">{val * 1000} ml</span>
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
              className="w-32 px-3 py-2 rounded-lg border border-borderPink/60 text-sm bg-white text-darkText focus:ring-2 focus:ring-accent"
            />
            <span className="text-xs font-semibold text-vintageText">Liters</span>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-semibold hover:bg-rose-500 transition-colors"
            >
              Save Target
            </button>
          </form>
        </div>
      )}

      {/* Main Interactive Tracker: Date Selector + Dynamic Tumbler */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Col: Water Logger & Dynamic Tumbler */}
        <div className="md:col-span-7 glass-card rounded-premium-xl p-6 space-y-6 flex flex-col justify-between border border-borderPink/60 bg-white/90">
          {/* Date Selector Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-borderPink/50">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">Date-wise Logging</span>
              <h2 className="font-heading text-xl font-bold text-darkText flex items-center gap-2 mt-0.5">
                <Calendar className="w-5 h-5 text-accent" />
                {formatDateLabel(selectedDate)}
              </h2>
            </div>

            {/* Quick Date Switchers & Picker */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedDate(getTodayString())}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedDate === getTodayString()
                    ? 'bg-accent text-white shadow-soft-glow'
                    : 'bg-secondary/60 text-vintageText hover:bg-secondary'
                  }`}
              >
                Today
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-borderPink/60 text-darkText cursor-pointer"
              />
            </div>
          </div>

          {/* Tumbler & Dynamic Fill Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center py-2">
            {/* Vintage Glass Tumbler Graphic */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative w-36 h-52 border-2 border-slate-300/80 dark:border-white/90 bg-slate-100/60 dark:bg-white/10 rounded-b-3xl shadow-luxury overflow-hidden flex flex-col justify-end">
                {/* Highlight glass reflection */}
                <div className="absolute top-0 left-2 w-2 h-full bg-white/30 rounded-full pointer-events-none" />
                <div className="absolute top-0 right-2 w-1.5 h-full bg-white/20 rounded-full pointer-events-none" />

                {/* Level Percentage Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                  <span className={`font-heading text-3xl font-bold ${currentWaterMl === 0 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-800 dark:text-white'} drop-shadow-md`}>
                    {progressPercent}%
                  </span>
                  <span className={`text-[11px] font-semibold ${currentWaterMl === 0 ? 'text-slate-600 dark:text-slate-300' : 'text-vintageText dark:text-slate-300'}`}>
                    {currentWaterMl === 0 ? 'Empty Glass 🥛' : `${currentWaterLiters} Liters`}
                  </span>
                </div>

                {/* Goal Achieved Trophy */}
                {rawProgressPercent >= 100 && (
                  <div className="absolute top-2 right-2 z-30 text-lg animate-bounce pointer-events-none select-none">
                    🏆
                  </div>
                )}

                {/* Animated Dynamic Water Fill matching Dashboard water colors */}
                <div
                  style={{ height: `${progressPercent}%` }}
                  className="w-full bg-gradient-to-t from-sky-500/70 via-teal-400/60 to-sky-300/50 relative transition-all duration-700 ease-out border-t-2 border-sky-300/80"
                >
                  {/* Wave Ripple Animation */}
                  {progressPercent > 0 && (
                    <>
                      <div className="absolute -top-2 left-0 right-0 h-3 bg-sky-200/60 rounded-full animate-pulse" />
                      <div className="absolute top-2 left-3 text-[10px] opacity-75 animate-bounce">💧</div>
                      <div className="absolute bottom-4 right-3 text-[9px] opacity-75 animate-pulse">✨</div>
                    </>
                  )}
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="font-heading text-2xl font-bold text-darkText">
                  {currentWaterLiters} <span className="text-base text-vintageText font-normal">/ {targetLiters} Liters</span>
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  {getStatusBadge(currentWaterMl)}
                </div>
              </div>
            </div>

            {/* Quick Add Action Buttons */}
            <div className="space-y-4">
              <p className="text-xs font-bold text-vintageText uppercase tracking-wider">Quick Add Water</p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleAddWater(250)}
                  className="p-3 rounded-premium-md border border-borderPink/60 bg-secondary/40 hover:bg-primary/40 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-darkText block">+0.25 L</span>
                  <span className="text-[11px] text-vintageText flex items-center gap-1 mt-0.5">
                    <span>🥛 Cup (250ml)</span>
                  </span>
                </button>

                <button
                  onClick={() => handleAddWater(500)}
                  className="p-3 rounded-premium-md border border-borderPink/60 bg-secondary/40 hover:bg-primary/40 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-darkText block">+0.50 L</span>
                  <span className="text-[11px] text-vintageText flex items-center gap-1 mt-0.5">
                    <span>🍾 Bottle (500ml)</span>
                  </span>
                </button>

                <button
                  onClick={() => handleAddWater(750)}
                  className="p-3 rounded-premium-md border border-borderPink/60 bg-secondary/40 hover:bg-primary/40 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-darkText block">+0.75 L</span>
                  <span className="text-[11px] text-vintageText flex items-center gap-1 mt-0.5">
                    <span>🍶 Sports (750ml)</span>
                  </span>
                </button>

                <button
                  onClick={() => handleAddWater(1000)}
                  className="p-3 rounded-premium-md border border-borderPink/60 bg-secondary/40 hover:bg-primary/40 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-darkText block">+1.00 L</span>
                  <span className="text-[11px] text-vintageText flex items-center gap-1 mt-0.5">
                    <span>🏺 Pitcher (1000ml)</span>
                  </span>
                </button>
              </div>

              {/* Subtract Button */}
              <button
                onClick={() => handleAddWater(-250)}
                className="w-full py-2 rounded-lg border border-rose-200 bg-rose-50/50 text-rose-700 text-xs font-medium hover:bg-rose-100/60 transition-colors flex items-center justify-center gap-1"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Subtract 0.25 L (250 ml)</span>
              </button>

              {/* Custom Input Form */}
              <form onSubmit={handleSetCustomWater} className="pt-2 flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="20"
                  placeholder="Custom Liters"
                  value={customAmountInput}
                  onChange={e => setCustomAmountInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-borderPink/60 text-xs bg-white text-darkText focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-accent text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-colors"
                >
                  Update Log
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Col: Daily Summary Card & Smart Reminders */}
        <div className="md:col-span-5 glass-card rounded-premium-xl p-6 space-y-5 flex flex-col justify-between border border-borderPink/60 bg-white/90">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading text-lg font-bold text-darkText flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Daily Hydration Summary
              </h3>
              {rawProgressPercent >= 100 && (
                <button
                  onClick={() => setShowCongratsModal(true)}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-300 text-[#4B3B45] flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
                >
                  🎉 View Celebration
                </button>
              )}
            </div>

            {/* Daily Summary Box */}
            <div className="p-4 rounded-premium-md bg-secondary/40 border border-borderPink/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-vintageText font-semibold">Today's Intake:</span>
                <span className="font-bold text-accent">{currentWaterLiters} L ({currentWaterMl} ml)</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-vintageText font-semibold">Daily Goal:</span>
                <span className="font-bold text-darkText">{targetLiters} L ({targetMl} ml)</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-vintageText font-semibold">Remaining Amount:</span>
                <span className="font-bold text-emerald-700">
                  {remainingMl === 0 ? 'Goal Reached! 🎉' : `${remainingLiters} L (${remainingMl} ml)`}
                </span>
              </div>

              <div className="space-y-1 pt-1 border-t border-borderPink/40">
                <div className="flex justify-between text-[11px] font-semibold text-vintageText">
                  <span>Hydration Score: {progressPercent}%</span>
                  <span>{getStatusBadge(currentWaterMl)}</span>
                </div>
                <div className="w-full h-2.5 bg-[#FDECEF] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-accent via-primary to-emerald-400 transition-all duration-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Smart Reminder Settings Card */}
            <HydrationSmartReminderCard progressPercent={rawProgressPercent} />
          </div>

          {/* Hydration Streak Banner */}
          <div className="p-4 rounded-premium-md bg-[#FFFDF8] border border-borderPink/60 shadow-sm text-xs text-darkText space-y-1">
            <p className="font-semibold text-rose-500 flex items-center gap-1.5">
              <span>🔥 Hydration Streak</span>
            </p>
            <p className="text-vintageText italic">
              "You are on a <strong>{streak}-day hydration streak</strong>! Keep logging daily water intake to maintain your wellness momentum."
            </p>
          </div>
        </div>
      </div>

      {/* Separate Section 1: 7-Day Hydration History Visual Chart */}
      <Hydration7DayChart symptoms={symptoms} targetMl={targetMl} />

      {/* Separate Section 2: Cycle Connection Insights */}
      <MenstrualHydrationInsights selectedDate={selectedDate} />

      {/* 1 Month (30 Days) Date-wise Water Status Report Table */}
      <div className="glass-card rounded-premium-xl p-6 space-y-6 border border-borderPink/60 bg-white/90">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-darkText flex items-center gap-2">
              <Droplet className="w-5 h-5 text-accent" />
              1 Month (30 Days) Daily Water Status Report
            </h2>
            <p className="text-xs text-vintageText">
              Shows on which day how many Liters of water were consumed and target completion status for the past 30 days.
            </p>
          </div>

          {/* History Filters */}
          <div className="flex items-center gap-2 bg-secondary/40 p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setHistoryFilter('30days')}
              className={`px-3 py-1.5 rounded-full transition-all ${historyFilter === '30days'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-vintageText hover:text-darkText'
                }`}
            >
              1 Month (30 Days)
            </button>
            <button
              onClick={() => setHistoryFilter('7days')}
              className={`px-3 py-1.5 rounded-full transition-all ${historyFilter === '7days'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-vintageText hover:text-darkText'
                }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setHistoryFilter('achieved')}
              className={`px-3 py-1.5 rounded-full transition-all ${historyFilter === 'achieved'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-vintageText hover:text-darkText'
                }`}
            >
              Goal Achieved Only 🏆
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-borderPink/60 text-xs font-bold text-vintageText uppercase tracking-wider bg-secondary/20">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Liters Consumed</th>
                <th className="py-3 px-4">Target Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderPink/40 text-sm">
              {paginatedTableLogs.map(log => {
                const liters = (log.waterIntake / 1000).toFixed(2);
                const pct = Math.min(100, Math.round((log.waterIntake / targetMl) * 100));
                const isEditingThisRow = editingRowDate === log.date;

                return (
                  <tr key={log.date} className="hover:bg-secondary/20 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 font-semibold text-darkText">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-accent shrink-0" />
                        <div>
                          <span>{formatDateLabel(log.date)}</span>
                          <span className="text-xs font-normal text-vintageText block">{log.date}</span>
                        </div>
                      </div>
                    </td>

                    {/* Liters Consumed */}
                    <td className="py-3.5 px-4">
                      {isEditingThisRow ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={editingRowAmount}
                            onChange={e => setEditingRowAmount(e.target.value)}
                            className="w-24 px-2 py-1 border border-borderPink rounded text-xs bg-white text-darkText"
                          />
                          <span className="text-xs">L</span>
                          <button
                            onClick={() => handleSaveRowAmount(log.date)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="font-heading font-bold text-base text-darkText">{liters} Liters</span>
                          <span className="text-xs text-vintageText block">({log.waterIntake} ml)</span>
                        </div>
                      )}
                    </td>

                    {/* Target Progress Bar */}
                    <td className="py-3.5 px-4 w-48">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-vintageText">
                          <span>{pct}%</span>
                          <span>Goal: {targetLiters} L</span>
                        </div>
                        <div className="w-full h-2.5 bg-[#FDECEF] rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${pct >= 90
                                ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                : pct >= 70
                                  ? 'bg-gradient-to-r from-accent to-primary'
                                  : pct >= 40
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                                    : 'bg-gradient-to-r from-rose-400 to-pink-500'
                              }`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(log.waterIntake)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedDate(log.date);
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 text-xs font-semibold rounded-md bg-secondary text-darkText border border-borderPink/60 hover:bg-primary/40 transition-colors"
                        >
                          Select & View
                        </button>
                        <button
                          onClick={() => {
                            setEditingRowDate(log.date);
                            setEditingRowAmount(liters);
                          }}
                          className="p-1.5 text-vintageText hover:text-darkText rounded-md hover:bg-secondary/40"
                          title="Quick Edit Liters"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-borderPink/40">
          <div className="flex items-center gap-3 text-xs text-vintageText font-medium">
            <span>
              Showing <strong className="text-darkText">{filteredTableLogs.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
              <strong className="text-darkText">{endIndex}</strong> of{' '}
              <strong className="text-darkText">{filteredTableLogs.length}</strong> entries
            </span>
            <div className="flex items-center gap-1.5 pl-2 border-l border-borderPink/40">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={e => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 rounded border border-borderPink/60 bg-white text-darkText font-semibold text-xs cursor-pointer"
              >
                <option value={5}>5 per page</option>
                <option value={7}>7 per page</option>
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-borderPink/60 text-xs font-semibold text-vintageText hover:text-darkText hover:bg-secondary/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${currentPage === page
                      ? 'bg-accent text-white shadow-sm'
                      : 'text-vintageText hover:bg-secondary/40 hover:text-darkText'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-borderPink/60 text-xs font-semibold text-vintageText hover:text-darkText hover:bg-secondary/40 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
