import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="headline">
          Generate Math Lessons with AI
        </h1>
        <p className="subheadline">
          No Concept is too Complex
        </p>
      </div>
      <button className="scroll-button">
        <FaChevronDown size={32} />
      </button>
    </div>
  );
};

export default Hero;