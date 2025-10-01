import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, STORAGE_KEYS } from '../services/api';
import { env } from '../config/env';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
};

type Credentials = { email: string; password: string };
type RegisterInput = { name: string; email: string; password: string };

type AuthContextType = AuthState & {
  login: (cred: Credentials) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.token),
          AsyncStorage.getItem('@app/user'),
        ]);
        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } finally {
        setInitialized(true);
      }
    })();
  }, []);

  const login = useCallback(async (cred: Credentials) => {
    setLoading(true);
    try {
      if (env.authMode === 'api') {
        const res = await api.post('/api/auth/login', cred);
        const { token: tkn, user: usr } = res.data;
        setToken(tkn);
        setUser(usr);
        await AsyncStorage.setItem(STORAGE_KEYS.token, tkn);
        await AsyncStorage.setItem('@app/user', JSON.stringify(usr));
      } else {
        // Fallback local auth (apenas para desenvolvimento quando a API não tem endpoints de auth)
        const fakeToken = 'dev-token';
        const fakeUser = { id: '1', name: 'Dev User', email: cred.email };
        setToken(fakeToken);
        setUser(fakeUser);
        await AsyncStorage.setItem(STORAGE_KEYS.token, fakeToken);
        await AsyncStorage.setItem('@app/user', JSON.stringify(fakeUser));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    setLoading(true);
    try {
      if (env.authMode === 'api') {
        const res = await api.post('/api/auth/register', data);
        const { token: tkn, user: usr } = res.data;
        setToken(tkn);
        setUser(usr);
        await AsyncStorage.setItem(STORAGE_KEYS.token, tkn);
        await AsyncStorage.setItem('@app/user', JSON.stringify(usr));
      } else {
        // Fallback local: cadastro fictício direto no client
        const fakeToken = 'dev-token';
        const fakeUser = { id: '1', name: data.name, email: data.email };
        setToken(fakeToken);
        setUser(fakeUser);
        await AsyncStorage.setItem(STORAGE_KEYS.token, fakeToken);
        await AsyncStorage.setItem('@app/user', JSON.stringify(fakeUser));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.multiRemove([STORAGE_KEYS.token, '@app/user']);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, initialized, login, register, logout }),
    [user, token, loading, initialized, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
