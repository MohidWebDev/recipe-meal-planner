import api from './axios';

export const register = (data) => api.post('/auth/register', data).then((res) => res.data);

export const login = (credentials) => api.post('/auth/login', credentials).then((res) => res.data);

export const getMe = () => api.get('/auth/me').then((res) => res.data);
