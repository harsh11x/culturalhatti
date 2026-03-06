import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const adminApi = axios.create({
    baseURL: API_URL,
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
    (response) => response,
    (error) => {
        // Don't auto-redirect on 401 - let components handle it
        // (prevents dashboard from bouncing back to login when API fails)
        return Promise.reject(error);
    }
);
