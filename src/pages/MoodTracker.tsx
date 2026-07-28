import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smile, BookOpen, Plus, HeartPulse } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const MoodTracker: React.FC = () => {
  const { moods, addMood } = useApp();

  const todayStr = '2026-07-28';
  const todayMood = moods.find(m => m.date === todayStr);

  const [selectedMood, setSelectedMood] = useState<'Happy' | 'Calm' | 'Sad' | 'Anxious' | 'Angry' | 'Tired' | ''>(todayMood?.mood || '');
  const [note, setNote] = useState(todayMood?.note || '');

  const moodsList = [
    { name: 'Happy', emoji: '🌸', description: 'Energetic, joyful, floating' },
    { name: 'Calm', emoji: '🍃', description: 'Peaceful, centered, relaxed' },
    { name: 'Sad', emoji: '🌧️', description: 'Tearful, heavy, slow' },
    { name: 'Anxious', emoji: '☁️', description: 'Restless, overthinking, tense' },
    { name: 'Angry', emoji: '🔥', description: 'Frustrated, irritable, hot' },
    { name: 'Tired', emoji: '🌙', description: 'Sleepy, low energy, nesting' }
  ] as const;

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      alert('Please pick an emotion before locking the diary.');
      return;
    }

    addMood({
      date: todayStr,
      mood: selectedMood,
      note: note || `Logged ${selectedMood.toLowerCase()} mood.`
    });

    alert('Journal entry locked in your sanctuary database. 🌸');
  };

  // Convert mood names to numerical values for Recharts line chart (Happy=6, Calm=5, Tired=4, Anxious=3, Sad=2, Angry=1)
  const moodValueMap: Record<string, number> = {
    Happy: 6,
    Calm: 5,
    Tired: 4,
    Anxious: 3,
    Sad: 2,
    Angry: 1
  };

  const chartData = moods.slice().reverse().map(m => ({
    date: m.date.split('-')[2] + ' Jul',
    value: moodValueMap[m.mood] || 4,
    mood: m.mood
  }));

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div>
        <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-accent" />
          Cozy Mood Journal
        </h1>
        <p className="font-subtitle text-sm text-vintageText/70 italic">Hold space for your feelings. Review emotional cycles alongside hormonal flows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Log Daily Journal */}
        <form onSubmit={handleSaveJournal} className="lg:col-span-5 glass-card rounded-premium-lg p-6 space-y-5">
          <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30 flex items-center gap-2">
            <Smile className="w-5 h-5 text-accent" />
            Today\'s Journal Page
          </h3>

          {/* Emojis grid */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle font-medium">How do you feel today?</label>
            <div className="grid grid-cols-3 gap-2">
              {moodsList.map(m => {
                const checked = selectedMood === m.name;
                return (
                  <button
                    type="button"
                    key={m.name}
                    onClick={() => setSelectedMood(m.name)}
                    className={`flex flex-col items-center justify-center p-3 rounded-premium-md border transition-all duration-300 ${
                      checked 
                        ? 'bg-primary/55 border-accent text-accent shadow-soft-glow scale-103 font-semibold' 
                        : 'bg-cream/40 border-borderPink/40 text-vintageText hover:bg-secondary/20'
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{m.emoji}</span>
                    <span className="text-[10px] font-body tracking-wider">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Journal notes */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Write in your digital diary</label>
            <textarea
              placeholder="Light a candle, take a breath, and let your thoughts flow onto this vintage paper overlay..."
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-cream/35 border border-borderPink/60 p-3 rounded-premium-md text-xs resize-none leading-relaxed font-body"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Lock Sanctuary Journal</span>
          </button>
        </form>

        {/* Right Column: Mood Trends & History */}
        <div className="lg:col-span-7 glass-card rounded-premium-lg p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-borderPink/30">
              <h3 className="font-heading text-lg font-semibold text-darkText flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-accent animate-pulse" />
                Hormonal Mood Trends
              </h3>
              <span className="text-[10px] font-bold text-accent font-subtitle uppercase tracking-widest">Emotional Fluctuations</span>
            </div>

            {/* Weekly Trend line chart */}
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis domain={[1, 6]} tick={{ fontSize: 9 }} tickFormatter={(tick) => {
                    const labelMap: Record<number, string> = { 6: '🌸', 5: '🍃', 4: '🌙', 3: '☁️', 2: '🌧️', 1: '🔥' };
                    return labelMap[tick] || '';
                  }} />
                  <Tooltip 
                    formatter={(val: any) => {
                      const nameMap: Record<number, string> = { 6: 'Happy', 5: 'Calm', 4: 'Tired', 3: 'Anxious', 2: 'Sad', 1: 'Angry' };
                      return [nameMap[val], 'Mood'];
                    }}
                    contentStyle={{ 
                      backgroundColor: '#FFFDFB', 
                      border: '1px solid rgba(242, 217, 230, 0.6)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontFamily: 'Poppins'
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#D4A5A5" strokeWidth={2.5} activeDot={{ r: 6 }} dot={{ r: 4, stroke: '#FFFDFB', strokeWidth: 1.5, fill: '#D4A5A5' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Past reflections list */}
          <div className="space-y-3 mt-4">
            <h4 className="font-subtitle text-xs uppercase font-bold tracking-widest text-accent">Past Reflections Log</h4>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {moods.map((m, idx) => (
                <div key={idx} className="bg-cream/45 border border-borderPink/30 p-3.5 rounded-premium-md space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-darkText flex items-center gap-1.5">
                      <span>
                        {m.mood === 'Happy' && '🌸'}
                        {m.mood === 'Calm' && '🍃'}
                        {m.mood === 'Sad' && '🌧️'}
                        {m.mood === 'Anxious' && '☁️'}
                        {m.mood === 'Angry' && '🔥'}
                        {m.mood === 'Tired' && '🌙'}
                      </span>
                      {m.mood} Reflection
                    </span>
                    <span className="text-[10px] text-vintageText/50 font-subtitle">{m.date}</span>
                  </div>
                  <p className="text-xxs leading-relaxed text-vintageText/80 font-body">
                    "{m.note}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
