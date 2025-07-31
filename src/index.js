import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import App from './App';
import './styles.css';

// Create the root element using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside the root element
root.render(<App />);