export type ApiEnvironment = {
  baseURL: string;
  authMode: 'api' | 'local';
  useWebProxy: boolean;
  proxyUrl: string;
};

// Dicas de baseURL conforme plataforma:
// - Android emulador (AVD): http://10.0.2.2:7054
// - Android Genymotion: http://10.0.3.2:7054
// - Android/iOS dispositivo físico: http://SEU_IP_LOCAL:7054
// - iOS Simulator: https://localhost:7054 (se certificado confiável)
// - Web: https://localhost:7054 (CORS + cert confiável)
// Configure via variável pública do Expo:
//   EXPO_PUBLIC_API_BASE_URL
const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://localhost:7054';
const AUTH_MODE = (process.env.EXPO_PUBLIC_AUTH_MODE as 'api' | 'local') || 'local';
const USE_WEB_PROXY = process.env.EXPO_PUBLIC_USE_WEB_PROXY === 'true';
const PROXY_URL = process.env.EXPO_PUBLIC_PROXY_URL || 'http://localhost:5050';

export const env: ApiEnvironment = {
  baseURL: DEFAULT_BASE_URL,
  authMode: AUTH_MODE,
  useWebProxy: USE_WEB_PROXY,
  proxyUrl: PROXY_URL,
};
