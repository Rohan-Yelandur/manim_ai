import { useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

const Header = ({ user, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isHomePage ? 'home-header' : 'gallery-header-bg'} ${isMenuOpen ? 'menu-open' : ''}`}>
      <div className="header-content">
        <NavLink className='home-button' to="/" onClick={closeMenu}>
          <img className="logo-img" src="/favicon.png" alt="AnyMath Logo" />
          <h1 className="title">AnyMath</h1>
        </NavLink>

        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <NavLink className='chat-button' to="/chat" onClick={closeMenu}>Chat</NavLink>
          <NavLink className='gallery-button' to="/gallery" onClick={closeMenu}>Gallery</NavLink>
          {user ? (
            <button className="logout-button" onClick={() => { onSignOut(); closeMenu(); }}>Logout</button>
          ) : (
            <>
              <NavLink className='login-button' to="/login" onClick={closeMenu}>Login</NavLink>
              <NavLink className='signup-button' to="/signup" onClick={closeMenu}>Sign Up</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;