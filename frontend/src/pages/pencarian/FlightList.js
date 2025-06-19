import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig.js';
import FlightCard from './FlightCard.js';
import './FlightList.css';
import './App.css';

const FlightList = ({ searchParams }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch semua penerbangan tanpa parameter
        const res = await axiosInstance.get('/api/flights');
        console.log('All flights:', res.data);
        setFlights(res.data);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError(err.response?.data?.msg || 'Gagal memuat data penerbangan');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, []); // Hapus searchParams dari dependency array

  // Calculate lowest price flight
  const getLowestPriceFlight = () => {
    if (!flights.length) return null;
    return flights.reduce((min, flight) =>
      parseFloat(flight.price) < parseFloat(min.price) ? flight : min
    , flights[0]);
  };

  // Calculate shortest duration flight
  const getShortestDurationFlight = () => {
    if (!flights.length) return null;
    return flights.reduce((shortest, flight) => {
      // Hitung durasi dalam menit untuk setiap penerbangan
      const getDurationInMinutes = (flight) => {
        const departure = new Date(flight.departureTime);
        const arrival = new Date(flight.arrivalTime);
        return Math.round((arrival - departure) / (1000 * 60));
      };

      const currentDuration = getDurationInMinutes(flight);
      const shortestDuration = getDurationInMinutes(shortest);

      return currentDuration < shortestDuration ? flight : shortest;
    }, flights[0]);
  };

  // Format durasi
  const formatDuration = (flight) => {
    const departure = new Date(flight.departureTime);
    const arrival = new Date(flight.arrivalTime);
    const durationMs = arrival - departure;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.round((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  if (loading) return <div className="flight-list-container">Loading...</div>;
  if (error) return <div className="flight-list-container">{error}</div>;

  const lowestPriceFlight = getLowestPriceFlight();
  const shortestDurationFlight = getShortestDurationFlight();

  return (
    <div className="flight-list-container">
      <div className="flight-summary">
        <div className="flight-summary-details">
          <div className="flight-summary-item">
            <p>Harga terendah</p>
            <p className="price-highlight">
              {lowestPriceFlight ? `Rp ${parseFloat(lowestPriceFlight.price).toLocaleString('id-ID')}` : 'N/A'}
            </p>
            <p>{lowestPriceFlight ? formatDuration(lowestPriceFlight) : 'N/A'}</p>
          </div>
          <div className="flight-summary-item">
            <p>Durasi tersingkat</p>
            <p>
              {shortestDurationFlight ? `Rp ${parseFloat(shortestDurationFlight.price).toLocaleString('id-ID')}` : 'N/A'}
            </p>
            <p>{shortestDurationFlight ? formatDuration(shortestDurationFlight) : 'N/A'}</p>
          </div>
        </div>
        <button className="flight-summary-more-button">Lainnya</button>
      </div>

      {flights.length > 0 && (
        <div className="recommended-flight-section">
          <p>Penerbangan langsung termurah</p>
          <FlightCard
            flight={lowestPriceFlight}
            isRecommended={true}
          />
        </div>
      )}

      <div className="all-flights-section">
        <h3>Semua Penerbangan {flights.length > 0 && `(${flights.length})`}:</h3>
        {flights.length === 0 ? (
          <div className="no-flights-message">Tidak ada penerbangan ditemukan.</div>
        ) : (
          flights.map(flight => (
            <FlightCard 
              key={flight.flightID} 
              flight={{
                ...flight,
                duration: formatDuration(flight)
              }} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FlightList;