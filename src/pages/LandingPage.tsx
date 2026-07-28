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

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
    <div className="bg-background text-vintageText min-h-screen relative overflow-hidden font-body selection:bg-primary selection:text-darkText">
      {/* Editorial Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-[50%] h-[700px] bg-primary/20 rounded-bl-[150px] -z-10"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-secondary/30 blur-3xl -z-10"></div>
      <div className="absolute top-1/2 left-0 w-[40%] h-[600px] bg-champagne/20 rounded-tr-[150px] -z-10"></div>

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Flower className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold tracking-wide">Flora</span>
            <span className="font-subtitle text-xs text-accent italic block -mt-1">AI Wellness</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={onStart}
            className="text-xs font-semibold hover:text-accent transition-colors"
          >
            Login
          </button>
          <button 
            onClick={onStart}
            className="px-5 py-2.5 rounded-full bg-darkText text-white hover:bg-accent transition-all duration-300 text-xs font-semibold shadow-luxury hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
        <div className="lg:col-span-7 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/20">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent font-subtitle">A New Paradigm in Wellness</span>
          </div>

          <h1 className="font-heading text-5xl sm:text-6.5xl leading-tight text-darkText">
            Understand Your <br />
            <span className="italic font-subtitle text-accent">Cycle Beautifully.</span>
          </h1>

          <p className="text-sm sm:text-base text-vintageText/80 max-w-lg leading-relaxed">
            Welcome to Flora. An AI-powered cycle planner and digital journal that syncs your daily symptoms with customized hormonal nutrition, sleep schedules, and slow-living insights. Designed to look like an elegant magazine, built to feel like home.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
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
          </div>
        </div>

        {/* Large Premium Hero Art */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Glassmorphic card overlay */}
          <div className="w-80 h-96 md:w-96 md:h-[450px] rounded-premium-lg border border-borderPink/70 bg-white/40 backdrop-blur-md shadow-premium relative flex flex-col justify-between p-8 overflow-hidden float-element">
            {/* Background shape */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/45 blur-2xl -z-10"></div>
            
            {/* Vintage layout content */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-subtitle text-xs text-accent italic uppercase tracking-wider">Flora Cycle Journal</p>
                <h3 className="font-heading text-xl text-darkText mt-1">Emma\'s Sanctuary</h3>
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
        </div>
      </section>

      {/* Elegant Divider */}
      <div className="elegant-divider max-w-5xl mx-auto my-12"></div>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 text-center space-y-16">
        <div className="space-y-4 max-w-xl mx-auto">
          <h2 className="font-heading text-4xl text-darkText">A curatorship of feminine health tools</h2>
          <p className="font-subtitle text-sm text-vintageText/75 italic">
            Tailored parameters, holistic approaches, and vintage design language combined.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div 
                key={idx}
                className="glass-card rounded-premium-lg p-7 text-left space-y-4 hover:-translate-y-1 transition-all duration-300 hover:shadow-soft-glow group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent shadow-soft-glow group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-darkText">{f.title}</h3>
                <p className="text-xs text-vintageText/75 leading-relaxed font-body">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-cream/45 border-y border-borderPink/30 py-20 my-12">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <span className="font-subtitle text-xs uppercase tracking-widest text-accent font-semibold">Shared Experiences</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card rounded-premium-lg p-8 space-y-6 text-left relative">
                <p className="font-subtitle text-base leading-relaxed text-vintageText/90 italic">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs">✨</div>
                  <div>
                    <h4 className="text-xs font-bold text-darkText font-body">{t.author}</h4>
                    <p className="text-[10px] text-vintageText/50 font-subtitle">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center space-y-12">
        <div className="space-y-4">
          <h2 className="font-heading text-4xl text-darkText">Curated Memberships</h2>
          <p className="font-subtitle text-sm text-vintageText/70 italic">Select your sanctuary wellness tier</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="glass-card rounded-premium-lg p-8 flex flex-col justify-between text-left space-y-6 border border-borderPink/50">
            <div>
              <span className="font-subtitle text-xs text-accent uppercase tracking-widest font-semibold">The Sage</span>
              <h3 className="font-heading text-2xl text-darkText mt-1">Free</h3>
              <p className="text-xs text-vintageText/60 mt-1">Essential menstrual journal logging.</p>
              <div className="elegant-divider my-4"></div>
              <ul className="space-y-2 text-xs text-vintageText/85 font-body">
                <li>• 12-Month Cycle History</li>
                <li>• Essential symptom checkbox logs</li>
                <li>• Base mood tracker emojis</li>
              </ul>
            </div>
            <button 
              onClick={onStart}
              className="w-full py-3 rounded-full bg-cream border border-borderPink/60 text-xs font-semibold tracking-wider hover:bg-secondary/40 transition-colors uppercase text-center"
            >
              Select Free
            </button>
          </div>

          {/* Plan 2 - Featured */}
          <div className="glass-card rounded-premium-lg p-8 flex flex-col justify-between text-left space-y-6 border-2 border-accent relative bg-white shadow-soft-glow">
            <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-accent text-white text-[9px] uppercase tracking-widest font-bold font-subtitle">
              Most Adored
            </span>
            <div>
              <span className="font-subtitle text-xs text-accent uppercase tracking-widest font-semibold">The Sisterhood</span>
              <h3 className="font-heading text-2xl text-darkText mt-1">$8 <span className="text-xs font-medium text-vintageText/60">/ mo</span></h3>
              <p className="text-xs text-vintageText/60 mt-1">Advanced AI cycle sync features.</p>
              <div className="elegant-divider my-4"></div>
              <ul className="space-y-2 text-xs text-vintageText/85 font-body">
                <li>• Comprehensive AI prediction models</li>
                <li>• Custom herbal nutrition integration</li>
                <li>• Anonymous community forum</li>
                <li>• Interactive custom wellness PDF reports</li>
              </ul>
            </div>
            <button 
              onClick={onStart}
              className="w-full py-3 rounded-full bg-accent text-white text-xs font-bold tracking-wider hover:bg-darkText transition-colors uppercase text-center shadow-soft-glow"
            >
              Select Premium
            </button>
          </div>

          {/* Plan 3 */}
          <div className="glass-card rounded-premium-lg p-8 flex flex-col justify-between text-left space-y-6 border border-borderPink/50">
            <div>
              <span className="font-subtitle text-xs text-accent uppercase tracking-widest font-semibold">The Sanctuary</span>
              <h3 className="font-heading text-2xl text-darkText mt-1">$15 <span className="text-xs font-medium text-vintageText/60">/ mo</span></h3>
              <p className="text-xs text-vintageText/60 mt-1">Personal endocrinology sync and consultation portals.</p>
              <div className="elegant-divider my-4"></div>
              <ul className="space-y-2 text-xs text-vintageText/85 font-body">
                <li>• Google Calendar & Fit health links</li>
                <li>• Virtual consultation scheduler</li>
                <li>• High-confidence cycle deviation warnings</li>
                <li>• Priority direct doctor summaries</li>
              </ul>
            </div>
            <button 
              onClick={onStart}
              className="w-full py-3 rounded-full bg-cream border border-borderPink/60 text-xs font-semibold tracking-wider hover:bg-secondary/40 transition-colors uppercase text-center"
            >
              Select Sanctuary
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <h2 className="font-heading text-4xl text-darkText text-center">Frequently Logged Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="glass-card rounded-premium-md border border-borderPink/40 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-heading text-base text-darkText"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 font-body text-xs text-vintageText/75 leading-relaxed border-t border-borderPink/25">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="glass-card rounded-premium-lg p-10 space-y-6 border border-accent/20 bg-cream/30">
          <h2 className="font-heading text-3.5xl text-darkText leading-tight">Join our Weekly Whisper newsletter</h2>
          <p className="font-subtitle text-sm text-vintageText/70 max-w-md mx-auto italic">
            Receive hormone-balancing recipes, luteal-phase self-care journals, and digital botanical downloads every Sunday.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full px-5 py-3 rounded-full bg-white border border-borderPink/70 text-xs focus:ring-1 focus:ring-accent"
            />
            <button 
              onClick={() => alert('Warmly subscribed! 🌸')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-accent text-white font-semibold text-xs tracking-wider uppercase hover:bg-darkText transition-colors shadow-soft-glow"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-borderPink/30 py-12 mt-12 bg-cream/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <Flower className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-base">Flora</span>
              <span className="font-subtitle text-xxs text-accent italic block -mt-1">Copyright 2026</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs font-subtitle italic text-vintageText/75">
            <a href="#privacy" className="hover:underline">Privacy Charter</a>
            <a href="#terms" className="hover:underline">Sanctuary Rules</a>
            <a href="#support" className="hover:underline">Ask a Specialist</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
