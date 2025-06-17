import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
    const [departureCity, setDepartureCity] = useState('Jakarta (CGK)');
    const [arrivalCity, setArrivalCity] = useState('Singapore (SIN)');
    const [departureDate, setDepartureDate] = useState('2025-07-10'); // YYYY-MM-DD
    const [returnDate, setReturnDate] = useState('2025-07-12'); // YYYY-MM-DD

    // Helper to format date for display (e.g., 10 Jul 2025)
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'DD/MM/YYYY';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handleSwapCities = () => {
        setDepartureCity(arrivalCity);
        setArrivalCity(departureCity);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log({
            departureCity,
            arrivalCity,
            departureDate,
            returnDate
        });
        // Here you would typically navigate or make an API call
    };

    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1 className="main-title">Tourin Aja</h1> {/* Judul di sini */}
                <h2 className='text-title'>Tourin hadir sebagai sahabat perjalanan terbaikmu! Kami menawarkan pengalaman wisata yang menyenangkan, nyaman, dan penuh petualangan ke berbagai destinasi impian. Dengan harga terjangkau dan layanan profesional, setiap perjalanan bersama Tourin akan menjadi kenangan tak terlupakan. Nikmati keindahan alam, kekayaan budaya, hingga kuliner khas daerah dengan cara yang seru dan aman. Saatnya wujudkan liburan impianmu bersama Tourin – #TravelWithTourin!</h2>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="input-group origin-destination">
                        <div className="input-field city-input">
                            <label>Dari</label>
                            <input
                                type="text"
                                value={departureCity}
                                onChange={(e) => setDepartureCity(e.target.value)}
                                placeholder="Jakarta (CGK)"
                            />
                            <span className="airport-code">(CGK)</span>
                        </div>
                        <button type="button" className="swap-button" onClick={handleSwapCities}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 16v-3h8v-2H6V8L2 12l4 4zm10-5V8h-8v2h8v3l4-4-4-4z"/>
                            </svg>
                        </button>
                        <div className="input-field city-input">
                            <label>Ke</label>
                            <input
                                type="text"
                                value={arrivalCity}
                                onChange={(e) => setArrivalCity(e.target.value)}
                                placeholder="Singapore (SIN)"
                            />
                            <span className="airport-code">(SIN)</span>
                        </div>
                    </div>

                    <div className="input-group dates-search">
                        <div className="input-field date-input">
                            <label>Tanggal Pergi</label>
                            <input
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                            />
                            <span className="date-display">{formatDateForDisplay(departureDate)}</span>
                            <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM5 7V6h14v1H5z"/>
                            </svg>
                        </div>
                        <div className="input-field date-input">
                            <label>Tanggal Pulang</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                            <span className="date-display">{formatDateForDisplay(returnDate)}</span>
                            <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM5 7V6h14v1H5z"/>
                            </svg>
                        </div>
                        <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="search-inspirations">
                    <button className="inspiration-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        Cari Inspirasi Terbang
                    </button>
                    <button className="inspiration-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z"/>
                        </svg>
                        Notifikasi Harga
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;