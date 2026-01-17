import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import './Pricing.css';

const Pricing = ({ session }) => {
  return (
    <div className="pricing-section">
      <h2 className="section-title">Simple Pricing</h2>
      <p className="section-text" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        Start visually exploring math for free. Upgrade for more power.
      </p>

      <div className="pricing-grid">
        {/* Free Plan */}
        <div className="pricing-card free-tier">
          <div className="card-header">
            <h3>Free</h3>
            <div className="price">$0<span>/month</span></div>
          </div>
          <div className="card-features">
            <div className="feature">
              <FaCheck className="check-icon" />
              <span>1 Video Generation per month</span>
            </div>
            <div className="feature">
              <FaCheck className="check-icon" />
              <span>Public Gallery Access</span>
            </div>
            <div className="feature">
              <FaCheck className="check-icon" />
              <span>Standard Support</span>
            </div>
          </div>
          <div className="card-footer">
            <NavLink to={session ? "/chat" : "/signup"} className="plan-btn free-btn">
              {session ? "Start Creating" : "Get Started"}
            </NavLink>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="pricing-card pro-tier">
          <div className="popular-badge">Most Popular</div>
          <div className="card-header">
            <h3>Pro</h3>
            <div className="price">Contact<span>us</span></div>
          </div>
          <div className="card-features">
            <div className="feature">
              <FaCheck className="check-icon" />
              <span>50 Video Generations per month</span>
            </div>
            <div className="feature">
              <FaCheck className="check-icon" />
              <span>Priority Processing</span>
            </div>
            <div className="feature">
              <FaCheck className="check-icon" />
              <span>Private Gallery</span>
            </div>
            <div className="feature">
              <FaCheck className="check-icon" />
              <span>Commercial Usage Rights</span>
            </div>
          </div>
          <div className="card-footer">
            <NavLink to="/get-pro" className="plan-btn pro-btn">Get Pro Access</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
