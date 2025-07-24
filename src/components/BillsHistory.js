import React, { useState, useEffect } from 'react';
import './BillsHistory.css';

const BillsHistory = ({ onClose, onViewBill }) => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem('savedBills')) || [];
    setBills(savedBills);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedBills = [...bills].sort((a, b) => {
    // Convert to string and lowercase for case-insensitive comparison
    const aValue = String(a[sortConfig.key]).toLowerCase();
    const bValue = String(b[sortConfig.key]).toLowerCase();
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredBills = sortedBills.filter(bill => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(bill.customerName).toLowerCase().includes(searchLower) ||
      String(bill.billNo).toLowerCase().includes(searchLower) ||
      String(bill.customerPhone || '').toLowerCase().includes(searchLower) ||
      String(bill.total).includes(searchTerm) // Allow searching by amount without decimal
    );
  });

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bills-history-container">
      <div className="history-header">
        <h2>Billing History</h2>
        <div className="history-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, bill no, phone, or amount..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="clear-search-btn"
              >
                ×
              </button>
            )}
          </div>
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div className="no-bills">
          {searchTerm ? 'No matching bills found' : 'No bills history available'}
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('billNo')}>
                  Bill No {sortConfig.key === 'billNo' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('date')}>
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('customerName')}>
                  Customer {sortConfig.key === 'customerName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('total')}>
                  Amount {sortConfig.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.billNo}>
                  <td>{bill.billNo}</td>
                  <td>{formatDate(bill.date)}</td>
                  <td>{bill.customerName}</td>
                  <td>{formatCurrency(bill.total)}</td>
                  <td>
                    <button 
                      onClick={() => onViewBill(bill)}
                      className="view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BillsHistory;