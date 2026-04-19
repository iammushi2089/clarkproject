// src/pages/PostPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; // axios is not used directly, only API is
import { useAuth } from '../context/AuthContext';

interface Comment {
  _id: string;
  body: string;
  author: { _id: string; name: string; profilePic?: string };
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  body: string;
  image?: string;
  author: { _id: string; name: string };
  createdAt: string;
}

export const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await API.post(`/comments/${id}`, { body: newComment });
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) { console.error(err); }
  };

  const deleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) { console.error(err); }
  };

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/home');
    } catch (err) { console.error(err); }
  };

  if (loading) return <section><p>Loading...</p></section>;
  if (!post) return <section><p>Post not found.</p></section>;

  const isOwnerOrAdmin = user && (user.id === post.author._id || user.role === 'admin');

  return (
    <section style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      {post.image && (
        <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem' }} />
      )}
      <h1 className="title">{post.title}</h1>
      <div style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        By {post.author.name} on {new Date(post.createdAt).toLocaleDateString()}
      </div>
      
      <div style={{ whiteSpace: 'pre-wrap', marginBottom: '3rem', fontSize: '1.1rem' }}>{post.body}</div>

      {isOwnerOrAdmin && (
        <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
          <Link to={`/edit-post/${post._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Edit Post</Link>
          <button onClick={deletePost} className="btn btn-outline" style={{ padding: '0.5rem 1.5rem', color: 'tomato', borderColor: 'tomato' }}>Delete Post</button>
        </div>
      )}

      <hr style={{ borderColor: 'var(--border-color)', margin: '2rem 0' }} />

      <h3>Comments ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleAddComment} style={{ margin: '1.5rem 0' }}>
          <textarea 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            placeholder="Write a comment..." 
            style={{ width: '100%', background: 'var(--bg-tertiary)', color: 'white', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
          />
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Post Comment</button>
        </form>
      ) : (
        <p><Link to="/login" style={{ color: 'var(--accent-color)' }}>Login</Link> to join the discussion.</p>
      )}

      <div style={{ marginTop: '2rem' }}>
        {comments.map(c => (
          <div key={c._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{c.author.name}</strong>
              <small>{new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
            <p style={{ marginTop: '0.5rem' }}>{c.body}</p>
            {(user?.id === c.author._id || user?.role === 'admin') && (
              <button onClick={() => deleteComment(c._id)} style={{ background: 'none', border: 'none', color: 'tomato', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};