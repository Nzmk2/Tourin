// src/components/FlightList.js
import React, { useState, useEffect } from 'react';
import FlightCard from './FlightCard.js';
import axiosInstance from '../../api/axiosConfig.js'; // Import axios instance
import './FlightList.css';
import './App.css';

const FlightList = ({ searchParams }) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlights = async () => {
      if (!searchParams || !searchParams.departureCity || !searchParams.destinationCity || !searchParams.departureDate) {
        setFlights([]); // Clear flights if search params are incomplete
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Construct query parameters for the API call
        const query = new URLSearchParams({
          departureCity: searchParams.departureCity,
          destinationCity: searchParams.destinationCity,
          departureDate: searchParams.departureDate,
          // Add other parameters if your backend supports filtering by them
          ...(searchParams.returnDate && { returnDate: searchParams.returnDate }),
          ...(searchParams.passengers && { passengers: searchParams.passengers }),
        }).toString();

        const response = await fetch(`http://localhost:5000/flights?${query}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFlights(data);
      } catch (e) {
        console.error("Failed to fetch flights:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]); // Re-fetch when searchParams change

  if (loading) {
    return <div className="flight-list-container">Loading flights...</div>;
  }

  if (error) {
    return <div className="flight-list-container">Error: {error.message}</div>;
  }

  return (
    <div className="flight-list-container">
      {/* Search results summary - adapt this to real data if needed */}
      <div className="flight-summary">
        <div className="flight-summary-details">
          {/* These will need to be calculated based on fetched flights */}
          <div className="flight-summary-item">
            <p>Harga terendah</p>
            <p className="price-highlight">
              {flights.length > 0 ? `Rp ${Math.min(...flights.map(f => parseFloat(f.price)))}` : 'N/A'}
            </p>
            {/* You'll need to parse duration from your flight data */}
            <p>{flights.length > 0 ? flights[0].duration : 'N/A'}</p>
          </div>
          <div className="flight-summary-item">
            <p>Durasi tersingkat</p>
            <p>
              {flights.length > 0 ? `Rp ${Math.min(...flights.map(f => parseFloat(f.price)))}` : 'N/A'}
            </p>
            {/* You'll need to parse duration from your flight data */}
            <p>{flights.length > 0 ? flights[0].duration : 'N/A'}</p>
          </div>
        </div>
        <button className="flight-summary-more-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Lainnya
        </button>
      </div>

      {/* Recommended flight - this will be the first flight from the fetched list */}
      {flights.length > 0 && (
        <div className="recommended-flight-section">
          <p>Penerbangan langsung termurah</p>
          <FlightCard flight={flights[0]} />
        </div>
      )}

      {/* All flights */}
      <div className="all-flights-section">
        <h3>All Flights:</h3>
        {flights.length > 0 ? (
          flights.map(flight => (
            <FlightCard key={flight.flightID} flight={flight} />
          ))
        ) : (
          <p>No flights found for your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default FlightList;