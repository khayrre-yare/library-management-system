import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);
const TOKEN_KEY = 'library_token';
const USER_KEY = 'library_user';

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(Boolean(token));

  const persistSession = useCallback((session) => {
    localStorage.setItem(TOKEN_KEY, session.token);
    localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false);
      return null;
    }

    try {
      const currentUser = await authApi.me();
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      if (error.response?.status === 401) logout();
      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      refreshUser().catch(() => undefined);
    } else {
      setLoading(false);
    }
  }, [refreshUser, token]);

  const login = useCallback(
    async (credentials) => {
      const session = await authApi.login(credentials);
      persistSession(session);
      return session.user;
    },
    [persistSession],
  );

  const register = useCallback(
    async (details) => {
      const session = await authApi.register(details);
      persistSession(session);
      return session.user;
    },
    [persistSession],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'ADMIN',
      login,
      register,
      logout,
      refreshUser,
    }),
    [loading, login, logout, refreshUser, register, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
