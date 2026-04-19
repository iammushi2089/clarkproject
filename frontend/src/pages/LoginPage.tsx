import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/home');
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || 'Login failed.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage('');
    try {
      const { data } = await API.post('/auth/forgot-password', { email: forgotEmail });
      setForgotMessage(data.message);
    } catch (err) { console.error(err); }
  };

  const containerStyle = { maxWidth: '400px', margin: '4rem auto', padding: '2.5rem', background: 'transparent', border: 'none', textAlign: 'left' as const };
  const inputStyle = { width: '100%', padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' };

  if (isForgotPassword) {
    return (
      <section style={{ minHeight: '80vh' }}>
        <div style={containerStyle}>
          <h2 style={{ marginBottom: '1rem' }}>Reset Password</h2>
          {forgotMessage && <div style={{ color: '#10b981', marginBottom: '1rem' }}>{forgotMessage}</div>}
          <form onSubmit={handleForgotPassword}>
            <input type="email" placeholder="Email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required style={inputStyle} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Send Reset Link</button>
          </form>
          <button onClick={() => setIsForgotPassword(false)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}>Back to Login</button>
        </div>
      </section>
    );
  }

  return (
    <section style={{ minHeight: '80vh' }}>
      <div style={containerStyle}>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Login to TheFolio</h2>
        {error && <div style={{ color: 'tomato', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1.5rem' }}>LOGIN</button>
          <div style={{ textAlign: 'center' }}>
             <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.85rem' }}>Forgot Password?</button>
          </div>
        </form>
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)' }}>Register here</Link>
        </div>
      </div>
    </section>
  );
};