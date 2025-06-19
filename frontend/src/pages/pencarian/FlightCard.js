import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightCard.css';

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  if (!flight) return null;

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle airline logo
  const getAirlineLogo = () => {
    if (flight.Airline?.logo) {
      // Jika logo adalah string base64
      if (typeof flight.Airline.logo === 'string') {
        return `data:${flight.Airline.logoType || 'image/png'};base64,${flight.Airline.logo}`;
      }
      
      // Jika logo adalah Uint8Array atau Buffer
      if (flight.Airline.logo instanceof Uint8Array || Buffer.isBuffer(flight.Airline.logo)) {
        const base64String = Buffer.from(flight.Airline.logo).toString('base64');
        return `data:${flight.Airline.logoType || 'image/png'};base64,${base64String}`;
      }
    }

    // Fallback jika tidak ada logo
    return `https://via.placeholder.com/36?text=${flight.Airline?.name?.[0] || '?'}`;
  };

  const handlePilih = () => {
    navigate('/pilihan', { 
      state: { 
        flight,
        currentUser: 'Nzmk2',
        currentDateTime: '2025-06-19 17:31:20'
      } 
    });
  };

  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="flight-card-airline-info">
          <img 
            src={getAirlineLogo()}
            alt={flight.Airline?.name || 'Airline'}
            className="airline-logo"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = `https://via.placeholder.com/36?text=${flight.Airline?.name?.[0] || '?'}`;
            }}
          />
          <span className="airline-name">{flight.Airline?.name || 'Unknown Airline'}</span>
        </div>
        <div className="flight-card-price-info">
          <span className="flight-card-price">{formatPrice(flight.price)}</span>
          <span className="flight-card-price-per-person">/org</span>
        </div>
      </div>

      <div className="flight-card-details">
        <div className="flight-detail-time">
          <p>
            {new Date(flight.departureTime).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </p>
          <p>{flight.DepartureAirport?.code}</p>
          <span className="airport-city">{flight.DepartureAirport?.city}</span>
        </div>
        <div className="flight-detail-duration">
          <div className="flight-detail-line">
            <span className="flight-line-icon">✈</span>
          </div>
        </div>
        <div className="flight-detail-time">
          <p>
            {new Date(flight.arrivalTime).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </p>
          <p>{flight.DestinationAirport?.code}</p>
          <span className="airport-city">{flight.DestinationAirport?.city}</span>
        </div>
      </div>

      <div className="flight-card-actions">
        <button className="select-button" onClick={handlePilih}>
          Pilih
        </button>
      </div>
    </div>
  );
};

export default FlightCard;