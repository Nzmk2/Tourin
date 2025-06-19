import React, { useState } from 'react';
import './pilihan.css';

const Pilihan = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const currentUser = "Nzmk2";
  const currentDate = "2025-06-19 15:17:24";

  return (
    <div className="nzmk-flight-booking-container">
      <div className="nzmk-flight-details">
        <div className="nzmk-flight-header">
          <div className="nzmk-flight-title">
            <h2>Emirates A380 Airbus</h2>
            <p>Return Wed, Dec 8</p>
          </div>
          <div className="nzmk-flight-price">$240</div>
        </div>

        <div className="nzmk-flight-user-info">
          <span className="nzmk-flight-user">Welcome, {currentUser}</span>
          <span className="nzmk-flight-datetime">{currentDate}</span>
        </div>

        <div className="nzmk-flight-airline-info">
          <img src="/emirates-logo.png" alt="Emirates" className="nzmk-flight-airline-logo" />
          <div className="nzmk-flight-airline-name">
            <h3>Emirates</h3>
            <p>Service Add-on</p>
          </div>
        </div>

        <div className="nzmk-flight-schedule">
          <div className="nzmk-flight-time">12:00 pm</div>
          <div className="nzmk-flight-line">
            <span className="nzmk-flight-plane-icon">✈</span>
          </div>
          <div className="nzmk-flight-time">12:00 pm</div>
          <div className="nzmk-flight-location">Newark(EWR)</div>
        </div>

        <div className="nzmk-flight-payment-section">
          <h3>Payment Method</h3>
          <div className="nzmk-flight-payment-select">
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="nzmk-flight-payment-dropdown"
            >
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="transfer">Bank Transfer</option>
              <option value="ewallet">E-Wallet</option>
            </select>
          </div>

          {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
            <div className="nzmk-flight-payment-details">
              <input 
                type="text" 
                placeholder="Card Number" 
                className="nzmk-flight-input-full"
              />
              <div className="nzmk-flight-input-group">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="nzmk-flight-input-half"
                />
                <input 
                  type="text" 
                  placeholder="CVV" 
                  className="nzmk-flight-input-half"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="nzmk-flight-payment-details">
              <select className="nzmk-flight-input-full">
                <option value="">Select Bank</option>
                <option value="bank1">Bank 1</option>
                <option value="bank2">Bank 2</option>
                <option value="bank3">Bank 3</option>
              </select>
              <input 
                type="text" 
                placeholder="Account Number" 
                className="nzmk-flight-input-full"
              />
            </div>
          )}

          {paymentMethod === 'ewallet' && (
            <div className="nzmk-flight-payment-details">
              <select className="nzmk-flight-input-full">
                <option value="">Select E-Wallet</option>
                <option value="wallet1">Wallet 1</option>
                <option value="wallet2">Wallet 2</option>
                <option value="wallet3">Wallet 3</option>
              </select>
              <input 
                type="text" 
                placeholder="Phone Number" 
                className="nzmk-flight-input-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="nzmk-flight-summary">
        <div className="nzmk-flight-summary-header">
          <div className="nzmk-flight-summary-image">
            <img src="/plane-image.png" alt="Emirates A380 Airbus" />
          </div>
          <div className="nzmk-flight-summary-details">
            <p className="nzmk-flight-economy">Economy</p>
            <h3>Emirates A380 Airbus</h3>
            <div className="nzmk-flight-rating">
              <span>4.2</span>
              <p>Very Good 84 reviews</p>
            </div>
          </div>
        </div>

        <p className="nzmk-flight-protection">Your booking is protected by <strong>golobe</strong></p>

        <div className="nzmk-flight-price-details">
          <h3>Price Details</h3>
          <div className="nzmk-flight-price-item">
            <span>Base Fare</span>
            <span>$400</span>
          </div>
          <div className="nzmk-flight-price-item">
            <span>Discount</span>
            <span>$400</span>
          </div>
          <div className="nzmk-flight-price-item">
            <span>Taxes</span>
            <span>$400</span>
          </div>
          <div className="nzmk-flight-price-item">
            <span>Service Fee</span>
            <span>$400</span>
          </div>
          <div className="nzmk-flight-price-item total">
            <span>Total</span>
            <span>$400</span>
          </div>
        </div>

        <button className="nzmk-flight-confirm-button">
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default Pilihan;