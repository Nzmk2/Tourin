// src/components/FlightList.js
import React from 'react';
import FlightCard from './FlightCard.js';
import { dummyFlights } from './FlightSearch.js';
import './FlightList.css'; // Import the CSS file
import './App.css';

const FlightList = () => {
  return (
    <div className="flight-list-container">
      {/* Search results summary */}
      <div className="flight-summary">
        <div className="flight-summary-details">
          <div className="flight-summary-item">
            <p>Harga terendah</p>
            <p className="price-highlight">Rp 511.229</p>
            <p>1j 50m</p>
          </div>
          <div className="flight-summary-item">
            <p>Durasi tersingkat</p>
            <p>Rp 612.900</p>
            <p>1j 30m</p>
          </div>
        </div>
        <button className="flight-summary-more-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Lainnya
        </button>
      </div>

      {/* Recommended flight */}
      <div className="recommended-flight-section">
        <p>Penerbangan langsung termurah</p>
        <FlightCard flight={dummyFlights[0]} /> {/* Assuming the first flight is the cheapest direct */}
      </div>

      {/* All flights list */}
      <h3 className="all-flights-heading">Semua Penerbangan</h3>
      {dummyFlights.map(flight => (
        <FlightCard key={flight.id} flight={flight} />
      ))}

      {/* Traveloka benefit banner */}
      <div className="traveloka-benefit-banner">
        <p>Jangan ketinggalan manfaat member Traveloka</p>
        <p>Anda bisa dapat poin, check-in online di aplikasi, dapat info promo atau harga tiket lagi turun, dll.</p>
        <a href="#">Log In Sekarang</a>
      </div>
    </div>
  );
};

export default FlightList;