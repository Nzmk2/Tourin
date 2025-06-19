import React, { useState } from 'react';
import './FlightSearch.css';

const FlightSearch = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    departureCity: '',
    destinationCity: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'one-way'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      ...searchData,
      returnDate: searchData.tripType === 'one-way' ? null : searchData.returnDate
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="flight-search">
      <form onSubmit={handleSubmit}>
        <div className="search-grid">
          <div className="trip-type">
            <label>
              <input
                type="radio"
                name="tripType"
                value="one-way"
                checked={searchData.tripType === 'one-way'}
                onChange={handleChange}
              />
              Sekali Jalan
            </label>
            <label>
              <input
                type="radio"
                name="tripType"
                value="round-trip"
                checked={searchData.tripType === 'round-trip'}
                onChange={handleChange}
              />
              Pulang Pergi
            </label>
          </div>

          <div className="search-row">
            <div className="form-group">
              <label>Dari</label>
              <input
                type="text"
                name="departureCity"
                value={searchData.departureCity}
                onChange={handleChange}
                placeholder="Kota Keberangkatan"
                required
              />
            </div>

            <div className="form-group">
              <label>Ke</label>
              <input
                type="text"
                name="destinationCity"
                value={searchData.destinationCity}
                onChange={handleChange}
                placeholder="Kota Tujuan"
                required
              />
            </div>

            <div className="form-group">
              <label>Tanggal Berangkat</label>
              <input
                type="date"
                name="departureDate"
                value={searchData.departureDate}
                onChange={handleChange}
                min={today}
                required
              />
            </div>

            {searchData.tripType === 'round-trip' && (
              <div className="form-group">
                <label>Tanggal Kembali</label>
                <input
                  type="date"
                  name="returnDate"
                  value={searchData.returnDate}
                  onChange={handleChange}
                  min={searchData.departureDate || today}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Penumpang</label>
              <input
                type="number"
                name="passengers"
                value={searchData.passengers}
                onChange={handleChange}
                min="1"
                max="10"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="search-button">
          Cari Penerbangan
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;