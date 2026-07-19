import { useState } from 'react';
import { contactApi } from '../api/client';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from '../context/ToastContext';

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setSent(false);
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (form.subject.trim().length < 3) next.subject = 'Enter a clear subject.';
    if (form.message.trim().length < 10) next.message = 'Message must contain at least 10 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await contactApi.send(form);
      setForm(initialForm);
      setErrors({});
      setSent(true);
      showToast('Your message was sent to the library administrator.', 'success');
    } catch (error) {
      setErrors(error.validationErrors || {});
      showToast(error.userMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section page-section contact-page">
      <div className="container">
        <PageHeader
          eyebrow="Contact"
          title="Send a message to the library"
          description="Use this form for questions about books, borrowing requests, or your account."
        />

        <div className="contact-layout">
          <div className="contact-information">
            <span className="contact-information__label">Library support</span>
            <h2>Clear questions receive clearer answers.</h2>
            <p>
              Include the book title, request status, or account email when it is relevant to your
              question.
            </p>
            <div className="contact-information__items">
              <div>
                <span aria-hidden="true">01</span>
                <strong>Book enquiries</strong>
                <small>Ask about availability or catalogue details.</small>
              </div>
              <div>
                <span aria-hidden="true">02</span>
                <strong>Borrowing support</strong>
                <small>Ask about pending, approved, or returned books.</small>
              </div>
              <div>
                <span aria-hidden="true">03</span>
                <strong>Account support</strong>
                <small>Report a problem accessing your member account.</small>
              </div>
            </div>
          </div>

          <form className="contact-form card card--padded" onSubmit={submit} noValidate>
            {sent && (
              <Alert type="success" title="Message sent">
                The administrator can now review your message.
              </Alert>
            )}
            <div className="form-grid form-grid--two">
              <Input
                label="Full name"
                name="name"
                value={form.name}
                onChange={update}
                error={errors.name}
                autoComplete="name"
                required
              />
              <Input
                label="Email address"
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                error={errors.email}
                autoComplete="email"
                required
              />
            </div>
            <Input
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={update}
              error={errors.subject}
              required
            />
            <div className="field">
              <label className="field__label" htmlFor="message">
                Message <span className="field__required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                className={`field__control field__textarea ${errors.message ? 'field__control--error' : ''}`}
                value={form.message}
                onChange={update}
                rows="7"
                required
              />
              {errors.message && <span className="field__error">{errors.message}</span>}
            </div>
            <Button type="submit" size="lg" loading={submitting}>
              Send message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
