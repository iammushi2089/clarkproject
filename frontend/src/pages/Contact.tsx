import { useState } from 'react';
import API from '../api/axios'; 

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ message: '', isSuccess: false });

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors = { name: '', email: '', message: '' };
    setStatus({ message: '', isSuccess: false });

    if (!formData.name.trim()) { newErrors.name = 'Please enter your name'; hasError = true; }
    if (!formData.email.trim()) { newErrors.email = 'Please enter your email'; hasError = true; } 
    else if (!validateEmail(formData.email.trim())) { newErrors.email = 'Please enter a valid email address'; hasError = true; }
    if (!formData.message.trim()) { newErrors.message = 'Please enter a message'; hasError = true; }

    setErrors(newErrors);

    if (hasError) {
      setStatus({ message: 'Please fix the errors above before sending.', isSuccess: false });
      return;
    }

    try {
      await API.post('/messages', formData);
      setStatus({ message: 'Message sent! Thank you — I will get back to you soon.', isSuccess: true });
      setFormData({ name: '', email: '', message: '' }); 
    } catch (err) {
      console.error('Failed to send message:', err); // Fixes the unused variable error
      setStatus({ message: 'Failed to send message. Please try again.', isSuccess: false });
    }
  };

  const containerStyle = { textAlign: 'left' as const, marginBottom: '0.5rem' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-primary)' };
  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-tertiary)', color: 'inherit', fontFamily: 'inherit' };
  const errorStyle = { color: 'tomato', fontSize: '0.85rem', marginTop: '0.4rem', display: 'block', minHeight: '18px' };

  return (
    <>
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 className="title">Get In Touch</h1>
        <p style={{ marginBottom: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Have a question or want to work together? Send me a message!</p>

        <form onSubmit={handleSubmit} noValidate style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={containerStyle}>
            <label htmlFor="name" style={labelStyle}>Your Name:</label>
            <input type="text" id="name" placeholder="Enter your name" value={formData.name} onChange={(e) => { setFormData({...formData, name: e.target.value}); if (errors.name) setErrors({...errors, name: ''}); }} style={inputStyle} />
            <span style={errorStyle}>{errors.name}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="email" style={labelStyle}>Your Email:</label>
            <input type="email" id="email" placeholder="Enter your email" value={formData.email} onChange={(e) => { setFormData({...formData, email: e.target.value}); if (errors.email) setErrors({...errors, email: ''}); }} style={inputStyle} />
            <span style={errorStyle}>{errors.email}</span>
          </div>

          <div style={containerStyle}>
            <label htmlFor="message" style={labelStyle}>Your Message:</label>
            <textarea id="message" placeholder="Type your message here..." value={formData.message} onChange={(e) => { setFormData({...formData, message: e.target.value}); if (errors.message) setErrors({...errors, message: ''}); }} style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}></textarea>
            <span style={errorStyle}>{errors.message}</span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Send Message</button>
          
          <div style={{ marginTop: '1rem', minHeight: '20px', fontSize: '0.95rem', color: status.isSuccess ? '#10b981' : 'tomato', fontWeight: 500, textAlign: 'center' }}>
            {status.message}
          </div>
        </form>
      </section>
    </>
  );
};