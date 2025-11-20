// frontend/src/components/InstructorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../styles/InstructorDashboard.css';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function InstructorDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  // ✅ Fetch feedbacks and verify login
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('instructorToken');
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Please log in first!',
          showConfirmButton: true,
        }).then(() => navigate('/Entry'));
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdminName(payload?.email?.split('@')[0] || 'Admin');

        const res = await axios.get(`${API_BASE_URL}/api/feedback/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error fetching feedbacks',
          text: 'Please check your connection or login again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [navigate]);

  // ✅ Logout logic
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout now?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('instructorToken');
        Swal.fire({
          icon: 'success',
          title: 'You logged out successfully!',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate('/Entry'));
      }
    });
  };

  // ✅ Mark feedback as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('instructorToken');
      await axios.put(
        `${API_BASE_URL}/api/feedback/mark-read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks((prev) =>
        prev.map((fb) => (fb._id === id ? { ...fb, isRead: true } : fb))
      );
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  // ✅ Delete feedback
  const handleDelete = async (id) => {
    const token = localStorage.getItem('instructorToken');
    if (!token) return Swal.fire('Error', 'Not authorized', 'error');

    const confirm = await Swal.fire({
      title: 'Delete this feedback?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/feedback/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          timer: 1200,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire('Error', 'Failed to delete feedback', 'error');
      }
    }
  };

  // ✅ Modal open + mark read
  const openFeedbackModal = (fb) => {
    setSelectedFeedback(fb);
    setShowModal(true);
    if (!fb.isRead) markAsRead(fb._id);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  // ✅ Sidebar Toggle
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);
  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);

  return (
    <div className={`dashboard-layout ${mobileOpen ? 'menu-open' : ''}`}>
      {/* Hamburger Menu (Mobile) */}
      <div className="menu-toggle" onClick={toggleMobileMenu}>
        ☰
      </div>

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${
          mobileOpen ? 'open' : ''
        }`}
      >
        <div className="sidebar-top">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Admin Avatar"
            className="admin-avatar"
          />
          {!sidebarCollapsed && (
            <>
              <h3 className="welcome-text">Welcome, {adminName}!</h3>
              <p className="role-text">Instructor</p>
            </>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        {/* Collapse Arrow */}
        <button
          className={`collapse-toggle ${sidebarCollapsed ? 'collapsed' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? '➤' : '◀'}
        </button>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="overlay" onClick={toggleMobileMenu}></div>}

      {/* ===== MAIN CONTENT ===== */}
      <main className="dashboard-content">
        <h2 className="dashboard-title">MccoTech Feedback Management</h2>

        {loading ? (
          <p className="loading-text">Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p className="no-feedbacks">No feedbacks yet.</p>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((fb) => (
              <div
                key={fb._id}
                className={`feedback-card ${fb.isRead ? 'read' : 'unread'}`}
                onClick={() => openFeedbackModal(fb)}
              >
                <div className="feedback-info">
                  <h4 className="feedback-name">{fb.name || 'Anonymous'}</h4>
                  <p className="feedback-summary">
                    sent feedback on <strong>{fb.course}</strong>
                  </p>
                </div>
                <div className="feedback-meta">
                  <span className="feedback-date">
                    {new Date(fb.date).toLocaleDateString()}
                  </span>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(fb._id);
                    }}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===== Modal Popup ===== */}
      {showModal && selectedFeedback && (
        <>
          <div className="modal-overlay" onClick={closeModal} />
          <div className="feedback-modal" role="dialog" aria-modal="true">
            <button className="modal-close" onClick={closeModal}>
              ✖
            </button>
            <h3>
              {selectedFeedback.name || 'Anonymous'} —{' '}
              {selectedFeedback.course}
            </h3>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(selectedFeedback.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Lesson Clarity:</strong> {selectedFeedback.lessonClarity}
            </p>
            <hr />
            <div className="modal-scroll">
              <p>
                <strong>Explanation:</strong>
                <br />
                {selectedFeedback.explanation}
              </p>
              <p>
                <strong>What Learned:</strong>
                <br />
                {selectedFeedback.whatLearned}
              </p>
              {selectedFeedback.improvement && (
                <p>
                  <strong>Improvement:</strong>
                  <br />
                  {selectedFeedback.improvement}
                </p>
              )}
              {selectedFeedback.recommendation && (
                <p>
                  <strong>Recommendation:</strong>
                  <br />
                  {selectedFeedback.recommendation}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default InstructorDashboard;
