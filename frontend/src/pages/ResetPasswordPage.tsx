import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api/axios';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match");
    try {
      const { data } = await API.put(`/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid token");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <section style={{ minHeight: '80vh' }}>
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h2 className="title" style={{ fontSize: '2rem' }}>Set New Password</h2>
        {error && <p style={{ color: 'tomato', marginBottom: '1rem' }}>{error}</p>}
        {message && <p style={{ color: '#10b981', marginBottom: '1rem' }}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border-color)' }} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem', background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border-color)' }} />
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Reset Password</button>
        </form>
      </div>
    </section>
  );
};