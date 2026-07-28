import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Search,
  Menu,
  X,
  CalendarDays,
  Sparkles,
  Flower
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, setCurrentTab }) => {
  const { notifications, markNotificationsRead, profile, updateProfile } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const getCycleDay = () => {
    if (!profile.lastPeriodStart) return 23;
    const start = new Date(profile.lastPeriodStart);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 1;
    return (diffDays % profile.cycleLength) + 1;
  };

  const currentCycleDay = getCycleDay();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Luxury quotes for the top banner based on tabs
  // (Removed getTabQuote since greetings are now static quotes)

  return (
    <div className="flex min-h-screen vintage-paper overflow-hidden text-vintageText select-none">
      {/* Botanical Decorative Overlays */}
      <div className="fixed -top-16 -right-16 w-96 h-96 rounded-full bg-rose-100/10 blur-3xl pointer-events-none z-0"></div>
      <div className="fixed -bottom-32 -left-32 w-120 h-120 rounded-full bg-pink-100/20 blur-3xl pointer-events-none z-0"></div>

      {/* Floating Botanical Flower Line Art */}
      <div className="fixed top-24 right-[10%] opacity-20 pointer-events-none float-element z-0">
        <Flower className="w-16 h-16 text-accent" strokeWidth={1} />
      </div>
      <div className="fixed bottom-24 left-[5%] opacity-15 pointer-events-none float-element-delayed z-0">
        <Flower className="w-24 h-24 text-rosegold" strokeWidth={1} />
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 h-full flex flex-col bg-background animate-slide-in shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full flex items-center justify-center bg-cream border border-borderPink text-vintageText"
            >
              <X className="w-4 h-4" />
            </button>
            <Sidebar currentTab={currentTab} setCurrentTab={(tab) => {
              setCurrentTab(tab);
              setMobileMenuOpen(false);
            }} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative h-screen overflow-y-auto">
        {/* Hanging Victorian Lantern next to sidebar */}
        <div className="absolute left-1 top-4 z-30 pointer-events-none hidden lg:block select-none animate-float">
          <div className="flex flex-col items-center">
            {/* Chain */}
            <div className="w-[1.5px] h-10 bg-[#8B6043]/60" />

            {/* Detailed lantern body */}
            <div className="relative -mt-0.5">
              <svg width="28" height="36" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                {/* Cap */}
                <path d="M12 2C8.5 2 7 5.5 5 7H19C17 5.5 15.5 2 12 2Z" fill="#634531" stroke="#442D1F" strokeWidth="1" />
                {/* Glass housing */}
                <path d="M5 7L7 21H17L19 7H5Z" fill="rgba(255,255,255,0.05)" stroke="#634531" strokeWidth="1" />
                {/* Metallic bars */}
                <line x1="9" y1="7" x2="10.5" y2="21" stroke="#634531" strokeWidth="1" opacity="0.6" />
                <line x1="15" y1="7" x2="13.5" y2="21" stroke="#634531" strokeWidth="1" opacity="0.6" />
                {/* Bottom base */}
                <path d="M6 21H18V23.5H6V21Z" fill="#A07253" stroke="#634531" strokeWidth="1" />

                {/* Glowing flame */}
                {profile.theme !== 'dark' ? (
                  <g transform="scale(1.35)" style={{ transformOrigin: '12px 13px' }}>
                    <path d="M12 9C10 11.5 10.5 16 12 17.5C13.5 16 14 11.5 12 9Z" fill="#FFC83B" className="animate-pulse" />
                    <circle cx="20" cy="15" r="40" fill="rgba(255, 175, 59, 0.35)" className="animate-ping" style={{ animationDuration: '3.5s' }} />
                  </g>
                ) : (
                  <path d="M12 11.5c-.3.5-.3 1.5 0 2c.3-.5.3-1.5 0-2z" fill="#C89F65" opacity="0.8" transform="scale(1.35)" style={{ transformOrigin: '12px 13px' }} />
                )}
              </svg>
              {/* Hanging leaf sprig */}
              <div className="absolute -top-1 -right-2 text-xxs select-none pointer-events-none opacity-80">🌿</div>
            </div>
          </div>
        </div>

        {/* Top Navbar */}
        <header className="glass-panel sticky top-0 z-20 px-6 py-4 flex items-center justify-between gap-4 border-b border-borderPink/40 relative overflow-visible">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-premium-md hover:bg-secondary/40 text-vintageText"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Luxury Greeting & Daily Quote */}
          <div className="hidden md:block flex-1 max-w-lg">
            <h1 className="font-heading text-xl font-bold text-darkText flex items-center gap-1.5 leading-none">
              Good Morning, {profile.name.split(' ')[0]} <span className="text-accent">🌸</span>
            </h1>
            <p className="font-subtitle text-[16px] text-vintageText/75 italic mt-1.5 flex items-center gap-1.5">
              <span>🌿</span> You are doing amazing, remember to be kind to yourself. <span>🌿</span>
            </p>
          </div>

          {/* Quick Stats Banner (Static/Dynamic indicators) */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="       Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-60 bg-cream/70 border border-borderPink/50 pl-9 pr-8 py-1.5 rounded-full text-xs font-body focus:w-64 transition-all duration-300"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-vintageText/50" />
              <span className="absolute right-3.5 top-2.5 text-xxs text-accent/50">❤️</span>
            </div>


            <div className="relative" ref={notificationRef}>
              <button
                onClick={handleNotificationClick}
                className="p-2.5 rounded-premium-md bg-cream/70 border border-borderPink/50 text-vintageText hover:bg-secondary/35 transition-all duration-300 relative flex items-center justify-center"
              >
                <Bell className="w-4 h-4 text-vintageText/80" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-[8.5px] font-bold text-white rounded-full flex items-center justify-center shadow-sm">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-card rounded-premium-lg shadow-luxury p-4 z-40 border border-borderPink animate-fade-in" style={{ position: 'absolute' }}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-borderPink/30">
                    <h3 className="font-heading text-sm font-semibold">Whispered Alerts</h3>
                    <div className="flex items-center gap-3">
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markNotificationsRead}
                          className="text-xs text-accent hover:underline font-subtitle font-semibold"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-vintageText/60 hover:underline font-subtitle"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                  <div className="mt-2.5 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-vintageText/60 py-4 italic font-body">No alerts whispering...</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-premium-md text-xs leading-relaxed border transition-colors ${n.read ? 'bg-cream/40 border-transparent' : 'bg-primary/20 border-accent/20'
                            }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            {n.type === 'ai' && <Sparkles className="w-3 h-3 text-purple-400" />}
                            {n.type === 'app' && <CalendarDays className="w-3 h-3 text-sky-400" />}
                            {n.type === 'med' && <span className="text-xs text-rose-400">💊</span>}
                            <span className="font-semibold text-darkText capitalize">{n.type} Insight</span>
                            <span className="ml-auto text-[10px] text-vintageText/55">{n.time}</span>
                          </div>
                          <p className="text-vintageText/80 font-body">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sanctuary Lamp Widget Toggle */}
            <div
              onClick={() => updateProfile({ theme: profile.theme === 'dark' ? 'vintage' : 'dark' })}
              className="cursor-pointer border border-[#C89F65]/50 bg-cream/60 rounded-premium-md px-3.5 py-1.5 flex flex-col items-center justify-center relative hover:scale-102 transition-all duration-300 min-w-[85px] shadow-sm border-dashed"
            >
              <span className="text-[7.5px] uppercase tracking-wider font-semibold text-accent font-subtitle">Sanctuary Lamp</span>

              {/* Detailed Victorian Lamp SVG */}
              <svg width="20" height="24" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="my-0.5 overflow-visible">
                {/* Cap and hanger */}
                <path d="M12 2v2M8 4h8" stroke="#8B6043" strokeWidth="1.2" />
                {/* Chimney */}
                <path d="M7 11.5c0-4 2-6.5 5-6.5s5 2.5 5 6.5C17 15 15 18 12 18s-5-3-5-6.5z" fill="rgba(255,255,255,0.1)" stroke="#8B6043" strokeWidth="1.2" />
                {/* Base tank */}
                <path d="M7 18h10v2.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20.5V18z" fill="#A07253" stroke="#634531" strokeWidth="1.2" />

                {/* Wick/Flame - glows when light mode, dim when dark mode */}
                {profile.theme !== 'dark' ? (
                  <g transform="scale(1.4)" style={{ transformOrigin: '12px 10px' }}>
                    <path d="M12 7.5c-1 1.5-.5 4.5 0 5.5c.5-1 1-4 0-5.5z" fill="#FFB74D" className="animate-pulse" />
                    <circle cx="12" cy="10" r="7" fill="rgba(255, 183, 77, 0.45)" className="animate-ping" style={{ animationDuration: '3s' }} />
                  </g>
                ) : (
                  <path d="M12 9.5c-.3.5-.3 1.5 0 2c.3-.5.3-1.5 0-2z" fill="#C89F65" opacity="1" transform="scale(1.4)" style={{ transformOrigin: '12px 10px' }} />
                )}
              </svg>

              <span className="text-[8px] font-bold text-vintageText/80 font-subtitle uppercase tracking-wide">
                {profile.theme !== 'dark' ? 'Glow On' : 'Glow Off'}
              </span>
            </div>

            {/* Quick Actions Calendar shortcut */}
            <button
              onClick={() => setCurrentTab('calendar')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/25 hover:bg-accent/25 text-vintageText text-xs font-semibold font-body transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">Cycle Day {currentCycleDay}</span>
            </button>
          </div>
        </header>

        {/* Dynamic page mount wrapper */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div >
    </div >
  );
};
