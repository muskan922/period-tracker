import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  Users,
  ChevronDown,
  ArrowRight,
  Flower,
  Pill,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onStart: () => void;
}

// Decorative Dark Mode Botanical Line-Art SVG
const DarkBotanicalSVG: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 180 C 60 140, 70 80, 120 40 C 150 16, 175 25, 180 30"
      stroke="#E06C92"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="opacity-40"
    />
    <path d="M65 130 C 50 115, 45 100, 65 105 C 75 110, 80 120, 65 130 Z" fill="#E89AB5" className="opacity-25" />
    <path d="M95 85 C 110 70, 125 75, 115 90 C 105 100, 90 95, 95 85 Z" fill="#C57E97" className="opacity-25" />
    <path d="M135 48 C 145 35, 160 38, 155 52 C 148 60, 135 55, 135 48 Z" fill="#E89AB5" className="opacity-30" />
    <circle cx="180" cy="30" r="6" fill="#E89AB5" className="opacity-50 animate-pulse" />
    <circle cx="180" cy="30" r="11" stroke="#E06C92" strokeWidth="1" strokeDasharray="2 2" className="opacity-30" />
  </svg>
);

// Decorative Dark Mode Floral Ring SVG
const DarkFloralRingSVG: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="80" cy="80" r="72" stroke="#E06C92" strokeWidth="1.2" strokeDasharray="4 4" className="opacity-40" />
    <circle cx="80" cy="80" r="62" stroke="#E89AB5" strokeWidth="0.8" className="opacity-25" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 80 80)`}>
        <circle cx="80" cy="12" r="3.5" fill="#E89AB5" className="opacity-50" />
        <path d="M80 15 C 76 22, 84 22, 80 15 Z" fill="#E06C92" className="opacity-30" />
      </g>
    ))}
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Global theme state from AppContext
  const { profile, updateProfile } = useApp();
  const isDark = profile.theme === 'dark';

  const toggleTheme = () => {
    const nextTheme = isDark ? 'vintage' : 'dark';
    updateProfile({ theme: nextTheme });
  };

  const features = [
    { title: 'AI Prediction', desc: 'Predict period dates, fertile windows, and hormonal swings with 98% confidence.', icon: Sparkles },
    { title: 'Mood Tracker', desc: 'Log feelings and journal entries in a cozy digital diary designed to support stress relief.', icon: Heart },
    { title: 'Cycle Calendar', desc: 'A luxury, custom color-coded journal calendar for medication, doctor consultations, and cycles.', icon: Calendar },
    { title: 'Medication Reminders', desc: 'Set discrete and elegant medication notifications for pills, vitamins, and infusions.', icon: Pill },
    { title: 'Sister Circle', desc: 'Share insights, experiences, and advice anonymously in an elegant, supportive forum.', icon: Users },
    { title: 'Health Analytics', desc: 'Generate comprehensive wellness reports to share with your gynecologist.', icon: Activity }
  ];

  const testimonials = [
    { text: '"This is the first period app that makes me feel cared for rather than clinically analyzed. The design is like reading a beautiful lifestyle magazine, and the AI insights are incredibly accurate."', author: 'Clara Delacour', role: 'Vogue Editor' },
    { text: '"Seed cycling features and luteal phase slow-living tips saved my work productivity. It teaches you to flow with your biology rather than fighting against it. A masterpiece of UX design."', author: 'Sophia Rossi', role: 'Holistic Chef' },
  ];

  const faqs = [
    { q: 'How does the AI cycle forecasting work?', a: 'Flora uses advanced machine learning models trained on cycle inputs, symptom parameters, and basal body temperatures (if synchronized). It adapts with each cycle logged to calculate highly accurate fertility window bounds.' },
    { q: 'Is my wellness data kept private?', a: 'Completely. Your health data is encrypted client-side and saved anonymously. We never share, trade, or expose private clinical logs to third-party advertisers.' },
    { q: 'Can I synchronize this with my smart ring or watch?', a: 'Yes! Under settings you can link Apple Health, Google Fit, and other smart rings to sync sleep cycles, active steps, and average temperatures.' }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden font-body transition-colors duration-300 ${isDark
        ? 'bg-[#09070D] text-[#D8CFC7] selection:bg-[#E06C92] selection:text-white'
        : 'bg-background text-vintageText selection:bg-primary selection:text-darkText'
      }`}>

      {/* ----------------- BACKGROUND DECORATIONS ----------------- */}
      {isDark ? (
        <>
          {/* Dark Mode Radial Ambient Glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[650px] bg-gradient-to-br from-[#4A1D33]/30 via-[#2A1024]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-1000"></div>
          <div className="absolute top-[20%] -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-[#38142D]/25 via-[#1F0C21]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
          <div className="absolute top-[55%] right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#4A1D33]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>

          {/* Dark Mode Floating Fine Botanical Line Art */}
          <DarkBotanicalSVG className="absolute top-10 left-6 w-52 h-52 text-[#E89AB5] pointer-events-none -z-10 opacity-60 hidden lg:block" />
          <DarkBotanicalSVG className="absolute top-[460px] right-10 w-64 h-64 text-[#C57E97] pointer-events-none -z-10 transform rotate-90 opacity-40 hidden lg:block" />
        </>
      ) : (
        <>
          {/* Exact Original Light Mode Editorial Backgrounds */}
          <div className="absolute top-0 right-0 w-[50%] h-[700px] bg-primary/20 rounded-bl-[150px] -z-10"></div>
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-secondary/30 blur-3xl -z-10"></div>
          <div className="absolute top-1/2 left-0 w-[40%] h-[600px] bg-champagne/20 rounded-tr-[150px] -z-10"></div>
        </>
      )}

      {/* ----------------- NAVBAR ----------------- */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark
              ? 'bg-gradient-to-br from-[#E06C92] to-[#B83B5E] text-white shadow-[0_0_15px_rgba(224,108,146,0.4)]'
              : 'bg-accent/20 text-accent'
            }`}>
            <Flower className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className={`font-heading text-xl font-bold tracking-wide ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
              Flora
            </span>
            <span className={`font-subtitle text-xs italic block -mt-1 ${isDark ? 'text-[#E89AB5]' : 'text-accent'}`}>
              AI Wellness
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md transition-all duration-300 group cursor-pointer ${isDark
                ? 'bg-[#160E21]/80 border-[#E06C92]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-[#E06C92]/60'
                : 'bg-white/60 border-rose-300/40 shadow-soft-glow hover:shadow-luxury hover:scale-105'
              }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme mode"
          >
            <div className={`relative w-8 h-4.5 rounded-full p-0.5 transition-all duration-300 flex items-center ${isDark ? 'bg-gradient-to-r from-[#38142D] to-[#B83B5E]' : 'bg-gradient-to-r from-rose-200 to-pink-400'
              }`}>
              <div className={`w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[8px] ${isDark ? 'translate-x-3.5 bg-[#FBF0EA] text-[#160E21]' : 'translate-x-0 bg-white text-rose-600'
                }`}>
                {isDark ? '🌙' : '☀️'}
              </div>
            </div>
            <span className={`text-[11px] font-subtitle font-bold tracking-widest uppercase transition-colors ${isDark ? 'text-[#E89AB5] group-hover:text-white' : 'text-vintageText group-hover:text-accent'
              }`}>
              {isDark ? 'Dark' : 'Light'}
            </span>
          </button>

          <button
            onClick={onStart}
            className={`text-xs font-semibold transition-colors ${isDark ? 'text-[#D8CFC7] hover:text-[#E89AB5]' : 'hover:text-accent'}`}
          >
            Login
          </button>

          <button
            onClick={onStart}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${isDark
                ? 'bg-gradient-to-r from-[#E06C92] to-[#B83B5E] text-white shadow-[0_4px_20px_rgba(224,108,146,0.35)] hover:scale-105'
                : 'bg-darkText text-white hover:bg-accent shadow-luxury hover:scale-105'
              }`}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        <div className="lg:col-span-7 space-y-8 z-10">

          {/* Paradigm Badge */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border ${isDark
              ? 'bg-[#241322]/80 border-[#E06C92]/30 text-[#E89AB5]'
              : 'bg-accent/15 border border-accent/20 text-accent'
            }`}>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest font-subtitle">A New Paradigm in Wellness</span>
          </div>

          {/* Hero Heading */}
          {isDark ? (
            <h1 className="font-heading text-5xl sm:text-6.5xl leading-tight text-[#F7EFEA] font-bold tracking-tight">
              Understand Your <br />
              <span className="italic font-subtitle text-transparent bg-clip-text bg-gradient-to-r from-[#E89AB5] via-[#E06C92] to-[#D8B4F8] font-normal drop-shadow-[0_2px_12px_rgba(224,108,146,0.3)]">
                Cycle Beautifully.
              </span>
            </h1>
          ) : (
            <h1 className="font-heading text-5xl sm:text-6.5xl leading-tight text-darkText">
              Understand Your <br />
              <span className="italic font-subtitle text-accent">Cycle Beautifully.</span>
            </h1>
          )}

          {/* Description */}
          <p className={`text-sm sm:text-base max-w-lg leading-relaxed ${isDark ? 'text-[#D8CFC7]/85 font-normal' : 'text-vintageText/80'
            }`}>
            Welcome to Flora. An AI-powered cycle planner and digital journal that syncs your daily symptoms with customized hormonal nutrition, sleep schedules, and slow-living insights. Designed to look like an elegant magazine, built to feel like home.
          </p>

          {/* Hero Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            {isDark ? (
              <>
                {/* Dark Mode Primary Button */}
                <button
                  onClick={onStart}
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-[#E06C92] via-[#D85C83] to-[#B83B5E] text-white font-bold text-xs tracking-wider uppercase shadow-[0_8px_30px_rgba(224,108,146,0.4)] hover:shadow-[0_12px_40px_rgba(224,108,146,0.6)] hover:scale-105 -translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B83B5E] to-[#E06C92] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>

                {/* Dark Mode Secondary Button */}
                <a
                  href="#features"
                  className="px-8 py-4 rounded-full bg-white/[0.04] border border-[#E06C92]/35 text-[#F7EFEA] text-center font-semibold text-xs tracking-wider uppercase backdrop-blur-md hover:bg-[#E06C92]/20 hover:border-[#E06C92]/60 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
                </a>
              </>
            ) : (
              <>
                {/* Exact Untouched Original Light Mode Buttons */}
                <button
                  onClick={onStart}
                  className="px-8 py-4 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText hover:scale-105 transition-all duration-300 shadow-premium flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href="#features"
                  className="px-8 py-4 rounded-full bg-cream border border-borderPink/60 text-vintageText text-center font-semibold text-xs tracking-wider uppercase hover:bg-secondary/40 transition-colors"
                >
                  Learn More
                </a>
              </>
            )}
          </div>
        </div>

        {/* ----------------- RIGHT COLUMN: CYCLE JOURNAL CARD ----------------- */}
        <div className="lg:col-span-5 relative flex items-center justify-center">

          {isDark ? (
            /* ============================================================== */
            /* =============== DARK MODE LUXURY JOURNAL CARD ================ */
            /* ============================================================== */
            <div className="w-80 h-96 md:w-96 md:h-[450px] rounded-premium-lg border border-[#E06C92]/30 bg-[#150E1F]/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(184,59,94,0.3)] relative flex flex-col justify-between p-8 overflow-hidden transform rotate-1 sm:rotate-2 hover:rotate-0 transition-all duration-700 group">

              {/* Subtle Pink/Purple Ambient Background Glow Behind Card */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#E06C92]/25 blur-2xl -z-10"></div>

              {/* Fine Dotted Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E89AB5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="font-subtitle text-xs text-[#E89AB5] italic uppercase tracking-wider font-semibold">
                    FLORA CYCLE JOURNAL
                  </p>
                  <h3 className="font-heading text-xl text-[#F7EFEA] font-bold mt-1">
                    Emma's Sanctuary
                  </h3>
                  <p className="font-subtitle text-xs text-[#D8CFC7]/70 italic mt-0.5">
                    Your cycle. Your story. Your power.
                  </p>
                </div>
                <span className="w-8 h-8 rounded-full bg-[#241322] border border-[#E06C92]/40 flex items-center justify-center text-xs text-[#E89AB5] shadow-md">
                  🌸
                </span>
              </div>

              {/* Circular Glowing Ring Center ("5 Days" Focal Point) */}
              <div className="my-6 flex flex-col items-center justify-center relative z-10">
                {/* Dark Floral Ring SVG */}
                <DarkFloralRingSVG className="w-44 h-44 absolute inset-0 m-auto pointer-events-none" />

                {/* Breathing Glow Outer Ring */}
                <div className="w-36 h-36 rounded-full border-2 border-dashed border-[#E06C92]/40 flex items-center justify-center relative">
                  {/* Center Counter Circle with Automatic Synchronized Breathing Glow */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#231433] to-[#150D24] border border-[#E06C92]/60 flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(224,108,146,0.4)] animate-pulse">
                    <span className="text-[10px] font-bold text-[#E89AB5] uppercase tracking-widest font-subtitle">
                      PERIOD IN
                    </span>
                    <span className="font-heading text-3.5xl font-extrabold text-[#F7EFEA] my-0.5 leading-none">
                      5
                    </span>
                    <span className="text-[9px] text-[#E89AB5] font-semibold font-body tracking-wider uppercase">
                      Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Dark AI Hormonal Advice Box */}
              <div className="bg-[#1F142E]/80 border border-[#E06C92]/35 p-3.5 rounded-premium-md text-xxs leading-relaxed font-body shadow-inner relative z-10 backdrop-blur-md">
                <span className="font-semibold text-[#E89AB5] flex items-center gap-1.5 mb-1 tracking-wider uppercase font-subtitle">
                  <Sparkles className="w-3.5 h-3.5 text-[#E06C92] animate-spin" />
                  AI HORMONAL ADVICE
                </span>
                <p className="text-[#D8CFC7]/90 text-[11px]">
                  Estrogen levels are gently rising. Perfect time for strength workouts and creative meetings.
                </p>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* ============ EXACT UNTOUCHED LIGHT MODE HERO CARD ============= */
            /* ============================================================== */
            <div className="w-80 h-96 md:w-96 md:h-[450px] rounded-premium-lg border border-borderPink/70 bg-white/40 backdrop-blur-md shadow-premium relative flex flex-col justify-between p-8 overflow-hidden float-element">
              {/* Background shape */}
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/45 blur-2xl -z-10"></div>

              {/* Vintage layout content */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-subtitle text-xs text-accent italic uppercase tracking-wider">Flora Cycle Journal</p>
                  <h3 className="font-heading text-xl text-darkText mt-1">Emma's Sanctuary</h3>
                  <p className="font-subtitle text-xs text-vintageText/70 italic mt-0.5">Your cycle. Your story. Your power.</p>
                </div>
                <span className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-xs border border-borderPink">🌸</span>
              </div>

              {/* Circular Ring */}
              <div className="my-6 flex flex-col items-center justify-center relative">
                <div className="w-36 h-36 rounded-full border-4 border-dashed border-accent/25 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-secondary/35 border border-accent/40 flex flex-col items-center justify-center text-center shadow-soft-glow animate-pulse">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest font-subtitle">Period In</span>
                    <span className="font-heading text-3xl text-darkText my-0.5">5</span>
                    <span className="text-[9px] text-vintageText/60 font-medium font-body">Days</span>
                  </div>
                </div>
              </div>

              {/* Micro insights */}
              <div className="bg-cream/70 border border-borderPink/30 p-3 rounded-premium-md text-xxs leading-relaxed font-body">
                <span className="font-semibold text-accent flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  AI HORMONAL ADVICE
                </span>
                Estrogen levels are gently rising. Perfect time for strength workouts and creative meetings.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ----------------- ELEGANT DIVIDER ----------------- */}
      <div className={`elegant-divider max-w-5xl mx-auto my-12 ${isDark ? 'opacity-30' : ''}`}></div>

      {/* ----------------- FEATURES GRID ----------------- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 text-center space-y-16">
        <div className="space-y-4 max-w-xl mx-auto">
          <h2 className={`font-heading text-4xl ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
            A curatorship of feminine health tools
          </h2>
          <p className={`font-subtitle text-sm italic ${isDark ? 'text-[#D8CFC7]/75' : 'text-vintageText/75'}`}>
            Tailored parameters, holistic approaches, and vintage design language combined.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className={`rounded-premium-lg p-7 text-left space-y-4 transition-all duration-300 group ${isDark
                    ? 'bg-[#150E1F]/70 border border-[#E06C92]/20 hover:-translate-y-1 hover:border-[#E06C92]/40 shadow-lg'
                    : 'glass-card hover:-translate-y-1 hover:shadow-soft-glow'
                  }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark
                    ? 'bg-[#241322] text-[#E89AB5] group-hover:bg-[#E06C92] group-hover:text-white'
                    : 'bg-secondary text-accent shadow-soft-glow group-hover:bg-accent group-hover:text-white'
                  }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className={`font-heading text-lg font-semibold ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
                  {f.title}
                </h3>
                <p className={`text-xs leading-relaxed font-body ${isDark ? 'text-[#D8CFC7]/75' : 'text-vintageText/75'}`}>
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- TESTIMONIALS ----------------- */}
      <section className={`py-20 my-12 ${isDark ? 'bg-[#120B1A]/80 border-y border-[#E06C92]/20' : 'bg-cream/45 border-y border-borderPink/30'
        }`}>
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <span className={`font-subtitle text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-[#E89AB5]' : 'text-accent'}`}>
            Shared Experiences
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className={`rounded-premium-lg p-8 space-y-6 text-left relative ${isDark ? 'bg-[#180E24]/80 border border-[#E06C92]/25 backdrop-blur-md' : 'glass-card'
                  }`}
              >
                <p className={`font-subtitle text-base leading-relaxed italic ${isDark ? 'text-[#D8CFC7]' : 'text-vintageText/90'}`}>
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${isDark ? 'bg-[#241322] text-[#E89AB5]' : 'bg-accent/20'}`}>
                    ✨
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-body ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
                      {t.author}
                    </h4>
                    <p className={`text-[10px] font-subtitle ${isDark ? 'text-[#E89AB5]' : 'text-vintageText/50'}`}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- PRICING PACKAGES ----------------- */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center space-y-12">
        <div className="space-y-4">
          <h2 className={`font-heading text-4xl ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
            Curated Memberships
          </h2>
          <p className={`font-subtitle text-sm italic ${isDark ? 'text-[#D8CFC7]/70' : 'text-vintageText/70'}`}>
            Select your sanctuary wellness tier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className={`rounded-premium-lg p-8 flex flex-col justify-between text-left space-y-6 ${isDark ? 'bg-[#150E1F]/70 border border-[#E06C92]/25' : 'glass-card border border-borderPink/50'
            }`}>
            <div>
              <span className={`font-subtitle text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-[#E89AB5]' : 'text-accent'}`}>
                The Sage
              </span>
              <h3 className={`font-heading text-2xl mt-1 ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>Free</h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#D8CFC7]/60' : 'text-vintageText/60'}`}>Essential menstrual journal logging.</p>
              <div className="elegant-divider my-4"></div>
              <ul className={`space-y-2 text-xs font-body ${isDark ? 'text-[#D8CFC7]/85' : 'text-vintageText/85'}`}>
                <li>• 12-Month Cycle History</li>
                <li>• Essential symptom checkbox logs</li>
                <li>• Base mood tracker emojis</li>
              </ul>
            </div>
            <button
              onClick={onStart}
              className={`w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-center transition-colors ${isDark ? 'bg-[#241322] border border-[#E06C92]/40 text-[#F7EFEA] hover:bg-[#E06C92]/30' : 'bg-cream border border-borderPink/60 text-vintageText hover:bg-secondary/40'
                }`}
            >
              Select Free
            </button>
          </div>

          {/* Plan 2 - Featured */}
          <div className={`rounded-premium-lg p-8 flex flex-col justify-between text-left space-y-6 border-2 relative ${isDark ? 'bg-[#1C102A] border-[#E06C92] shadow-[0_10px_35px_rgba(224,108,146,0.25)]' : 'glass-card border-accent bg-white shadow-soft-glow'
            }`}>
            <span className={`absolute -top-3.5 right-6 px-3 py-1 rounded-full text-white text-[9px] uppercase tracking-widest font-bold font-subtitle ${isDark ? 'bg-[#E06C92]' : 'bg-accent'
              }`}>
              Most Adored
            </span>
            <div>
              <span className={`font-subtitle text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-[#E89AB5]' : 'text-accent'}`}>
                The Sisterhood
              </span>
              <h3 className={`font-heading text-2xl mt-1 ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
                $8 <span className={`text-xs font-medium ${isDark ? 'text-[#D8CFC7]/60' : 'text-vintageText/60'}`}>/ mo</span>
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#D8CFC7]/60' : 'text-vintageText/60'}`}>Advanced AI cycle sync features.</p>
              <div className="elegant-divider my-4"></div>
              <ul className={`space-y-2 text-xs font-body ${isDark ? 'text-[#D8CFC7]/85' : 'text-vintageText/85'}`}>
                <li>• Comprehensive AI prediction models</li>
                <li>• Custom herbal nutrition integration</li>
                <li>• Anonymous community forum</li>
                <li>• Interactive custom wellness PDF reports</li>
              </ul>
            </div>
            <button
              onClick={onStart}
              className={`w-full py-3 rounded-full text-white text-xs font-bold tracking-wider transition-colors uppercase text-center ${isDark ? 'bg-gradient-to-r from-[#E06C92] to-[#B83B5E] shadow-md hover:scale-105' : 'bg-accent hover:bg-darkText shadow-soft-glow'
                }`}
            >
              Select Premium
            </button>
          </div>

          {/* Plan 3 */}
          <div className={`rounded-premium-lg p-8 flex flex-col justify-between text-left space-y-6 ${isDark ? 'bg-[#150E1F]/70 border border-[#E06C92]/25' : 'glass-card border border-borderPink/50'
            }`}>
            <div>
              <span className={`font-subtitle text-xs uppercase tracking-widest font-semibold ${isDark ? 'text-[#E89AB5]' : 'text-accent'}`}>
                The Sanctuary
              </span>
              <h3 className={`font-heading text-2xl mt-1 ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
                $15 <span className={`text-xs font-medium ${isDark ? 'text-[#D8CFC7]/60' : 'text-vintageText/60'}`}>/ mo</span>
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-[#D8CFC7]/60' : 'text-vintageText/60'}`}>Personal endocrinology sync and consultation portals.</p>
              <div className="elegant-divider my-4"></div>
              <ul className={`space-y-2 text-xs font-body ${isDark ? 'text-[#D8CFC7]/85' : 'text-vintageText/85'}`}>
                <li>• Google Calendar & Fit health links</li>
                <li>• Virtual consultation scheduler</li>
                <li>• High-confidence cycle deviation warnings</li>
                <li>• Priority direct doctor summaries</li>
              </ul>
            </div>
            <button
              onClick={onStart}
              className={`w-full py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-center transition-colors ${isDark ? 'bg-[#241322] border border-[#E06C92]/40 text-[#F7EFEA] hover:bg-[#E06C92]/30' : 'bg-cream border border-borderPink/60 text-vintageText hover:bg-secondary/40'
                }`}
            >
              Select Sanctuary
            </button>
          </div>
        </div>
      </section>

      {/* ----------------- FAQ SECTION ----------------- */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <h2 className={`font-heading text-4xl text-center ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
          Frequently Logged Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-premium-md border overflow-hidden ${isDark ? 'bg-[#150E1F]/80 border-[#E06C92]/25' : 'glass-card border-borderPink/40'
                  }`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-left font-heading text-base cursor-pointer ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'
                    }`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-[#E89AB5]' : 'text-accent'
                    }`} />
                </button>
                {isOpen && (
                  <div className={`px-6 pb-4 pt-1 font-body text-xs leading-relaxed border-t ${isDark ? 'text-[#D8CFC7]/80 border-[#E06C92]/20' : 'text-vintageText/75 border-borderPink/25'
                    }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- NEWSLETTER ----------------- */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className={`rounded-premium-lg p-10 space-y-6 border ${isDark ? 'bg-[#180E24]/80 border-[#E06C92]/30 backdrop-blur-md' : 'glass-card border-accent/20 bg-cream/30'
          }`}>
          <h2 className={`font-heading text-3.5xl leading-tight ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>
            Join our Weekly Whisper newsletter
          </h2>
          <p className={`font-subtitle text-sm max-w-md mx-auto italic ${isDark ? 'text-[#D8CFC7]/75' : 'text-vintageText/70'}`}>
            Receive hormone-balancing recipes, luteal-phase self-care journals, and digital botanical downloads every Sunday.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className={`w-full px-5 py-3 rounded-full text-xs focus:ring-1 ${isDark ? 'bg-[#241322] border border-[#E06C92]/40 text-[#F7EFEA] placeholder-[#D8CFC7]/50 focus:ring-[#E06C92]' : 'bg-white border border-borderPink/70 focus:ring-accent'
                }`}
            />
            <button
              onClick={() => alert('Warmly subscribed! 🌸')}
              className={`w-full sm:w-auto px-6 py-3 rounded-full text-white font-semibold text-xs tracking-wider uppercase transition-colors ${isDark ? 'bg-gradient-to-r from-[#E06C92] to-[#B83B5E] shadow-md hover:scale-105' : 'bg-accent hover:bg-darkText shadow-soft-glow'
                }`}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className={`border-t py-12 mt-12 ${isDark ? 'border-[#E06C92]/20 bg-[#0E0A12]/80' : 'border-borderPink/30 bg-cream/20'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-[#241322] text-[#E89AB5]' : 'bg-accent/20 text-accent'
              }`}>
              <Flower className="w-4 h-4" />
            </div>
            <div>
              <span className={`font-heading font-bold text-base ${isDark ? 'text-[#F7EFEA]' : 'text-darkText'}`}>Flora</span>
              <span className={`font-subtitle text-xxs italic block -mt-1 ${isDark ? 'text-[#E89AB5]' : 'text-accent'}`}>Copyright 2026</span>
            </div>
          </div>
          <div className={`flex flex-wrap justify-center gap-8 text-xs font-subtitle italic ${isDark ? 'text-[#D8CFC7]/75' : 'text-vintageText/75'
            }`}>
            <a href="#privacy" className="hover:underline">Privacy Charter</a>
            <a href="#terms" className="hover:underline">Sanctuary Rules</a>
            <a href="#support" className="hover:underline">Ask a Specialist</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
