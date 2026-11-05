import api from './axios';

export const getMealPlans = ({ from, to }) => api.get('/meal-plans', { params: { from, to } }).then((res) => res.data);

export const createMealPlan = (data) => api.post('/meal-plans', data).then((res) => res.data);

export const updateMealPlan = (id, data) => api.put(`/meal-plans/${id}`, data).then((res) => res.data);

export const deleteMealPlan = (id) => api.delete(`/meal-plans/${id}`).then((res) => res.data);
