import React, { useState, useEffect } from 'react';
import './BillingForm.css';

const BillingForm = ({ onGenerateBill }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    itemType: 'Ring',
    goldPurity: '22',
    weight: '',
    stoneWeight: '',
    goldRate: '5000',
    makingCharge: '15',
    gstRate: '3',
    advanceAmount: '',
    paymentMethod: 'Cash',
    remarks: ''
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    const draft = localStorage.getItem('currentBillDraft');
    if (draft) {
      const { formData: savedFormData, items: savedItems } = JSON.parse(draft);
      setFormData(savedFormData);
      setItems(savedItems);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('currentBillDraft', JSON.stringify({ formData, items }));
    }, 5000);
    return () => clearInterval(interval);
  }, [formData, items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value === '' || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return num.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  const addItem = () => {
    const weight = parseFloat(formData.weight) || 0;
    const stoneWeight = parseFloat(formData.stoneWeight) || 0;
    const goldRate = parseFloat(formData.goldRate) || 0;
    const makingChargePercent = parseFloat(formData.makingCharge) || 0;
    const gstRate = parseFloat(formData.gstRate) || 0;

    if (weight <= 0) {
      alert("Please enter a valid weight");
      return;
    }

    const goldValue = weight * goldRate;
    const makingCharge = goldValue * (makingChargePercent / 100);
    const taxableValue = goldValue + makingCharge;
    const gst = taxableValue * (gstRate / 100);
    const total = taxableValue + gst;

    const newItem = {
      type: formData.itemType,
      purity: formData.goldPurity,
      weight: weight,
      stoneWeight: stoneWeight,
      goldRate: goldRate,
      goldValue: goldValue,
      makingChargePercent: makingChargePercent,
      makingCharge: makingCharge,
      gstRate: gstRate,
      gst: gst,
      total: total
    };

    setItems([...items, newItem]);
    setFormData(prev => ({
      ...prev,
      weight: '',
      stoneWeight: ''
    }));
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.goldValue + item.makingCharge, 0);
    const totalGst = items.reduce((sum, item) => sum + item.gst, 0);
    const grandTotal = subtotal + totalGst;
    const advanceAmount = parseFloat(formData.advanceAmount) || 0;
    const remainingAmount = Math.max(0, grandTotal - advanceAmount);

    return { subtotal, totalGst, grandTotal, remainingAmount };
  };

  const { subtotal, totalGst, grandTotal, remainingAmount } = calculateTotals();

  const generateBill = () => {
    if (items.length === 0) {
      alert("Please add at least one item to generate the bill");
      return;
    }

    if (!formData.customerName.trim()) {
      alert("Please enter customer name");
      return;
    }

    const bill = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      items: [...items],
      subtotal: subtotal,
      gst: totalGst,
      total: grandTotal,
      advanceAmount: parseFloat(formData.advanceAmount) || 0,
      remainingAmount: remainingAmount,
      paymentMethod: formData.paymentMethod,
      remarks: formData.remarks,
      goldRate: parseFloat(formData.goldRate) || 0,
      makingCharge: parseFloat(formData.makingCharge) || 0,
      gstRate: parseFloat(formData.gstRate) || 0
    };

    onGenerateBill(bill);
  };

  const clearBill = () => {
    if (window.confirm("Are you sure you want to clear the current bill?")) {
      setItems([]);
      setFormData({
        customerName: '',
        customerPhone: '',
        itemType: 'Ring',
        goldPurity: '22',
        weight: '',
        stoneWeight: '',
        goldRate: '5000',
        makingCharge: '15',
        gstRate: '3',
        advanceAmount: '',
        paymentMethod: 'Cash',
        remarks: ''
      });
      localStorage.removeItem('currentBillDraft');
    }
  };

  return (
    <div className="billing-form-container">
      <div className="form-section">
        <label>Customer Name*</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-section">
        <label>Phone Number</label>
        <input
          type="text"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleInputChange}
        />
      </div>

      <h3 className="section-title">Add Item</h3>

      <div className="form-grid">
        <div className="form-section">
          <label>Item Type</label>
          <select
            name="itemType"
            value={formData.itemType}
            onChange={handleInputChange}
          >
            <option value="Ring">Ring</option>
            <option value="Chain">Chain</option>
            <option value="Bangle">Bangle</option>
            <option value="Earring">Earring</option>
            <option value="Pendant">Pendant</option>
            <option value="Necklace">Necklace</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Silver">Silver</option>
            <option value="Fancy Haar">Fancy Haar</option>
            <option value="Short Necklace">Short Necklace</option>
            <option value="Finger Ring">Finger Ring</option>
            <option value="Mangalsutra">Mangalsutra</option>
            <option value="Bangles">Bangles</option>
            <option value="Jhumka">Jhumka</option>
            <option value="Hanging Top">Hanging Top</option>
            <option value="Turkish">Turkish</option>
            <option value="Galcar">Galcar</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-section">
          <label>Gold Purity</label>
          <select
            name="goldPurity"
            value={formData.goldPurity}
            onChange={handleInputChange}
          >
            <option value="18">18K</option>
            <option value="22">22K</option>
            <option value="24">24K</option>
            <option value="Silver">Silver</option>


          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-section">
          <label>Gold Weight (grams)*</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleNumberChange}
            placeholder="0.00"
          />
        </div>

        <div className="form-section">
          <label>Stone Weight (grams)</label>
          <input
            type="text"
            name="stoneWeight"
            value={formData.stoneWeight}
            onChange={handleNumberChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="form-grid-three">
        <div className="form-section">
          <label>Gold Rate (per gram)</label>
          <input
            type="text"
            name="goldRate"
            value={formData.goldRate}
            onChange={handleNumberChange}
          />
        </div>

        <div className="form-section">
          <label>Making Charge (%)</label>
          <input
            type="text"
            name="makingCharge"
            value={formData.makingCharge}
            onChange={handleNumberChange}
          />
        </div>

        <div className="form-section">
          <label>GST Rate (%)</label>
          <input
            type="text"
            name="gstRate"
            value={formData.gstRate}
            onChange={handleNumberChange}
          />
        </div>
      </div>

      <button 
        onClick={addItem}
        className="add-item-btn"
      >
        Add Item
      </button>

      <h3 className="section-title">Current Bill Items</h3>
      {items.length > 0 ? (
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Purity</th>
                <th>Gold (g)</th>
                <th>Stone (g)</th>
                <th>Rate</th>
                <th>Value</th>
                <th>Making</th>
                <th>GST</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.type}</td>
                  <td>{item.purity}K</td>
                  <td>{item.weight.toFixed(2)}g</td>
                  <td>{(item.stoneWeight || 0).toFixed(2)}g</td>
                  <td>₹{formatCurrency(item.goldRate)}</td>
                  <td>₹{formatCurrency(item.goldValue)}</td>
                  <td>₹{formatCurrency(item.makingCharge)} ({item.makingChargePercent}%)</td>
                  <td>₹{formatCurrency(item.gst)}</td>
                  <td>₹{formatCurrency(item.total)}</td>
                  <td>
                    <button 
                      onClick={() => removeItem(index)}
                      className="remove-item-btn"
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-items">No items added yet</p>
      )}

      <div className="totals-section">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>₹{formatCurrency(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>GST:</span>
          <span>₹{formatCurrency(totalGst)}</span>
        </div>
        <div className="summary-row grand-total">
          <span>Grand Total:</span>
          <span>₹{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Details</h3>
        <div className="form-section">
          <label>Advance Amount</label>
          <input
            type="text"
            name="advanceAmount"
            value={formData.advanceAmount}
            onChange={handleNumberChange}
          />
        </div>
        <div className="payment-row">
          <span>Remaining Amount:</span>
          <span>₹{formatCurrency(remainingAmount)}</span>
        </div>
        <div className="form-section">
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
        <div className="form-section">
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button 
          onClick={generateBill}
          className="generate-btn"
        >
          Generate Bill
        </button>
        <button 
          onClick={clearBill} 
          className="clear-btn"
        >
          Clear Bill
        </button>
      </div>
    </div>
  );
};

export default BillingForm;