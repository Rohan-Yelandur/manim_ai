import { NavLink } from "react-router-dom";
import './Header.css';

const Header = ({ user, onSignOut }) => {
  return (
    <header className="header">
      <NavLink className='home-button' to="/">
        <img className="logo-img" src="/favicon.png" alt="AnyMath Logo" />
        <h1 className="title">AnyMath</h1>
      </NavLink>
      <NavLink className='gallery-button' to="/gallery">Gallery</NavLink>
      {user ? (
        <button className="logout-button" onClick={onSignOut}>Logout</button>
      ) : (
        <>
          <NavLink className='login-button' to="/login">Login</NavLink>
          <NavLink className='signup-button' to="/signup">Sign Up</NavLink>
        </>
      )}

    </header>
  );
};

export default Header;