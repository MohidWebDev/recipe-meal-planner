import api from './axios';

export const getTopIngredients = () => api.get('/stats/top-ingredients').then((res) => res.data);

export const getMealsByCuisine = () => api.get('/stats/meals-by-cuisine').then((res) => res.data);
