import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Trash2, ShieldAlert, Heart, Plus } from 'lucide-react';

export const PeriodTracker: React.FC = () => {
  const { cycles, addCycle, deleteCycle } = useApp();

  // Logging states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flow, setFlow] = useState<'Light' | 'Medium' | 'Heavy'>('Medium');
  const [pain, setPain] = useState(5);
  const [loggedSymptoms, setLoggedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const symptomsList = ['Cramps', 'Headache', 'Bloating', 'Acne', 'Back Pain', 'Fatigue', 'Insomnia', 'Nausea'];

  const toggleSymptom = (symptom: string) => {
    setLoggedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Please enter start and end dates.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('End date must be after start date.');
      return;
    }

    addCycle({
      startDate,
      endDate,
      flow,
      pain,
      symptoms: loggedSymptoms,
      notes
    });

    // Reset fields
    setStartDate('');
    setEndDate('');
    setFlow('Medium');
    setPain(5);
    setLoggedSymptoms([]);
    setNotes('');
  };

  // Helper: calculate length in days
  const getCycleDuration = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Helper: get pain description
  const getPainDescription = (val: number) => {
    if (val === 0) return 'No pain';
    if (val <= 3) return 'Mild twinges / Dull ache';
    if (val <= 6) return 'Moderate uterine cramps';
    if (val <= 8) return 'Severe pelvic pain / Interferes with daily task';
    return 'Debilitating pain / Requires absolute rest';
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-darkText">Period tracker & history</h1>
          <p className="font-subtitle text-sm text-vintageText/70 italic">Log symptoms, flow metrics, and track your cycle length history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Logging Form */}
        <form onSubmit={handleSubmitLog} className="lg:col-span-5 glass-card rounded-premium-lg p-6 space-y-5">
          <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30 flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent animate-pulse" />
            Log Period Cycle
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-cream/55 border border-borderPink/50 px-3.5 py-2 rounded-premium-md text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-cream/55 border border-borderPink/50 px-3.5 py-2 rounded-premium-md text-xs"
              />
            </div>
          </div>

          {/* Flow Selector */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Flow Intensity</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Light', 'Medium', 'Heavy'] as const).map(f => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFlow(f)}
                  className={`py-2 rounded-premium-md text-xs font-semibold border transition-all duration-300 ${
                    flow === f 
                      ? 'bg-primary/45 border-accent text-accent shadow-soft-glow scale-103' 
                      : 'bg-cream/40 border-borderPink/40 text-vintageText hover:bg-secondary/20'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Pain Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Pain Intensity (0-10)</label>
              <span className="font-semibold text-accent">{pain} / 10</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="10" 
              value={pain}
              onChange={(e) => setPain(Number(e.target.value))}
              className="w-full cursor-pointer accent-accent"
            />
            <p className="text-[10px] text-vintageText/55 italic font-subtitle font-medium leading-none">
              {getPainDescription(pain)}
            </p>
          </div>

          {/* Symptoms Checklist */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Symptoms Logged</label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {symptomsList.map(s => {
                const checked = loggedSymptoms.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`px-3 py-1.5 rounded-full text-xxs font-semibold border transition-colors ${
                      checked 
                        ? 'bg-accent/15 border-accent text-accent' 
                        : 'bg-cream/40 border-borderPink/40 text-vintageText/80 hover:bg-secondary/20'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Personal reflections & notes</label>
            <textarea
              placeholder="How are you holding space for yourself today?"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-cream/40 border border-borderPink/60 p-3 rounded-premium-md text-xs resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Cycle Log</span>
          </button>
        </form>

        {/* Right Column: Cycle Timeline History */}
        <div className="lg:col-span-7 glass-card rounded-premium-lg p-6 space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-borderPink/30">
            <h3 className="font-heading text-lg font-semibold text-darkText flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Cycle History Timeline
            </h3>
            <span className="text-[10px] font-bold text-accent font-subtitle uppercase tracking-widest">Logs database</span>
          </div>

          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {cycles.length > 0 ? (
              cycles.map((c, idx) => {
                const duration = getCycleDuration(c.startDate, c.endDate);
                return (
                  <div key={c.id} className="relative pl-6 border-l-2 border-accent/25 py-1">
                    {/* Timeline Node Bullet */}
                    <div className="absolute -left-1.5 top-2 w-3.5 h-3.5 rounded-full bg-accent border-2 border-white shadow-soft-glow flex items-center justify-center text-[7px] text-white">✨</div>
                    
                    <div className="bg-cream/40 border border-borderPink/35 p-4 rounded-premium-md space-y-3 relative group">
                      <button 
                        onClick={() => deleteCycle(c.id)}
                        title="Delete log"
                        className="absolute top-4 right-4 text-vintageText/45 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h4 className="font-heading text-base font-semibold text-darkText">
                            Cycle Log #{cycles.length - idx}
                          </h4>
                          <p className="text-[10px] text-vintageText/55 font-subtitle italic">
                            {c.startDate} to {c.endDate}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-primary/45 text-accent text-xs font-semibold font-subtitle italic border border-accent/20 align-self-start sm:align-self-auto">
                          {duration} Days Period
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xxs font-body text-vintageText/80">
                        <div>
                          <span className="font-semibold text-darkText">Flow:</span> {c.flow}
                        </div>
                        <div>
                          <span className="font-semibold text-darkText">Pain level:</span> {c.pain} / 10
                        </div>
                      </div>

                      {c.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {c.symptoms.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded bg-cream border border-borderPink/45 text-[9px] text-vintageText/70 font-semibold uppercase tracking-wider font-subtitle">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {c.notes && (
                        <p className="text-xxs leading-relaxed bg-white/50 p-2 rounded border border-borderPink/20 text-vintageText/75 italic">
                          "{c.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-vintageText/50 italic space-y-2">
                <ShieldAlert className="w-8 h-8 text-accent/40 mx-auto" />
                <p>No cycle history has been logged yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
