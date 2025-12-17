import { FaLinkedin, FaGithub } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <span className="footer-text">Built by Rohan Yelandur</span>
      <div className="footer-links">
        <a
          href="https://www.linkedin.com/in/rohan-yelandur/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          title="LinkedIn"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://github.com/Rohan-Yelandur/manim_ai"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          title="GitHub"
        >
          <FaGithub size={24} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;