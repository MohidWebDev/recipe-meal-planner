import { LogIn, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '../api/axios';
import AuthLayout from '../components/common/AuthLayout';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Please enter a valid email';
  if (!password) errors.password = 'Password is required';
  return errors;
};

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/recipes';

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const clientErrors = validate(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setSubmitting(true);
    try {
      const user = await login({ email: values.email.trim(), password: values.password });
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors(getFieldErrors(error));
      setServerError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValues({ email: 'demo@example.com', password: 'demo1234' });
    setErrors({});
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to plan your meals for the week.">
      <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6 sm:p-7">
        {serverError && (
          <div role="alert" className="alert-error animate-fade-in">
            {serverError}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`input ${errors.email ? 'input-error' : ''}`}
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn-accent w-full py-3" disabled={submitting}>
          {submitting ? (
            'Logging in…'
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden="true" /> Log in
            </>
          )}
        </button>

        <p className="text-center text-sm text-muted">
          No account yet?{' '}
          <Link to="/register" className="link">
            Create one
          </Link>
        </p>
      </form>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm">
        <p className="text-muted">
          <span className="font-semibold text-fg">Demo:</span> demo@example.com / demo1234
        </p>
        <button type="button" onClick={fillDemo} className="link inline-flex shrink-0 items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Fill in demo credentials
        </button>
      </div>
    </AuthLayout>
  );
}
