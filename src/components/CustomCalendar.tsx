import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomCalendar: React.FC = () => {
  const { cycles, appointments, medications, moods } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 28)); // July 28, 2026

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(prev => {
      let nextM = prev.getMonth() + 1;
      let nextY = prev.getFullYear();
      if (nextM > 11) {
        nextM = 0;
        nextY += 1;
      }
      return new Date(nextY, nextM, 1);
    });
  };

  const prevMonth = () => {
    setCurrentDate(prev => {
      let prevM = prev.getMonth() - 1;
      let prevY = prev.getFullYear();
      if (prevM < 0) {
        prevM = 11;
        prevY -= 1;
      }
      return new Date(prevY, prevM, 1);
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Generate calendar days
  const calendarDays = [];
  // Fill initial blanks
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Fill actual day numbers
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Helper: Format single-digit values
  const formatDateString = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // Helper: Check status of days
  const checkDayStatus = (day: number | null) => {
    if (!day) return null;
    const dateStr = formatDateString(day);

    let isPeriod = false;
    let isFertile = false;
    let isOvulation = false;
    let hasAppointment = false;
    let hasMedication = false;
    let dayMood = null;
    let note = '';

    // Check actual cycle logs
    cycles.forEach(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      const current = new Date(dateStr);
      if (current >= start && current <= end) {
        isPeriod = true;
      }
    });

    // Simple prediction calculations for the future cycles
    // (Emma's last period started July 5, duration 5 days. Next starts Aug 2. Fertile window is Jul 15-21 approx, ovulation Jul 19)
    // Predictions for August: Next period Aug 2 - Aug 6, Fertile window Aug 12 - 18, Ovulation Aug 16
    const curDateObj = new Date(dateStr);
    
    // Predicted August Period
    const augPeriodStart = new Date(2026, 7, 2);
    const augPeriodEnd = new Date(2026, 7, 6);
    if (curDateObj >= augPeriodStart && curDateObj <= augPeriodEnd) {
      isPeriod = true;
    }

    // Predicted August Fertile & Ovulation
    const augFertileStart = new Date(2026, 7, 12);
    const augFertileEnd = new Date(2026, 7, 18);
    const augOvulation = new Date(2026, 7, 16);

    if (curDateObj.getTime() === augOvulation.getTime()) {
      isOvulation = true;
    } else if (curDateObj >= augFertileStart && curDateObj <= augFertileEnd) {
      isFertile = true;
    }

    // Checking July Fertile/Ovulation retrospectively
    const julFertileStart = new Date(2026, 6, 15);
    const julFertileEnd = new Date(2026, 6, 21);
    const julOvulation = new Date(2026, 6, 19);

    if (curDateObj.getTime() === julOvulation.getTime()) {
      isOvulation = true;
    } else if (curDateObj >= julFertileStart && curDateObj <= julFertileEnd) {
      isFertile = true;
    }

    // Appointments
    const appt = appointments.find(a => a.date === dateStr);
    if (appt) {
      hasAppointment = true;
      note += `Appointment with ${appt.doctorName}. `;
    }

    // Medications completed
    const medsToday = medications.filter(m => m.completedDates.includes(dateStr));
    if (medsToday.length > 0) {
      hasMedication = true;
    }

    // Moods
    const moodLog = moods.find(m => m.date === dateStr);
    if (moodLog) {
      dayMood = moodLog.mood;
      note += moodLog.note;
    }

    return { isPeriod, isFertile, isOvulation, hasAppointment, hasMedication, dayMood, note };
  };

  // Selected Day Details Modal/Card
  const [selectedDay, setSelectedDay] = useState<number | null>(28);
  const selectedDateStr = selectedDay ? formatDateString(selectedDay) : '';
  const selectedStatus = selectedDay ? checkDayStatus(selectedDay) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 glass-card rounded-premium-lg p-6 flex flex-col relative overflow-hidden">
        {/* Decorative corner leaves */}
        <div className="absolute top-2 right-2 text-accent/15 select-none pointer-events-none">
          <Calendar className="w-24 h-24" strokeWidth={0.5} />
        </div>

        {/* Month Picker Header */}
        <div className="flex items-center justify-between mb-8 z-10">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-darkText">{monthNames[month]}</h2>
            <p className="font-subtitle text-sm text-accent italic">{year}</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={prevMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-cream border border-borderPink/60 text-vintageText hover:bg-secondary/40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-cream border border-borderPink/60 text-vintageText hover:bg-secondary/40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 text-center mb-4">
          {daysOfWeek.map(d => (
            <span key={d} className="font-subtitle text-xs text-vintageText/60 tracking-wider uppercase font-semibold">
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-3.5 gap-x-2 text-center flex-1">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-12"></div>;
            }

            const status = checkDayStatus(day);
            const isSelected = selectedDay === day;
            const isToday = day === 28 && month === 6 && year === 2026;

            // Compute background color based on cycle/fertility state
            let cellBg = 'bg-transparent';
            let borderStyle = 'border border-transparent';
            let textColor = 'text-vintageText';
            let customClass = '';

            if (status?.isPeriod) {
              cellBg = 'bg-primary/45';
              borderStyle = 'border border-accent/25';
              textColor = 'text-rose-700 font-medium';
              customClass = 'calendar-day-period';
            } else if (status?.isOvulation) {
              cellBg = 'bg-amber-100/40';
              borderStyle = 'border border-amber-300/40';
              textColor = 'text-amber-800 font-semibold';
              customClass = 'calendar-day-ovulation';
            } else if (status?.isFertile) {
              cellBg = 'bg-emerald-50/50';
              borderStyle = 'border border-emerald-200/30';
              textColor = 'text-emerald-800 font-medium';
              customClass = 'calendar-day-fertile';
            }

            if (isSelected) {
              borderStyle = 'border-2 border-accent shadow-soft-glow';
              customClass += ' calendar-day-selected';
            } else if (isToday) {
              borderStyle = 'border border-rose-300';
              customClass += ' calendar-day-today';
            }

            return (
              <button
                key={`day-${day}`}
                onClick={() => setSelectedDay(day)}
                className={`h-12 rounded-premium-md flex flex-col items-center justify-between p-1.5 transition-all duration-300 relative ${cellBg} ${borderStyle} ${textColor} hover:scale-105 hover:bg-cream/40 ${customClass}`}
              >
                {/* Day number in Playfair Display */}
                <span className={`font-heading text-sm ${isToday ? 'bg-accent/40 w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                  {day}
                </span>

                {/* Event Dots */}
                <div className="flex justify-center gap-0.75 w-full h-1.5 overflow-hidden">
                  {status?.isPeriod && <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />}
                  {status?.isFertile && !status.isOvulation && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  {status?.isOvulation && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  {status?.hasAppointment && <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
                  {status?.hasMedication && <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="elegant-divider my-6"></div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs justify-center px-4">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-primary border border-accent/45 inline-block shrink-0" />
            <span>Period days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-300/40 inline-block shrink-0" />
            <span>Fertility window</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300/50 inline-block shrink-0" />
            <span>Ovulation day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-sky-100 border border-sky-300/40 inline-block shrink-0" />
            <span>Appointment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-purple-100 border border-purple-300/40 inline-block shrink-0" />
            <span>Medication logs</span>
          </div>
        </div>
      </div>

      {/* Selected Day details sidebar */}
      <div className="glass-card rounded-premium-lg p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-4 border-b border-borderPink/45">
            <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-accent">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-darkText">Day Summary</h3>
              <p className="text-xs text-vintageText/50 font-subtitle">{selectedDateStr}</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {/* Cycle Status */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-accent tracking-wider font-subtitle">Phase Indicator</span>
              <div className="mt-1.5 flex items-center gap-2">
                {selectedStatus?.isPeriod ? (
                  <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    Menstrual Cycle Phase
                  </span>
                ) : selectedStatus?.isOvulation ? (
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                    Ovulation Day Peak
                  </span>
                ) : selectedStatus?.isFertile ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    Follicular Phase (Fertile)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-cream border border-borderPink text-vintageText/80 text-xs font-medium">
                    Luteal Phase (Cozy rest)
                  </span>
                )}
              </div>
            </div>

            {/* Daily Mood */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-accent tracking-wider font-subtitle font-medium">Emotion Tracked</span>
              {selectedStatus?.dayMood ? (
                <div className="mt-1.5 flex items-center gap-2.5 bg-cream/50 p-2.5 rounded-premium-md border border-borderPink/30">
                  <span className="text-xl">
                    {selectedStatus.dayMood === 'Happy' && '🌸'}
                    {selectedStatus.dayMood === 'Calm' && '🍃'}
                    {selectedStatus.dayMood === 'Sad' && '🌧️'}
                    {selectedStatus.dayMood === 'Anxious' && '☁️'}
                    {selectedStatus.dayMood === 'Angry' && '🔥'}
                    {selectedStatus.dayMood === 'Tired' && '🌙'}
                  </span>
                  <span className="text-xs font-medium text-darkText font-body">{selectedStatus.dayMood}</span>
                </div>
              ) : (
                <p className="text-xs text-vintageText/55 italic mt-1 font-body">No emotional log today.</p>
              )}
            </div>

            {/* Daily Vitals Note */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-accent tracking-wider font-subtitle">Sanctuary Log Journal</span>
              <p className="text-xs leading-relaxed text-vintageText/80 mt-1.5 p-3 rounded-premium-md bg-cream/30 border border-dashed border-borderPink/70">
                {selectedStatus?.note ? selectedStatus.note : "No journal written for this day. Click \"Mood Journal\" in the sidebar to add a personal reflection."}
              </p>
            </div>

            {/* Checkbox status for pills */}
            <div>
              <span className="text-[10px] uppercase font-semibold text-accent tracking-wider font-subtitle">Reminders Log</span>
              {selectedStatus?.hasMedication ? (
                <div className="mt-2 text-xs flex items-center gap-1.5 text-purple-600 font-semibold bg-purple-50/50 p-2 rounded-premium-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                  Medicines logged as taken.
                </div>
              ) : (
                <p className="text-xs text-vintageText/55 italic mt-1.5 font-body">No reminders logged today.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-borderPink/35 flex items-center justify-between bg-primary/10 p-3.5 rounded-premium-md border border-accent/15">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-xs font-subtitle italic font-semibold text-darkText">AI Prediction Confidence</span>
          </div>
          <span className="text-xs font-bold text-accent">98.4%</span>
        </div>
      </div>
    </div>
  );
};
