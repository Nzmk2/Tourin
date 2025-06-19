import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig.js';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange }) => {
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loadingAirlines, setLoadingAirlines] = useState(true);
  const [errorAirlines, setErrorAirlines] = useState(null);

  useEffect(() => {
    const fetchAirlines = async () => {
      setLoadingAirlines(true);
      setErrorAirlines(null);
      try {
        const response = await axiosInstance.get('/api/airlines');
        setAirlines(response.data);
      } catch (error) {
        console.error("Failed to fetch airlines:", error);
        setErrorAirlines(error.message || 'Failed to load airlines');
      } finally {
        setLoadingAirlines(false);
      }
    };
    fetchAirlines();
  }, []);

  const handleAirlineChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedAirlines(prev => {
      const newAirlines = prev.includes(value) ? 
        prev.filter(a => a !== value) : 
        [...prev, value];
      onFilterChange({ airlines: newAirlines });
      return newAirlines;
    });
  };

  const handleResetFilters = () => {
    setSelectedAirlines([]);
    onFilterChange({ airlines: [] });
  };

  // Helper: bikin data url inline dari logo/logoType
  const getLogoSrc = (airline) => {
    if (airline.logo && airline.logoType) {
      return `data:${airline.logoType};base64,${airline.logo}`;
    }
    return null;
  };

  return (
    <div className="filter-sidebar-container">
      <div className="filter-header">
        <h3>Filter Maskapai:</h3>
        <button onClick={handleResetFilters}>Reset</button>
      </div>

      {/* Maskapai */}
      <div className="filter-section">
        <div className="filter-options airline-options">
          {loadingAirlines ? (
            <div>Loading airlines...</div>
          ) : errorAirlines ? (
            <div>Error loading airlines: {errorAirlines}</div>
          ) : airlines.length > 0 ? (
            airlines.map(airline => (
              <div key={airline.airlineID} className="filter-option-item">
                <label className="filter-option-item">
                  <input
                    type="checkbox"
                    value={airline.airlineID}
                    checked={selectedAirlines.includes(airline.airlineID)}
                    onChange={handleAirlineChange}
                  />
                  {getLogoSrc(airline) ? (
                    <img src={getLogoSrc(airline)} alt={airline.name} className="airline-logo" />
                  ) : (
                    <img src={`https://via.placeholder.com/20?text=${airline.name[0]}`} alt={airline.name} />
                  )}
                  <span>{airline.name}</span>
                </label>
              </div>
            ))
          ) : (
            <div>No airlines found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;