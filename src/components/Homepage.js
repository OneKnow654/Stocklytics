// src/components/Homepage.js

import React from 'react';
import './Homepage.css'; // Import the CSS for styling

const Homepage = () => {
  return (
    <div className="homepage-container">
      {/* Header Section */}
      <header className="homepage-header">
        <h1 >
          Welcome to StockVision
        </h1>
       <p>
          Predict the future of your investments with confidence.
        </p>
      </header>

      {/* Hero Section */}
     <div>
        <img 
          src="https://via.placeholder.com/800x400" 
          alt="Stock Market Graphic" 
          className="hero-image"
        />
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div>
          <h2>Accurate Predictions</h2>
          <p>Our AI model provides precise stock price predictions for short, mid, and long terms.</p>
        </div>
        <div
         
        >
          <h2>Real-Time Updates</h2>
          <p>Stay ahead with live market data and instant analysis.</p>
        </div>
        <div 
        
        >
          <h2>Risk Analysis</h2>
          <p>Minimize risk with dynamic risk-reward metrics tailored to your preferences.</p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="homepage-footer">
        <p 
         
        >
          © 2025 StockVision. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;
