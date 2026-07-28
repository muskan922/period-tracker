import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Smile,
  Heart,
  FileText,
  Users,
  CalendarDays,
  Pill,
  Settings,
  User,
  LogOut,
  Flower
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { profile, setIsLoggedIn } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-rose-400' },
    { id: 'tracker', label: 'Period Tracker', icon: Heart, color: 'text-pink-400' },
    { id: 'calendar', label: 'Luxury Calendar', icon: Calendar, color: 'text-amber-400' },
    { id: 'predictions', label: 'AI Predictions', icon: Sparkles, color: 'text-purple-400' },
    { id: 'mood', label: 'Mood Journal', icon: Smile, color: 'text-teal-400' },
    { id: 'symptoms', label: 'Symptom Logger', icon: Flower, color: 'text-indigo-400' },
    { id: 'medication', label: 'Pill Reminders', icon: Pill, color: 'text-violet-400' },
    { id: 'appointments', label: 'Consultations', icon: CalendarDays, color: 'text-sky-400' },
    { id: 'community', label: 'Sister Circle', icon: Users, color: 'text-emerald-400' },
    { id: 'reports', label: 'Wellness Reports', icon: FileText, color: 'text-rose-400' },
  ];

  const bottomItems = [
    { id: 'profile', label: 'My Sanctuary', icon: User },
    { id: 'settings', label: 'Preferences', icon: Settings }
  ];

  return (
    <aside className="w-72 h-screen flex flex-col glass-panel border-r border-borderPink/60 shrink-0 sticky top-0 z-20">
      {/* Brand Logo */}
      <div className="p-8 pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent shadow-soft-glow float-element">
          <Flower className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-darkText leading-none">Flora</h1>
          <p className="font-subtitle text-xs text-accent italic mt-0.5">AI Period & Wellness</p>
        </div>
      </div>

      <div className="elegant-divider my-2 mx-6"></div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-1.5 scrollbar-thin">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-premium-md text-sm font-medium transition-all duration-300 ${isActive
                ? 'bg-primary/50 text-darkText shadow-soft-glow border-l-4 border-accent'
                : 'text-vintageText hover:bg-secondary/40 hover:text-darkText'
                }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? item.color : 'text-vintageText/70'}`} />
              <span className="font-body tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="elegant-divider mx-6 my-2"></div>

      {/* Bottom Profile and Settings */}
      <div className="p-4 space-y-1.5">
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-premium-md text-sm font-medium transition-all duration-300 ${isActive
                ? 'bg-primary/50 text-darkText shadow-soft-glow'
                : 'text-vintageText/80 hover:bg-secondary/40 hover:text-darkText'
                }`}
            >
              <Icon className="w-4.5 h-4.5 text-vintageText/70" />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Old Photograph Profile Card */}
        <div className="mt-6 p-4 rounded-premium-md bg-[#FF8FB8]/20 border border-borderPink/80 flex items-center gap-3 relative shadow-premium overflow-visible">
          {/* Masking Tape */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-4.5 bg-[#FAF2E8]/80 border border-amber-800/10 shadow-sm rotate-[-2deg] opacity-90 text-[8px] text-amber-800/40 text-center select-none font-subtitle pointer-events-none">
            ░ Flora Tape ░
          </div>

          {/* Lavender sprig behind photo */}
          <div className="absolute -bottom-2 -left-2 text-xl pointer-events-none select-none rotate-[-45deg] opacity-75">
            🌿
          </div>

          {/* Polaroid photo style */}
          <div className="relative p-1 bg-white border border-slate-200 shadow-md shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-10 h-10 object-cover"
            />
            {/* Wax Seal on the photo */}
            <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-[#E06C92] border border-[#C89F65]/40 flex items-center justify-center shadow-sm select-none text-[8px]">
              🌸
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-[#4B3B45] truncate font-heading">{profile.name}</h4>
            <p className="text-[13px] text-[#4B3B45]/90 truncate font-subtitle italic">Active cycle log ❤️</p>
          </div>

          <button
            onClick={() => setIsLoggedIn(false)}
            title="Log Out"
            className="w-7 h-7 rounded-full flex items-center justify-center text-vintageText/60 hover:text-red-400 hover:bg-red-50/50 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
