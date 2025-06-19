import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig.js';
import './FilterSidebar.css';
import './App.css';

const FilterSidebar = ({ onFilterChange }) => {
  const [selectedTransits, setSelectedTransits] = useState([]);
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

  const handleTransitChange = (event) => {
    const value = event.target.value;
    setSelectedTransits(prev => {
      const newTransits = prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value];
      onFilterChange({ transits: newTransits, airlines: selectedAirlines });
      return newTransits;
    });
  };

  const handleAirlineChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedAirlines(prev => {
      const newAirlines = prev.includes(value) ? 
        prev.filter(a => a !== value) : 
        [...prev, value];
      onFilterChange({ transits: selectedTransits, airlines: newAirlines });
      return newAirlines;
    });
  };

  const handleResetFilters = () => {
    setSelectedTransits([]);
    setSelectedAirlines([]);
    onFilterChange({ transits: [], airlines: [] });
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
        <h3>Filter:</h3>
        <button onClick={handleResetFilters}>Reset</button>
      </div>

      {/* Jumlah transit */}
      <div className="filter-section">
        <h4>Jumlah transit</h4>
        <div className="filter-options">
          <div className="filter-option-item">
            <label className="filter-option-item">
              <input
                type="checkbox"
                value="direct"
                checked={selectedTransits.includes('direct')}
                onChange={handleTransitChange}
              />
              <span>Langsung</span>
              <span className="price">Rp 511.229</span> 
            </label>
          </div>
          <div className="filter-option-item">
            <label className="filter-option-item">
              <input
                type="checkbox"
                value="1-transit"
                checked={selectedTransits.includes('1-transit')}
                onChange={handleTransitChange}
              />
              <span>1 transit</span>
              <span className="price">Rp 1.193.200</span>
            </label>
          </div>
          <div className="filter-option-item">
            <label className="filter-option-item">
              <input
                type="checkbox"
                value="2-transits"
                checked={selectedTransits.includes('2-transits')}
                onChange={handleTransitChange}
              />
              <span>2+ transits</span>
            </label>
          </div>
        </div>
      </div>

      {/* Maskapai */}
      <div className="filter-section">
        <h4>Maskapai</h4>
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
                  {/* Pakai logo/logoType langsung */}
                  {getLogoSrc(airline) ? (
                    <img src={getLogoSrc(airline)} alt={airline.name} className="airline-logo" />
                  ) : (
                    <img src={`https://via.placeholder.com/20?text=${airline.name[0]}`} alt={airline.name} />
                  )}
                  <span>{airline.name}</span>
                  <span className="price"></span>
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