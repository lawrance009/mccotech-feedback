// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Create Express app
const app = express();

// ✅ CORS setup (order matters)
const allowedOrigins = [
  'http://localhost:5173',                 // Local frontend
  'https://mccotech-feedback.vercel.app/'  // ⬅️ REPLACE with your real Vercel URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow tools like Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

// Preflight handler
app.options('*', cors());

app.use(express.json()); // Parse JSON

// ✅ Import routes
const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');

// ✅ Use routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Welcome to MccoTech Feedback Backend!');
});

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
