import { User } from '@/utils/mockData';
import { getAuthToken } from '@/utils/session';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() || '/api';

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const body = await response.json();
      message = body?.error ?? message;
    } catch {
      // noop
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
};

export const api = {
  login: (email: string, password: string) =>
    request<{ success: boolean; user?: User; token?: string; error?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, role: 'alumni' | 'student') =>
    request<{ success: boolean; user?: User; token?: string; error?: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),

  me: () => request<{ success: boolean; user?: User }>('/auth/me'),

  bootstrap: () => request<Record<string, unknown>>('/bootstrap'),

  syncData: (key: string, value: unknown) =>
    request<{ success: boolean }>(`/data/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    }),

  alumni: {
    list: (query?: Record<string, string>) => {
      const search = new URLSearchParams(query || {}).toString();
      return request<{ success: boolean; data: unknown[] }>(`/alumni${search ? `?${search}` : ''}`);
    },
    upsertMe: (payload: unknown) => request<{ success: boolean; data: unknown }>('/alumni/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  },

  jobs: {
    list: () => request<{ success: boolean; data: any[] }>('/jobs'),
    create: (payload: unknown) => request<{ success: boolean; data: any }>('/jobs', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: unknown) => request<{ success: boolean; data: any }>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<{ success: boolean; data: any }>(`/jobs/${id}`, { method: 'DELETE' }),
    apply: (id: string, payload: unknown = {}) => request<{ success: boolean; data: any }>(`/jobs/${id}/apply`, { method: 'POST', body: JSON.stringify(payload) }),
    recommendations: () => request<{ success: boolean; data: any[] }>('/jobs/recommendations/me'),
  },

  applications: {
    mine: () => request<{ success: boolean; data: any[] }>('/applications/my'),
  },

  mentorship: {
    list: () => request<{ success: boolean; data: any[] }>('/mentorship'),
    create: (payload: unknown) => request<{ success: boolean; data: any }>('/mentorship', { method: 'POST', body: JSON.stringify(payload) }),
    updateStatus: (id: string, payload: unknown) => request<{ success: boolean; data: any }>(`/mentorship/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }),
  },

  events: {
    list: () => request<{ success: boolean; data: any[] }>('/events'),
    create: (payload: unknown) => request<{ success: boolean; data: any }>('/events', { method: 'POST', body: JSON.stringify(payload) }),
    register: (id: string) => request<{ success: boolean; data: any }>(`/events/${id}/register`, { method: 'POST' }),
    registrations: (id: string) => request<{ success: boolean; data: any[] }>(`/events/${id}/registrations`),
  },

  donations: {
    list: () => request<{ success: boolean; data: any[] }>('/donations'),
    order: (payload: unknown) => request<{ success: boolean; data: any }>('/donations/order', { method: 'POST', body: JSON.stringify(payload) }),
    confirm: (payload: unknown) => request<{ success: boolean; data: any }>('/donations/confirm', { method: 'POST', body: JSON.stringify(payload) }),
  },

  stories: {
    list: () => request<{ success: boolean; data: any[] }>('/stories'),
    create: (payload: unknown) => request<{ success: boolean; data: any }>('/stories', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: unknown) => request<{ success: boolean; data: any }>(`/stories/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<{ success: boolean; data: any }>(`/stories/${id}`, { method: 'DELETE' }),
  },

  feedback: {
    submit: (payload: unknown) => request<{ success: boolean; data: any }>('/feedback', { method: 'POST', body: JSON.stringify(payload) }),
    list: () => request<{ success: boolean; data: any[] }>('/feedback'),
  },

  ai: {
    mentorMatch: (payload: unknown) => request<{ success: boolean; data: any[] }>('/ai/mentor-match', { method: 'POST', body: JSON.stringify(payload) }),
    jobRecommendations: (payload: unknown) => request<{ success: boolean; data: any[] }>('/ai/job-recommendations', { method: 'POST', body: JSON.stringify(payload) }),
    tag: (payload: unknown) => request<{ success: boolean; data: any }>('/ai/tag', { method: 'POST', body: JSON.stringify(payload) }),
  },

  analytics: {
    engagement: () => request<{ success: boolean; data: any }>('/analytics/engagement'),
  },
};
