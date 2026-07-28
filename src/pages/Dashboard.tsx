import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplet,
  Moon,
  Sparkles,
  Plus,
  Clock,
  ChevronRight,
  Check,
  TrendingUp
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export const Dashboard: React.FC = () => {
  const {
    moods,
    addMood,
    symptoms,
    addSymptomLog,
    medications,
    toggleMedication,
    appointments
  } = useApp();

  const [showWisdomModal, setShowWisdomModal] = React.useState(false);

  // Find today's date in YYYY-MM-DD
  const todayStr = '2026-07-28';

  // Get current logs
  const todayMood = moods.find(m => m.date === todayStr);
  const todaySymptom = symptoms.find(s => s.date === todayStr) || {
    date: todayStr, cramps: 0, bloating: 0, headache: 0, acne: 0, backPain: 0,
    waterIntake: 0, sleepHours: 0, weight: 58.0, exerciseMinutes: 0
  };

  // State handlers
  const handleMoodSelect = (moodName: 'Happy' | 'Calm' | 'Sad' | 'Anxious' | 'Angry' | 'Tired') => {
    addMood({
      date: todayStr,
      mood: moodName,
      note: todayMood?.note || `Felt ${moodName.toLowerCase()} today.`
    });
  };

  const handleAddWater = (amount: number) => {
    addSymptomLog({
      ...todaySymptom,
      waterIntake: todaySymptom.waterIntake + amount
    });
  };

  const handleUpdateSleep = (hours: number) => {
    addSymptomLog({
      ...todaySymptom,
      sleepHours: Math.min(24, Math.max(0, todaySymptom.sleepHours + hours))
    });
  };

  // Recharts Energy/Hormone wave predictions for the week
  const energyData = [
    { name: 'Mon', level: 65 },
    { name: 'Tue', level: 70 },
    { name: 'Wed', level: 85 },
    { name: 'Thu', level: 90 }, // Ovulation peak
    { name: 'Fri', level: 75 },
    { name: 'Sat', level: 60 },
    { name: 'Sun', level: 50 }
  ];

  // Circular calculations for countdown
  const daysRemaining = 5;
  const totalCycleDays = 28;
  const countdownPercentage = ((totalCycleDays - daysRemaining) / totalCycleDays) * 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (countdownPercentage / 100) * circumference;

  return (
    <div className="space-y-6 font-body">

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">

        {/* Column 1: Cycle Countdown */}
        <div className="md:col-span-4 glass-card rounded-premium-lg p-6 flex flex-col items-center justify-center text-center space-y-4 relative overflow-visible">
          {/* Paperclip header decoration */}
          <div className="absolute top-2 left-6 text-xl rotate-[-12deg] opacity-80 select-none pointer-events-none">📎</div>

          {/* Vintage Post Stamp */}
          <div className="absolute top-3 right-4 w-9 h-11 border-2 border-dashed border-accent/40 bg-[#FFFDF8] flex items-center justify-center rotate-6 shadow-sm overflow-hidden select-none pointer-events-none">
            <div className="text-[12px] text-accent/50 opacity-70">💌</div>
          </div>

          <h3 className="font-heading text-base font-semibold text-darkText mt-2">Next Period Countdown</h3>

          <div className="absolute -bottom-2 -left-3 text-4.5xl select-none pointer-events-none animate-float">🧸</div>

          {/* Circular Countdown with Wreath styling */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 overflow-visible">
              <circle
                cx="72" cy="72" r={radius}
                className="text-secondary/35"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72" cy="72" r={radius}
                className="text-accent"
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />

              {/* Gold wreath vine accents */}
              <circle
                cx="72" cy="72" r={radius + 6}
                stroke="var(--rosegold)"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                fill="transparent"
                opacity="0.6"
                className="animate-spin"
                style={{ animationDuration: '40s' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest font-subtitle">Period In</span>
              <span className="font-heading text-4xl text-darkText my-0.5">{daysRemaining}</span>
              <span className="text-[9px] text-vintageText/60 font-body">Days</span>
            </div>

            {/* Wreath Floral Overlay Accents */}
            <div className="absolute top-1.5 left-2.5 text-[9px] select-none pointer-events-none opacity-85">🌿</div>
            <div className="absolute top-3.5 right-4.5 text-[9px] select-none pointer-events-none opacity-85">🌸</div>
            <div className="absolute bottom-1.5 right-3 text-[9px] select-none pointer-events-none opacity-85">🌿</div>
            <div className="absolute bottom-3 left-4 text-[9px] select-none pointer-events-none opacity-85">🌸</div>
            <div className="absolute top-1/2 -right-1.5 text-[9px] select-none pointer-events-none opacity-85">🦋</div>
          </div>

          <div className="text-xs text-vintageText/75 leading-relaxed font-body">
            Predicted Start: <span className="font-semibold text-accent">Aug 2</span> <br />
            Fertility Window: <span className="font-semibold text-emerald-600">Ended Jul 21</span>
          </div>
        </div>

        {/* Column 2: Today's Mood Log */}
        <div className="md:col-span-5 glass-card rounded-premium-lg p-6 flex flex-col justify-between space-y-4 relative">
          {/* Paperclip header decoration */}
          <div className="absolute top-2 left-6 text-xl rotate-[-12deg] opacity-80 select-none pointer-events-none">📎</div>

          <div className="flex justify-between items-center pl-4 mt-1">
            <h3 className="font-heading text-base font-semibold text-darkText">Today's Mood</h3>
            <span className="text-[9px] uppercase font-bold text-accent tracking-wider font-subtitle">Daily Sanctorium</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Happy', emoji: '🪴', bg: 'hover:bg-rose-50 border-rose-100' },
              { name: 'Calm', emoji: '🌿', bg: 'hover:bg-emerald-50 border-emerald-100' },
              { name: 'Sad', emoji: '🌧️', bg: 'hover:bg-blue-50 border-blue-100' },
              { name: 'Anxious', emoji: '🌺', bg: 'hover:bg-slate-50 border-slate-100' },
              { name: 'Angry', emoji: '🍁', bg: 'hover:bg-red-50 border-red-100' },
              { name: 'Tired', emoji: '🌙', bg: 'hover:bg-indigo-50 border-indigo-100' }
            ].map(m => {
              const isSelected = todayMood?.mood === m.name;
              return (
                <button
                  key={m.name}
                  onClick={() => handleMoodSelect(m.name as any)}
                  className={`mood-button flex flex-col items-center justify-center p-2.5 rounded-premium-md border-2 transition-all duration-300 ${isSelected
                    ? 'mood-button-selected bg-primary/50 border-white text-accent shadow-premium scale-105 font-medium'
                    : 'bg-white/80 border-white text-vintageText hover:scale-103 shadow-sm hover:shadow-md'
                    }`}
                >
                  <span className="text-xl mb-1">{m.emoji}</span>
                  <span className="text-[10px] font-body">{m.name}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xxs leading-relaxed text-vintageText/55 italic text-center font-body mt-2">
            Selected: {todayMood?.mood ? `"${todayMood.mood}" - logs update on calendar instantly.` : 'Select a mood above to log today\'s cycle state.'}
          </p>
        </div>

        {/* Column 3: AI Daily Insights capsule */}
        <div className="md:col-span-3 glass-card rounded-premium-lg p-6 bg-gradient-to-br from-cream to-primary/10 border border-accent/25 flex flex-col justify-between relative overflow-visible">
          {/* Pink Push-Pin header decoration */}
          <div className="absolute top-2 left-6 text-xl rotate-12 opacity-90 select-none pointer-events-none">📌</div>

          {/* Butterfly flying near the corner */}
          <div className="absolute -top-3.5 -right-2 text-xl select-none pointer-events-none animate-float z-20">🦋</div>

          {/* Pressed flower branch watermark */}
          <div className="absolute bottom-8 right-2 text-4xl opacity-35 select-none pointer-events-none">🌿🌸</div>

          <div className="space-y-3 pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/20 border border-accent/30 text-[9px] font-bold tracking-widest text-accent uppercase font-subtitle">
              <Sparkles className="w-3 h-3 text-accent animate-pulse" />
              AI Wisdom
            </span>
            <h4 className="font-heading text-base font-semibold text-darkText">Progesterone Peak Phase</h4>
            <p className="text-xs leading-relaxed text-vintageText/80 font-body">
              During the mid-luteal phase, your body releases high levels of progesterone. You may feel cozy, introverted, or slightly bloated. Opt for chamomile infusions, magnesium-rich foods like dark chocolate, and slow-flow yin yoga.
            </p>
          </div>
          <button
            onClick={() => setShowWisdomModal(true)}
            className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 mt-4 font-subtitle justify-end"
          >
            <span>Read more insights</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Column 1: Water Intake */}
        <div className="md:col-span-4 glass-card rounded-premium-lg p-6 flex flex-col justify-between space-y-4 relative overflow-visible">
          {/* Pink Push-Pin header decoration */}
          <div className="absolute top-2 left-6 text-xl rotate-[-6deg] opacity-90 select-none pointer-events-none">📌</div>

          <div className="flex justify-between items-center pl-4 mt-1">
            <h3 className="font-heading text-lg font-semibold text-darkText flex items-center gap-2">
              <Droplet className="w-5 h-5 text-sky-400" />
              Water Intake
            </h3>
            <span className="text-xs font-semibold text-sky-600">{todaySymptom.waterIntake} ml / 2000 ml</span>
          </div>

          {/* Transparent Vintage Glass Tumbler */}
          <div className="flex justify-center py-2 relative">
            {/* Hydration Tracker Decoration */}
            <div className="absolute bottom-1 right-2 text-xl pointer-events-none select-none animate-float">
              🦆
            </div>

            {/* Pinned Handwritten label */}
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-28 p-2.5 bg-[#FFFDF8] border border-amber-900/15 shadow-premium rotate-3 font-subtitle text-[12px] text-[#4B3B45]/90 leading-relaxed rounded-sm select-none pointer-events-none z-10">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">📌</div>
              "A little water, a lot of love for your body ♡"
            </div>

            {/* The Vintage Glass Tumbler */}
            <div className="relative w-24 h-36 border-1 border-white/90 bg-white/5 rounded-b-2xl shadow-luxury overflow-hidden flex flex-col justify-end">
              {/* Highlight glass reflection */}
              <div className="absolute top-0 left-1 w-1.5 h-full bg-white/20 rounded-full pointer-events-none" />
              <div className="absolute top-0 right-1.5 w-1 h-full bg-white/10 rounded-full pointer-events-none" />

              {/* Goal Achieved Butterfly */}
              {todaySymptom.waterIntake >= 2000 && (
                <div className="absolute -top-1 -right-1 z-20 text-sm animate-float pointer-events-none select-none">
                  🦋
                </div>
              )}

              {/* Water Level */}
              <div
                style={{ height: `${Math.min(100, (todaySymptom.waterIntake / 2000) * 100)}%` }}
                className="w-full bg-gradient-to-t from-sky-400/40 to-sky-200/50 relative transition-all duration-1000 border-t border-sky-300/40"
              >
                {/* Rising Ripples */}
                <div className="absolute -top-1 left-0 right-0 h-1.5 bg-sky-200/40 rounded-full animate-pulse" />

                {/* Floating Rose Petals / Daisies */}
                {todaySymptom.waterIntake > 0 && (
                  <>
                    <div className="absolute bottom-2 left-2 text-[10px] opacity-80 animate-bounce">🌸</div>
                    <div className="absolute bottom-8 right-2 text-[9px] opacity-75 animate-bounce">🌼</div>
                    <div className="absolute top-1 left-4 text-[10px] opacity-90 animate-pulse">🌹</div>
                    <div className="absolute bottom-5 left-6 text-[8px] opacity-70 rotate-12">🌿</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAddWater(250)}
              className="flex-1 py-2 rounded-full border border-borderPink/50 text-xs font-semibold bg-cream hover:bg-secondary/40 text-vintageText flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 250ml cup</span>
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="flex-1 py-2 rounded-full border border-borderPink/50 text-xs font-semibold bg-cream hover:bg-secondary/40 text-vintageText flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 500ml bottle</span>
            </button>
          </div>
        </div>

        {/* Column 2: Sleep hours */}
        <div className="md:col-span-4 glass-card rounded-premium-lg p-6 flex flex-col justify-between space-y-4 relative overflow-visible">
          {/* Pink Push-Pin header decoration */}
          <div className="absolute top-2 left-6 text-xl rotate-12 opacity-90 select-none pointer-events-none">📌</div>

          <div className="flex justify-between items-center pl-4 mt-1">
            <h3 className="font-heading text-base font-semibold text-darkText flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-400" />
              Sleep Tracker
            </h3>
            <span className="text-xs font-semibold text-purple-600">{todaySymptom.sleepHours} hrs</span>
          </div>

          {/* Sleeping Teddy Bear on Cloud Illustration */}
          <div className="flex items-center justify-center gap-4 py-1 relative">
            {/* Hanging stars */}
            <div className="absolute top-0 right-2 text-xs select-none pointer-events-none animate-float opacity-75">✨⭐</div>

            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center select-none pointer-events-none text-center">
              <span className="text-4xl">☁️</span>
              <span className="text-2xl absolute -top-1">🌛</span>
              <span className="text-xxs absolute -bottom-1 right-2 animate-bounce">⭐</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateSleep(-0.5)}
                className="w-9 h-9 rounded-full bg-cream border border-borderPink/50 flex items-center justify-center hover:bg-secondary/40 text-vintageText transition-colors shadow-sm"
              >
                -0.5
              </button>
              <span className="font-heading text-3.5xl text-darkText font-medium px-2">{todaySymptom.sleepHours}</span>
              <button
                onClick={() => handleUpdateSleep(0.5)}
                className="w-9 h-9 rounded-full bg-cream border border-borderPink/50 flex items-center justify-center hover:bg-secondary/40 text-vintageText transition-colors shadow-sm"
              >
                +0.5
              </button>
            </div>
          </div>

          <p className="text-[13px] text-vintageText/80 text-center font-subtitle italic">Recommended target: 8 hours for hormonal balance & glow ✨</p>
        </div>

        {/* Column 3: Energy Forecast Chart */}
        <div className="md:col-span-4 glass-card rounded-premium-lg p-6 flex flex-col justify-between space-y-2 relative overflow-visible">
          {/* Pink Push-Pin header decoration */}
          <div className="absolute top-2 left-6 text-xl rotate-[-8deg] opacity-90 select-none pointer-events-none">📌</div>

          {/* Pressed flower bouquet in corners */}
          <div className="absolute bottom-8 left-2 text-xxs select-none pointer-events-none opacity-45">🌸🌿</div>
          <div className="absolute bottom-8 right-2 text-xxs select-none pointer-events-none opacity-45">🌿🌸</div>

          <div className="flex justify-between items-center pl-4 mt-1">
            <h3 className="font-heading text-base font-semibold text-darkText flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Energy & Libido Waves
            </h3>
            <span className="text-[9px] uppercase font-bold text-accent tracking-wider font-subtitle">Weekly Trend</span>
          </div>

          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8DB3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF8DB3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFDF8',
                    border: '1px solid var(--rosegold)',
                    borderRadius: '8px',
                    fontSize: '10px',
                    color: '#4B3B45'
                  }}
                />
                <Area type="monotone" dataKey="level" stroke="#C89F65" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-vintageText/60 leading-normal font-body text-center mt-1">
            Progesterone rising curves cause a gradual decrease in energetic output. Reserve high-stress tasks.
          </p>
        </div>
      </div>

      {/* Dynamic Checklist & Reminders Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Column 1: Medication Checklist */}
        <div className="md:col-span-6 glass-card rounded-premium-lg p-6 space-y-4 relative overflow-visible">
          {/* Stamped twigs decoration in corner */}
          <div className="absolute -top-3 -right-2 text-lg select-none pointer-events-none">🌸🌿</div>

          <div className="flex justify-between items-center pb-2 border-b border-borderPink/30">
            <h3 className="font-heading text-lg font-semibold text-darkText">Medication & Supplement Reminders</h3>
            <span className="text-[12px] font-bold text-accent font-subtitle uppercase tracking-widest">Pillbox Log</span>
          </div>

          <div className="space-y-2.5">
            {medications.map(m => {
              const isTaken = m.completedDates.includes(todayStr);
              return (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-3 rounded-premium-md border transition-all duration-300 ${isTaken
                    ? 'bg-purple-50/30 border-purple-300/50 opacity-80'
                    : 'bg-[#FFFDF8]-50/30 border-borderPink opacity-80'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleMedication(m.id, todayStr)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${isTaken
                        ? 'bg-purple-400 border-purple-500 text-white shadow-soft-glow'
                        : 'border-borderPink hover:border-accent hover:bg-cream bg-white'
                        }`}
                    >
                      {isTaken && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div>
                      <h4 className={`text-xs font-semibold ${isTaken ? 'line-through text-vintageText/50' : 'text-darkText'}`}>
                        {m.name}
                      </h4>
                      <p className="text-[10px] text-vintageText/55 mt-0.5">{m.dosage} • {m.time}</p>
                    </div>
                  </div>

                  {/* Handwritten note right side stamp */}
                  {m.id === 'm1' && (
                    <div className="hidden sm:block text-[14px] font-subtitle italic text-accent px-2 py-0.5 border border-dashed border-accent/35 rounded bg-cream/30">
                      "Don't forget to take care of yourself ♡"
                    </div>
                  )}

                  <span className={`text-[13px] font-medium font-subtitle px-2 py-0.5 rounded-full ${isTaken ? 'bg-purple-100 text-purple-700' : 'bg-cream border border-borderPink text-vintageText/60'
                    }`}>
                    {isTaken ? 'Taken' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Upcoming Appointments */}
        <div className="md:col-span-6 glass-card rounded-premium-lg p-6 space-y-4 relative overflow-visible">
          {/* Stamped pink ribbon header */}
          <div className="absolute -top-3 -right-2 text-lg select-none pointer-events-none">🎀</div>

          <div className="flex justify-between items-center pb-2 border-b border-borderPink/30">
            <h3 className="font-heading text-lg font-semibold text-darkText">Upcoming Wellness Appointments</h3>
            <span className="text-[10px] font-bold text-accent font-subtitle uppercase tracking-widest">Consultations</span>
          </div>

          <div className="space-y-2.5">
            {appointments.length > 0 ? (
              appointments.map(a => (
                <div key={a.id} className="bg-cream/40 border border-borderPink/35 p-3 rounded-premium-md flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex flex-col items-center justify-center text-accent font-semibold text-xs leading-none shrink-0 font-heading">
                    <span>{a.date.split('-')[2]}</span>
                    <span className="text-[8px] tracking-wider uppercase font-subtitle mt-0.5">Aug</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-darkText truncate">{a.doctorName}</h4>
                      <span className="text-[9px] text-vintageText/55 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {a.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-accent font-subtitle italic mt-0.5">{a.specialty}</p>
                    {a.notes && <p className="text-[10px] text-vintageText/75 leading-relaxed mt-1 font-body bg-white/40 p-1.5 rounded border border-borderPink/20">{a.notes}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-vintageText/50 italic text-center py-6 font-body">No doctor appointments scheduled. Click "Consultations" in the sidebar to book one.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Envelope & Fountain Pen Decoration */}
      <div className="flex justify-end mt-4 relative overflow-visible pr-8 pb-4">
        <div className="relative w-72 p-5 bg-[#FFFDF8] border border-amber-900/15 shadow-premium rotate-[-2deg] font-subtitle text-xs text-[#4B3B45]/90 rounded-sm select-none pointer-events-none">
          {/* Masking Tape */}
          <div className="absolute -top-3 left-4 w-12 h-3.5 bg-[#FAF2E8]/60 border border-amber-800/10 shadow-sm rotate-6" />

          <p className="font-heading italic text-sm mb-1 text-[#8B6043]">Dear me,</p>
          <p className="font-subtitle italic text-xs pl-2">you're doing the best you can...</p>
          <p className="text-right mt-3 text-[10px] text-accent font-semibold">❤️ </p>

          {/* Detailed Golden Fountain Pen SVG */}
          <svg width="120" height="20" viewBox="0 0 150 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -bottom-2 -right-6 rotate-[15deg] filter drop-shadow-md overflow-visible">
            {/* Pen Body (Dark Resin) */}
            <rect x="25" y="6" width="100" height="8" rx="2" fill="#1A1A1A" stroke="#C89F65" strokeWidth="1" />
            {/* Gold accents */}
            <rect x="25" y="6" width="4" height="8" fill="#C89F65" />
            <rect x="120" y="6" width="5" height="8" fill="#C89F65" />
            <rect x="75" y="6" width="3" height="8" fill="#C89F65" />
            {/* Pen Nib (Gold) */}
            <path d="M25 10l-15-4v8l15-4z" fill="#C89F65" stroke="#B0854E" strokeWidth="0.8" />
            <path d="M16 10l9-2v4l-9-2z" fill="#EAEAEA" />
            <line x1="10" y1="10" x2="20" y2="10" stroke="#1A1A1A" strokeWidth="0.8" />
            {/* Clip */}
            <path d="M110 4h10v2h-10z" fill="#C89F65" />
          </svg>
        </div>
      </div>

      {/* AI Wisdom Modal */}
      {showWisdomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300">
          <div className="relative w-full max-w-lg glass-card rounded-premium-lg p-6 max-h-[85vh] overflow-y-auto space-y-4 animate-scale-up">
            <button
              onClick={() => setShowWisdomModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-cream border border-borderPink text-vintageText hover:bg-secondary/40 transition-colors"
            >
              &times;
            </button>

            <div className="flex items-center gap-2 border-b border-borderPink/30 pb-3">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <h2 className="font-heading text-xl font-semibold text-darkText">AI Sanctuary Insights</h2>
            </div>

            <div className="space-y-4 font-body mt-2">
              <div className="bg-cream/40 border border-borderPink/30 p-4 rounded-premium-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 font-subtitle font-semibold">Active Phase</span>
                  <span className="text-xxs font-semibold text-vintageText/55">Today</span>
                </div>
                <h4 className="font-heading text-sm font-semibold text-darkText">Luteal Phase Wellness & Nutrition</h4>
                <p className="text-xs text-vintageText/80 leading-relaxed">
                  With progesterone peaking, your body runs slightly warmer and burns calories more efficiently. Support this phase by eating magnesium-dense foods like dark chocolate, almonds, and avocados. Focus on anti-inflammatory herbal drinks (like dandelion root and chamomile tea) to ease water retention.
                </p>
              </div>

              <div className="bg-cream/20 border border-borderPink/20 p-4 rounded-premium-md space-y-2 opacity-90">
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-500 font-subtitle font-semibold">Rest Phase</span>
                <h4 className="font-heading text-sm font-semibold text-darkText">Menstrual Phase Sanctuary</h4>
                <p className="text-xs text-vintageText/80 leading-relaxed">
                  Estrogen and progesterone drop to their lowest levels. Energy is drawn inwards. Prioritize warm vegetable soups, iron restoration (spinach, lentils), and limit high-intensity training to prevent cortisol spikes.
                </p>
              </div>

              <div className="bg-cream/20 border border-borderPink/20 p-4 rounded-premium-md space-y-2 opacity-90">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 font-subtitle font-semibold">Rise Phase</span>
                <h4 className="font-heading text-sm font-semibold text-darkText">Follicular Phase Cognitive Growth</h4>
                <p className="text-xs text-vintageText/80 leading-relaxed">
                  As estrogen rises, cognitive functions and positive energy peak. This is the optimal window to plan new business ventures, engage in creative writing, and eat light, fresh, fiber-rich meals to process metabolizing hormones.
                </p>
              </div>

              <div className="bg-cream/20 border border-borderPink/20 p-4 rounded-premium-md space-y-2 opacity-90">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 font-subtitle font-semibold">Radiance Phase</span>
                <h4 className="font-heading text-sm font-semibold text-darkText">Ovulation Phase Peak Athletics</h4>
                <p className="text-xs text-vintageText/80 leading-relaxed">
                  Luteinizing hormone peaks. Physical strength, communication confidence, and skin glow are at their absolute heights. Fuel this high-energy phase with fresh salads, raw vegetables, and support with strength training.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
