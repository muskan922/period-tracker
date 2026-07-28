import React from 'react';
import { Sparkles, Calendar, Zap, Heart, ShieldCheck, Compass, Apple, Dumbbell, Coffee } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const AIPredictions: React.FC = () => {
  // Hormonal cycle waves database (estrogen, progesterone, LH levels mock)
  const hormoneData = Array.from({ length: 28 }, (_, i) => {
    const day = i + 1;
    // Estrogen peaks around day 13, small peak day 21
    const estrogen = Math.round(
      day <= 13 
        ? 15 + (85 * Math.pow(day / 13, 3))
        : 100 - (60 * Math.pow((day - 13) / 8, 2)) + (day > 21 ? -10 : 0)
    );
    // Progesterone peaks around day 21
    const progesterone = Math.round(
      day <= 14 
        ? 5 
        : 5 + (90 * Math.sin(((day - 14) / 14) * Math.PI))
    );
    // LH spikes massively day 13-14
    const lh = Math.round(
      Math.abs(day - 13.5) < 1.5 
        ? 90 - 60 * Math.abs(day - 13.5)
        : 10 + 5 * Math.sin((day / 28) * Math.PI * 2)
    );

    return { day, Estrogen: Math.max(5, estrogen), Progesterone: Math.max(5, progesterone), LH: Math.max(5, lh) };
  });

  const predictions = [
    { title: 'Next Period Cycle', date: 'Aug 2 - Aug 6', conf: '98%', desc: 'Highly stable cycle pattern based on past logs.', icon: Calendar, color: 'text-rose-400 border-rose-100 bg-rose-50/10' },
    { title: 'Peak Ovulation Day', date: 'Aug 16', conf: '95%', desc: 'Estimated egg release day. Elevated body temperature predicted.', icon: Zap, color: 'text-amber-400 border-amber-100 bg-amber-50/10' },
    { title: 'Fertility Window', date: 'Aug 12 - Aug 18', conf: '93%', desc: '6-day window. Maximum conceiving likelihood.', icon: Heart, color: 'text-emerald-400 border-emerald-100 bg-emerald-50/10' }
  ];

  const recommendations = [
    { type: 'Nutritional Focus', item: 'Pumpkin Seeds & Magnesium-Rich Cacao', desc: 'In your luteal phase, Progesterone requires zinc, magnesium, and healthy fats. Enjoy roasting squash or drink hot cacao.', icon: Apple },
    { type: 'Movement Guide', item: 'Yin Yoga & Steady-State Walking', desc: 'High-intensity workouts can spike cortisol during this phase, worsening PMS. Opt for soothing walks or slow stretches.', icon: Dumbbell },
    { type: 'Self-Care Ritual', item: 'Cozy Hibernation & Warm Baths', desc: 'Estrogen drop may cause low social energy. Cancel high-stress commitments, run a bath with Epsom salts, and write in your journal.', icon: Coffee }
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
                  <div className="w-9 h-9 rounded-full bg-white border border-borderPink/40 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/70 border border-accent/20 text-xxs font-bold text-accent font-subtitle uppercase tracking-wider">
                    {p.conf} Conf.
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-darkText">{p.title}</h3>
                  <p className="font-heading text-xl text-accent font-bold mt-1">{p.date}</p>
                </div>
              </div>
              <p className="text-[10px] text-vintageText/70 leading-relaxed mt-4 pt-3 border-t border-borderPink/25 font-body">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Hormonal Waves Chart */}
      <div className="glass-card rounded-premium-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-borderPink/30">
          <div>
            <h3 className="font-heading text-lg font-semibold text-darkText">Curated Hormonal Waves (Estrogen vs Progesterone)</h3>
            <p className="font-subtitle text-xs text-vintageText/55 italic">Mapping hormone curves across a standard 28-day cycle. Day 23 highlighted.</p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-cream border border-borderPink/50 text-xxs font-semibold flex items-center gap-1.5 text-vintageText shadow-soft-glow self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            Bio-Mathematical Simulation
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hormoneData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="day" label={{ value: 'Cycle Day', position: 'insideBottom', offset: -5, style: { fontSize: '10px', fill: '#4A3F46' } }} tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFDFB', 
                  border: '1px solid rgba(242, 217, 230, 0.6)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontFamily: 'Poppins'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Estrogen" stroke="#D4A5A5" strokeWidth={2} fillOpacity={0.15} fill="#D4A5A5" />
              <Area type="monotone" dataKey="Progesterone" stroke="#EFC7D5" strokeWidth={2} fillOpacity={0.15} fill="#EFC7D5" />
              <Area type="monotone" dataKey="LH" stroke="#8FB996" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={0.05} fill="#8FB996" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cycle Sync Recommendations */}
      <div className="glass-card rounded-premium-lg p-6 space-y-4">
        <h3 className="font-heading text-lg font-semibold text-darkText flex items-center gap-2">
          <Compass className="w-5 h-5 text-accent animate-spin" />
          AI Cycle-Sync Recommendations for Luteal Phase
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {recommendations.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div key={idx} className="bg-cream/40 border border-borderPink/35 rounded-premium-lg p-5 space-y-3 hover:shadow-soft-glow transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-accent font-subtitle tracking-widest">{r.type}</span>
                  <h4 className="text-xs font-semibold text-darkText font-body mt-0.5">{r.item}</h4>
                </div>
                <p className="text-xxs leading-relaxed text-vintageText/75 font-body">
                  {r.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
