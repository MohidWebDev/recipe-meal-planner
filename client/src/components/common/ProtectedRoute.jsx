import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AuthGate from "./AuthGate";
import Loader from "./Loader";

/**
 * Renders its content only for logged-in users.
 * Logged-out visitors are redirected to /login, or, when a `gate` is passed,
 * see a sign-up card for that page instead.
 * Use it as a layout route (no children) or wrap a single page (with children).
 */
export default function ProtectedRoute({ gate, children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <Loader fullScreen label="Checking your session…" />;

  if (!isAuthenticated) {
    if (gate) return <AuthGate {...gate} />;
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
}
