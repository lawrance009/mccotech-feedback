const express = require('express');
const router = express.Router();

// ✅ Controllers
const { submitFeedback, getAllFeedbacks, markAsRead, deleteFeedback } = require('../controllers/feedbackController');

// ✅ Middleware
const { authenticateToken } = require('../middleware/authMiddleware');

// ✅ POST: submit new feedback (public)
router.post('/submit', submitFeedback);

// ✅ GET: fetch all feedbacks (protected)
router.get('/all', authenticateToken, getAllFeedbacks);

// ✅ PUT: mark feedback as read (protected)
router.put('/mark-read/:id', authenticateToken, markAsRead);

// ✅ DELETE: mark feedback as read (protected)
router.delete('/:id', authenticateToken, deleteFeedback);  

module.exports = router;
