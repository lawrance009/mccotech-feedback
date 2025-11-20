// backend/controllers/feedbackController.js
const Feedback = require('../models/feedback');

// ✅ 1. Handle feedback submission
const submitFeedback = async (req, res) => {
  try {
    const {
      name,
      course,
      date,
      rating,
      explanation,
      learned,
      improvement,
      recommendation,
    } = req.body;

    if (!course || !rating) {
      return res.status(400).json({ error: 'Course and rating are required' });
    }

    const feedback = new Feedback({
      name: name?.trim(),
      course: course?.trim(),
      date: date || Date.now(),
      lessonClarity: rating,
      explanation: explanation?.trim(),
      whatLearned: learned?.trim(),
      improvement: improvement?.trim(),
      recommendation: recommendation?.trim(),
      isRead: false, // default unread
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully!' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// ✅ 2. Fetch all feedbacks (for instructor dashboard)
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ date: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
};

// ✅ 3. Mark a feedback as read (permanent)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (!feedback.isRead) {
      feedback.isRead = true;
      await feedback.save();
    }

    res.status(200).json({ message: 'Feedback marked as read' });
  } catch (error) {
    console.error('Error marking feedback as read:', error);
    res.status(500).json({ message: 'Failed to mark feedback as read' });
  }
};

// ✅ 3. Delete a feedback (permanently)
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Feedback.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Feedback not found' });
    return res.status(200).json({ message: 'Feedback deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ error: 'Failed to delete feedback' });
  }
};

module.exports = { submitFeedback, getAllFeedbacks, markAsRead, deleteFeedback };
