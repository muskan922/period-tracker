import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Award, Edit3, Target, CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [cycleLength, setCycleLength] = useState(profile.cycleLength);
  const [periodLength, setPeriodLength] = useState(profile.periodLength);
  const [goalInput, setGoalInput] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      age: Number(age),
      cycleLength: Number(cycleLength),
      periodLength: Number(periodLength)
    });
    setIsEditing(false);
    alert('Sanctuary profile updated! 🌸');
  };

  const handleAddGoal = () => {
    if (!goalInput) return;
    updateProfile({
      goals: [...profile.goals, goalInput]
    });
    setGoalInput('');
  };

  const handleRemoveGoal = (goalIndex: number) => {
    updateProfile({
      goals: profile.goals.filter((_, idx) => idx !== goalIndex)
    });
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div>
        <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
          <User className="w-7 h-7 text-accent" />
          My Personal Sanctuary
        </h1>
        <p className="font-subtitle text-sm text-vintageText/70 italic">Curate your biological metrics, achievements, and focus goals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Avatar & Basic Info Card */}
        <div className="lg:col-span-4 glass-card rounded-premium-lg p-6 flex flex-col items-center text-center space-y-4">
          <img 
            src={profile.avatar} 
            alt={profile.name} 
            className="w-28 h-28 rounded-full object-cover border-2 border-accent shadow-premium"
          />
          
          <div>
            <h2 className="font-heading text-2xl font-semibold text-darkText">{profile.name}</h2>
            <p className="font-subtitle text-xs text-accent italic uppercase tracking-wider font-semibold">Age {profile.age} • Cycle Tracker</p>
          </div>

          <div className="elegant-divider my-2 w-full"></div>

          <div className="grid grid-cols-2 gap-4 w-full text-center text-xs">
            <div className="bg-cream/45 p-3 rounded-premium-md border border-borderPink/30">
              <span className="text-[9px] uppercase font-bold text-accent tracking-wider font-subtitle">Period Length</span>
              <p className="font-heading text-xl text-darkText mt-1">{profile.periodLength} days</p>
            </div>
            <div className="bg-cream/45 p-3 rounded-premium-md border border-borderPink/30">
              <span className="text-[9px] uppercase font-bold text-accent tracking-wider font-subtitle">Cycle Average</span>
              <p className="font-heading text-xl text-darkText mt-1">{profile.cycleLength} days</p>
            </div>
          </div>

          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-full border border-accent/40 text-accent bg-white text-xxs font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-all shadow-soft-glow w-full flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Sanctuary Profile</span>
            </button>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3.5 w-full text-left bg-cream/20 p-4 rounded-premium-lg border border-borderPink/40">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-vintageText/60 uppercase font-subtitle">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-vintageText/60 uppercase font-subtitle">Age</label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-white border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-vintageText/60 uppercase font-subtitle">Period</label>
                  <input 
                    type="number" 
                    value={periodLength}
                    onChange={(e) => setPeriodLength(Number(e.target.value))}
                    className="w-full bg-white border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-vintageText/60 uppercase font-subtitle">Cycle</label>
                  <input 
                    type="number" 
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full bg-white border border-borderPink/60 px-3 py-1.5 rounded-premium-md text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 border border-borderPink/60 rounded-full text-xxs font-semibold text-center hover:bg-secondary/20"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 bg-accent text-white rounded-full text-xxs font-bold uppercase tracking-wider hover:bg-darkText transition-colors shadow-soft-glow"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Goals and Achievements */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Goals Card */}
          <div className="glass-card rounded-premium-lg p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Focus Wellness Goals
            </h3>

            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Add a wellness focus (e.g. balance cortisol level)..." 
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                className="flex-1 bg-cream/45 border border-borderPink/60 px-4 py-2 rounded-full text-xs font-body"
              />
              <button 
                onClick={handleAddGoal}
                className="px-4 py-2 bg-accent hover:bg-darkText text-white rounded-full text-xs font-semibold shadow-soft-glow transition-colors shrink-0"
              >
                Add Target
              </button>
            </div>

            <div className="space-y-2.5">
              {profile.goals.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-cream/40 border border-borderPink/35 rounded-premium-md text-xs font-body text-vintageText">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span>{g}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveGoal(idx)}
                    className="text-vintageText/55 hover:text-red-400 text-xxs font-subtitle hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Card */}
          <div className="glass-card rounded-premium-lg p-6 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent animate-pulse" />
              Sanctuary Milestones & Streak Awards
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.achievements.map((ach, idx) => (
                <div key={idx} className="bg-cream/40 border border-borderPink/35 rounded-premium-lg p-4 text-center space-y-2.5 hover:shadow-soft-glow transition-all duration-300">
                  <span className="text-3xl filter drop-shadow-sm">{ach.icon}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-darkText font-body truncate">{ach.title}</h4>
                    <p className="text-[10px] text-vintageText/55 font-subtitle italic mt-0.5">{ach.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
