const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register a new instructor
const register = async (req, res) => {
  try {
    const { name, email, password, courses } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user document
    const user = new User({
      name,
      email,
      passwordHash: hash,
      courses: Array.isArray(courses) && courses.length ? courses : ['Cyber Security']
    });

    await user.save();

    // Return success (do not return password)
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

// Login instructor (returns JWT)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    // Create JWT payload (keep it small)
    const payload = { sub: user._id, role: user.role, name: user.name, email: user.email };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Return token and a small user object
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, courses: user.courses } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

// backend/controllers/authController.js
exports.logout = async (req, res) => {
  try {
    // Optional: Add token to blacklist if using Redis or DB (advanced)
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed' });
  }
};


module.exports = { register, login };
