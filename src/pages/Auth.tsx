import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flower, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Apple
} from 'lucide-react';

export const Auth: React.FC = () => {
  const { setIsLoggedIn } = useApp();
  const [authStep, setAuthStep] = useState<'login' | 'signup' | 'forgot' | 'otp' | 'reset'>('login');
  
  // Local state inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep('otp'); // proceed to OTP screen
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthStep('otp'); // proceed to OTP screen
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authStep === 'otp' && email && !name) {
      setAuthStep('reset'); // coming from forgot password, go to reset password
    } else {
      setIsLoggedIn(true); // coming from signup, log in directly
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background font-body select-none">
      
      {/* Left Column: Elegant Editorial Brand Illustration */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-cream/70 border-r border-borderPink/40 flex-col justify-between p-12 overflow-hidden vintage-paper">
        {/* Floating background blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/30 blur-3xl -z-10"></div>

        {/* Branding header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Flower className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold text-darkText">Flora</h1>
            <p className="font-subtitle text-xxs text-accent italic -mt-1 font-semibold">Sanctuary of Wellness</p>
          </div>
        </div>

        {/* Botanical Moon Illustration using SVG */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <svg className="w-48 h-48 text-accent animate-pulse" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Delicate Moon */}
            <path d="M60 20C40 20 25 35 25 55C25 75 40 90 60 90C45 90 35 80 35 60C35 40 45 25 60 20Z" fill="currentColor" opacity="0.8" />
            {/* Botanical leafy stems weaving through moon */}
            <path d="M45 75C40 70 38 60 42 50C46 40 50 35 55 30" stroke="#4A3F46" strokeWidth="1.5" strokeLinecap="round" />
            {/* Small leaves */}
            <path d="M42 50C43 47 47 46 48 48C49 50 45 52 42 50Z" fill="#D4A5A5" />
            <path d="M47 38C48 35 52 34 53 36C54 38 50 40 47 38Z" fill="#D4A5A5" />
            <path d="M38 65C39 62 43 61 44 63C45 65 41 67 38 65Z" fill="#D4A5A5" />
            {/* Stars */}
            <circle cx="70" cy="30" r="1.5" fill="#4A3F46" />
            <circle cx="20" cy="40" r="1" fill="#4A3F46" />
            <circle cx="30" cy="80" r="1.5" fill="#4A3F46" />
          </svg>

          <div className="text-center space-y-2 max-w-sm">
            <h3 className="font-heading text-2xl text-darkText">"Listen to the quiet rhythm of your own body."</h3>
            <p className="font-subtitle text-xs text-vintageText/60 italic">Your sanctuary for natural hormonal harmony and slow, elegant self-reflection.</p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[10px] text-vintageText/45 font-subtitle">Vintage Editorial Design. Crafted with reverence.</p>
      </div>

      {/* Right Column: Authentication Form Panel */}
      <div className="lg:col-span-7 flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        {/* Floating circles on right background */}
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-champagne/15 blur-2xl -z-10"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-primary/10 blur-2xl -z-10"></div>

        <div className="w-full max-w-md space-y-8 glass-card rounded-premium-lg p-8 sm:p-10 border border-borderPink/60 relative">
          
          {/* Back button for internal screens */}
          {authStep !== 'login' && (
            <button 
              onClick={() => setAuthStep(authStep === 'otp' ? 'login' : 'login')}
              className="absolute top-6 left-6 text-vintageText/60 hover:text-accent flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          {/* Form Header */}
          <div className="text-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-accent mx-auto">
              <Flower className="w-4.5 h-4.5 animate-spin" />
            </div>
            
            {authStep === 'login' && (
              <>
                <h2 className="font-heading text-3xl text-darkText">Welcome Back</h2>
                <p className="font-subtitle text-xs text-vintageText/60 italic">Step inside your cycle wellness sanctuary.</p>
              </>
            )}
            {authStep === 'signup' && (
              <>
                <h2 className="font-heading text-3xl text-darkText">Begin Your Journey</h2>
                <p className="font-subtitle text-xs text-vintageText/60 italic">Create your sanctuary catalog.</p>
              </>
            )}
            {authStep === 'forgot' && (
              <>
                <h2 className="font-heading text-3xl text-darkText">Restore Peace</h2>
                <p className="font-subtitle text-xs text-vintageText/60 italic">Enter email to recover account key.</p>
              </>
            )}
            {authStep === 'otp' && (
              <>
                <h2 className="font-heading text-3xl text-darkText">Confirm Identity</h2>
                <p className="font-subtitle text-xs text-vintageText/60 italic">We sent a 6-digit passcode to your mailbox.</p>
              </>
            )}
            {authStep === 'reset' && (
              <>
                <h2 className="font-heading text-3xl text-darkText">Reset Sanctuary Key</h2>
                <p className="font-subtitle text-xs text-vintageText/60 italic">Enter a new secure lock code.</p>
              </>
            )}
          </div>

          {/* Social Logins - Only on Login/Signup */}
          {(authStep === 'login' || authStep === 'signup') && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="flex items-center justify-center gap-2 py-2.5 border border-borderPink/60 rounded-full text-xs font-semibold hover:bg-secondary/20 transition-colors"
                >
                  <Apple className="w-3.5 h-3.5" />
                  <span>Apple</span>
                </button>
                <button 
                  onClick={() => setIsLoggedIn(true)}
                  className="flex items-center justify-center gap-2 py-2.5 border border-borderPink/60 rounded-full text-xs font-semibold hover:bg-secondary/20 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </button>
              </div>
              <div className="flex items-center justify-between gap-4 py-2">
                <span className="h-px bg-borderPink/40 flex-1"></span>
                <span className="text-[10px] text-vintageText/50 uppercase tracking-widest font-subtitle">or enter email</span>
                <span className="h-px bg-borderPink/40 flex-1"></span>
              </div>
            </div>
          )}

          {/* Form switchers */}
          <form className="space-y-4.5" onSubmit={
            authStep === 'login' ? handleLoginSubmit :
            authStep === 'signup' ? handleSignupSubmit :
            authStep === 'forgot' ? handleForgotSubmit :
            authStep === 'otp' ? handleOtpSubmit :
            handleResetSubmit
          }>
            {authStep === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle"> Sanctuary Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Emma Rose" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cream/40 border border-borderPink/60 px-9 py-2.5 rounded-full text-xs font-body"
                  />
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-vintageText/50" />
                </div>
              </div>
            )}

            {(authStep === 'login' || authStep === 'signup' || authStep === 'forgot') && (
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle font-medium">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="emma@sanctuary.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-cream/40 border border-borderPink/60 px-9 py-2.5 rounded-full text-xs font-body"
                  />
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-vintageText/50" />
                </div>
              </div>
            )}

            {(authStep === 'login' || authStep === 'signup') && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle font-medium">Sanctuary Key (Password)</label>
                  {authStep === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setAuthStep('forgot')}
                      className="text-xxs text-accent hover:underline font-subtitle"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-cream/40 border border-borderPink/60 px-9 py-2.5 rounded-full text-xs font-body"
                  />
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-vintageText/50" />
                </div>
              </div>
            )}

            {authStep === 'otp' && (
              <div className="space-y-1.5 text-center">
                <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">6-Digit Passcode</label>
                <div className="relative max-w-[200px] mx-auto">
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    placeholder="123456" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full bg-cream/40 border border-borderPink/60 px-4 py-2.5 rounded-full text-center text-sm font-semibold tracking-widest font-body"
                  />
                </div>
              </div>
            )}

            {authStep === 'reset' && (
              <div className="space-y-1.5">
                <label className="text-xxs font-bold text-vintageText/60 tracking-wider uppercase font-subtitle">New Sanctuary Key (Password)</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-cream/40 border border-borderPink/60 px-9 py-2.5 rounded-full text-xs font-body"
                  />
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-vintageText/50" />
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 rounded-full bg-accent hover:bg-darkText text-white text-xs font-semibold tracking-wider uppercase transition-colors shadow-soft-glow mt-4 flex items-center justify-center gap-2"
            >
              {authStep === 'login' && <span>Unlock Sanctuary</span>}
              {authStep === 'signup' && <span>Send Verification Code</span>}
              {authStep === 'forgot' && <span>Send Passcode</span>}
              {authStep === 'otp' && <span>Verify & Proceed</span>}
              {authStep === 'reset' && <span>Secure Account</span>}
            </button>
          </form>

          {/* Bottom Switch Links */}
          <div className="text-center pt-2">
            {authStep === 'login' ? (
              <p className="text-xs text-vintageText/60 font-body">
                New to the Sanctuary?{' '}
                <button 
                  onClick={() => setAuthStep('signup')}
                  className="text-accent hover:underline font-semibold"
                >
                  Create account
                </button>
              </p>
            ) : authStep === 'signup' ? (
              <p className="text-xs text-vintageText/60 font-body">
                Already have a Sanctuary key?{' '}
                <button 
                  onClick={() => setAuthStep('login')}
                  className="text-accent hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
