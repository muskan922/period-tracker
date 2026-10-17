import React from 'react';
import { Sparkles, Calendar, Zap, Heart, ShieldCheck, Compass, Apple, Dumbbell, Coffee } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { formatDateRangeLabel } from '../utils/cycleEngine';

export const AIPredictions: React.FC = () => {
  const { cycleEngine, smartRecommendations, patternInsights } = useApp();

  // Hormonal cycle waves database based on calculated averageCycleLength
  const cycleLength = cycleEngine.averageCycleLength || 28;
  const hormoneData = Array.from({ length: cycleLength }, (_, i) => {
    const day = i + 1;
    const ovulationDay = Math.floor(cycleLength / 2);
    // Estrogen peaks around ovulationDay - 1, small peak during luteal phase
    const estrogen = Math.round(
      day <= ovulationDay
        ? 15 + (85 * Math.pow(day / ovulationDay, 3))
        : 100 - (60 * Math.pow((day - ovulationDay) / 8, 2)) + (day > ovulationDay + 7 ? -10 : 0)
    );
    // Progesterone peaks in luteal phase
    const progesterone = Math.round(
      day <= ovulationDay
        ? 5 
        : 5 + (90 * Math.sin(((day - ovulationDay) / (cycleLength - ovulationDay)) * Math.PI))
    );
    // LH spikes massively at ovulationDay - 1
    const lh = Math.round(
      Math.abs(day - (ovulationDay - 0.5)) < 1.5 
        ? 90 - 60 * Math.abs(day - (ovulationDay - 0.5))
        : 10 + 5 * Math.sin((day / cycleLength) * Math.PI * 2)
    );

    return { day, Estrogen: Math.max(5, estrogen), Progesterone: Math.max(5, progesterone), LH: Math.max(5, lh) };
  });

  const nextPeriodLabel = cycleEngine.nextPeriodEstimate.label;
  const ovulationLabel = formatDateRangeLabel(
    cycleEngine.fertileWindowEstimate.ovulationDate,
    cycleEngine.fertileWindowEstimate.ovulationDate
  );
  const fertileLabel = cycleEngine.fertileWindowEstimate.label;

  const predictions = [
    {
      title: 'Next Period Estimate',
      date: nextPeriodLabel,
      conf: cycleEngine.previousCycles.length >= 2 ? '95%' : '85%',
      desc: cycleEngine.previousCycles.length >= 2
        ? `Estimated based on your average ${cycleEngine.averageCycleLength}-day cycle.`
        : 'Initial estimate. Track 1-2 more cycles for higher precision.',
      icon: Calendar,
      color: 'text-rose-400 border-rose-100 bg-rose-50/10'
    },
    {
      title: 'Peak Ovulation Window',
      date: ovulationLabel,
      conf: '90%',
      desc: `Estimated peak egg release window around Day ${Math.floor(cycleEngine.averageCycleLength / 2)}.`,
      icon: Zap,
      color: 'text-amber-400 border-amber-100 bg-amber-50/10'
    },
    {
      title: 'Fertility Window',
      date: fertileLabel,
      conf: '90%',
      desc: '6-day window representing your estimated peak fertility period.',
      icon: Heart,
      color: 'text-emerald-400 border-emerald-100 bg-emerald-50/10'
    }
  ];

  // Map smartRecommendations to display cards
  const displayRecommendations = smartRecommendations.length > 0
    ? smartRecommendations.map((r, idx) => ({
        type: r.category,
        item: r.title,
        desc: r.description,
        icon: idx === 0 ? Apple : idx === 1 ? Dumbbell : Coffee
      }))
    : [
        { type: 'Nutritional Focus', item: 'Magnesium & Complex Carbs', desc: 'In your luteal phase, Progesterone requires zinc, magnesium, and healthy fats.', icon: Apple },
        { type: 'Movement Guide', item: 'Gentle Walking & Yin Yoga', desc: 'Listen to your body rhythm. Opt for restorative movement when feeling lower energy.', icon: Dumbbell },
        { type: 'Self-Care Ritual', item: 'Restorative Sleep & Warm Infusions', desc: 'Hydrate well and maintain a calm evening routine for optimal sleep quality.', icon: Coffee }
      ];

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div>
        <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-accent animate-pulse" />
          AI Cycle & Hormonal Predictions
        </h1>
        <p className="font-subtitle text-sm text-vintageText/70 italic">
          Advanced cycle forecasting models mapping your biological rhythm with recommendations.
        </p>
      </div>

      {/* Main predictions summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {predictions.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className={`glass-card rounded-premium-lg p-5 border relative overflow-hidden flex flex-col justify-between ${p.color}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-cream/60 border border-borderPink/40 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-cream/60 border border-accent/20 text-xxs font-bold text-accent font-subtitle uppercase tracking-wider">
                    {p.conf} Est.
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-darkText">{p.title}</h3>
                  <p className="font-heading text-xl text-accent font-bold mt-1">{p.date}</p>
                </div>
              </div>
              <p className="text-[11px] text-vintageText/80 dark:text-vintageText/90 leading-relaxed mt-4 pt-3 border-t border-borderPink/25 font-body">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pattern Insights Banner */}
      {patternInsights && patternInsights.length > 0 && (
        <div className="glass-card rounded-premium-lg p-5 border border-accent/20 bg-cream/40 dark:bg-cream/15 space-y-2">
          <h4 className="font-heading text-sm font-semibold text-darkText flex items-center gap-2">
            <span>✨ Personal Pattern Engine Insights</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {patternInsights.slice(0, 4).map(ins => (
              <div key={ins.id} className="p-3 bg-white/85 dark:bg-cream/30 rounded-premium-md border border-borderPink/40 text-xs">
                <div className="font-semibold text-accent font-subtitle">{ins.icon || '📌'} {ins.title}</div>
                <div className="text-[11px] text-vintageText/85 dark:text-vintageText/95 font-body mt-0.5">{ins.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hormonal Waves Chart */}
      <div className="glass-card rounded-premium-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-borderPink/30">
          <div>
            <h3 className="font-heading text-lg font-semibold text-darkText">Curated Hormonal Waves (Estrogen vs Progesterone)</h3>
            <p className="font-subtitle text-xs text-vintageText/75 dark:text-vintageText/90 italic">Mapping hormone curves across your {cycleEngine.averageCycleLength}-day cycle. Day {cycleEngine.currentCycleDay} highlighted.</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-cream dark:bg-cream/40 border border-borderPink/50 text-xxs font-semibold flex items-center gap-1.5 text-vintageText dark:text-darkText shadow-soft-glow self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            Biological Cycle Model
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hormoneData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorEstrogen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProgesterone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="Estrogen" stroke="#EC4899" fillOpacity={1} fill="url(#colorEstrogen)" strokeWidth={2} />
              <Area type="monotone" dataKey="Progesterone" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorProgesterone)" strokeWidth={2} />
              <Area type="monotone" dataKey="LH" stroke="#F59E0B" fillOpacity={1} fill="url(#colorLH)" strokeWidth={1.5} strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Smart Recommendations Section */}
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-semibold text-darkText flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent" />
          Smart Recommendations ({cycleEngine.currentPhase.name})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayRecommendations.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div key={idx} className="glass-card rounded-premium-lg p-5 border border-borderPink/40 space-y-3 flex flex-col justify-between hover:shadow-luxury transition-all duration-300">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-accent">
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-xxs font-bold uppercase tracking-wider font-subtitle">{r.type}</span>
                  </div>
                  <h4 className="font-heading text-base font-semibold text-darkText">{r.item}</h4>
                  <p className="text-xs text-vintageText/75 leading-relaxed font-body">{r.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
