import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig.js';
import FlightCard from './FlightCard.js';
import FilterSidebar from './FilterSidebar.js';
import './FlightList.css';

// FlightSummary Component
const FlightSummary = ({ searchParams, formatDateForDisplay, flights }) => {
  return (
    <div className="flight-summary-container">
        <div className="flight-route-info">
            <div className="route-header">
                <div className="route-airports">
                    <div className="airport departure">
                        <span className="airport-code">
                            {searchParams.departureAirportDetails?.code}
                        </span>
                        <span className="airport-name">
                            {searchParams.departureAirportDetails?.name}
                        </span>
                        <span className="airport-location">
                            {`${searchParams.departureAirportDetails?.city}, ${searchParams.departureAirportDetails?.country}`}
                        </span>
                    </div>
                    <div className="route-arrow">→</div>
                    <div className="airport arrival">
                        <span className="airport-code">
                            {searchParams.arrivalAirportDetails?.code}
                        </span>
                        <span className="airport-name">
                            {searchParams.arrivalAirportDetails?.name}
                        </span>
                        <span className="airport-location">
                            {`${searchParams.arrivalAirportDetails?.city}, ${searchParams.arrivalAirportDetails?.country}`}
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
                        {formatDateForDisplay(searchParams.departureDate)}
                    </div>
                </div>
                
                <div className="date-separator"></div>
                
                <div className="date-item">
                    <div className="date-label">
                        <i className="fas fa-plane-arrival"></i>
                        <span>Tanggal Pulang</span>
                    </div>
                    <div className="date-value">
                        {formatDateForDisplay(searchParams.returnDate)}
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

  const handleFilterChange = ({ airlines }) => {
    let filtered = [...flights];
    
    if (airlines && airlines.length > 0) {
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
            // Buat URL dengan query parameters
            const queryParams = new URLSearchParams({
                departureCode: searchParams.departureCity,
                destinationCode: searchParams.arrivalCity,
                departureDate: searchParams.departureDate,
                returnDate: searchParams.returnDate
            }).toString();

            const url = `/api/flights?${queryParams}`;
            
            const res = await axiosInstance.get(url);
            
            // Get airlines data for each flight
            const flightsWithAirlines = await Promise.all(res.data.map(async flight => {
                if (flight.airlineID) {
                    try {
                        const airlineRes = await axiosInstance.get(`/api/airlines/${flight.airlineID}`);
                        return {
                            ...flight,
                            Airline: airlineRes.data,
                            DepartureAirport: searchParams.departureAirportDetails,
                            DestinationAirport: searchParams.arrivalAirportDetails
                        };
                    } catch (err) {
                        console.error(`Failed to fetch airline data for flight ${flight.flightID}:`, err);
                        return flight;
                    }
                }
                return flight;
            }));

            setFlights(flightsWithAirlines);
            setFilteredFlights(flightsWithAirlines);
        } catch (err) {
            console.error('Error fetching flights:', err);
            setError(err.response?.data?.msg || 'Gagal memuat data penerbangan');
        } finally {
            setLoading(false);
        }
    };

    // Hanya fetch jika ada parameter pencarian
    if (searchParams.departureCity && searchParams.arrivalCity && 
        searchParams.departureDate && searchParams.returnDate) {
        fetchFlights();
    }
  }, [searchParams]);

  const getLowestPriceFlight = () => {
    if (!filteredFlights.length) return null;
    return filteredFlights.reduce((min, flight) =>
      parseFloat(flight.price) < parseFloat(min.price) ? flight : min
    , filteredFlights[0]);
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
              <p>Penerbangan termurah</p>
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
                  flight={flight}
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