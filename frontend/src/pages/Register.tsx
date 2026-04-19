import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api/axios';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', confirmPassword: '', dob: '', yearsExp: '', gender: '', terms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modal, setModal] = useState({ isOpen: false, message: '' });

  const showModal = (msg: string) => setModal({ isOpen: true, message: msg });
  const closeModal = () => setModal({ isOpen: false, message: '' });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.isOpen) closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [modal.isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'password') {
      if (typeof finalValue === 'string' && finalValue.length > 0 && finalValue.length < 8) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) { newErrors.name = "Full Name is required"; isValid = false; }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"; isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"; isValid = false;
    }
    if (!formData.password) { newErrors.password = "Password is required"; isValid = false; }
    else if (formData.password.length < 8) { newErrors.password = "Password must be at least 8 characters"; isValid = false; }
    if (!formData.confirmPassword) { newErrors.confirmPassword = "Confirm Password is required"; isValid = false; }
    else if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = "Passwords do not match"; isValid = false; }

    setErrors(newErrors);

    if (isValid) {
      try {
        const { data } = await API.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('token', data.token);
        showModal("You are registered successfully!");
        
        setTimeout(() => {
          navigate('/home');
        }, 1500);

      } catch (err) {
        if (axios.isAxiosError(err)) {
          showModal(err.response?.data?.message || "Registration failed. Please try again.");
        } else {
          showModal("An unexpected error occurred.");
        }
      }
    }
  };

  const containerStyle = { textAlign: 'left' as const, marginBottom: '0.5rem' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' };
  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'inherit' };
  const errorStyle = { color: 'tomato', fontSize: '0.85rem', marginTop: '0.4rem', display: 'block', minHeight: '18px' };

  return (
    <>
      <section>
        <h1 className="title">Analyst / Coach Registration</h1>
        <p style={{ marginBottom: '2rem' }}>Sign up to receive strategy insights, coaching tips, and esports updates.</p>

        {modal.isOpen && (
          <div className="modal-overlay" style={{ display: 'flex', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(4px)' }} role="dialog" aria-modal="true">
            <div className="modal" style={{ background: 'var(--bg-secondary)', padding: '30px', borderRadius: '8px', border: '1px solid var(--accent-color)', textAlign: 'center', maxWidth: '400px', width: '90%' }}>
              <p style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{modal.message}</p>
              <button className="btn btn-primary" onClick={closeModal} autoFocus>OK</button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={containerStyle}>
            <label htmlFor="name" style={labelStyle}>Full Name:</label>
            <input type="text" id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} style={inputStyle} />
            <span style={errorStyle}>{errors.name}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="username" style={labelStyle}>Preferred Username:</label>
            <input type="text" id="username" name="username" placeholder="Enter a username" value={formData.username} onChange={handleChange} style={inputStyle} />
            <span style={errorStyle}>{errors.username}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="email" style={labelStyle}>Email:</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} style={inputStyle} />
            <span style={errorStyle}>{errors.email}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="password" style={labelStyle}>Password:</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} style={inputStyle} />
            <span style={errorStyle}>{errors.password}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} />
            <span style={errorStyle}>{errors.confirmPassword}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="dob" style={labelStyle}>Date of Birth:</label>
            <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} style={{ ...inputStyle, colorScheme: 'dark' }} />
            <span style={errorStyle}>{errors.dob}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="yearsExp" style={labelStyle}>Years of Experience:</label>
            <input type="number" id="yearsExp" name="yearsExp" placeholder="Enter years of experience" min="0" step="0.5" value={formData.yearsExp} onChange={handleChange} style={inputStyle} />
            <span style={errorStyle}>{errors.yearsExp}</span>
          </div>

          <div style={containerStyle}>
            <label style={labelStyle}>Gender:</label>
            <div style={{ display: 'flex', gap: '1.5rem', padding: '0.5rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> Male
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Female
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} /> Other
              </label>
            </div>
            <span style={errorStyle}>{errors.gender}</span>
          </div>

          <div style={{ ...containerStyle, marginTop: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} style={{ width: '18px', height: '18px' }} /> 
              I agree to the terms and conditions
            </label>
            <span style={errorStyle}>{errors.terms}</span>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '1rem' }}>Register</button>
        </form>
      </section>
    </>
  );
};