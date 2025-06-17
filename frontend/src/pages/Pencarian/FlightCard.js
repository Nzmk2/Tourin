// src/components/FlightCard.js
import React from 'react';
import './FlightCard.css'; // Import the CSS file
import './App.css';

const FlightCard = ({ flight }) => {
  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="flight-card-airline-info">
          <img src={`https://via.placeholder.com/30?text=${flight.airline[0]}`} alt={flight.airline} />
          <span>{flight.airline}</span>
          {flight.highlights && (
            <span className="flight-card-highlight">
              {flight.highlights.includes('Hemat') ? flight.highlights : 'Harga terendah'}
            </span>
          )}
        </div>
        <div className="flight-card-price-info">
          <span className="flight-card-price">Rp {flight.price}</span>
          <span className="flight-card-price-per-person">/org</span>
        </div>
      </div>

      <div className="flight-card-details">
        <div className="flight-detail-time">
          <p>{flight.departureTime}</p>
          <p>CGK</p>
        </div>
        <div className="flight-detail-duration">
          <p>{flight.duration}</p>
          <div className="flight-detail-line">
            <span>{flight.stop}</span>
          </div>
        </div>
        <div className="flight-detail-time">
          <p>{flight.arrivalTime}</p>
          <p>SIN</p>
        </div>
      </div>

      <div className="flight-card-actions">
        <button>Detail</button>
        <button>Keuntungan Tambahan</button>
        <button>Refund</button>
        <button>Reschedule</button>
        <button className="select-button">
          Pilih
        </button>
      </div>
    </div>
  );
};

export default FlightCard;