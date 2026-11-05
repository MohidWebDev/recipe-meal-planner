import api from './axios';

/** Removes empty values so the URL only contains filters that are set. */
const cleanParams = (params = {}) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== '' && value != null));

export const getRecipes = (params) => api.get('/recipes', { params: cleanParams(params) }).then((res) => res.data);

export const getRecipe = (id) => api.get(`/recipes/${id}`).then((res) => res.data);

export const createRecipe = (data) => api.post('/recipes', data).then((res) => res.data);

export const updateRecipe = (id, data) => api.put(`/recipes/${id}`, data).then((res) => res.data);

export const deleteRecipe = (id) => api.delete(`/recipes/${id}`).then((res) => res.data);
