// src/components/FlightSearch.js
// This file will now primarily manage search state and pass it to FlightList for fetching.
// Dummy data is moved to be fetched from the backend.

import React, { useState, useEffect } from 'react';

// We'll no longer export dummyAirlines or dummyFlights from here.
// They will be fetched by FlightList and FilterSidebar directly.

const FlightSearch = ({ onSearch }) => {
  const [departureCity, setDepartureCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1); // Default to 1 passenger
  const [tripType, setTripType] = useState('one-way'); // 'one-way' or 'round-trip'

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real application, you'd probably pass these to a parent component or directly to FlightList
    // For now, let's just log them or pass them to a handler that triggers the fetch in FlightList.
    console.log('Search Params:', {
      departureCity,
      destinationCity,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : null,
      passengers,
      tripType,
    });

    // Call the onSearch prop to trigger flight fetching in FlightList
    onSearch({
      departureCity,
      destinationCity,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : null,
      passengers,
    });
  };

  return (
    <div className="flight-search-container">
      <h2>Flight Search</h2>
      <form onSubmit={handleSearch}>
        <div className="input-group">
          <label>
            Departure City:
            <input
              type="text"
              value={departureCity}
              onChange={(e) => setDepartureCity(e.target.value)}
              placeholder="e.g., Jakarta (CGK)"
              required
            />
          </label>
          <label>
            Destination City:
            <input
              type="text"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              placeholder="e.g., Singapore (SIN)"
              required
            />
          </label>
        </div>
        <div className="input-group">
          <label>
            Departure Date:
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              required
            />
          </label>
          {tripType === 'round-trip' && (
            <label>
              Return Date:
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required={tripType === 'round-trip'}
              />
            </label>
          )}
        </div>
        <div className="input-group">
          <label>
            Passengers:
            <input
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              min="1"
            />
          </label>
          <label>
            Trip Type:
            <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
              <option value="one-way">One-Way</option>
              <option value="round-trip">Round-Trip</option>
            </select>
          </label>
        </div>
        <button type="submit">Search Flights</button>
      </form>
    </div>
  );
};

export default FlightSearch;