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
  Activity,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onStart: () => void;
}

// Decorative Floral Line-Art SVG (Botanical Vine)
const BotanicalVineSVG: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 180 C 60 140, 70 80, 120 40 C 150 16, 175 25, 180 30"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className="opacity-40"
    />
    {/* Leaves */}
    <path d="M65 130 C 50 115, 45 100, 65 105 C 75 110, 80 120, 65 130 Z" fill="currentColor" className="opacity-25" />
    <path d="M95 85 C 110 70, 125 75, 115 90 C 105 100, 90 95, 95 85 Z" fill="currentColor" className="opacity-25" />
    <path d="M135 48 C 145 35, 160 38, 155 52 C 148 60, 135 55, 135 48 Z" fill="currentColor" className="opacity-30" />
    {/* Delicate Flower Bud */}
    <circle cx="180" cy="30" r="6" fill="currentColor" className="opacity-40 animate-pulse" />
    <circle cx="180" cy="30" r="11" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-30" />
  </svg>
);

// Decorative Floral Ring SVG for Card
const FloralRingSVG: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" className="opacity-35" />
    <circle cx="80" cy="80" r="62" stroke="currentColor" strokeWidth="0.8" className="opacity-20" />
    {/* Petal accents around perimeter */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 80 80)`}>
        <circle cx="80" cy="12" r="3.5" fill="currentColor" className="opacity-40" />
        <path d="M80 15 C 76 22, 84 22, 80 15 Z" fill="currentColor" className="opacity-25" />
      </g>
    ))}
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Use project's single source of truth for theme state
  const { profile, updateProfile } = useApp();
  const isDark = profile.theme === 'dark';

  const toggleTheme = () => {
    const nextTheme = isDark ? 'vintage' : 'dark';
    updateProfile({ theme: nextTheme });
  };

  const features = [
    {
      title: 'AI Prediction',
      desc: 'Predict period dates, fertile windows, and hormonal swings with 98% confidence.',
      icon: Sparkles,
      tag: 'Machine Learning'
    },
    {
      title: 'Mood Tracker',
      desc: 'Log feelings and journal entries in a cozy digital diary designed to support stress relief.',
      icon: Heart,
      tag: 'Emotional Balance'
    },
    {
      title: 'Cycle Calendar',
      desc: 'A luxury, custom color-coded journal calendar for medication, doctor consultations, and cycles.',
      icon: Calendar,
      tag: 'Luxury Interface'
    },
    {
      title: 'Medication Reminders',
      desc: 'Set discrete and elegant medication notifications for pills, vitamins, and infusions.',
      icon: Pill,
      tag: 'Discrete Care'
    },
    {
      title: 'Sister Circle',
      desc: 'Share insights, experiences, and advice anonymously in an elegant, supportive forum.',
      icon: Users,
      tag: 'Private Forum'
    },
    {
      title: 'Health Analytics',
      desc: 'Generate comprehensive wellness reports to share with your gynecologist.',
      icon: Activity,
      tag: 'Clinical Export'
    }
  ];

  const testimonials = [
    {
      text: '"This is the first period app that makes me feel cared for rather than clinically analyzed. The design is like reading a beautiful lifestyle magazine, and the AI insights are incredibly accurate."',
      author: 'Clara Delacour',
      role: 'Vogue Editor',
      avatar: '🌸'
    },
    {
      text: '"Seed cycling features and luteal phase slow-living tips saved my work productivity. It teaches you to flow with your biology rather than fighting against it. A masterpiece of UX design."',
      author: 'Sophia Rossi',
      role: 'Holistic Chef',
      avatar: '🌿'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI cycle forecasting work?',
      a: 'Flora uses advanced machine learning models trained on cycle inputs, symptom parameters, and basal body temperatures (if synchronized). It adapts with each cycle logged to calculate highly accurate fertility window bounds.'
    },
    {
      q: 'Is my wellness data kept private?',
      a: 'Completely. Your health data is encrypted client-side and saved anonymously. We never share, trade, or expose private clinical logs to third-party advertisers.'
    },
    {
      q: 'Can I synchronize this with my smart ring or watch?',
      a: 'Yes! Under settings you can link Apple Health, Google Fit, and other smart rings to sync sleep cycles, active steps, and average temperatures.'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden font-body bg-[#FFF9F5] dark:bg-[#07040E] text-[#3B1E30] dark:text-[#FBEBF3] transition-colors duration-300 ease-in-out selection:bg-rose-200 dark:selection:bg-pink-900 selection:text-rose-950">

      {/* ----------------- Ambient Glowing Background Elements ----------------- */}
      <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-gradient-to-br from-rose-300/30 via-pink-400/20 to-purple-300/10 dark:from-pink-900/30 dark:via-purple-950/20 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10 transition-opacity duration-500"></div>
      <div className="absolute top-[20%] -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/40 via-rose-200/20 to-transparent dark:from-purple-950/25 dark:via-fuchsia-950/20 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10 transition-opacity duration-500"></div>
      <div className="absolute top-[55%] right-0 w-[450px] h-[450px] bg-gradient-to-bl from-pink-300/20 via-rose-200/15 to-transparent dark:from-rose-950/30 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10 transition-opacity duration-500"></div>

      {/* Decorative Floating Floral Line Art */}
      <BotanicalVineSVG className="absolute top-12 left-4 w-48 h-48 text-rose-400/50 dark:text-pink-400/30 pointer-events-none -z-10 transition-colors duration-300 hidden lg:block" />
      <BotanicalVineSVG className="absolute top-[480px] right-8 w-60 h-60 text-purple-400/40 dark:text-fuchsia-500/30 pointer-events-none -z-10 transform rotate-90 transition-colors duration-300 hidden lg:block" />

      {/* ----------------- NAVBAR ----------------- */}
      <header className="max-w-7xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between relative z-20">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 dark:from-pink-500 dark:to-purple-600 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(244,114,182,0.4)] group-hover:scale-105 transition-all duration-300">
            <Flower className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-wide text-[#2D1325] dark:text-white block leading-none transition-colors duration-300">
              Flora
            </span>
            <span className="font-subtitle text-xs text-rose-500 dark:text-pink-400 italic block mt-0.5 tracking-wider font-semibold transition-colors duration-300">
              AI Wellness
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#150C22]/80 backdrop-blur-xl border border-rose-200/80 dark:border-pink-500/35 shadow-[0_4px_15px_rgba(244,114,182,0.15)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 group cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme mode"
          >
            <div className="relative w-8 h-4.5 rounded-full bg-gradient-to-r from-rose-200 to-pink-400 dark:from-purple-900 dark:to-pink-600 p-0.5 transition-all duration-300 flex items-center">
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white dark:bg-amber-300 shadow-md transform transition-transform duration-300 flex items-center justify-center text-[8px] ${isDark ? 'translate-x-3.5 text-slate-950' : 'translate-x-0 text-rose-600'
                  }`}
              >
                {isDark ? '🌙' : '☀️'}
              </div>
            </div>
            <span className="text-[11px] font-subtitle font-bold tracking-widest uppercase text-[#3B1E30] dark:text-rose-200 group-hover:text-rose-500 transition-colors duration-300">
              {isDark ? ' Dark' : ' Light'}
            </span>
          </button>

          {/* Login Button */}
          <button
            onClick={onStart}
            className="text-xs font-semibold tracking-wider text-[#3B1E30]/80 dark:text-rose-200 hover:text-rose-500 dark:hover:text-pink-400 transition-colors duration-300 hidden sm:block cursor-pointer"
          >
            Login
          </button>

          {/* Get Started Navbar Pill */}
          <button
            onClick={onStart}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-xs tracking-wider shadow-[0_6px_25px_rgba(236,72,153,0.35)] hover:shadow-[0_8px_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-20 sm:pt-16 sm:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 space-y-8 text-left">

          {/* Paradigm Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100/80 dark:bg-pink-950/60 border border-rose-300/60 dark:border-pink-500/30 backdrop-blur-md shadow-sm transition-colors duration-300">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 dark:text-pink-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-pink-300 font-subtitle transition-colors duration-300">
              A New Paradigm in AI Wellness
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-heading text-4.5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#2D1325] dark:text-white font-bold tracking-tight transition-colors duration-300">
            Understand Your <br />
            <span className="italic font-subtitle text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 dark:from-pink-400 dark:via-rose-300 dark:to-fuchsia-400 font-normal pr-2">
              Cycle Beautifully.
            </span>
          </h1>

          {/* Description Paragraph */}
          <p className="text-sm sm:text-base text-[#3B1E30]/80 dark:text-rose-100/80 max-w-xl leading-relaxed font-body font-normal transition-colors duration-300">
            Welcome to Flora. An AI-powered cycle planner and digital journal that syncs your daily symptoms with customized hormonal nutrition, sleep schedules, and slow-living insights. Designed to look like an elegant magazine, built to feel like home.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            {/* Primary Button */}
            <button
              onClick={onStart}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-600 text-white font-bold text-xs tracking-widest uppercase shadow-[0_10px_35px_rgba(236,72,153,0.45)] hover:shadow-[0_15px_45px_rgba(236,72,153,0.6)] hover:scale-105 -translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-4 h-4 relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            {/* Secondary Button */}
            <a
              href="#features"
              className="px-8 py-4 rounded-full backdrop-blur-md bg-white/70 dark:bg-white/5 border border-rose-300/80 dark:border-pink-500/40 text-[#2D1325] dark:text-rose-100 font-bold text-xs tracking-widest uppercase hover:bg-rose-100/60 dark:hover:bg-pink-500/20 hover:border-pink-400 transition-all duration-300 text-center shadow-sm"
            >
              Learn More →
            </a>
          </div>

          {/* Key Metrics Bar */}
          <div className="pt-6 border-t border-rose-200/50 dark:border-pink-900/30 flex flex-wrap items-center gap-8 text-xs font-subtitle italic text-[#3B1E30]/70 dark:text-rose-200/70 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-500 dark:text-pink-400" />
              <span>98% Fertility Window Accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500 dark:text-pink-400" />
              <span>Client-Side Encryption</span>
            </div>
          </div>
        </div>

        {/* Right Column: Glassmorphic Flora Cycle Journal Card */}
        <div className="lg:col-span-5 relative flex items-center justify-center">

          {/* Ambient Outer Glow Behind Card */}
          <div className="absolute w-72 h-80 sm:w-96 sm:h-[420px] rounded-full bg-gradient-to-tr from-rose-400/35 via-pink-500/30 to-purple-600/30 dark:from-pink-600/40 dark:to-fuchsia-700/40 blur-3xl -z-10 animate-pulse transition-all duration-500"></div>

          {/* Main Cycle Journal Card */}
          <div className="w-full max-w-md sm:w-[410px] rounded-[32px] backdrop-blur-xl bg-white/75 dark:bg-[#150D24]/85 border border-rose-200/90 dark:border-pink-500/35 shadow-[0_20px_50px_rgba(224,108,146,0.18)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] p-7 sm:p-8 relative flex flex-col justify-between overflow-hidden transform rotate-1 sm:rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-700 ease-in-out group">

            {/* Inner Top Accent */}
            <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-rose-300/30 dark:bg-pink-600/20 blur-xl pointer-events-none"></div>

            {/* Header Metadata */}
            <div className="flex items-center justify-between relative z-10">
              <div>
                <span className="font-subtitle text-[11px] font-bold text-rose-500 dark:text-pink-400 uppercase tracking-widest block transition-colors duration-300">
                  FLORA CYCLE JOURNAL
                </span>
                <h3 className="font-heading text-2xl font-bold text-[#2D1325] dark:text-white mt-0.5 transition-colors duration-300">
                  Emma's Sanctuary
                </h3>
                <p className="font-subtitle text-xs text-[#3B1E30]/70 dark:text-rose-200/70 italic mt-0.5 transition-colors duration-300">
                  Your cycle. Your story. Your power.
                </p>
              </div>

              {/* Stamp Icon */}
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-100 to-pink-200 dark:from-purple-900 dark:to-pink-900 border border-rose-300/60 dark:border-pink-500/40 flex items-center justify-center text-rose-600 dark:text-pink-300 shadow-md transition-colors duration-300">
                <Flower className="w-5 h-5 animate-spin duration-1000" />
              </div>
            </div>

            {/* Circular Cycle Indicator ("5 Days" Glow) */}
            <div className="my-8 flex flex-col items-center justify-center relative z-10">
              {/* Outer Floral Ring SVG */}
              <FloralRingSVG className="w-48 h-48 text-rose-400 dark:text-pink-400 absolute inset-0 m-auto pointer-events-none transition-colors duration-300" />

              {/* Center Counter Circle with Automatic Continuous Glow */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-b from-white to-rose-50/90 dark:from-[#231435] dark:to-[#170C26] border border-rose-300/70 dark:border-pink-500/50 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgba(236,72,153,0.3)] animate-pulse relative group-hover:scale-105 transition-all duration-500">
                <span className="text-[10px] font-bold tracking-widest text-rose-500 dark:text-pink-400 uppercase font-subtitle transition-colors duration-300">
                  PERIOD IN
                </span>
                <span className="font-heading text-4xl font-extrabold text-[#2D1325] dark:text-white my-0.5 leading-none transition-colors duration-300">
                  5
                </span>
                <span className="text-[10px] font-semibold text-[#3B1E30]/60 dark:text-rose-200/60 uppercase tracking-wider font-body transition-colors duration-300">
                  Days
                </span>
              </div>
            </div>

            {/* AI Hormonal Advice Box */}
            <div className="rounded-2xl bg-white/90 dark:bg-[#201333]/90 border border-rose-200/80 dark:border-pink-500/30 p-4 shadow-sm relative z-10 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-rose-500 dark:text-pink-400 animate-pulse" />
                <span className="text-[10px] font-extrabold text-rose-600 dark:text-pink-300 uppercase tracking-widest font-subtitle transition-colors duration-300">
                  AI HORMONAL ADVICE
                </span>
              </div>
              <p className="text-xs text-[#3B1E30]/85 dark:text-rose-100/90 leading-relaxed font-body transition-colors duration-300">
                Estrogen levels are gently rising. Perfect time for strength workouts and creative meetings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- ELEGANT DIVIDER ----------------- */}
      <div className="max-w-5xl mx-auto px-6 my-8">
        <div className="h-px bg-gradient-to-r from-transparent via-rose-300/50 dark:via-pink-500/30 to-transparent transition-colors duration-300"></div>
      </div>

      {/* ----------------- FEATURES GRID ----------------- */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 text-center space-y-16 relative z-10">
        <div className="space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-pink-400 font-subtitle transition-colors duration-300">
            Hormonal Harmony & Intelligence
          </span>
          <h2 className="font-heading text-3.5xl sm:text-5xl font-bold text-[#2D1325] dark:text-white transition-colors duration-300">
            A curatorship of feminine health tools
          </h2>
          <p className="font-subtitle text-base text-[#3B1E30]/75 dark:text-rose-200/70 italic transition-colors duration-300">
            Tailored parameters, holistic approaches, and vintage design language combined.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-[#150D24]/70 border border-rose-200/70 dark:border-pink-500/25 p-8 text-left space-y-5 hover:-translate-y-1.5 transition-all duration-300 hover:shadow-[0_15px_35px_rgba(236,72,153,0.18)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] group relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 dark:from-purple-900/60 dark:to-pink-900/60 border border-rose-300/40 dark:border-pink-500/30 flex items-center justify-center text-rose-600 dark:text-pink-300 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-rose-500 dark:text-pink-400 uppercase tracking-widest font-subtitle block mb-1">
                    {f.tag}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-[#2D1325] dark:text-white transition-colors duration-300">
                    {f.title}
                  </h3>
                </div>
                <p className="text-xs text-[#3B1E30]/75 dark:text-rose-100/75 leading-relaxed font-body transition-colors duration-300">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- TESTIMONIALS ----------------- */}
      <section className="bg-gradient-to-b from-rose-100/40 via-pink-50/30 to-transparent dark:from-[#180E28]/60 dark:to-transparent border-y border-rose-200/40 dark:border-pink-900/30 py-20 my-16 relative z-10 transition-colors duration-300">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <span className="font-subtitle text-xs uppercase tracking-widest text-rose-500 dark:text-pink-400 font-bold transition-colors duration-300">
            Shared Experiences
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-[#170E26]/80 border border-rose-200/70 dark:border-pink-500/30 p-8 space-y-6 text-left shadow-sm hover:shadow-md transition-all duration-300"
              >
                <p className="font-subtitle text-base sm:text-lg leading-relaxed text-[#3B1E30]/90 dark:text-rose-100 italic transition-colors duration-300">
                  {t.text}
                </p>
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-rose-200/60 dark:bg-purple-900/60 flex items-center justify-center text-base transition-colors duration-300">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2D1325] dark:text-white font-body transition-colors duration-300">
                      {t.author}
                    </h4>
                    <p className="text-[10px] text-rose-500 dark:text-pink-400 font-subtitle font-semibold transition-colors duration-300">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- FAQ SECTION ----------------- */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12 relative z-10">
        <h2 className="font-heading text-3.5xl sm:text-4.5xl font-bold text-[#2D1325] dark:text-white text-center transition-colors duration-300">
          Frequently Logged Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl backdrop-blur-md bg-white/70 dark:bg-[#150D24]/70 border border-rose-200/70 dark:border-pink-500/25 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-heading text-base font-semibold text-[#2D1325] dark:text-white cursor-pointer transition-colors duration-300"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-rose-500 dark:text-pink-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 font-body text-xs text-[#3B1E30]/80 dark:text-rose-100/80 leading-relaxed border-t border-rose-200/40 dark:border-pink-900/30 transition-colors duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="border-t border-rose-200/40 dark:border-pink-900/30 py-12 mt-16 relative z-10 bg-white/40 dark:bg-[#080510]/60 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-sm">
              <Flower className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-base text-[#2D1325] dark:text-white block leading-none transition-colors duration-300">
                Flora
              </span>
              <span className="font-subtitle text-[10px] text-rose-500 dark:text-pink-400 italic block mt-0.5 transition-colors duration-300">
                Copyright 2026 • AI Cycle Wellness
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-subtitle italic text-[#3B1E30]/75 dark:text-rose-200/75 transition-colors duration-300">
            <a href="#privacy" className="hover:text-rose-500 transition-colors">Privacy Charter</a>
            <a href="#terms" className="hover:text-rose-500 transition-colors">Sanctuary Rules</a>
            <a href="#support" className="hover:text-rose-500 transition-colors">Ask a Specialist</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
