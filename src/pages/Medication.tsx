import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Pill, Bell, Plus, Check, Clock, Award } from 'lucide-react';

export const MedicationPage: React.FC = () => {
  const { medications, toggleMedication, addMedication } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  // New medication form states
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [repeat, setRepeat] = useState('Daily');
  const [notify, setNotify] = useState(true);

  const todayStr = '2026-07-28';

  const handleCreateMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) {
      alert('Please fill out medication name and dosage.');
      return;
    }

    addMedication({
      name,
      dosage,
      time,
      repeat,
      notifications: notify
    });

    setName('');
    setDosage('');
    setTime('08:00 AM');
    setRepeat('Daily');
    setNotify(true);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
            <Pill className="w-7 h-7 text-accent" />
            Supplement Cabinet & Reminders
          </h1>
          <p className="font-subtitle text-sm text-vintageText/70 italic">Curate your daily vitamin regimens, hormone sync infusions, and pills.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Supplement</span>
        </button>
      </div>

      {/* Optional Add Medication Form (Inlined Card) */}
      {showAddForm && (
        <form onSubmit={handleCreateMedication} className="glass-card rounded-premium-lg p-6 space-y-4 max-w-xl mx-auto border border-accent/35 bg-cream/30">
          <h3 className="font-heading text-base font-semibold text-darkText">Add New supplement/pill</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Supplement Name</label>
              <input 
                type="text" 
                placeholder="Coenzyme Q10" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Dosage</label>
              <input 
                type="text" 
                placeholder="200mg / 1 tablet" 
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Time of Day</label>
              <input 
                type="text" 
                placeholder="09:00 AM" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Repeat Interval</label>
              <select 
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText"
              >
                <option value="Daily">Daily</option>
                <option value="Every other day">Every other day</option>
                <option value="Only in Luteal Phase">Only in Luteal Phase</option>
                <option value="Only during menstruation">Only during menstruation</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Enable push reminders</span>
            <input 
              type="checkbox" 
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="w-4 h-4 rounded text-accent accent-accent"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2 rounded-full border border-borderPink/60 text-xs text-vintageText hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:bg-darkText transition-colors shadow-soft-glow"
            >
              Confirm supplement
            </button>
          </div>
        </form>
      )}

      {/* Cabinet Cabinet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {medications.map(m => {
          const isTakenToday = m.completedDates.includes(todayStr);
          return (
            <div 
              key={m.id} 
              className={`glass-card rounded-premium-lg p-6 flex flex-col justify-between space-y-4 border transition-all duration-300 ${
                isTakenToday 
                  ? 'bg-purple-50/10 border-purple-200/40 opacity-85' 
                  : 'bg-cream/40 border-borderPink/45 hover:shadow-soft-glow'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent">
                  <Pill className="w-5 h-5" />
                </div>
                <button 
                  onClick={() => toggleMedication(m.id, todayStr)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isTakenToday 
                      ? 'bg-purple-400 border-purple-500 text-white shadow-soft-glow' 
                      : 'border-borderPink/60 text-vintageText/60 hover:bg-cream bg-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className={`font-heading text-lg font-semibold text-darkText leading-none ${isTakenToday ? 'line-through text-vintageText/50' : ''}`}>
                  {m.name}
                </h3>
                <p className="text-xs text-vintageText/70">{m.dosage} • {m.repeat}</p>
              </div>

              <div className="elegant-divider my-2"></div>

              <div className="flex items-center justify-between text-xxs font-subtitle italic text-vintageText/60">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  Take at {m.time}
                </span>
                {m.notifications ? (
                  <span className="flex items-center gap-1 text-purple-500 font-semibold">
                    <Bell className="w-3 h-3 text-purple-400 animate-bounce" />
                    Alert active
                  </span>
                ) : (
                  <span className="text-vintageText/40">Alert muted</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Stat box */}
      <div className="glass-card rounded-premium-lg p-6 bg-gradient-to-r from-cream to-primary/10 flex items-center justify-between border border-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Award className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold text-darkText">Consistency Trophy Tracker</h4>
            <p className="text-xs text-vintageText/70 leading-normal font-body">Marking pills as taken adds tokens to your monthly wellness PDF charts.</p>
          </div>
        </div>
        <span className="font-heading text-2xl text-accent font-bold">100% Weekly Streak</span>
      </div>
    </div>
  );
};
