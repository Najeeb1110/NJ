import React, { useRef, useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import './BillPrint.css';

const BillPrint = ({ bill }) => {
  const printRef = useRef();
  const [logoBase64, setLogoBase64] = useState('');

  // Convert logo to base64 for reliable printing
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = logo;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      setLogoBase64(canvas.toDataURL('image/png'));
    };
  }, []);

  const totals = {
    goldWeight: bill.items.reduce((sum, item) => sum + item.weight, 0),
    stoneWeight: bill.items.reduce((sum, item) => sum + (item.stoneWeight || 0), 0),
    goldValue: bill.items.reduce((sum, item) => sum + item.goldValue, 0),
    makingCharge: bill.items.reduce((sum, item) => sum + item.makingCharge, 0),
    gst: bill.items.reduce((sum, item) => sum + item.gst, 0),
    total: bill.items.reduce((sum, item) => sum + item.total, 0)
  };

  const handlePrint = () => {
    if (!logoBase64) {
      alert('Logo is still loading, please try again');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - NJ${bill.billNo}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #000;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print-header {
              text-align: center;
              margin-bottom: 20px;
            }
            .print-header h1 {
              color: #D4AF37 !important;
              margin: 5px 0;
              font-size: 24px;
            }
            .shop-info {
              margin: 3px 0;
              font-size: 12px;
            }
            .divider {
              border: none;
              height: 1px;
              background-color: #D4AF37 !important;
              margin: 10px 0;
            }
            .bill-meta {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
              margin-bottom: 15px;
              font-size: 13px;
            }
            .meta-row {
              display: flex;
              justify-content: space-between;
            }
            .print-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 12px;
              page-break-inside: avoid;
            }
            .print-table th {
              background-color: #D4AF37 !important;
              color: white !important;
              padding: 8px;
              text-align: center;
            }
            .print-table td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: center;
            }
            .print-summary {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              border: 1px solid #ddd;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .grand-total {
              font-weight: bold;
              border-top: 1px solid #D4AF37 !important;
              padding-top: 10px;
              margin-top: 10px;
              font-size: 13px;
            }
            .print-payment {
              background-color: #f0f8ff;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              border: 1px solid #ddd;
            }
            .print-footer {
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 9px;
              color: #666;
            }
            .print-logo {
              height: 200px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <img src="${logoBase64}" class="print-logo" alt="N Jewellers Logo" />
            <p class="shop-info">Near Headpost Office, Azam Road, Nizamabad - 503001</p>
            <p class="shop-info">Phone: +91 9573023553, +91 8074703828</p>
          </div>

          <hr class="divider" />

          <div class="bill-meta">
            <div class="meta-row">
              <strong>Bill No:</strong>
              <span>NJ${bill.billNo}</span>
            </div>
            <div class="meta-row">
              <strong>Date:</strong>
              <span>${new Date(bill.date).toLocaleDateString()}</span>
            </div>
            <div class="meta-row">
              <strong>Customer:</strong>
              <span>${bill.customerName}</span>
            </div>
            <div class="meta-row">
              <strong>Phone:</strong>
              <span>${bill.customerPhone || 'N/A'}</span>
            </div>
          </div>

          <table class="print-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Purity</th>
                <th>Gold (g)</th>
                <th>Stone (g)</th>
                <th>Rate</th>
                <th>Value</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${bill.items.map(item => `
                <tr>
                  <td>${item.type}</td>
                  <td>${item.purity}K</td>
                  <td>${item.weight.toFixed(2)}</td>
                  <td>${(item.stoneWeight || 0).toFixed(2)}</td>
                  <td>₹${item.goldRate.toFixed(2)}</td>
                  <td>₹${(item.goldValue + item.makingCharge).toFixed(2)}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="print-summary">
            <div class="summary-row">
              <span>Total Gold Weight:</span>
              <span>${totals.goldWeight.toFixed(2)}g</span>
            </div>
            <div class="summary-row">
              <span>Total Stone Weight:</span>
              <span>${totals.stoneWeight.toFixed(2)}g</span>
            </div>
            <div class="summary-row">
              <span>Gold Value:</span>
              <span>₹${totals.goldValue.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Making Charges:</span>
              <span>₹${totals.makingCharge.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>GST:</span>
              <span>₹${totals.gst.toFixed(2)}</span>
            </div>
            <div class="summary-row grand-total">
              <span>GRAND TOTAL:</span>
              <span>₹${totals.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="print-payment">
            <h3>Payment Details</h3>
            <div class="summary-row">
              <span>Paid:</span>
              <span>₹${bill.advanceAmount.toFixed(2)} (${bill.paymentMethod})</span>
            </div>
            <div class="summary-row">
              <span>Balance Due:</span>
              <span>₹${(totals.total - bill.advanceAmount).toFixed(2)}</span>
            </div>
          </div>

          <div class="print-footer">
            <p>Thank you for your business!</p>
            <p>* Making charges and GST are non-refundable</p>
            <p>The melting purity of gold ornaments is dependent on factors such as design and extent of soldering and may accordingly vary between 75% to 91.6%</p>
            <p>Please produce the original bill at the time of sale of gold ornaments.</p>
            <p>* All buyback will be subject to the production of the original bill and the rate will be as per the prevailling policy of the showroom. Any exceptions will not be entertained. In such cases, the actual weight of the time of exchange will be considered.</p>
            <p>Customised Jewellery cannot be replaced and jewellery damaged due to the negligence in handling can only be repaired. No cash refunds is admissible</p>

          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="bill-print" ref={printRef}>
      <div className="bill-header">
        <img src={logo} alt="N Jewellers Logo" className="logo-img" />
        <h1>N JEWELLERS</h1>
        <p className="shop-tagline">Designer 916 Gold Jewellery</p>
        <p className="shop-info">Near Headpost Office, Azam Road, Nizamabad - 503001</p>
        <p className="shop-info">Phone: +91 9573023553, +91 8074703828</p>
      </div>

      <hr className="divider" />

      <div className="bill-meta">
        <div className="meta-row">
          <strong>Bill No:</strong>
          <span>NJ{bill.billNo}</span>
        </div>
        <div className="meta-row">
          <strong>Date:</strong>
          <span>{new Date(bill.date).toLocaleDateString()}</span>
        </div>
        <div className="meta-row">
          <strong>Customer:</strong>
          <span>{bill.customerName}</span>
        </div>
        <div className="meta-row">
          <strong>Phone:</strong>
          <span>{bill.customerPhone || 'N/A'}</span>
        </div>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Purity</th>
            <th>Gold (g)</th>
            <th>Stone (g)</th>
            <th>Rate</th>
            <th>Value</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.purity}K</td>
              <td>{item.weight.toFixed(2)}</td>
              <td>{(item.stoneWeight || 0).toFixed(2)}</td>
              <td>₹{item.goldRate.toFixed(2)}</td>
              <td>₹{(item.goldValue + item.makingCharge).toFixed(2)}</td>
              <td>₹{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="calculation-summary">
        <div className="summary-row">
          <span>Total Gold Weight:</span>
          <span>{totals.goldWeight.toFixed(2)}g</span>
        </div>
        <div className="summary-row">
          <span>Total Stone Weight:</span>
          <span>{totals.stoneWeight.toFixed(2)}g</span>
        </div>
        <div className="summary-row">
          <span>Gold Value:</span>
          <span>₹{totals.goldValue.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Making Charges:</span>
          <span>₹{totals.makingCharge.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>GST:</span>
          <span>₹{totals.gst.toFixed(2)}</span>
        </div>
        <div className="summary-row grand-total">
          <span>GRAND TOTAL:</span>
          <span>₹{totals.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="payment-section">
        <h3>Payment Details</h3>
        <div className="payment-row">
          <span>Paid:</span>
          <span>₹{bill.advanceAmount.toFixed(2)} ({bill.paymentMethod})</span>
        </div>
        <div className="payment-row">
          <span>Balance Due:</span>
          <span>₹{(totals.total - bill.advanceAmount).toFixed(2)}</span>
        </div>
      </div>

      <div className="bill-footer">
        <p>Thank you for your business!</p>
        <p>For any queries, please contact us at +91 9573023553 or +91 8074703828</p>
        <p>* Making charges and GST are non-refundable</p>
      </div>

      <div className="no-print">
        <button onClick={handlePrint} className="print-btn">
          Print Bill
        </button>
      </div>
    </div>
  );
};

export default BillPrint;