import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function NotFound({ title = 'Page not found', message = "We couldn't find the page you were looking for." }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-5xl font-bold text-emerald-600">404</p>
      <h1 className="mt-3 text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">{message}</p>
      <Link to={isAuthenticated ? '/recipes' : '/login'} className="btn-primary mt-6">
        {isAuthenticated ? 'Back to recipes' : 'Go to login'}
      </Link>
    </div>
  );
}
