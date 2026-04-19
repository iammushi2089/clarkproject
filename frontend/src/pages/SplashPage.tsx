import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChampionLogo from '../assets/Champion.jpg';

export const SplashPage = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <section 
      id="profile" 
      style={{ 
        textAlign: 'center', 
        minHeight: '85vh',       // Adjusting height to leave room for the Navbar
        padding: '2rem 0',       
        margin: 0,
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}
    >
      <div className="loader-container">
        <div className="logo" style={{ marginBottom: '30px', animation: 'float 3s ease-in-out infinite' }}>
          <img 
            src={ChampionLogo} 
            alt="Logo" 
            style={{ 
              width: '280px',     // Slightly reduced to fit better with the header visible
              height: '280px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '6px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.35)'
            }} 
          />
        </div>

        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'white' }}>Esports Analyst</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '700px' }}>
          Focused on MOBA strategy, draft analysis, and competitive team performance improvement.
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Login</Link>
          <Link to="/register" className="btn btn-outline" style={{ padding: '1rem 3rem' }}>Create Account</Link>
        </div>
      </div>
    </section>
  );
};