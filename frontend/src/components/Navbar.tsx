import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChampionLogo from '../assets/Champion.jpg';
import { useTheme } from '../hooks/useTheme';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLightMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 4rem' }}>
      <div className="logo" onClick={() => navigate(user ? "/home" : "/")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img src={ChampionLogo} alt="Logo" className="logo-img" />
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Portfolio</span>
      </div>
      
      {/* Navigation Items - Removed triangle icons for cleaner spacing */}
      <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: 0, padding: 0, listStyle: 'none' }}>
        {user ? (
          <>
            <li><Link className={isActive('/home')} to="/home">HOME</Link></li>
            <li><Link className={isActive('/about')} to="/about">ABOUT</Link></li>
            <li><Link className={isActive('/contact')} to="/contact">CONTACT</Link></li>
            <li><Link className={isActive('/create-post')} to="/create-post">WRITE POST</Link></li>
            <li><Link className={isActive('/profile')} to="/profile">PROFILE</Link></li>
            {user.role === 'admin' && <li><Link className={isActive('/admin')} to="/admin">ADMIN</Link></li>}
            <li><button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>LOGOUT</button></li>
          </>
        ) : (
          <>
            <li><Link className={isActive('/')} to="/">HOME</Link></li>
            <li><Link className={isActive('/about')} to="/about">ABOUT</Link></li>
            <li><Link className={isActive('/contact')} to="/contact">CONTACT</Link></li>
            <li><Link className={isActive('/login')} to="/login">LOGIN</Link></li>
            <li><Link className={isActive('/register')} to="/register">REGISTER</Link></li>
          </>
        )}
        
        {/* Toggle remains at the end */}
        <li style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
          <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
            <input type="checkbox" checked={!isLightMode} onChange={toggleTheme} style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{ position: 'absolute', inset: 0, backgroundColor: !isLightMode ? '#1e90ff' : '#ccc', borderRadius: '34px', transition: '0.3s' }} />
            <span style={{ position: 'absolute', height: '18px', width: '18px', left: !isLightMode ? '23px' : '3px', bottom: '3px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s' }} />
          </label>
        </li>
      </ul>
    </header>
  );
};