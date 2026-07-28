import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flower, CheckCircle, BarChart3, Droplet, Dumbbell, ShieldAlert, Scale, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

export const SymptomTracker: React.FC = () => {
  const { symptoms, addSymptomLog } = useApp();

  const todayStr = '2026-07-28';
  const todayLog = symptoms.find(s => s.date === todayStr) || {
    date: todayStr, cramps: 0, bloating: 0, headache: 0, acne: 0, backPain: 0,
    waterIntake: 1500, sleepHours: 7, weight: 58.0, exerciseMinutes: 30
  };

  // Local state metrics
  const [cramps, setCramps] = useState(todayLog.cramps);
  const [bloating, setBloating] = useState(todayLog.bloating);
  const [headache, setHeadache] = useState(todayLog.headache);
  const [acne, setAcne] = useState(todayLog.acne);
  const [backPain, setBackPain] = useState(todayLog.backPain);
  const [water, setWater] = useState(todayLog.waterIntake);
  const [sleep, setSleep] = useState(todayLog.sleepHours);
  const [weight, setWeight] = useState(todayLog.weight);
  const [exercise, setExercise] = useState(todayLog.exerciseMinutes);

  const handleSaveLogs = (e: React.FormEvent) => {
    e.preventDefault();
    addSymptomLog({
      date: todayStr,
      cramps,
      bloating,
      headache,
      acne,
      backPain,
      waterIntake: water,
      sleepHours: sleep,
      weight: Number(weight),
      exerciseMinutes: exercise
    });
    alert('Today\'s physical symptoms locked in database. 🌸');
  };

  // Recharts correlation data
  const chartData = symptoms.slice().reverse().map(s => ({
    date: s.date.split('-')[2] + ' Jul',
    Cramps: s.cramps,
    Bloating: s.bloating,
    BackPain: s.backPain,
    Sleep: s.sleepHours
  }));

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div>
        <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
          <Flower className="w-7 h-7 text-accent animate-pulse" />
          Symptom Logger & Vitals
        </h1>
        <p className="font-subtitle text-sm text-vintageText/70 italic">Identify physiological patterns across cycle weeks. Inform your health reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Log Vitals Form */}
        <form onSubmit={handleSaveLogs} className="lg:col-span-5 glass-card rounded-premium-lg p-6 space-y-5">
          <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-accent" />
            Today\'s Clinical Vitals
          </h3>

          {/* Sliders Grid */}
          <div className="space-y-4">
            <h4 className="font-subtitle text-xs uppercase font-bold tracking-widest text-accent">Cycle Symptoms (0-10)</h4>
            
            {[
              { label: 'Uterine Cramps', value: cramps, setter: setCramps, desc: 'Pelvic contraction pain' },
              { label: 'Abdominal Bloating', value: bloating, setter: setBloating, desc: 'Water retention / fullness' },
              { label: 'Headaches & Migraines', value: headache, setter: setHeadache, desc: 'Estrogen-drop headaches' },
              { label: 'Acne Breakouts', value: acne, setter: setAcne, desc: 'Sebum flareups around jawline' },
              { label: 'Lower Back Pain', value: backPain, setter: setBackPain, desc: 'Pelvic radiating soreness' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-darkText font-body">{item.label}</span>
                  <span className="font-bold text-accent">{item.value} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10" 
                  value={item.value}
                  onChange={(e) => item.setter(Number(e.target.value))}
                  className="w-full cursor-pointer accent-accent"
                />
                <p className="text-[9px] text-vintageText/50 italic leading-none font-subtitle mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="elegant-divider"></div>

          {/* Physical Statistics */}
          <div className="space-y-4">
            <h4 className="font-subtitle text-xs uppercase font-bold tracking-widest text-accent">Vitals & Activity</h4>

            <div className="grid grid-cols-2 gap-3">
              {/* Weight */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-accent" />
                  Weight (kg)
                </label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-cream/45 border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs font-body"
                />
              </div>

              {/* Water */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-sky-400" />
                  Water (ml)
                </label>
                <input 
                  type="number" 
                  step="50" 
                  value={water}
                  onChange={(e) => setWater(Number(e.target.value))}
                  className="w-full bg-cream/45 border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs font-body"
                />
              </div>

              {/* Exercise */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
                  Exercise (min)
                </label>
                <input 
                  type="number" 
                  step="5" 
                  value={exercise}
                  onChange={(e) => setExercise(Number(e.target.value))}
                  className="w-full bg-cream/45 border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs font-body"
                />
              </div>

              {/* Sleep */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                  Sleep (hrs)
                </label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={sleep}
                  onChange={(e) => setSleep(Number(e.target.value))}
                  className="w-full bg-cream/45 border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs font-body"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow flex items-center justify-center gap-2 mt-4"
          >
            <span>Lock Vitals Data</span>
          </button>
        </form>

        {/* Right Column: Analytics Correlation Chart */}
        <div className="lg:col-span-7 glass-card rounded-premium-lg p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-borderPink/30">
              <h3 className="font-heading text-lg font-semibold text-darkText flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-accent" />
                Symptom & Vitals Correlation
              </h3>
              <span className="text-[10px] font-bold text-accent font-subtitle uppercase tracking-widest">Co-Relation Database</span>
            </div>

            {/* Recharts chart */}
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 15, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(242, 217, 230, 0.3)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} domain={[0, 10]} />
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
                  <Line type="monotone" dataKey="Cramps" stroke="#D4A5A5" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Bloating" stroke="#E57373" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="BackPain" stroke="#F2C57C" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Sleep" stroke="#8FB996" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-primary/10 border border-accent/15 rounded-premium-md p-4 flex items-start gap-3 mt-4">
            <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-xxs leading-relaxed text-vintageText/80 font-body">
              <span className="font-semibold text-darkText">AI Insight:</span> Lower back pain and cramping intensity peak inversely against sleep cycles. High progesterone on day 23 increases bloating indexes. Maintaining hydration targets reduces uterine cramping peaks by 20%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
