import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as authApi from '../api/auth.api';
import { TOKEN_KEY, setUnauthorizedHandler } from '../api/axios';
import useToast from '../hooks/useToast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True while we check a stored token on first load.
  const [initializing, setInitializing] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));
  const toast = useToast();
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Any 401 from the API (expired/invalid token) logs the user out.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (userRef.current) toast.error('Your session has expired. Please log in again.');
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, [toast]);

  // On startup, restore the session from the stored token.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    let cancelled = false;

    authApi
      .getMe()
      .then(({ user: me }) => !cancelled && setUser(me))
      .catch(() => !cancelled && clearSession())
      .finally(() => !cancelled && setInitializing(false));

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const saveSession = useCallback(({ token, user: nextUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(async (credentials) => saveSession(await authApi.login(credentials)), [saveSession]);

  const register = useCallback(async (data) => saveSession(await authApi.register(data)), [saveSession]);

  const logout = useCallback(() => {
    clearSession();
    toast.success('You have been logged out.');
  }, [clearSession, toast]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), initializing, login, register, logout }),
    [user, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
