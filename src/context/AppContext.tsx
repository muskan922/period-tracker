import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface UserProfile {
  name: string;
  avatar: string;
  age: number;
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string;
  goals: string[];
  achievements: { title: string; date: string; icon: string }[];
  connectedDevices: string[];
  notificationsEnabled: boolean;
  theme: 'vintage' | 'dark' | 'journal';
}

export interface CycleLog {
  id: string;
  startDate: string;
  endDate: string;
  flow: 'Light' | 'Medium' | 'Heavy';
  pain: number; // 1-10
  symptoms: string[];
  notes?: string;
}

export interface MoodLog {
  date: string; // YYYY-MM-DD
  mood: 'Happy' | 'Calm' | 'Sad' | 'Anxious' | 'Angry' | 'Tired';
  note: string;
}

export interface DailySymptomLog {
  date: string; // YYYY-MM-DD
  cramps: number; // 0-10
  bloating: number; // 0-10
  headache: number; // 0-10
  acne: number; // 0-10
  backPain: number; // 0-10
  waterIntake: number; // in ml
  sleepHours: number;
  weight: number; // kg
  exerciseMinutes: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  repeat: string;
  notifications: boolean;
  completedDates: string[]; // list of YYYY-MM-DD when taken
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  notes?: string;
  synced: boolean;
}

export interface CommunityPost {
  id: string;
  author: string; // Anonymous or Pseudonym
  avatar: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  liked: boolean;
  saved: boolean;
  comments: { id: string; author: string; avatar: string; content: string; time: string }[];
  time: string;
}

interface AppContextType {
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  cycles: CycleLog[];
  addCycle: (cycle: Omit<CycleLog, 'id'>) => void;
  deleteCycle: (id: string) => void;
  moods: MoodLog[];
  addMood: (mood: MoodLog) => void;
  symptoms: DailySymptomLog[];
  addSymptomLog: (symptom: DailySymptomLog) => void;
  medications: Medication[];
  toggleMedication: (id: string, date: string) => void;
  addMedication: (med: Omit<Medication, 'id' | 'completedDates'>) => void;
  appointments: Appointment[];
  addAppointment: (app: Omit<Appointment, 'id' | 'synced'>) => void;
  posts: CommunityPost[];
  likePost: (id: string) => void;
  savePost: (id: string) => void;
  addComment: (postId: string, commentContent: string) => void;
  createPost: (title: string, content: string, tags: string[]) => void;
  notifications: { id: string; text: string; time: string; type: string; read: boolean }[];
  markNotificationsRead: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Initial Mock Profile
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Emma Rose',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    age: 26,
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: '2026-07-05',
    goals: ['Balance hormones naturally', 'Improve sleep quality', 'Log mood changes daily'],
    achievements: [
      { title: '10-Day Streak logged', date: '2026-07-20', icon: '✨' },
      { title: 'Hydration Target Met', date: '2026-07-25', icon: '💧' },
      { title: 'Perfect Sleep Cycle', date: '2026-07-27', icon: '🌙' }
    ],
    connectedDevices: ['Apple Watch', 'Apple Health'],
    notificationsEnabled: true,
    theme: 'vintage'
  });

  // Load and apply initial theme preference from storage or preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('flora-theme');
    let activeTheme = savedTheme;
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeTheme = prefersDark ? 'dark' : 'vintage';
    }
    
    setProfile(prev => ({ ...prev, theme: activeTheme as any }));

    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update localStorage and document class when profile.theme state changes
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flora-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flora-theme', 'vintage');
    }
  }, [profile.theme]);

  // Cycle History Logs
  const [cycles, setCycles] = useState<CycleLog[]>([
    { id: '1', startDate: '2026-05-10', endDate: '2026-05-14', flow: 'Medium', pain: 4, symptoms: ['Cramps', 'Headache'] },
    { id: '2', startDate: '2026-06-07', endDate: '2026-06-11', flow: 'Heavy', pain: 6, symptoms: ['Cramps', 'Bloating', 'Fatigue'] },
    { id: '3', startDate: '2026-07-05', endDate: '2026-07-09', flow: 'Medium', pain: 3, symptoms: ['Headache', 'Back Pain'] }
  ]);

  // Mood Logs
  const [moods, setMoods] = useState<MoodLog[]>([
    { date: '2026-07-25', mood: 'Calm', note: 'Had chamomile tea, walked in the rose garden. Felt very at peace.' },
    { date: '2026-07-26', mood: 'Tired', note: 'Woke up in the middle of the night. Slow workday today.' },
    { date: '2026-07-27', mood: 'Happy', note: 'Did yoga in the morning, energy is picking up!' },
    { date: '2026-07-28', mood: 'Calm', note: 'Feeling grounded. Preparing for my upcoming cycle next week.' }
  ]);

  // Daily Vitals & Symptoms log
  const [symptoms, setSymptoms] = useState<DailySymptomLog[]>([
    { date: '2026-07-25', cramps: 0, bloating: 1, headache: 0, acne: 2, backPain: 0, waterIntake: 1500, sleepHours: 7.5, weight: 58.2, exerciseMinutes: 30 },
    { date: '2026-07-26', cramps: 1, bloating: 2, headache: 2, acne: 1, backPain: 1, waterIntake: 1200, sleepHours: 6.0, weight: 58.4, exerciseMinutes: 15 },
    { date: '2026-07-27', cramps: 0, bloating: 0, headache: 0, acne: 1, backPain: 0, waterIntake: 2000, sleepHours: 8.2, weight: 58.1, exerciseMinutes: 45 },
    { date: '2026-07-28', cramps: 1, bloating: 1, headache: 1, acne: 0, backPain: 2, waterIntake: 1750, sleepHours: 7.8, weight: 58.0, exerciseMinutes: 20 }
  ]);

  // Medications
  const [medications, setMedications] = useState<Medication[]>([
    { id: 'm1', name: 'Iron & Folic Acid', dosage: '1 Capsule', time: '08:30 AM', repeat: 'Daily', notifications: true, completedDates: ['2026-07-27', '2026-07-28'] },
    { id: 'm2', name: 'Evening Primrose Oil', dosage: '1000mg', time: '07:00 PM', repeat: 'Daily', notifications: true, completedDates: ['2026-07-27'] },
    { id: 'm3', name: 'Magnesium Bisglycinate', dosage: '200mg', time: '09:30 PM', repeat: 'Daily', notifications: false, completedDates: ['2026-07-27', '2026-07-28'] }
  ]);

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'a1', doctorName: 'Dr. Evelyn Fontaine', specialty: 'Holistic Gynecologist', date: '2026-08-03', time: '10:00 AM', notes: 'Discuss hormone blood test results & herbal cycle infusions.', synced: true },
    { id: 'a2', doctorName: 'Dr. Sarah Lin', specialty: 'Endocrinologist', date: '2026-08-15', time: '02:30 PM', notes: 'Routine checkup for thyroid panel.', synced: false }
  ]);

  // Community Posts
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'p1',
      author: 'Wildflower_9',
      avatar: '🌸',
      title: 'Soothing Chamomile & Raspberry Leaf Tea Infusions',
      content: 'I have started drinking raspberry leaf tea exactly 5 days before my cycle begins, and it has reduced my pelvic cramps by at least half! Has anyone else tried this? I add a tiny bit of raw lavender honey and fresh mint leaves.',
      tags: ['Herbal Remedies', 'Cramp Relief', 'Self-Care'],
      likes: 42,
      liked: false,
      saved: true,
      comments: [
        { id: 'c1', author: 'Lila_Bloom', avatar: '🍃', content: 'Yes! Raspberry leaf tea is a uterine tonic. Adding ginger also helps with period inflammation!', time: '2 hours ago' },
        { id: 'c2', author: 'TeaLover_2', avatar: '☕', content: 'Trying this tonight! Thanks for the tip, cramps have been tough this month.', time: '1 hour ago' }
      ],
      time: '4 hours ago'
    },
    {
      id: 'p2',
      author: 'Selene_Mind',
      avatar: '🌙',
      title: 'Luteal Phase Mood Swings & Cozy Digital Sabbaticals',
      content: 'During my luteal phase (days 21-28), I feel an overwhelming urge to log off social media and just read poetry, light vanilla candles, and rest. I used to feel guilty, but now I embrace it as a sacred period of hibernation. How do you all cope with the pre-period low energy?',
      tags: ['Mental Health', 'Luteal Phase', 'Slow Living'],
      likes: 58,
      liked: true,
      saved: false,
      comments: [
        { id: 'c3', author: 'FloraDior', avatar: '🌺', content: 'Embracing this completely changed my relationship with my body. We are not designed to be hyper-productive 100% of the time.', time: '3 hours ago' }
      ],
      time: '6 hours ago'
    },
    {
      id: 'p3',
      author: 'HormoneHarmony',
      avatar: '✨',
      title: 'Seed Cycling for Period Regularity: My 3-Month Journey',
      content: 'I have been seed cycling (pumpkin & flax seeds in the first half, sesame & sunflower in the second half) and my cycle length normalized from a wild 35-42 days to a clean 29 days. Highly recommend looking into seed cycling if you have minor hormonal imbalances.',
      tags: ['Nutrition', 'Cycle Syncing', 'Hormones'],
      likes: 89,
      liked: false,
      saved: true,
      comments: [],
      time: '1 day ago'
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'AI Forecast: Your fertile window starts tomorrow. Stay hydrated 🌸', time: '10 min ago', type: 'ai', read: false },
    { id: 'n2', text: 'Reminder: Take Iron & Folic Acid pill at 08:30 AM.', time: '4 hours ago', type: 'med', read: false },
    { id: 'n3', text: 'Dr. Evelyn Fontaine confirmed your appointment on Aug 3.', time: '1 day ago', type: 'app', read: true }
  ]);

  // Actions
  const updateProfile = (fields: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const addCycle = (cycle: Omit<CycleLog, 'id'>) => {
    const newCycle: CycleLog = {
      id: Math.random().toString(36).substr(2, 9),
      ...cycle
    };
    setCycles(prev => [newCycle, ...prev]);
    // update profile last period start if new cycle is most recent
    if (cycles.length === 0 || new Date(cycle.startDate) > new Date(profile.lastPeriodStart)) {
      setProfile(prev => ({ ...prev, lastPeriodStart: cycle.startDate }));
    }
  };

  const deleteCycle = (id: string) => {
    setCycles(prev => prev.filter(c => c.id !== id));
  };

  const addMood = (mood: MoodLog) => {
    setMoods(prev => {
      const filtered = prev.filter(m => m.date !== mood.date);
      return [mood, ...filtered];
    });
  };

  const addSymptomLog = (symptom: DailySymptomLog) => {
    setSymptoms(prev => {
      const filtered = prev.filter(s => s.date !== symptom.date);
      return [symptom, ...filtered];
    });
  };

  const toggleMedication = (id: string, date: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === id) {
        const completed = med.completedDates.includes(date)
          ? med.completedDates.filter(d => d !== date)
          : [...med.completedDates, date];
        return { ...med, completedDates: completed };
      }
      return med;
    }));
  };

  const addMedication = (med: Omit<Medication, 'id' | 'completedDates'>) => {
    const newMed: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      completedDates: [],
      ...med
    };
    setMedications(prev => [...prev, newMed]);
  };

  const addAppointment = (app: Omit<Appointment, 'id' | 'synced'>) => {
    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      synced: true,
      ...app
    };
    setAppointments(prev => [...prev, newApp]);
  };

  const likePost = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return {
          ...post,
          likes: post.liked ? post.likes - 1 : post.likes + 1,
          liked: !post.liked
        };
      }
      return post;
    }));
  };

  const savePost = (id: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return { ...post, saved: !post.saved };
      }
      return post;
    }));
  };

  const addComment = (postId: string, commentContent: string) => {
    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Emma Rose',
      avatar: '🌸',
      content: commentContent,
      time: 'Just now'
    };
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    }));
  };

  const createPost = (title: string, content: string, tags: string[]) => {
    const newPost: CommunityPost = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Emma_R',
      avatar: '🌸',
      title,
      content,
      tags,
      likes: 0,
      liked: false,
      saved: false,
      comments: [],
      time: 'Just now'
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      profile,
      updateProfile,
      cycles,
      addCycle,
      deleteCycle,
      moods,
      addMood,
      symptoms,
      addSymptomLog,
      medications,
      toggleMedication,
      addMedication,
      appointments,
      addAppointment,
      posts,
      likePost,
      savePost,
      addComment,
      createPost,
      notifications,
      markNotificationsRead,
      isLoggedIn,
      setIsLoggedIn
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
