import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <NavLink className='home-button'to="/">
        <img className="logo-img"src="/favicon.png" alt="AnyMath Logo"/>
        <h1 className="title">AnyMath</h1>
      </NavLink>
      <NavLink className='gallery-button'to="/gallery">Gallery</NavLink>
      <CgProfile />
    </header>
  );
};

export default Header;