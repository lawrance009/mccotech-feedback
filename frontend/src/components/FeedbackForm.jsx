import React, { useState } from 'react';
import '../styles/FeedbackForm.css';
import logo from '../assets/logo1.png';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    course: 'Cyber Security',
    date: '',
    rating: '',
    explanation: '',
    learned: '',
    improvement: '',
    recommendation: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rating || !formData.explanation || !formData.learned) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields: Rating, Explanation, and Learned!',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/feedback/submit`,
        formData
      );

      Swal.fire({
        icon: 'success',
        title: 'Thanks!',
        text: 'Your Feedback was submitted successfully!',
        timer: 2500,
        showConfirmButton: false,
      });

      setFormData({
        name: '',
        course: 'Cyber Security',
        date: '',
        rating: '',
        explanation: '',
        learned: '',
        improvement: '',
        recommendation: '',
      });
    } catch (error) {
      console.error('Submit error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error submitting feedback. Please try again!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-page">
      {/* Overlay loader */}
      {loading && (
        <div className="overlay">
          <img src={logo} alt="loading" className="logo spin" />
        </div>
      )}

      <div className={`form-container ${loading ? 'blurred' : ''}`}>
        <h2>We Value Your Feedback!</h2>
        <p>Your input helps MccoTech continue being the best at what we do.</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name (optional)" value={formData.name} onChange={handleChange} />
          <select name="course" value={formData.course} onChange={handleChange}>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Other Course">Other Course</option>
          </select>
          <input type="date" name="date" value={formData.date} onChange={handleChange} />
          <select name="rating" value={formData.rating} onChange={handleChange} required>
            <option value="">Rate Lesson Clarity *</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
          <textarea name="explanation" placeholder="How was the explanation? *" value={formData.explanation} onChange={handleChange} required />
          <textarea name="learned" placeholder="What did you learn today? *" value={formData.learned} onChange={handleChange} required />
          <textarea name="improvement" placeholder="What can we improve?" value={formData.improvement} onChange={handleChange} />
          <textarea name="recommendation" placeholder="Recommendations / Comments" value={formData.recommendation} onChange={handleChange} />
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      <div className="info-container">
        <img src={logo} alt="MccoTech Logo" className="logo" />

      </div>

      <footer>
        Developed by Lawrance Wagan Domah. Developer at MccoTech.
      </footer>
    </div>
  );
}

export default FeedbackForm;
