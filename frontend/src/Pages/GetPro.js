import React, { useState } from 'react';
import './GetPro.css';

const GetPro = () => {
  const [name, setName] = useState('');

  // Hardcoded email destination and subject
  const destinationEmail = 'r.yelandur@gmail.com';
  const emailSubject = 'I would like a Pro subscription to AnyMath.';

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct the mailto link
    // We can add a simple body with their name if meaningful, or just keep it simple
    const body = `Hi,\n\nI'm ${name}, and I'm interested in upgrading to the Pro plan.`;

    window.location.href = `mailto:${destinationEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="get-pro-container">
      <div className="get-pro-card">
        <h1 className="pro-title">Upgrade to Pro</h1>
        <p className="pro-description">
          Unlock 50+ video generations per month and take your math visualization to the next level.
        </p>

        <div className="pro-benefits">
          <div className="benefit-item">
            <span className="check-icon">✓</span>
            <span>50 Videos per month</span>
          </div>
          <div className="benefit-item">
            <span className="check-icon">✓</span>
            <span>Priority Support</span>
          </div>
          <div className="benefit-item">
            <span className="check-icon">✓</span>
            <span>Commercial Usage Rights</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <button type="submit" className="pro-cta-btn">
            Contact for Access
          </button>
          <p className="form-note">
            This will open your email client to send a request directly to me.
          </p>
        </form>
      </div>
    </div>
  );
};

export default GetPro;
