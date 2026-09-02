import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event: any) {
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
            email,
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
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <br />

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Password</label>

          <br />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && (
        <p>
          <strong>Error: {error}</strong>
        </p>
      )}

      <p>
        Don't have an account?{' '}
        <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;