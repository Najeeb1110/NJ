import React from 'react';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = ({ currentUser, onLogout, onShowHistory }) => {
  return (
    <header className="navbar">
      <div className="logo-container">
        <img src={logo} alt="N Jewellers Logo" className="logo-img" />
        <div className="logo-text">
          <h1>N Jewellers</h1>
          <p>Designer 916 gold jewellery</p>
        </div>
      </div>
      {currentUser && (
        <div className="user-controls">
          <span className="user-greeting">Logged in as: {currentUser.name}</span>
          <div className="button-group">
            <button 
              onClick={onShowHistory} 
              className="history-btn"
            >
              Bill History
            </button>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;