const KEY = "returnTo";
const AUTH_PATHS = ["/login", "/register"];

/** Remember the last page the user was on (ignoring the login and signup pages). */
export const rememberPage = ({ pathname, search }) => {
  if (AUTH_PATHS.includes(pathname)) return;
  try {
    sessionStorage.setItem(KEY, pathname + search);
  } catch {
    /* storage unavailable, fall back to the default */
  }
};

/** Where to send the user after they log in or sign up. */
export const getReturnTo = (fallback = "/recipes") => {
  try {
    return sessionStorage.getItem(KEY) || fallback;
  } catch {
    return fallback;
  }
};
