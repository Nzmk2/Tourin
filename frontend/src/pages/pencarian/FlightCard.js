// src/components/FlightCard.js
import React from 'react';
import './FlightCard.css';
import './App.css';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight }) => {
  // Ensure flight data properties match your backend's FlightModel and controller output
  // Example: flight.Airline.name, flight.DepartureAirport.code, flight.DestinationAirport.code

  const navigate = useNavigate();

  const handlePilih = () => {
    navigate('/pilihan', { state: { flight } });
  };

  if (!flight) {
    return null; // Or a placeholder if flight is not provided
  }

  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="flight-card-airline-info">
          {flight.Airline && flight.Airline.logoUrl ? (
            <img src={flight.Airline.logoUrl} alt={flight.Airline.name} className="airline-logo" />
          ) : (
            <img src={`https://via.placeholder.com/30?text=${flight.Airline?.name[0] || '?'}`} alt={flight.Airline?.name || 'Airline'} />
          )}
          <span>{flight.Airline?.name || 'Unknown Airline'}</span>
          {/* You'll need to define 'highlights' based on your flight data if applicable */}
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
          <p>{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p>{flight.DepartureAirport?.code || 'N/A'}</p>
        </div>
        <div className="flight-detail-duration">
          {/* Calculate duration based on departureTime and arrivalTime */}
          <p>
            {/* This is a placeholder for duration calculation, you might need a utility function */}
            {`${Math.floor((new Date(flight.arrivalTime) - new Date(flight.departureTime)) / (1000 * 60 * 60))}j ${Math.round(((new Date(flight.arrivalTime) - new Date(flight.departureTime)) % (1000 * 60 * 60)) / (1000 * 60))}m`}
          </p>
          <div className="flight-detail-line">
            {/* You'll need to determine 'stop' from your flight data (e.g., check for transit airports) */}
            <span>{flight.stop || 'Direct'}</span>
          </div>
        </div>
        <div className="flight-detail-time">
          <p>{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p>{flight.DestinationAirport?.code || 'N/A'}</p>
        </div>
      </div>

      <div className="flight-card-actions">
        <button>Detail</button>
        <button>Keuntungan Tambahan</button>
        <button>Refund</button>
        <button onClick={handlePilih}>Pilih</button>
      </div>
    </div>
  );
};

export default FlightCard;