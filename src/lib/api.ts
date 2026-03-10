import axios from 'axios';

// Use same-origin proxy on production to avoid mixed content (HTTPS page calling HTTP API)
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'culturalhatti.com' || host === 'www.culturalhatti.com') {
      return `${window.location.origin}/backend-api`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

// Base URL for upload/asset URLs - use proxy on production to avoid mixed content
export const getAssetBase = () => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'culturalhatti.com' || host === 'www.culturalhatti.com') {
      return `${window.location.origin}/backend-uploads`;
    }
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  if (apiUrl.includes('/backend-api')) return apiUrl.replace('/backend-api', '/backend-uploads');
  return apiUrl.replace(/\/api\/?$/, '');
};

export const getAssetUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = getAssetBase();
  // Proxy base ends with /backend-uploads; path /uploads/abc -> /backend-uploads/abc
  const useProxy = base.endsWith('/backend-uploads');
  const rest = path.replace(/^\/?uploads\/?/, '');
  return useProxy ? `${base}/${rest}` : `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
};

const api = axios.create({
    baseURL: getApiBase(),
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ch_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('ch_token');
            localStorage.removeItem('ch_user');
            const path = window.location.pathname;
            const redirect = path && path !== '/login' ? `?redirect=${encodeURIComponent(path)}` : '';
            window.location.href = `/login${redirect}`;
        }
        return Promise.reject(err);
    }
);

export const adminApi = axios.create({
    baseURL: getApiBase(),
    headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('ch_admin_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

adminApi.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('ch_admin_token');
            window.location.href = '/admin/login';
        }
        return Promise.reject(err);
    }
);

export default api;
