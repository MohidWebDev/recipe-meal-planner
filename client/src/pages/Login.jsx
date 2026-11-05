import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '../api/axios';
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
    <div className="mx-auto max-w-md py-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to plan your meals for the week.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-6">
        {serverError && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
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
            className={`input ${errors.password ? 'input-error' : ''}`}
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>

        <p className="text-center text-sm text-slate-500">
          No account yet?{' '}
          <Link to="/register" className="font-medium text-emerald-700 hover:underline">
            Create one
          </Link>
        </p>
      </form>

      <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <p>
          <strong>Demo account:</strong> demo@example.com / demo1234
        </p>
        <button type="button" onClick={fillDemo} className="mt-1 font-medium underline hover:no-underline">
          Fill in demo credentials
        </button>
      </div>
    </div>
  );
}
