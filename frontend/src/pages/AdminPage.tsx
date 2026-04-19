import { useState, useEffect } from 'react';
import API from '../api/axios';

interface AdminUser { _id: string; name: string; email: string; status: 'active' | 'inactive'; }
interface AdminPost { _id: string; title: string; status: 'published' | 'removed'; author?: { name: string } }
interface AdminMessage { _id: string; name: string; email: string; message: string; status: string; reply?: string; createdAt: string; }

export const AdminPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [tab, setTab] = useState<'users' | 'posts' | 'messages'>('users');
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    API.get('/admin/users').then(r => setUsers(r.data));
    API.get('/admin/posts').then(r => setPosts(r.data));
    API.get('/admin/messages').then(r => setMessages(r.data));
  }, []);

  const toggleStatus = async (id: string) => {
    if (!window.confirm("Change user status?")) return;
    const { data } = await API.put(`/admin/users/${id}/status`);
    setUsers(users.map(u => u._id === id ? data.user : u));
  };

  const removePost = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    await API.put(`/admin/posts/${id}/remove`);
    setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    const { data } = await API.put(`/admin/messages/${selectedMessage._id}/reply`, { reply: replyText });
    setMessages(messages.map(m => m._id === selectedMessage._id ? data.updatedMessage : m));
    setSelectedMessage(null); setReplyText('');
  };

  const rowStyle = { 
    display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', 
    padding: '1.5rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', 
    marginBottom: '0.8rem', width: '100%', justifyContent: 'space-between' 
  };

  const colLeft = { flex: '0 0 35%', textAlign: 'left' as const };
  const colCenter = { flex: '1', textAlign: 'center' as const };
  const colRight = { flex: '0 0 300px', textAlign: 'right' as const, display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' };

  const actionBtnBase = {
    padding: '0.6rem 1.2rem',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
    minWidth: '100px'
  };

  return (
    <section style={{ width: '100%', padding: '4rem 5rem', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Admin <span style={{ color: 'var(--accent-color)' }}>Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage users, editorial content, and support tickets.</p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem', width: '100%' }}>
        <button onClick={() => setTab('users')} className={`btn ${tab === 'users' ? 'btn-primary' : 'btn-outline'}`} style={{ width: '200px', padding: '1rem' }}>USERS ({users.length})</button>
        <button onClick={() => setTab('posts')} className={`btn ${tab === 'posts' ? 'btn-primary' : 'btn-outline'}`} style={{ width: '200px', padding: '1rem' }}>POSTS ({posts.length})</button>
        <button onClick={() => setTab('messages')} className={`btn ${tab === 'messages' ? 'btn-primary' : 'btn-outline'}`} style={{ width: '200px', padding: '1rem' }}>CONTACTS ({messages.length})</button>
      </div>

      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', padding: '0 2.5rem 1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          <div style={colLeft}>{tab === 'posts' ? 'Headline' : 'Member / From'}</div>
          <div style={colCenter}>{tab === 'posts' ? 'Author' : (tab === 'messages' ? 'Subject' : 'Status')}</div>
          <div style={colRight}>Action</div>
        </div>

        {tab === 'users' && users.map(u => (
          <div key={u._id} style={rowStyle}>
            <div style={colLeft}><strong>{u.name}</strong><br /><small style={{ color: 'var(--text-muted)' }}>{u.email}</small></div>
            <div style={colCenter}><span style={{ color: u.status === 'active' ? '#10b981' : 'tomato', fontWeight: 800 }}>{u.status.toUpperCase()}</span></div>
            <div style={colRight}>
                {/* Deactivate/Activate button relocated to the prominent Action slot */}
                <button 
                    onClick={() => toggleStatus(u._id)} 
                    className={u.status === 'active' ? "btn btn-outline" : "btn btn-primary"} 
                    style={{ ...actionBtnBase, width: '150px' }}
                >
                  {u.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
            </div>
          </div>
        ))}

        {tab === 'posts' && posts.map(p => (
          <div key={p._id} style={rowStyle}>
            <div style={colLeft}><strong>{p.title}</strong></div>
            <div style={colCenter}><span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{p.author?.name || 'Admin'}</span></div>
            <div style={colRight}>
                {p.status === 'published' ? (
                  <button onClick={() => removePost(p._id)} style={{ ...actionBtnBase, background: 'rgba(255, 99, 71, 0.15)', color: 'tomato', width: '120px' }}>Delete</button>
                ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '120px', textAlign:'center' }}>REMOVED</span>}
            </div>
          </div>
        ))}

        {tab === 'messages' && messages.map(m => {
          // FIXED LOGIC: Ignores case and spaces for a perfect match
          const isMember = users.some(u => u.email.trim().toLowerCase() === m.email.trim().toLowerCase());
          
          return (
            <div key={m._id} style={rowStyle}>
              <div style={colLeft}>
                <strong>{m.name}</strong><br />
                <small style={{ color: isMember ? 'var(--accent-color)' : 'var(--text-muted)', fontWeight: 'bold' }}>{isMember ? 'MEMBER' : 'GUEST'}</small>
              </div>
              <div style={{ flex: 2, textAlign: 'left', paddingLeft: '2rem' }}>
                <span style={{ fontSize: '0.7rem', background: m.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: m.status === 'Pending' ? '#f59e0b' : '#10b981', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{m.status.toUpperCase()}</span>
                <p style={{ margin: '8px 0 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.message}</p>
              </div>
              <div style={colRight}>
                <button onClick={() => setSelectedMessage(m)} style={{ ...actionBtnBase, width: '160px' }} className="btn btn-primary">{m.status === 'Pending' ? 'Send Reply' : 'View Reply'}</button>
              </div>
            </div>
          )
        })}
      </div>

      {selectedMessage && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '12px', width: '90%', maxWidth: '600px', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Reply to {selectedMessage.name}</h3>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '1.5rem', borderRadius: '8px', margin: '1rem 0', color: 'var(--text-primary)', lineHeight: 1.6 }}>{selectedMessage.message}</div>
            <textarea placeholder="Type your reply here..." value={replyText || selectedMessage.reply} onChange={(e) => setReplyText(e.target.value)} style={{ width: '100%', minHeight: '120px', background: 'var(--bg-tertiary)', color: '#fff', border: '1px solid var(--border-color)', padding: '15px', borderRadius: '8px', marginTop: '1rem' }} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button onClick={() => { setSelectedMessage(null); setReplyText(''); }} className="btn btn-outline" style={{ padding: '0.8rem 2rem' }}>Close</button>
              <button onClick={handleReply} className="btn btn-primary" style={{ padding: '0.8rem 2.5rem' }}>Save Reply</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};