import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:3000/api/auth/sign-up/email',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Signup failed',
        );
      }

      navigate('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">

        {/* Header */}

        <header className="auth-header">
          <p className="auth-eyebrow">
            COLLABCODE • ACCOUNT
          </p>

          <h1>Build with others.</h1>

          <p className="auth-subtitle">
            Create your account and start discovering
            developers and projects worth building.
          </p>
        </header>

        {/* Signup Card */}

        <section className="auth-card">
          <div className="auth-section-heading">
            <span>01</span>

            <div>
              <h2>Create Account</h2>

              <p>
                Set up your CollabCode account.
              </p>
            </div>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {/* Name */}

            <div className="auth-form-group">
              <label htmlFor="signup-name">
                Name
              </label>

              <input
                id="signup-name"
                type="text"
                value={name}
                placeholder="Your name"
                autoComplete="name"
                onChange={(event) =>
                  setName(event.target.value)
                }
              />
            </div>

            {/* Email */}

            <div className="auth-form-group">
              <label htmlFor="signup-email">
                Email
              </label>

              <input
                id="signup-email"
                type="email"
                value={email}
                placeholder="you@example.com"
                autoComplete="email"
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            {/* Password */}

            <div className="auth-form-group">
              <label htmlFor="signup-password">
                Password
              </label>

              <input
                id="signup-password"
                type="password"
                value={password}
                placeholder="Create a password"
                autoComplete="new-password"
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />

              <small>
                Use a strong password for your account.
              </small>
            </div>

            {/* Submit */}

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? 'Creating account...'
                : 'Sign Up →'}
            </button>
          </form>

          {/* Error */}

          {error && (
            <div className="auth-message error">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* Login Link */}

        <div className="auth-footer">
          <span>ALREADY A MEMBER?</span>

          <p>
            Already have an account?{' '}
            <Link to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Signup;