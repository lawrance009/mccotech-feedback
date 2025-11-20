import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/FeedbackForm.css';
import App from './App';  // import App, not FeedbackForm

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />  {/* Render App so routes & navbar show */}
  </StrictMode>
);

