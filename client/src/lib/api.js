import axios from 'axios';
import config from '@/config';

const api = axios.create({
    baseURL: config.api.baseURL,
    withCredentials: true,
    timeout: 15000,
});

export default api;
