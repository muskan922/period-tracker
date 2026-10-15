import React, { useState } from 'react';
import { useApp, type Medication } from '../context/AppContext';
import { Pill, Bell, Plus, Check, Clock, Award, Edit3, Trash2, X, AlertCircle } from 'lucide-react';

export const MedicationPage: React.FC = () => {
  const { medications, toggleMedication, addMedication, updateMedication, deleteMedication } = useApp();
  
  // Modals state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states (shared for add & edit)
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [repeat, setRepeat] = useState('Daily');
  const [notify, setNotify] = useState(true);

  // Dynamic today's date
  const todayStr = new Date().toISOString().split('T')[0];

  const resetForm = () => {
    setName('');
    setDosage('');
    setTime('08:00 AM');
    setRepeat('Daily');
    setNotify(true);
    setShowAddForm(false);
    setEditingMed(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleOpenEdit = (m: Medication) => {
    setName(m.name);
    setDosage(m.dosage);
    setTime(m.time);
    setRepeat(m.repeat);
    setNotify(m.notifications);
    setEditingMed(m);
    setShowAddForm(false);
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      alert('Please fill out supplement name and dosage.');
      return;
    }

    if (editingMed) {
      updateMedication(editingMed.id, {
        name: name.trim(),
        dosage: dosage.trim(),
        time,
        repeat,
        notifications: notify
      });
    } else {
      addMedication({
        name: name.trim(),
        dosage: dosage.trim(),
        time,
        repeat,
        notifications: notify
      });
    }

    resetForm();
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMedication(deletingId);
      setDeletingId(null);
    }
  };

  const takenCount = medications.filter(m => m.completedDates.includes(todayStr)).length;
  const adherencePercent = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 100;

  return (
    <div className="space-y-6 font-body">
      
      {/* Title & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
            <Pill className="w-7 h-7 text-accent" />
            Supplement Cabinet & Reminders
          </h1>
          <p className="font-subtitle text-sm text-vintageText/70 italic">
            Curate your daily vitamin regimens, hormone sync infusions, and prescriptions.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Supplement</span>
        </button>
      </div>

      {/* Add / Edit Medication Form (Inlined Card) */}
      {(showAddForm || editingMed) && (
        <form onSubmit={handleSaveMedication} className="glass-card rounded-premium-lg p-6 space-y-4 max-w-xl mx-auto border border-accent/35 bg-cream/30 animate-fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-borderPink/30">
            <h3 className="font-heading text-base font-semibold text-darkText flex items-center gap-2">
              <Pill className="w-4 h-4 text-accent" />
              {editingMed ? `Edit ${editingMed.name}` : 'Add New Supplement / Pill'}
            </h3>
            <button type="button" onClick={resetForm} className="text-vintageText/60 hover:text-accent">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Supplement Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Magnesium Bisglycinate" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Dosage</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 200mg / 1 capsule" 
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Time of Day</label>
              <input 
                type="text" 
                placeholder="09:00 AM" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs focus:ring-1 focus:ring-accent outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Repeat Interval</label>
              <select 
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText focus:ring-1 focus:ring-accent outline-none"
              >
                <option value="Daily">Daily</option>
                <option value="Every other day">Every other day</option>
                <option value="Only in Follicular Phase">Only in Follicular Phase</option>
                <option value="Only in Luteal Phase">Only in Luteal Phase</option>
                <option value="Only during menstruation">Only during menstruation</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Enable push reminders</span>
            <input 
              type="checkbox" 
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="w-4 h-4 rounded text-accent accent-accent cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              type="button" 
              onClick={resetForm}
              className="flex-1 py-2 rounded-full border border-borderPink/60 text-xs text-vintageText hover:bg-secondary/20 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:bg-darkText transition-colors shadow-soft-glow"
            >
              {editingMed ? 'Save Changes' : 'Confirm Supplement'}
            </button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs p-4 animate-fade-in">
          <div className="glass-card rounded-premium-lg p-6 max-w-sm w-full border border-red-200 bg-white shadow-luxury space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h4 className="font-heading text-base font-semibold text-darkText">Remove Supplement?</h4>
                <p className="text-xs text-vintageText/70">This will remove the item and its logging history.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2 rounded-full border border-borderPink/60 text-xs text-vintageText hover:bg-cream transition-colors"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cabinet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.length === 0 ? (
          <div className="col-span-full p-12 text-center glass-card rounded-premium-lg border border-dashed border-borderPink/60">
            <p className="text-sm text-vintageText/60 italic font-subtitle">Your supplement cabinet is empty. Click "Add Supplement" above to start tracking vitamins & pills.</p>
          </div>
        ) : (
          medications.map(m => {
            const isTakenToday = m.completedDates.includes(todayStr);
            return (
              <div 
                key={m.id} 
                className={`glass-card rounded-premium-lg p-6 flex flex-col justify-between space-y-4 border transition-all duration-300 relative group ${
                  isTakenToday 
                    ? 'bg-rose-50/15 border-rose-200/50 opacity-90' 
                    : 'bg-cream/40 border-borderPink/45 hover:shadow-soft-glow'
                }`}
              >
                {/* Action Toolbar on Hover */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent">
                    <Pill className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(m)}
                      title="Edit Supplement"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-vintageText/60 hover:text-accent hover:bg-white/80 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeletingId(m.id)}
                      title="Delete Supplement"
                      className="w-7 h-7 rounded-full flex items-center justify-center text-vintageText/60 hover:text-red-500 hover:bg-red-50/80 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Checkbox button */}
                    <button 
                      onClick={() => toggleMedication(m.id, todayStr)}
                      title={isTakenToday ? 'Mark as not taken' : 'Mark as taken today'}
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ml-1 ${
                        isTakenToday 
                          ? 'bg-rose-400 border-rose-500 text-white shadow-soft-glow' 
                          : 'border-borderPink/60 text-vintageText/60 hover:bg-cream bg-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
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
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <Bell className="w-3 h-3 text-rose-400" />
                      Alert active
                    </span>
                  ) : (
                    <span className="text-vintageText/40">Alert muted</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completion Stat box */}
      <div className="glass-card rounded-premium-lg p-6 bg-gradient-to-r from-cream to-primary/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-accent/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Award className="w-5.5 h-5.5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-heading text-base font-semibold text-darkText">Daily Cabinet Adherence</h4>
            <p className="text-xs text-vintageText/70 leading-normal font-body">
              {takenCount} of {medications.length} items logged for today ({todayStr}).
            </p>
          </div>
        </div>
        <span className="font-heading text-2xl text-accent font-bold">{adherencePercent}% Adherence</span>
      </div>
    </div>
  );
};
