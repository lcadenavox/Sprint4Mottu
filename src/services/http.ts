import { AxiosRequestConfig } from 'axios';
import { api } from './api';

// Lightweight HTTP helpers that return only response.data and reuse interceptors.
export async function httpGet<T>(url: string, config?: AxiosRequestConfig) {
  const res = await api.get<T>(url, config);
  return res.data;
}

export async function httpPost<TReq, TRes = any>(url: string, data: TReq, config?: AxiosRequestConfig) {
  const res = await api.post<TRes>(url, data, config);
  return res.data as TRes;
}

export async function httpPut<TReq, TRes = any>(url: string, data: TReq, config?: AxiosRequestConfig) {
  const res = await api.put<TRes>(url, data, config);
  return res.data as TRes;
}

export async function httpDelete<TRes = any>(url: string, config?: AxiosRequestConfig) {
  const res = await api.delete<TRes>(url, config);
  return res.data as TRes;
}
