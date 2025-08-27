/**
 * Interfaces para configuración del cliente API
 */

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
}

export interface RequestConfig {
  method: HttpMethod;
  headers: Record<string, string>;
  signal: AbortSignal;
  body?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export const DEFAULT_CONFIG: ApiClientConfig = {
  baseURL: typeof window === 'undefined' 
    ? process.env.BACKEND_API_URL || '/api/sgd' 
    : '/api/sgd',
  timeout: 30000,
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};