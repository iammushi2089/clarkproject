// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom';
import ChampionLogo from '../assets/Champion.jpg';
import { useTheme } from '../hooks/useTheme';

export const Header = () => {
  const location = useLocation();
  const { isLightMode, toggleTheme } = useTheme();

  // Don't show header on the Splash screen
  if (location.pathname === '/') return null;

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <header>
      <div className="logo">
        <img src={ChampionLogo} alt="Logo" className="logo-img" />
        <span>Portfolio</span>
      </div>
      <ul className="nav-links">
        <li><Link className={isActive('/home')} to="/home">Home</Link></li>
        <li><Link className={isActive('/about')} to="/about">About</Link></li>
        <li><Link className={isActive('/contact')} to="/contact">Contact</Link></li>
        <li><Link className={isActive('/register')} to="/register">Register</Link></li>
      </ul>
      <button 
        className="theme-toggle" 
        onClick={toggleTheme} 
        title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
      >
        {isLightMode ? '🌙' : '☀️'}
      </button>
    </header>
  );
};