import { api } from '@/lib/api';

// localStorage helper functions
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (SYNC_KEYS.has(key)) {
      void api.syncData(key, value);
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
    if (SYNC_KEYS.has(key)) {
      void api.syncData(key, []);
    }
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'alumni_platform_user',
  USERS: 'alumni_platform_users',
  ALUMNI_PROFILES: 'alumni_platform_profiles',
  JOBS: 'alumni_platform_jobs',
  JOB_APPLICATIONS: 'alumni_platform_applications',
  EVENTS: 'alumni_platform_events',
  EVENT_REGISTRATIONS: 'alumni_platform_registrations',
  DONATIONS: 'alumni_platform_donations',
  MENTORSHIP_REQUESTS: 'alumni_platform_mentorship',
  SUCCESS_STORIES: 'alumni_platform_stories',
};

const SYNC_KEYS = new Set<string>([
  STORAGE_KEYS.USERS,
  STORAGE_KEYS.ALUMNI_PROFILES,
  STORAGE_KEYS.JOBS,
  STORAGE_KEYS.JOB_APPLICATIONS,
  STORAGE_KEYS.EVENTS,
  STORAGE_KEYS.EVENT_REGISTRATIONS,
  STORAGE_KEYS.DONATIONS,
  STORAGE_KEYS.MENTORSHIP_REQUESTS,
  STORAGE_KEYS.SUCCESS_STORIES,
]);

export const hydrateLocalStorageFromBackend = async (): Promise<void> => {
  const data = await api.bootstrap();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
};
