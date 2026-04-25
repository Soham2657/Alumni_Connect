import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/utils/mockData';
import { STORAGE_KEYS, getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/utils/localStorage';
import { api } from '@/lib/api';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/utils/session';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (name: string, email: string, password: string, role: 'alumni' | 'student') => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedUser = getFromLocalStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
      const token = getAuthToken();

      if (storedUser && token) {
        setUser(storedUser);
      }

      if (token) {
        try {
          const response = await api.me();
          if (response.success && response.user) {
            setUser(response.user);
            saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, response.user);
          }
        } catch {
          clearAuthToken();
          removeFromLocalStorage(STORAGE_KEYS.CURRENT_USER);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    void restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const response = await api.login(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, response.user);
        if ((response as { token?: string }).token) {
          setAuthToken((response as { token: string }).token);
        }
        return { success: true, user: response.user };
      }
      return { success: false, error: response.error || 'Invalid email or password' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'alumni' | 'student'
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const response = await api.register(name, email, password, role);
      if (response.success && response.user) {
        const users = getFromLocalStorage<User[]>(STORAGE_KEYS.USERS, []);
        saveToLocalStorage(STORAGE_KEYS.USERS, [...users, response.user]);
        setUser(response.user);
        saveToLocalStorage(STORAGE_KEYS.CURRENT_USER, response.user);
        if ((response as { token?: string }).token) {
          setAuthToken((response as { token: string }).token);
        }
        return { success: true, user: response.user };
      }
      return { success: false, error: response.error || 'Registration failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    removeFromLocalStorage(STORAGE_KEYS.CURRENT_USER);
    clearAuthToken();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
