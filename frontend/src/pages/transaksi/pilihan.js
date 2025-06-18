// src/pages/pilihan.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './pilihan.css';
import Header from '../dashboard/Header';

const Pilihan = () => {
  const location = useLocation();
  const flight = location.state?.flight;
  const [paymentOption, setPaymentOption] = useState('full');

  if (!flight) {
    return (
      <div className="pilihan-body">
        <div className="pilihan-container">
          <Header />
          <h2 style={{ padding: '2rem' }}>Flight not found. Please go back and select a flight first.</h2>
        </div>
      </div>
    );
  }

  // Hitung durasi
  const durationMs = new Date(flight.arrivalTime) - new Date(flight.departureTime);
  const durationHours = Math.floor(durationMs / 3600000);
  const durationMinutes = Math.round((durationMs % 3600000) / 60000);

  return (
    <div className="pilihan-body">
      <div className="pilihan-container">
        <Header />

        <div className="pilihan-header">
          <span className="pilihan-breadcrumb">{flight.DepartureAirport?.name} &gt;</span>
          <span className="pilihan-breadcrumb">{flight.DestinationAirport?.name} &gt;</span>
          <span className="pilihan-breadcrumb">{flight.Airline?.name}</span>
        </div>

        <div className="pilihan-content-wrapper">
          {/* Kiri */}
          <div className="pilihan-left-section">
            <div className="pilihan-flight-details-card">
              <div className="pilihan-flight-title-price">
                <h3 className="pilihan-flight-type">{flight.Airline?.name} {flight.aircraftType || ''}</h3>
                <div className="pilihan-price-tag">
                  <span className="pilihan-currency">Rp</span>
                  <span className="pilihan-price-value">{flight.price}</span>
                </div>
              </div>
              <div className="pilihan-return-date-duration">
                <span className="pilihan-return-date">{new Date(flight.departureTime).toDateString()}</span>
                <span className="pilihan-duration">{durationHours}h {durationMinutes}m</span>
              </div>

              <div className="pilihan-airline-info">
                <img
                  src={flight.Airline?.logoUrl || 'https://via.placeholder.com/40'}
                  alt={flight.Airline?.name}
                  className="pilihan-airline-logo"
                />
                <div className="pilihan-airline-text">
                  <div className="pilihan-airline-name">{flight.Airline?.name}</div>
                  <div className="pilihan-aircraft-type">{flight.aircraftType || 'Aircraft'}</div>
                </div>
                <div className="pilihan-flight-icons">
                  <span className="pilihan-icon">✈️</span>
                  <span className="pilihan-icon">📶</span>
                  <span className="pilihan-icon">💺</span>
                  <span className="pilihan-icon">🍱</span>
                  <span className="pilihan-icon">🎧</span>
                  <span className="pilihan-icon">♿</span>
                </div>
              </div>

              <div className="pilihan-flight-times">
                <div className="pilihan-departure">
                  <div className="pilihan-time">
                    {new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="pilihan-airport">{flight.DepartureAirport?.code}</div>
                </div>
                <div className="pilihan-flight-arrow">➡️</div>
                <div className="pilihan-arrival">
                  <div className="pilihan-time">
                    {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="pilihan-airport">{flight.DestinationAirport?.code}</div>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="pilihan-payment-options-section">
              <div
                className={`pilihan-payment-option-card ${paymentOption === 'full' ? 'selected' : ''}`}
                onClick={() => setPaymentOption('full')}
              >
                <div className="pilihan-option-text">
                  <div className="pilihan-option-title">Pay in full</div>
                  <div className="pilihan-option-description">Pay the total and you are all set</div>
                </div>
                <div className="pilihan-radio-button">
                  {paymentOption === 'full' && <div className="pilihan-radio-inner-circle"></div>}
                </div>
              </div>

              <div
                className={`pilihan-payment-option-card ${paymentOption === 'part' ? 'selected' : ''}`}
                onClick={() => setPaymentOption('part')}
              >
                <div className="pilihan-option-text">
                  <div className="pilihan-option-title">Pay part now, part later</div>
                  <div className="pilihan-option-description">
                    Pay Rp {Math.floor(flight.price / 2)} now, and the rest later. No extra fees.
                  </div>
                </div>
                <div className="pilihan-radio-button">
                  {paymentOption === 'part' && <div className="pilihan-radio-inner-circle"></div>}
                </div>
              </div>
              <div className="pilihan-more-info">More info</div>
            </div>

            {/* Credit Card Section */}
            <div className="pilihan-credit-card-section">
              <div className="pilihan-card-header">
                <div className="pilihan-card-type-logo">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Visa_2021.svg/1200px-Visa_2021.svg.png"
                    alt="Visa"
                    className="pilihan-visa-logo"
                  />
                  <span className="pilihan-card-number">**** 4321</span>
                  <span className="pilihan-expiry-date">02/27</span>
                </div>
                <div className="pilihan-radio-button selected">
                  <div className="pilihan-radio-inner-circle"></div>
                </div>
              </div>
              <div className="pilihan-add-new-card">
                <div className="pilihan-add-icon">+</div>
                <div className="pilihan-add-text">Add a new card</div>
              </div>
            </div>
          </div>

          {/* Kanan */}
          <div className="pilihan-right-section">
            <div className="pilihan-booking-summary-card">
              <div className="pilihan-booking-header">
                <div className="pilihan-summary-flight-info">
                  <div className="pilihan-summary-economy">Economy</div>
                  <div className="pilihan-summary-flight-name">{flight.Airline?.name}</div>
                </div>
                <img src={flight.Airline?.logoUrl} alt="Flight" className="pilihan-summary-flight-image" />
              </div>

              <div className="pilihan-rating">
                <span className="pilihan-stars">⭐⭐⭐⭐</span>
                <span className="pilihan-rating-text">Very Good</span>
                <span className="pilihan-reviews">4 reviews</span>
              </div>

              <div className="pilihan-booking-protection">
                Your booking is protected by <span className="pilihan-golobe">golobe</span>
              </div>

              <div className="pilihan-price-details">
                <div className="pilihan-price-item">
                  <span className="pilihan-label">Base Fare</span>
                  <span className="pilihan-value">Rp {flight.price}</span>
                </div>
                <div className="pilihan-price-item">
                  <span className="pilihan-label">Discount</span>
                  <span className="pilihan-value">Rp 0</span>
                </div>
                <div className="pilihan-price-item">
                  <span className="pilihan-label">Taxes</span>
                  <span className="pilihan-value">Rp 0</span>
                </div>
                <div className="pilihan-price-item">
                  <span className="pilihan-label">Service Fee</span>
                  <span className="pilihan-value">Rp 0</span>
                </div>
                <div className="pilihan-price-item pilihan-total">
                  <span className="pilihan-label">Total</span>
                  <span className="pilihan-value">Rp {flight.price}</span>
                </div>
              </div>

              <button className="pilihan-proceed-button">Proceed to Transaction</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pilihan;
