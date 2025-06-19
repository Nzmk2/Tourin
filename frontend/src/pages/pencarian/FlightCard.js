import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightCard.css';

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  if (!flight) return null;

  // Fungsi untuk menghitung durasi
  const calculateDuration = (departure, arrival) => {
    const departureTime = new Date(departure);
    const arrivalTime = new Date(arrival);
    const durationMs = arrivalTime - departureTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.round((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  // Format harga
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle airline logo (binary/BLOB) with MIME type
  const getAirlineLogo = () => {
    if (flight.Airline?.logo && flight.Airline?.logoType) {
      return `data:${flight.Airline.logoType};base64,${flight.Airline.logo}`;
    }
    // fallback to placeholder
    return `https://via.placeholder.com/36?text=${flight.Airline?.name?.[0] || '?'}`;
  };

  const handlePilih = () => {
    navigate('/pilihan', { state: { flight } });
  };

  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="flight-card-airline-info">
          <img 
            src={getAirlineLogo()}
            alt={flight.Airline?.name || 'Airline'}
            className="airline-logo"
          />
          <span className="airline-name">{flight.Airline?.name || 'Unknown Airline'}</span>
          {flight.highlights && (
            <span className="flight-card-highlight">{flight.highlights}</span>
          )}
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
          <p>{calculateDuration(flight.departureTime, flight.arrivalTime)}</p>
          <div className="flight-detail-line">
            <span>
              {flight.transitCount ? `${flight.transitCount} Transit` : 'Langsung'}
            </span>
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
        <button onClick={() => console.log('Detail clicked')}>Detail</button>
        <button onClick={() => console.log('Benefits clicked')}>Keuntungan</button>
        <button onClick={() => console.log('Refund clicked')}>Refund</button>
        <button className="select-button" onClick={handlePilih}>
          Pilih
        </button>
      </div>
    </div>
  );
};

export default FlightCard;