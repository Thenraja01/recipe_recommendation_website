import axios from 'axios';
import config from '@/config';

const api = axios.create({
    baseURL: config.api.baseURL,
    withCredentials: true,
    timeout: 15000,
});

api.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(err);
    }
);

export default api;
