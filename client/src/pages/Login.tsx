import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError('');

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        'http://localhost:3000/api/auth/sign-in/email',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
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

          <h1>Welcome back.</h1>

          <p className="auth-subtitle">
            Sign in to continue building with your
            developer community.
          </p>
        </header>

        {/* Login Card */}

        <section className="auth-card">
          <div className="auth-section-heading">
            <span>01</span>

            <div>
              <h2>Sign In</h2>
              <p>Enter your account details.</p>
            </div>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-form-group">
              <label htmlFor="login-email">
                Email
              </label>

              <input
                id="login-email"
                type="email"
                value={email}
                placeholder="you@example.com"
                autoComplete="email"
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="login-password">
                Password
              </label>

              <input
                id="login-password"
                type="password"
                value={password}
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={(event) =>
                  setPassword(event.target.value)
                }
              />
            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          {error && (
            <div className="auth-message error">
              <strong>Error:</strong> {error}
            </div>
          )}
        </section>

        {/* Signup Link */}

        <div className="auth-footer">
          <span>NEW TO COLLABCODE?</span>

          <p>
            Don't have an account?{' '}
            <Link to="/signup">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;