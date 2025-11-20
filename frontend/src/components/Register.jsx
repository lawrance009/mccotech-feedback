import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css'; // merged CSS file for both Register and Login

function Register() {
  const [admin, setAdmin] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', admin);

      Swal.fire({
        icon: 'success',
        title: '🎉 Registration Successful!',
        text: 'You can now log in as an instructor.',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err.response?.data?.error || 'Please try again later.',
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Instructor Registration</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={admin.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={admin.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={admin.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn">Register</button>
        </form>
        </div>
    </div>
  );
}

export default Register;
