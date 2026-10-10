import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<any>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('travelxp_token'));
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const userData = await api.getMe();
      setUser(userData);
    } catch {
      localStorage.removeItem('travelxp_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    localStorage.setItem('travelxp_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    localStorage.setItem('travelxp_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const googleLogin = async () => {
    const mockGoogleProfile = {
      email: 'anamika.traveler@gmail.com',
      name: 'Anamika Sharma',
      googleId: 'g_user_123456789',
    };
    const res = await api.googleAuth(mockGoogleProfile);
    localStorage.setItem('travelxp_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('travelxp_token');
    setToken(null);
    setUser(null);
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = await api.updatePreferences(prefs);
    if (user) {
      setUser({ ...user, preferences: updated });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
        updatePreferences,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
