import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarDays, Plus, Clock, Video, ShieldAlert, Check } from 'lucide-react';

export const Appointments: React.FC = () => {
  const { appointments, addAppointment } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);

  // New Appointment form
  const [doctorName, setDoctorName] = useState('Dr. Evelyn Fontaine');
  const [specialty, setSpecialty] = useState('Holistic Gynecologist');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  const doctorsList = [
    { name: 'Dr. Evelyn Fontaine', specialty: 'Holistic Gynecologist', avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=150', rating: '4.9 (124 reviews)' },
    { name: 'Dr. Sarah Lin', specialty: 'Reproductive Endocrinologist', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150', rating: '4.8 (89 reviews)' },
    { name: 'Dr. Aria Vance', specialty: 'Hormonal Nutritionist', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150', rating: '4.9 (192 reviews)' }
  ];

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert('Please select a date.');
      return;
    }

    addAppointment({
      doctorName,
      specialty,
      date,
      time,
      notes
    });

    setDate('');
    setNotes('');
    setShowAddForm(false);
    alert('Appointment scheduled & synced to Google Calendar! 📅');
  };

  return (
    <div className="space-y-6 font-body">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-darkText flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-accent" />
            Specialist Consultations
          </h1>
          <p className="font-subtitle text-sm text-vintageText/70 italic">Consult gynecologists, nutritionists, and endocrinologists directly inside your sanctuary.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Session</span>
        </button>
      </div>

      {/* Booking Form Overlay */}
      {showAddForm && (
        <form onSubmit={handleCreateAppointment} className="glass-card rounded-premium-lg p-6 space-y-4 max-w-xl mx-auto border border-accent/35 bg-cream/30">
          <h3 className="font-heading text-base font-semibold text-darkText">Schedule Virtual Consultation</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Select Doctor</label>
              <select 
                value={doctorName}
                onChange={(e) => {
                  setDoctorName(e.target.value);
                  const doc = doctorsList.find(d => d.name === e.target.value);
                  if (doc) setSpecialty(doc.specialty);
                }}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText"
              >
                {doctorsList.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Specialty Area</label>
              <input 
                type="text" 
                disabled 
                value={specialty}
                className="w-full bg-cream/50 border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Consultation Date</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Preferred Slot</label>
              <input 
                type="text" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-borderPink/60 px-3.5 py-2 rounded-premium-md text-xs text-vintageText"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">Clinical Notes & Symptoms description</label>
            <textarea
              placeholder="What questions or cycle symptoms would you like to cover in this telemedicine slot?"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-borderPink/60 p-3 rounded-premium-md text-xs resize-none"
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
              Book & Sync Calendar
            </button>
          </div>
        </form>
      )}

      {/* Directory & Upcoming Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Doctors Directory */}
        <div className="lg:col-span-2 glass-card rounded-premium-lg p-6 space-y-6">
          <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30">Sanctuary Doctors Directory</h3>
          
          <div className="space-y-4">
            {doctorsList.map(d => (
              <div key={d.name} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-borderPink/40 rounded-premium-lg bg-cream/35 hover:shadow-soft-glow transition-all duration-300">
                <div className="flex items-center gap-4">
                  <img 
                    src={d.avatar} 
                    alt={d.name} 
                    className="w-12 h-12 rounded-full object-cover border border-accent/30 shadow-soft-glow"
                  />
                  <div>
                    <h4 className="font-heading text-base font-semibold text-darkText">{d.name}</h4>
                    <p className="text-xs text-accent font-subtitle italic mt-0.5">{d.specialty}</p>
                    <p className="text-[10px] text-vintageText/60 mt-1 font-body">Consultation Rating: {d.rating}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setDoctorName(d.name);
                    setSpecialty(d.specialty);
                    setShowAddForm(true);
                  }}
                  className="px-4 py-2 border border-accent/30 text-accent bg-white rounded-full text-xxs font-bold uppercase tracking-wider hover:bg-accent hover:text-white transition-all shadow-soft-glow self-start sm:self-auto"
                >
                  Schedule Telehealth
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Appointments list */}
        <div className="glass-card rounded-premium-lg p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-lg font-semibold text-darkText pb-2 border-b border-borderPink/30">Your Scheduled Visits</h3>
            
            <div className="space-y-4 mt-4 max-h-[330px] overflow-y-auto pr-1">
              {appointments.map(a => (
                <div key={a.id} className="bg-cream/40 border border-borderPink/35 p-3.5 rounded-premium-md space-y-2.5 relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-darkText">{a.doctorName}</h4>
                      <p className="text-[10px] text-accent font-subtitle italic">{a.specialty}</p>
                    </div>
                    {a.synced && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-0.5 font-subtitle">
                        <Check className="w-3 h-3 text-emerald-500" />
                        G-Cal Linked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xxs text-vintageText/60 font-body">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {a.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5 text-accent" />
                      {a.date}
                    </span>
                  </div>

                  {a.notes && (
                    <p className="text-xxs leading-relaxed bg-white/50 p-2 rounded border border-borderPink/20 text-vintageText/75 italic">
                      "{a.notes}"
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 text-xxs font-bold text-accent font-subtitle pt-1">
                    <Video className="w-3.5 h-3.5" />
                    <span className="hover:underline cursor-pointer">Virtual Telehealth link active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 border border-accent/15 rounded-premium-md p-4 flex items-start gap-3 mt-4">
            <ShieldAlert className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-xxs leading-relaxed text-vintageText/75 font-body">
              <span className="font-semibold text-darkText">Reminder:</span> Log cycle deviations and basal temperatures 24 hours prior to consultations to generate automatic physician reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
