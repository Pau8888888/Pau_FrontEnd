import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo iniciar sesion');
      }

      onLogin(data.data.accessToken, data.data.refreshToken, {
        id: data.data.id,
        role: data.data.role,
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}
        />
        <input
          type='password'
          placeholder='Password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', width: '100%', boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <button
          type='submit'
          disabled={loading}
          style={{ display: 'block', width: '100%', boxSizing: 'border-box' }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p>No tienes cuenta? <Link to='/register'>Registrate</Link></p>
    </div>
  );
}
