import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  }

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(user.role === 'ADMIN' ? '/admin' : '/', {
        replace: true,
      });
    } catch (error) {
      setServerError(error.userMessage);
      setErrors(error.validationErrors || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-page__visual">
        <div className="auth-page__visual-content">
          <span className="eyebrow eyebrow--light">Member access</span>
          <h1>Continue your library activity.</h1>
          <p>Sign in to submit borrowing requests and follow each request from your dashboard.</p>
          <div className="auth-page__quote">
            <span aria-hidden="true">“</span>
            <p>A library account keeps your requests and active loans in one clear place.</p>
          </div>
        </div>
      </div>

      <div className="auth-page__form-wrap">
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="auth-form__heading">
            <span className="eyebrow">Welcome back</span>
            <h2>Login to your account</h2>
            <p>Enter the email and password registered with the library.</p>
          </div>

          {serverError && <Alert type="error">{serverError}</Alert>}

          <Input
            label="Email address"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            error={errors.email}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          <Button type="submit" size="lg" loading={submitting} className="auth-form__submit">
            Login
          </Button>

          <p className="auth-form__switch">
            Do not have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
