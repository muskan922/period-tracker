import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiAI } from '../services/api';
import {
  Sparkles,
  Send,
  User,
  Copy,
  Check,
  RotateCcw,
  Flower
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: 'gemini' | 'knowledge-base';
  timestamp: string;
}

export const AIAssistant: React.FC = () => {
  const { profile, cycleEngine, personalBaseline } = useApp();
  
  const initialGreeting: ChatMessage = {
    id: 'msg-0',
    role: 'assistant',
    content: `Warmest greetings, ${profile.name || 'Sanctuary Member'}. 🌸\n\nI am Flora, your compassionate AI companion for menstrual cycle wellness and hormonal harmony.\n\nAccording to your cycle log, you are currently around **Day ${cycleEngine.currentCycleDay} (${cycleEngine.currentPhase.name})**.\n\nHow is your body feeling today? You can ask me anything about cramp relief, hormonal nutrition, seed cycling, PMS mood shifts, or cycle irregularities.`,
    source: 'knowledge-base',
    timestamp: 'Just now'
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('flora-ai-chat-history');
      return saved ? JSON.parse(saved) : [initialGreeting];
    } catch {
      return [initialGreeting];
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '🍵 Natural remedies for uterine cramps',
    '🥑 What should I eat in my current phase?',
    '🌙 Why do I feel fatigued before my period?',
    '🗓️ What causes a 4 to 5 day period delay?',
    '🌸 How do I start seed cycling for hormones?'
  ];

  useEffect(() => {
    try {
      localStorage.setItem('flora-ai-chat-history', JSON.stringify(messages));
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const contextPayload = {
        name: profile.name,
        age: profile.age,
        currentCycleDay: cycleEngine.currentCycleDay,
        currentPhase: cycleEngine.currentPhase.name,
        avgCycleLength: cycleEngine.averageCycleLength,
        avgPeriodLength: cycleEngine.averagePeriodLength,
        sleepHours: personalBaseline.avgSleepHours,
        waterIntake: personalBaseline.avgWaterIntake
      };

      const res = await apiAI.chat(query, historyPayload, contextPayload);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        source: res.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      if (res.suggestedQuestions && res.suggestedQuestions.length > 0) {
        setDynamicSuggestions(res.suggestedQuestions);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, darling. My herbal connection encountered a slight hesitation: ${err.message || 'Please verify network connection.'}\n\nPlease feel free to try asking again.`,
        source: 'knowledge-base',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleClearChat = () => {
    if (window.confirm('Reset conversation history with Flora AI?')) {
      setMessages([initialGreeting]);
      setDynamicSuggestions([]);
      localStorage.removeItem('flora-ai-chat-history');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] font-body max-w-5xl mx-auto space-y-4">
      
      {/* Header Banner */}
      <div className="glass-card rounded-premium-lg p-5 border border-borderPink/60 bg-cream/35 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-300 via-rose-400 to-accent flex items-center justify-center text-white shadow-soft-glow float-element">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-bold text-darkText leading-none">Flora AI Health Sanctuary</h1>
              <span className="text-[10px] font-semibold text-accent px-2 py-0.5 rounded-full bg-accent/15 border border-accent/25 flex items-center gap-1 font-subtitle">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
                Gemini 2.5 Active
              </span>
            </div>
            <p className="font-subtitle text-xs text-vintageText/75 italic mt-1">
              Synced to: {cycleEngine.currentPhase.name} (Day {cycleEngine.currentCycleDay}) • Avg Cycle {cycleEngine.averageCycleLength}d
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="text-xs text-vintageText/60 hover:text-accent flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-cream border border-borderPink/40 transition-colors font-subtitle cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Dialogue</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 glass-card rounded-premium-lg p-6 overflow-y-auto border border-borderPink/50 bg-white/70 dark:bg-[#1A1A23]/80 space-y-5 scrollbar-thin shadow-inner">
        {messages.map(m => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-accent text-white'
                    : 'bg-cream dark:bg-cream/40 text-accent border border-borderPink/60'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Flower className="w-4.5 h-4.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-premium-md p-4 space-y-2 relative shadow-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-accent to-[#C57E97] text-white rounded-tr-xs'
                    : 'bg-cream/60 dark:bg-cream/25 border border-borderPink/50 text-darkText rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 pb-1 border-b border-white/20">
                  <span className="font-subtitle font-bold tracking-wider uppercase">
                    {isUser ? profile.name || 'You' : 'Flora Sanctuary AI'}
                  </span>
                  <div className="flex items-center gap-2">
                    {!isUser && m.source && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-accent/15 text-accent font-semibold">
                        {m.source === 'gemini' ? '✨ Gemini AI' : '🌿 Holistic Guide'}
                      </span>
                    )}
                    <span>{m.timestamp}</span>
                  </div>
                </div>

                <div className="text-xs sm:text-[13px] whitespace-pre-line leading-relaxed font-body">
                  {m.content}
                </div>

                {!isUser && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      title="Copy response"
                      className="text-vintageText/50 hover:text-accent text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {loading && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-cream dark:bg-cream/40 text-accent border border-borderPink/60 flex items-center justify-center shrink-0">
              <Flower className="w-4.5 h-4.5 animate-spin" />
            </div>
            <div className="bg-cream/60 dark:bg-cream/25 border border-borderPink/50 rounded-premium-md px-4 py-3 text-xs text-vintageText/80 dark:text-vintageText flex items-center gap-2">
              <span className="italic font-subtitle text-accent">Flora is consulting holistic biology...</span>
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts / Dynamic Follow-up Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
        <span className="text-[10px] font-bold text-vintageText/70 dark:text-vintageText/80 tracking-wider uppercase font-subtitle shrink-0 pl-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-accent" />
          {dynamicSuggestions.length > 0 ? 'Follow-ups:' : 'Suggestions:'}
        </span>
        {(dynamicSuggestions.length > 0 ? dynamicSuggestions : quickPrompts).map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt.replace(/^[^\w\s]+\s*/, ''))}
            className="text-xxs px-3 py-1.5 rounded-full bg-cream/70 dark:bg-cream/35 hover:bg-primary/40 border border-borderPink/60 text-vintageText dark:text-darkText font-body whitespace-nowrap transition-colors shadow-2xs hover:border-accent cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="glass-card rounded-premium-lg p-2.5 border border-borderPink/60 bg-white/90 dark:bg-[#1A1A23] flex items-center gap-2 shrink-0 shadow-soft-glow"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Flora about cramps, late periods, seed cycling, teas, or hormonal moods..."
          className="flex-1 bg-transparent border-none px-4 py-2.5 text-xs text-darkText placeholder-vintageText/50 focus:outline-none font-body"
        />

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-5 py-2.5 rounded-full bg-accent hover:bg-darkText text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-soft-glow flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Subtle Clinical Disclaimer */}
      <p className="text-[10px] text-vintageText/75 dark:text-vintageText/90 italic text-center font-subtitle shrink-0">
        Flora AI offers evidence-based cycle education and holistic comfort. In cases of severe pelvic trauma or acute pain, please consult an emergency physician.
      </p>
    </div>
  );
};
