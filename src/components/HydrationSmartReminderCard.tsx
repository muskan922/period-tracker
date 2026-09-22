import React, { useState } from 'react';
import { Clock, Bell, CheckCircle2, Sparkles } from 'lucide-react';

interface HydrationSmartReminderCardProps {
  progressPercent: number;
}

export const HydrationSmartReminderCard: React.FC<HydrationSmartReminderCardProps> = ({ progressPercent }) => {
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [intervalHours, setIntervalHours] = useState<number>(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isGoalReached = progressPercent >= 100;

  // Calculate dynamic reminder countdown label based on selected interval
  const getNextReminderTimeLabel = () => {
    switch (intervalHours) {
      case 1: return '~25 min';
      case 2: return '~45 min';
      case 3: return '~1 hr 15 min';
      case 4: return '~2 hr 10 min';
      default: return '~45 min';
    }
  };

  const triggerTestAlert = () => {
    setToastMessage('💧 Reminder Alert: Time to drink a glass of water to stay hydrated!');
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="glass-card rounded-premium-lg p-5 space-y-3 border border-borderPink/60 bg-white/90 relative">
      {/* Toast popup when test alert triggered */}
      {toastMessage && (
        <div className="absolute top-2 right-2 left-2 z-30 p-3 rounded-premium-md bg-accent text-white font-semibold text-xs shadow-luxury animate-slideDown flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            {toastMessage}
          </span>
          <button onClick={() => setToastMessage(null)} className="text-white text-xs font-bold opacity-80 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-accent">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading text-sm font-bold text-darkText flex items-center gap-1.5">
              Smart Hydration Reminders
            </h4>
            <p className="text-[11px] text-vintageText">
              Customizable drink alerts tailored to your daily progress.
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          onClick={() => setReminderEnabled(!reminderEnabled)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
            reminderEnabled
              ? 'bg-accent text-white shadow-sm'
              : 'bg-primary/40 text-vintageText border border-borderPink/60'
          }`}
        >
          {reminderEnabled ? 'Enabled 🔔' : 'Disabled 🔕'}
        </button>
      </div>

      {reminderEnabled && (
        <div className="pt-2 border-t border-borderPink/40 space-y-3">
          {/* Status Indicator */}
          {isGoalReached ? (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Daily Goal Reached! 🎉</strong> Reminders are automatically paused for today so you aren't disturbed.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-secondary/70 border border-borderPink/60 text-darkText text-xs flex items-center justify-between font-medium">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent shrink-0 animate-bounce" />
                <span>Next reminder scheduled in <strong>{getNextReminderTimeLabel()}</strong>.</span>
              </div>
              <button
                onClick={triggerTestAlert}
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent/20 text-accent hover:bg-accent hover:text-white transition-colors"
                title="Test reminder alert popup"
              >
                Test Alert 🔔
              </button>
            </div>
          )}

          {/* Interval Selector */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-medium text-vintageText">Reminder Interval:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map(hrs => (
                <button
                  key={hrs}
                  onClick={() => setIntervalHours(hrs)}
                  className={`px-2.5 py-1 rounded-md font-bold text-xs transition-all ${
                    intervalHours === hrs
                      ? 'bg-accent text-white shadow-sm'
                      : 'bg-secondary/40 text-vintageText hover:bg-secondary/70 border border-borderPink/40'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
