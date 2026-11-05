import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function NotFound({ title = 'Page not found', message = "We couldn't find the page you were looking for." }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-[55vh] animate-fade-up flex-col items-center justify-center text-center">
      <p className="font-display text-8xl font-bold text-accent drop-shadow-[0_0_30px_rgba(212,255,36,0.25)]">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-fg">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
      <Link to={isAuthenticated ? '/recipes' : '/login'} className="btn-primary mt-8">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {isAuthenticated ? 'Back to recipes' : 'Go to login'}
      </Link>
    </div>
  );
}
