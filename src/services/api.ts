import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '../config/env';

export const STORAGE_KEYS = {
  token: '@app/token',
};

export const api = axios.create({
  baseURL: env.baseURL,
  // With self-signed HTTPS (localhost), consider using expo dev client and trust cert.
  // If needed for development with self-signed certs on web, you may use http instead.
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Normalize error message
    const message =
      error?.response?.data?.message || error?.message || 'Erro de rede. Tente novamente.';
    return Promise.reject({ ...error, message });
  }
);

export type Paginated<T> = {
  items: T[];
  total: number;
};
