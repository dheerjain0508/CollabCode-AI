import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event: any) {
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
            name,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
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
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      {error && (
        <p>
          <strong>Error: {error}</strong>
        </p>
      )}

      <p>
        Already have an account?{' '}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;