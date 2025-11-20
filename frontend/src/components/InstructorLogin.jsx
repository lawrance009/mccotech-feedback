import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';

function InstructorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('instructorToken', res.data.token);

      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'Login successful.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/mccotech_Dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.error || 'Invalid credentials, try again.',
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h4>Welcome back!</h4>
          <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default InstructorLogin;
