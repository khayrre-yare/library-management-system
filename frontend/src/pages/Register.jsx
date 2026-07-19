import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = 'Full name must contain at least 2 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.password.length < 8) next.password = 'Password must contain at least 8 characters.';
    if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      navigate('/', { replace: true });
    } catch (error) {
      setServerError(error.userMessage);
      setErrors((current) => ({ ...current, ...(error.validationErrors || {}) }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page auth-page--register">
      <div className="auth-page__visual">
        <div className="auth-page__visual-content">
          <span className="eyebrow eyebrow--light">New member</span>
          <h1>Create your library account.</h1>
          <p>Registration gives you access to the borrow cart and a personal borrowing dashboard.</p>
          <ul className="auth-benefits">
            <li>Browse and search the full catalogue</li>
            <li>Submit books together from the borrow cart</li>
            <li>Follow approval and return status</li>
          </ul>
        </div>
      </div>

      <div className="auth-page__form-wrap">
        <form className="auth-form" onSubmit={submit} noValidate>
          <div className="auth-form__heading">
            <span className="eyebrow">Member registration</span>
            <h2>Create an account</h2>
            <p>Complete every field. Your email will be used as your login.</p>
          </div>

          {serverError && <Alert type="error">{serverError}</Alert>}

          <Input
            label="Full name"
            name="fullName"
            value={form.fullName}
            onChange={update}
            error={errors.fullName}
            autoComplete="name"
            required
          />
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
            hint="Use at least 8 characters."
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={update}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <Button type="submit" size="lg" loading={submitting} className="auth-form__submit">
            Create account
          </Button>

          <p className="auth-form__switch">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
