import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import BillingForm from './components/BillingForm';
import Navbar from './components/Navbar';
import BillsHistory from './components/BillsHistory';
import BillPrint from './components/BillPrint';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (loggedIn && user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('currentUser');
    setShowBill(false);
    setShowHistory(false);
  };

  const handleGenerateBill = (bill) => {
    const billWithDetails = {
      ...bill,
      billNo: `NJ${Date.now()}`,
      date: new Date().toISOString()
    };
    
    const savedBills = JSON.parse(localStorage.getItem('savedBills')) || [];
    savedBills.push(billWithDetails);
    localStorage.setItem('savedBills', JSON.stringify(savedBills));
    
    setCurrentBill(billWithDetails);
    setShowBill(true);
  };

  return (
    <div className="app-container">
      {isLoggedIn ? (
        <>
          <Navbar 
            currentUser={currentUser} 
            onLogout={handleLogout}
            onShowHistory={() => setShowHistory(!showHistory)}
          />
          
          <div className="content-container">
            {showHistory ? (
              <BillsHistory 
                onClose={() => setShowHistory(false)}
                onViewBill={(bill) => {
                  setCurrentBill(bill);
                  setShowBill(true);
                  setShowHistory(false);
                }}
              />
            ) : (
              <BillingForm onGenerateBill={handleGenerateBill} />
            )}
          </div>
          
          {showBill && currentBill && (
            <div className="bill-modal">
              <div className="bill-modal-content">
                <button 
                  onClick={() => setShowBill(false)}
                  className="close-modal-btn"
                >
                  ×
                </button>
                <BillPrint bill={currentBill} />
              </div>
            </div>
          )}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;