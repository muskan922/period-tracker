import type { UserProfile, CycleLog, MoodLog, DailySymptomLog, Medication, Appointment, CommunityPost } from '../context/AppContext';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Generic Fetch Wrapper with Auth Header support and detailed error message parsing
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('flora-token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `API error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMsg = errorData.error;
      }
    } catch {
      // Use status text fallback
    }

    if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/signup')) {
      localStorage.removeItem('flora-token');
      window.dispatchEvent(new Event('flora-unauthorized'));
    }

    throw new Error(errorMsg);
  }

  return response.json();
}

// Profile & Auth API
export const apiProfile = {
  get: () => request<UserProfile>('/auth/profile'),
  update: (data: Partial<UserProfile>) => request<UserProfile>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  login: (email?: string, password?: string) => request<{ token: string; user: UserProfile }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  signup: (name?: string, email?: string, password?: string) => request<{ message: string; otpRequired: boolean; email: string; token?: string; user?: UserProfile }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }),
  forgotPassword: (email: string) => request<{ message: string; otpRequired: boolean; email: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  verifyOtp: (email: string, otp: string) => request<{ valid: boolean; message: string }>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  }),
  resetPassword: (email: string, newPassword: string, otpCode?: string) => request<{ token: string; user: UserProfile; message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, newPassword, otpCode }),
  }),
  deleteAccount: () => request<{ message: string }>('/auth/account', {
    method: 'DELETE',
  }),
};

// Notifications API
export interface NotificationItem {
  id: string;
  text: string;
  time: string;
  type: string;
  read: boolean;
  title?: string;
}

export const apiNotifications = {
  getAll: () => request<NotificationItem[]>('/notifications'),
  markRead: () => request<{ message: string }>('/notifications/read', {
    method: 'PUT',
  }),
  create: (item: { title: string; message: string; type?: string; time?: string }) => request<NotificationItem>('/notifications', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  delete: (id: string) => request<{ message: string; id: string }>('/notifications/' + id, {
    method: 'DELETE',
  }),
};


// Cycle Logs API
export const apiCycles = {
  getAll: () => request<CycleLog[]>('/cycles'),
  add: (cycle: Omit<CycleLog, 'id'>) => request<CycleLog>('/cycles', {
    method: 'POST',
    body: JSON.stringify(cycle),
  }),
  delete: (id: string) => request<{ id: string }>('/cycles/' + id, {
    method: 'DELETE',
  }),
};

// Mood Logs API
export const apiMoods = {
  getAll: () => request<MoodLog[]>('/moods'),
  add: (mood: MoodLog) => request<MoodLog>('/moods', {
    method: 'POST',
    body: JSON.stringify(mood),
  }),
};

// Daily Symptoms & Water Intake API
export const apiSymptoms = {
  getAll: () => request<DailySymptomLog[]>('/symptoms'),
  add: (symptom: DailySymptomLog) => request<DailySymptomLog>('/symptoms', {
    method: 'POST',
    body: JSON.stringify(symptom),
  }),
  updateWater: (date: string, amountMl: number) => request<{ date: string; waterIntake: number }>('/symptoms/water', {
    method: 'PUT',
    body: JSON.stringify({ date, amountMl }),
  }),
};

// Medications API
export const apiMedications = {
  getAll: () => request<Medication[]>('/medications'),
  add: (med: Omit<Medication, 'id' | 'completedDates'>) => request<Medication>('/medications', {
    method: 'POST',
    body: JSON.stringify(med),
  }),
  update: (id: string, med: Partial<Omit<Medication, 'id' | 'completedDates'>>) => request<Medication>('/medications/' + id, {
    method: 'PUT',
    body: JSON.stringify(med),
  }),
  delete: (id: string) => request<{ message: string; id: string }>('/medications/' + id, {
    method: 'DELETE',
  }),
  toggle: (id: string, date: string) => request<{ id: string; date: string; completed: boolean }>('/medications/toggle', {
    method: 'POST',
    body: JSON.stringify({ id, date }),
  }),
};

// Appointments API
export const apiAppointments = {
  getAll: () => request<Appointment[]>('/appointments'),
  add: (app: Omit<Appointment, 'id' | 'synced'>) => request<Appointment>('/appointments', {
    method: 'POST',
    body: JSON.stringify(app),
  }),
  update: (id: string, app: Partial<Omit<Appointment, 'id'>>) => request<Appointment>('/appointments/' + id, {
    method: 'PUT',
    body: JSON.stringify(app),
  }),
  delete: (id: string) => request<{ message: string; id: string }>('/appointments/' + id, {
    method: 'DELETE',
  }),
};

// Community API
export const apiCommunity = {
  getAll: () => request<CommunityPost[]>('/community'),
  create: (title: string, content: string, tags: string[]) => request<CommunityPost>('/community', {
    method: 'POST',
    body: JSON.stringify({ title, content, tags }),
  }),
  like: (id: string) => request<{ id: string; likes: number; liked: boolean }>('/community/' + id + '/like', {
    method: 'POST',
  }),
  save: (id: string) => request<{ id: string; saved: boolean }>('/community/' + id + '/save', {
    method: 'POST',
  }),
  addComment: (postId: string, content: string) => request<{ id: string; author: string; avatar: string; content: string; time: string }>('/community/' + postId + '/comments', {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
};

// Flora AI Health Assistant API
export const apiAI = {
  chat: (message: string, history?: { role: 'user' | 'assistant'; content: string }[], context?: Record<string, any>) =>
    request<{ reply: string; source: 'gemini' | 'knowledge-base'; suggestedQuestions: string[]; timestamp: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, context }),
    }),
};
