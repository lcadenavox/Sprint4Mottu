import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '../config/env';
import { Platform } from 'react-native';

export const STORAGE_KEYS = {
  token: '@app/token',
};

const resolvedBaseURL = Platform.OS === 'web' && env.useWebProxy ? `${env.proxyUrl}` : env.baseURL;

export const api = axios.create({
  baseURL: resolvedBaseURL,
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
    // Normalize error message (ASP.NET Core ProblemDetails / ModelState)
    let message: string | undefined;
    const data = error?.response?.data;

    // 1) ModelState dictionary: { errors: { Field: ["msg1","msg2"] } }
    if (data?.errors && typeof data.errors === 'object') {
      const parts: string[] = [];
      for (const key of Object.keys(data.errors)) {
        const arr = data.errors[key];
        if (Array.isArray(arr)) {
          for (const item of arr) {
            parts.push(`${key}: ${item}`);
          }
        }
      }
      if (parts.length) message = parts.join('\n');
    }

    // 2) ProblemDetails title/detail
    if (!message && (data?.title || data?.detail)) {
      message = `${data?.title ?? 'Erro'}${data?.detail ? `: ${data.detail}` : ''}`;
    }

    // 3) Plain message or string body
    if (!message) {
      message = data?.message || (typeof data === 'string' ? data : undefined) || error?.message;
    }

    if (!message) message = 'Erro de rede. Tente novamente.';

    if (process.env.NODE_ENV !== 'production') {
      // Helpful for debugging backend responses during dev
      // eslint-disable-next-line no-console
      console.error('API error:', {
        url: error?.config?.url,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }

    return Promise.reject({ ...error, message });
  }
);

export type Paginated<T> = {
  items: T[];
  total: number;
};
