import axios from 'axios';

export const TOKEN_KEY = 'rmp_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT (if any) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AuthContext registers a callback here so a 401 logs the user out.
let unauthorizedHandler = null;
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const AUTH_FORM_URLS = ['/auth/login', '/auth/register'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    // A wrong password on the login form is a 401 too, but that is not a "session expired".
    const isAuthForm = AUTH_FORM_URLS.some((path) => url.includes(path));

    if (status === 401 && !isAuthForm) {
      localStorage.removeItem(TOKEN_KEY);
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

/** Human-readable message from an axios error. */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ERR_NETWORK') return 'Cannot reach the server. Is the API running?';
  return error?.message || fallback;
};

/**
 * Converts the API's `errors: [{ field, message }]` array into an object
 * keyed by field, e.g. { title: '...', 'ingredients[0].name': '...' }.
 * Mongoose-style paths (ingredients.0.name) are normalised to the same format.
 */
export const getFieldErrors = (error) => {
  const list = error?.response?.data?.errors;
  if (!Array.isArray(list)) return {};
  return list.reduce((acc, { field, message }) => {
    const key = String(field).replace(/\.(\d+)(?=\.|$)/g, '[$1]');
    if (!acc[key]) acc[key] = message;
    return acc;
  }, {});
};

export default api;
