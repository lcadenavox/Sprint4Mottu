export type ApiEnvironment = {
  baseURL: string;
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

export const env: ApiEnvironment = {
  baseURL: DEFAULT_BASE_URL,
};
