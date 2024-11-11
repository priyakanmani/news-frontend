import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { UserContext } from '../context/UserContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(UserContext); // Access login function from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      setMessage(response.data.message);
      localStorage.setItem('token', response.data.token);
      
      login(email); // Store the user's email in context

      navigate('/news');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="image-side">
        <img
          src="https://img.freepik.com/premium-vector/breaking-news-design_24877-38230.jpg"
          alt="Login Background"
          className="background-image"
       />
      </div>
      {/* Login form layout */}
      <div className="form-side">
        <div className="login-container">
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group password-group">
                <label>Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
              <button type="submit" className="login-button">Login</button>
            </form>
            {message && <p className="message">{message}</p>}
            <p>
              Don't have an account? <Link to="/signup">Sign up here</Link>
            </p>
            <p>
              <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
