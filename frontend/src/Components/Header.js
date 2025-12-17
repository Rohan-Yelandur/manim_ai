import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo-icon">
          <img src="/favicon.png" alt="MathVision Logo" className="logo-img" />
        </div>
        <h1 className="title">AnyMath</h1>
      </div>
    </header>
  );
};

export default Header;