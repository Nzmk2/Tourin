import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightCard.css';

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  const handlePilih = () => {
    navigate('/pilihan', { state: { flight } });
  };

  if (!flight) {
    return null;
  }

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

  return (
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="flight-card-airline-info">
          <img 
            src={flight.Airline?.logoUrl || `https://via.placeholder.com/30?text=${flight.Airline?.name?.[0] || '?'}`}
            alt={flight.Airline?.name || 'Airline'}
            className="airline-logo"
          />
          <span className="airline-name">{flight.Airline?.name || 'Unknown Airline'}</span>
          {flight.highlights && (
            <span className="flight-highlight">{flight.highlights}</span>
          )}
        </div>
        <div className="flight-price-info">
          <span className="price">{formatPrice(flight.price)}</span>
          <span className="per-person">/org</span>
        </div>
      </div>

      <div className="flight-details">
        <div className="flight-time-info departure">
          <span className="time">
            {new Date(flight.departureTime).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </span>
          <span className="airport-code">{flight.DepartureAirport?.code}</span>
          <span className="airport-city">{flight.DepartureAirport?.city}</span>
        </div>

        <div className="flight-duration">
          <span className="duration">
            {calculateDuration(flight.departureTime, flight.arrivalTime)}
          </span>
          <div className="duration-line">
            <span className="flight-type">
              {flight.transitCount ? `${flight.transitCount} Transit` : 'Langsung'}
            </span>
          </div>
        </div>

        <div className="flight-time-info arrival">
          <span className="time">
            {new Date(flight.arrivalTime).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </span>
          <span className="airport-code">{flight.DestinationAirport?.code}</span>
          <span className="airport-city">{flight.DestinationAirport?.city}</span>
        </div>
      </div>

      <div className="flight-card-actions">
        <button className="btn-detail" onClick={() => console.log('Detail clicked')}>
          Detail
        </button>
        <button className="btn-benefits" onClick={() => console.log('Benefits clicked')}>
          Keuntungan
        </button>
        <button className="btn-refund" onClick={() => console.log('Refund clicked')}>
          Refund
        </button>
        <button className="btn-select" onClick={handlePilih}>
          Pilih
        </button>
      </div>
    </div>
  );
};

export default FlightCard;