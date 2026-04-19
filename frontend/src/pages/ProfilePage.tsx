import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import axios from 'axios';

interface MyPost { _id: string; title: string; createdAt: string; }
interface MyReply { _id: string; message: string; reply?: string; status: string; createdAt: string; }

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState<File | null>(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [myReplies, setMyReplies] = useState<MyReply[]>([]);

  useEffect(() => {
    API.get('/posts/my-posts').then(res => setMyPosts(res.data)).catch(err => console.error(err));
    API.get('/messages/my-messages').then(res => setMyReplies(res.data)).catch(err => console.error(err));
  }, []);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    // CRITICAL: Ensure the field name matches the backend 'profilePic'
    if (pic) {
        fd.append('profilePic', pic);
    }

    try {
      const { data } = await API.put('/auth/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(data);
      setMsg('Profile updated!');
      setPic(null); // Reset selection after success
    } catch (err) { 
        console.error(err);
        setMsg('Failed to update profile.');
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
      setPwMsg('Password changed!');
      setCurPw(''); setNewPw('');
    } catch (err) { if (axios.isAxiosError(err)) setPwMsg(err.response?.data?.message || 'Error'); }
  };

  const deleteMyPost = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      setMyPosts(myPosts.filter(p => p._id !== id));
    } catch (err) { console.error(err); }
  };

  const picSrc = user?.profilePic ? `https://clarkproject.onrender.com/uploads/${user.profilePic}` : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&size=150`;
  const cardStyle = { background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' };
  const inputStyle = { width: '100%', marginBottom: '1.5rem', padding: '0.8rem', background: 'var(--bg-tertiary)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '6px' };

  return (
    <section style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '4rem 1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Profile Card */}
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src={picSrc} alt="Pfp" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent-color)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.8rem' }}>My Profile</h2>
            {msg && <p style={{ color: '#10b981' }}>{msg}</p>}
          </div>
          <form onSubmit={handleProfile}>
            <label style={{fontWeight:'bold', fontSize:'0.75rem'}}>DISPLAY NAME</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <label style={{fontWeight:'bold', fontSize:'0.75rem'}}>SHORT BIO</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} style={{...inputStyle, resize:'vertical'}} />
            
            <label style={{fontWeight:'bold', fontSize:'0.75rem'}}>PROFILE PICTURE</label>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={e => setPic(e.target.files?.[0] || null)} 
                style={{ display: 'none' }} 
                accept="image/*"
            />
            
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{...inputStyle, fontSize:'0.8rem', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.5rem 0.8rem'}}>
                    <span>{pic ? pic.name : 'No file chosen'}</span>
                    <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()} style={{padding:'0.3rem 0.8rem', fontSize:'0.7rem'}}>BROWSE...</button>
                </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>SAVE PROFILE</button>
          </form>
        </div>

        {/* Security Card */}
        <div style={cardStyle}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Security</h2>
          {pwMsg && <p style={{ color: '#10b981', textAlign:'center' }}>{pwMsg}</p>}
          <form onSubmit={handlePassword}>
            <label style={{fontWeight:'bold', fontSize:'0.75rem'}}>CURRENT PASSWORD</label>
            <input type="password" value={curPw} onChange={e => setCurPw(e.target.value)} style={inputStyle} required />
            <label style={{fontWeight:'bold', fontSize:'0.75rem'}}>NEW PASSWORD</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} style={inputStyle} required />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem' }}>CHANGE PASSWORD</button>
          </form>
        </div>
      </div>

      {user?.role !== 'admin' && <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem', fontFamily: 'serif' }}>User Dashboard</h1>}

      <div style={cardStyle}>
        <h3 style={{marginBottom:'2rem'}}>{user?.role === 'admin' ? 'My Posts' : 'My Posts'}</h3>
        {myPosts.length === 0 ? <p style={{color:'var(--text-muted)'}}>No posts yet.</p> : myPosts.map(p => (
          <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <span style={{ fontWeight: 'bold', fontSize:'1.1rem' }}>{p.title.toUpperCase()}</span>
              <small style={{ display: 'block', color:'var(--text-muted)' }}>{new Date(p.createdAt).toLocaleDateString()}</small>
            </div>
            <button onClick={() => deleteMyPost(p._id)} style={{ color: 'tomato', background: 'rgba(255,0,0,0.1)', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight:'bold' }}>DELETE</button>
          </div>
        ))}
      </div>

      {user?.role !== 'admin' && (
        <div style={cardStyle}>
          <h3>Admin Replies</h3>
          {myReplies.length === 0 ? <p style={{color:'var(--text-muted)'}}>No messages sent yet.</p> : myReplies.map(m => (
            <div key={m._id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Sent: {new Date(m.createdAt).toLocaleDateString()}</strong>
                <span style={{ color: m.status === 'Resolved' ? '#10b981' : '#f59e0b', fontWeight:'bold' }}>{m.status.toUpperCase()}</span>
              </div>
              <p style={{marginTop:'1rem'}}><i>"{m.message}"</i></p>
              {m.reply && <div style={{ borderLeft: '3px solid var(--accent-color)', paddingLeft: '1.5rem', marginTop: '1.5rem' }}><strong>Admin Reply:</strong><p>{m.reply}</p></div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};