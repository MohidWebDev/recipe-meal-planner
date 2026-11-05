import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getErrorMessage, getFieldErrors } from '../api/axios';
import AuthLayout from '../components/common/AuthLayout';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const validate = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Name is required';
  else if (name.trim().length > 50) errors.name = 'Name cannot be longer than 50 characters';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(email.trim())) errors.email = 'Please enter a valid email';
  if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match';
  return errors;
};

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', placeholder: 'Jane Doe' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'you@example.com' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', placeholder: '••••••••', hint: 'At least 6 characters' },
  { name: 'confirmPassword', label: 'Confirm password', type: 'password', autoComplete: 'new-password', placeholder: '••••••••' },
];

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/recipes" replace />;

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
      const user = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
      toast.success(`Welcome, ${user.name.split(' ')[0]}! Start by adding a recipe.`);
      navigate('/recipes', { replace: true });
    } catch (error) {
      setErrors(getFieldErrors(error)); // e.g. 409 → { email: 'An account with that email already exists' }
      setServerError(getErrorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Save recipes, plan meals and never forget an ingredient.">
      <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6 sm:p-7">
        {serverError && (
          <div role="alert" className="alert-error animate-fade-in">
            {serverError}
          </div>
        )}

        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className={`input ${errors[field.name] ? 'input-error' : ''}`}
              value={values[field.name]}
              onChange={handleChange}
            />
            {errors[field.name] ? (
              <p className="field-error">{errors[field.name]}</p>
            ) : (
              field.hint && <p className="mt-1.5 text-xs text-subtle">{field.hint}</p>
            )}
          </div>
        ))}

        <button type="submit" className="btn-accent w-full py-3" disabled={submitting}>
          {submitting ? (
            'Creating account…'
          ) : (
            <>
              <UserPlus className="h-4 w-4" aria-hidden="true" /> Create account
            </>
          )}
        </button>

        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="link">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
