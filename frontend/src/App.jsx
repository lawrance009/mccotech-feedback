import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import Register from './components/Register';
import InstructorLogin from './components/InstructorLogin';
import InstructorDashboard from './components/InstructorDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route — students only see this */}
        <Route path="/" element={<FeedbackForm />} />

        {/* Admin-only routes */}
        <Route path="/mccotech-Register" element={<Register />} />
        <Route path="/Entry" element={<InstructorLogin />} />
        <Route path="/mccotech_Dashboard" element={<InstructorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
