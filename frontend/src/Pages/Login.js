import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ supabase }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) {
      setMessage(error.message);
    } else {
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="login">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {message && <div className="error-message">{message}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
        <p className="signup-link" style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.9em' }}>
          Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;