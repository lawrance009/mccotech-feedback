const mongoose = require('mongoose');

// Define the feedback structure
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // removes extra spaces
  },
  course: {
    type: String,
    required: true, // must be filled
  },
  date: {
    type: Date,
    default: Date.now, // auto sets current date
  },
  lessonClarity: {
    type: Number,
    required: true, // 1–5 rating
  },
  explanation: {
    type: String,
    required: true,
  },
  whatLearned: {
    type: String,
    required: true,
  },
  improvement: {
    type: String,
  },
  recommendation: {
    type: String,
  },
  isRead: {
    type: Boolean, default: false }, // 🟢 new field

});

// Create the Feedback model from schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Export it so other files can use it
module.exports = Feedback;
