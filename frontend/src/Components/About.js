import React from 'react';
import { FaLinkedin, FaLightbulb, FaBrain, FaGraduationCap } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-section">
      {/* What is AnyMath */}
      <div className="about-container">
        <h2 className="section-title">What is AnyMath?</h2>
        <p className="section-text">
          AnyMath is an AI-powered educational tool designed to transform the way you understand mathematics.
          Instead of just giving you the answer, we generate dynamic video visualizations that explain the
          concepts behind the equations. By seeing the math come to life, you build intuition and deep understanding
          that lasts.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaLightbulb /></div>
            <h3 className="feature-title">Visual Intuition</h3>
            <p>Don't just memorize formulas. See how they behave, interact, and evolve in real-time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaBrain /></div>
            <h3 className="feature-title">AI-Powered</h3>
            <p>Our advanced AI understands your specific questions and generates custom Manim animations instantly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaGraduationCap /></div>
            <h3 className="feature-title">For Everyone</h3>
            <p>Whether you're a student, teacher, or lifelong learner, visual proofs make complex topics accessible.</p>
          </div>
        </div>
      </div>

      {/* User Experiences */}
      <div className="testimonials-section">
        <h2 className="section-title" style={{ textAlign: 'center' }}>Hear From Real Users</h2>
        <div className="testimonial-card">
          "I used to struggle with calculus until I saw the rate of change visually. It just clicked.
          AnyMath bridges the gap between abstract numbers and real-world understanding."
          <span className="testimonial-author">- Early Beta User</span>
        </div>
        <div className="testimonial-card">
          "As a visual learner, traditional textbooks often felt like a wall of text.
          Seeing usage of the concepts in motion changed everything for me."
          <span className="testimonial-author">- Math Enthusiast</span>
        </div>
      </div>

    </div>
  );
};

export default About;
