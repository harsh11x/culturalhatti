import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export const adminApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
