import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (err) { console.error(err); }
  };

  return (
    <section style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="title">Write a New Post</h2>
      <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '8px' }}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem' }} required />
        <textarea placeholder="Write your strategy..." value={body} onChange={e => setBody(e.target.value)} rows={10} style={{ width: '100%', marginBottom: '1rem', padding: '0.8rem' }} required />
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cover Image (Optional):</label>
          <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} accept="image/*" />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish Post</button>
      </form>
    </section>
  );
};