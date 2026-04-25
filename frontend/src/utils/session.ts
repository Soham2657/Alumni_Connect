export const SESSION_KEYS = {
  AUTH_TOKEN: 'alumni_platform_token',
};

export const getAuthToken = (): string => {
  try {
    return localStorage.getItem(SESSION_KEYS.AUTH_TOKEN) || '';
  } catch {
    return '';
  }
};

export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem(SESSION_KEYS.AUTH_TOKEN, token);
  } catch {
    // noop
  }
};

export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem(SESSION_KEYS.AUTH_TOKEN);
  } catch {
    // noop
  }
};
