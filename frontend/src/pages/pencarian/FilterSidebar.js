// src/components/FilterSidebar.js
import React, { useState } from 'react';
import { dummyAirlines } from './FlightSearch.js';
import './FilterSidebar.css'; // Import the CSS file
import './App.css';

const FilterSidebar = () => {
  const [selectedTransits, setSelectedTransits] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  const handleTransitChange = (event) => {
    const value = event.target.value;
    setSelectedTransits(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
  };

  const handleAirlineChange = (event) => {
    const value = event.target.value;
    setSelectedAirlines(prev =>
      prev.includes(value) ? prev.filter(a => a !== value) : [...prev, value]
    );
  };

  return (
    <div className="filter-sidebar-container">
      <div className="filter-header">
        <h3>Filter:</h3>
        <button onClick={() => { setSelectedTransits([]); setSelectedAirlines([]); }}>Reset</button>
      </div>

      {/* Jumlah transit */}
      <div className="filter-section">
        <h4>Jumlah transit</h4>
        <div className="filter-options">
          <div className="filter-option-item">
            <label className="filter-option-item">
              <input
                type="checkbox"
                value="langsung"
                checked={selectedTransits.includes('langsung')}
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
          {dummyAirlines.map(airline => (
            <div key={airline.id} className="filter-option-item">
              <label className="filter-option-item">
                <input
                  type="checkbox"
                  value={airline.id}
                  checked={selectedAirlines.includes(airline.id)}
                  onChange={handleAirlineChange}
                />
                <img src={`https://via.placeholder.com/20?text=Logo`} alt="" />
                <span>{airline.name}</span>
                <span className="price">{airline.price}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;