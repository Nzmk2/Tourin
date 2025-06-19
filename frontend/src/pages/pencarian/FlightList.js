import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig.js';
import FlightCard from './FlightCard.js';
import FilterSidebar from './FilterSidebar.js';
import './FlightList.css';
import './App.css';

// FlightSummary Component
const FlightSummary = ({ searchParams, formatDateForDisplay, flights }) => {
  const firstFlight = flights && flights.length > 0 ? flights[0] : null;

  return (
    <div className="flight-summary-container">
      <div className="flight-route-info">
        <div className="route-header">
          <div className="route-airports">
            <div className="airport departure">
              <span className="airport-code">{searchParams.departureCity}</span>
              <span className="airport-name">
                {firstFlight?.DepartureAirport?.name
                  ? `${firstFlight.DepartureAirport.name} (${firstFlight.DepartureAirport.code})`
                  : searchParams.departureCity}
              </span>
            </div>
            <div className="route-arrow">→</div>
            <div className="airport arrival">
              <span className="airport-code">{searchParams.arrivalCity}</span>
              <span className="airport-name">
                {firstFlight?.DestinationAirport?.name
                  ? `${firstFlight.DestinationAirport.name} (${firstFlight.DestinationAirport.code})`
                  : searchParams.arrivalCity}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flight-dates">
          <div className="date-item">
            <div className="date-label">
              <i className="fas fa-plane-departure"></i>
              <span>Tanggal Berangkat</span>
            </div>
            <div className="date-value">
              {searchParams.departureDate
                ? formatDateForDisplay(searchParams.departureDate)
                : 'N/A'}
            </div>
          </div>
          
          <div className="date-separator"></div>
          
          <div className="date-item">
            <div className="date-label">
              <i className="fas fa-plane-arrival"></i>
              <span>Tanggal Pulang</span>
            </div>
            <div className="date-value">
              {searchParams.returnDate
                ? formatDateForDisplay(searchParams.returnDate)
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main FlightList Component
const FlightList = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const searchParams = location.state || {};

  const handleFilterChange = ({ transits, airlines }) => {
    let filtered = [...flights];
    
    if (transits.length > 0) {
      filtered = filtered.filter(flight => {
        if (transits.includes('direct')) {
          return flight.transitCount === 0;
        }
        if (transits.includes('1-transit')) {
          return flight.transitCount === 1;
        }
        if (transits.includes('2-transits')) {
          return flight.transitCount >= 2;
        }
        return true;
      });
    }

    if (airlines.length > 0) {
      filtered = filtered.filter(flight => 
        airlines.includes(flight.airlineID)
      );
    }

    setFilteredFlights(filtered);
  };

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = '/api/flights';
        if (searchParams.departureCity && searchParams.arrivalCity) {
          url += `?departureCode=${searchParams.departureCity}&destinationCode=${searchParams.arrivalCity}`;
          if (searchParams.departureDate) {
            url += `&departureDate=${searchParams.departureDate}`;
          }
        }

        const res = await axiosInstance.get(url);
        console.log('Filtered flights:', res.data);
        setFlights(res.data);
        setFilteredFlights(res.data);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError(err.response?.data?.msg || 'Gagal memuat data penerbangan');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchParams]);

  const getLowestPriceFlight = () => {
    if (!filteredFlights.length) return null;
    return filteredFlights.reduce((min, flight) =>
      parseFloat(flight.price) < parseFloat(min.price) ? flight : min
    , filteredFlights[0]);
  };

  const formatDuration = (flight) => {
    const departure = new Date(flight.departureTime);
    const arrival = new Date(flight.arrivalTime);
    const durationMs = arrival - departure;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.round((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  const formatDateForDisplay = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="flight-list-container">Loading...</div>;
  if (error) return <div className="flight-list-container">{error}</div>;

  const lowestPriceFlight = getLowestPriceFlight();

  return (
    <div className="flight-list-container">
      <div className="flight-list-layout">
        <FilterSidebar 
          onFilterChange={handleFilterChange}
          flights={flights}
        />
        
        <div className="flight-list-content">
          {searchParams.departureCity && searchParams.arrivalCity && (
            <FlightSummary 
              searchParams={searchParams}
              formatDateForDisplay={formatDateForDisplay}
              flights={filteredFlights}
            />
          )}

          {filteredFlights.length > 0 && (
            <div className="recommended-flight-section">
              <p>Penerbangan langsung termurah</p>
              <FlightCard
                flight={lowestPriceFlight}
                isRecommended={true}
              />
            </div>
          )}

          <div className="all-flights-section">
            <h3>Semua Penerbangan {filteredFlights.length > 0 && `(${filteredFlights.length})`}:</h3>
            {filteredFlights.length === 0 ? (
              <div className="no-flights-message">Tidak ada penerbangan ditemukan.</div>
            ) : (
              filteredFlights.map(flight => (
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
      </div>
    </div>
  );
};

export default FlightList;