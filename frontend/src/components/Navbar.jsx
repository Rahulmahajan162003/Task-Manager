import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', color: 'var(--primary-color)'}}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
        Task Manager
      </Link>
      <div className="nav-links">
        <button onClick={toggleTheme} className="action-btn" style={{ marginRight: '16px' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {user ? (
          <>
            <span style={{ marginRight: '15px', color: 'var(--text-secondary)' }}>
              Hi, {user.name} <span className="status-badge" style={{marginLeft: '5px', borderColor: 'var(--panel-border)'}}>{user.role}</span>
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ marginRight: '10px', padding: '6px 12px' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '6px 12px' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
