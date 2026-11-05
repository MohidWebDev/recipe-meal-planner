import api from './axios';

export const getShoppingList = ({ from, to }) =>
  api.get('/shopping-list', { params: { from, to } }).then((res) => res.data);
