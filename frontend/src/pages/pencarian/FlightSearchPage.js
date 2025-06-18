// src/pages/FlightSearchPage.js
import React from 'react';
import FilterSidebar from './FilterSidebar';
import FlightList from './FlightList';
import Header from '../dashboard/Header';

import './App.css';

const FlightSearchPage = () => {
  return (
    <div className="flight-search-page">
      {/* Top section (FlightSearch.js content) - adapted to fit here */}
      <Header />

      <div className="main-content">
        <FilterSidebar />
        <FlightList />
      </div>
    </div>
  );
};

export default FlightSearchPage;