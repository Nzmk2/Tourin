// src/pages/FlightSearchPage.js
import React from 'react';
import FilterSidebar from './FilterSidebar';
import FlightList from './FlightList';
import './FlightSearch.css';

const FlightSearchPage = () => {
  return (
    <div className="flight-search-page">
      {/* Top section (FlightSearch.js content) - adapted to fit here */}
      <header className="flight-search-container">
        <div className="flight-search-header">
          <div className="flight-search-route">
            <span>Jakarta (CGK)</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10H4a1 1 0 110-2h10.586l-4.293-4.293a1 1 0 011.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Singapore (SIN)</span>
          </div>
          <div className="flight-search-info">
            <div className="flight-search-details">
              <span>Wed, 17 July 2024</span>
              <span>1 Adult</span>
              <span>Economy</span>
            </div>
            <button className="flight-search-button">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flight-search-dates">
          <div className="flight-date-item">
            <p>Tue</p>
            <p>16 Jul</p>
            <p>Rp 560.000</p>
          </div>
          <div className="flight-date-item selected">
            <p>Wed</p>
            <p>17 Jul</p>
            <p>Rp 511.229</p>
          </div>
          <div className="flight-date-item">
            <p>Thu</p>
            <p>18 Jul</p>
            <p>Rp 630.000</p>
          </div>
          <div className="flight-date-item">
            <p>Fri</p>
            <p>19 Jul</p>
            <p>Rp 700.000</p>
          </div>
          <div className="flight-date-calendar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Lainnya</span>
          </div>
        </div>
        <div className="flight-search-actions">
          <button className="flight-action-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </button>
          <button className="flight-action-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 4a1 1 0 10-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4z" />
            </svg>
            Urutkan
          </button>
          <button className="flight-action-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" clipRule="evenodd" />
            </svg>
            Peta Harga
          </button>
        </div>
      </header>

      <div className="main-content">
        <FilterSidebar />
        <FlightList />
      </div>
    </div>
  );
};

export default FlightSearchPage;