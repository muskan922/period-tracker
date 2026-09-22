import type { UserProfile, CycleLog, MoodLog, DailySymptomLog, Medication, Appointment, CommunityPost } from '../context/AppContext';

const API_BASE_URL = 'http://localhost:5000/api';

// Generic Fetch Wrapper
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
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
  signup: (name?: string, email?: string, password?: string) => request<{ message: string; otpRequired: boolean; email: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
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
