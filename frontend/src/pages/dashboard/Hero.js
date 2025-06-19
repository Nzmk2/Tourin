import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig.js';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState({
        departure: false,
        arrival: false
    });
    
    // Initialize with current date
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const [departureDate, setDepartureDate] = useState(today);
    const [returnDate, setReturnDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    
    const [airportOptions, setAirportOptions] = useState([]);
    const [loadingAirports, setLoadingAirports] = useState(true);
    const [errorAirports, setErrorAirports] = useState(null);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await axiosInstance.get('/api/airports');
                const airports = response.data.map(airport => ({
                    airportCode: airport.code,
                    airportName: airport.name,
                    city: airport.city,
                    country: airport.country
                }));
                setAirportOptions(airports);
                if (airports.length > 0) {
                    setDepartureCity(airports[0].airportCode);
                    setArrivalCity(airports.length > 1 ? airports[1].airportCode : airports[0].airportCode);
                }
            } catch (error) {
                console.error("Error fetching airports:", error);
                setErrorAirports(error.message);
            } finally {
                setLoadingAirports(false);
            }
        };

        fetchAirports();
    }, []);

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'DD/MM/YYYY';
        const date = new Date(dateString);
        const options = { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric'
        };
        return date.toLocaleDateString('id-ID', options);
    };

    const handleSwapCities = () => {
        setDepartureCity(arrivalCity);
        setArrivalCity(departureCity);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Pastikan semua field terisi
        if (!departureCity || !arrivalCity || !departureDate || !returnDate) {
            alert('Mohon lengkapi semua field pencarian');
            return;
        }

        // Bandingkan tanggal
        const depDate = new Date(departureDate);
        const retDate = new Date(returnDate);
        
        if (retDate < depDate) {
            alert('Tanggal pulang tidak boleh lebih awal dari tanggal berangkat');
            return;
        }

        // Ambil detail bandara keberangkatan dan tujuan
        const departureAirport = airportOptions.find(airport => airport.airportCode === departureCity);
        const arrivalAirport = airportOptions.find(airport => airport.airportCode === arrivalCity);

        navigate('/flight', {
            state: {
                departureCity: departureCity,
                arrivalCity: arrivalCity,
                departureDate: departureDate,
                returnDate: returnDate,
                departureAirportDetails: {
                    code: departureAirport?.airportCode,
                    name: departureAirport?.airportName,
                    city: departureAirport?.city,
                    country: departureAirport?.country
                },
                arrivalAirportDetails: {
                    code: arrivalAirport?.airportCode,
                    name: arrivalAirport?.airportName,
                    city: arrivalAirport?.city,
                    country: arrivalAirport?.country
                }
            }
        });
    };

    const toggleDropdown = (type) => {
        setIsDropdownOpen(prev => ({
            departure: false,
            arrival: false,
            [type]: !prev[type]
        }));
    };

    const handleCitySelect = (type, value) => {
        if (type === 'departure') {
            setDepartureCity(value);
        } else {
            setArrivalCity(value);
        }
        setIsDropdownOpen(prev => ({
            ...prev,
            [type]: false
        }));
    };

    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1 className="main-title">Tourin Aja</h1>
                <h2 className="text-title">
                    Tourin hadir sebagai sahabat perjalanan terbaikmu! 
                    Kami menawarkan pengalaman wisata yang menyenangkan, 
                    nyaman, dan penuh petualangan ke berbagai destinasi impian.
                </h2>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-grid">
                        {/* Departure City Input */}
                        <div className="input-field city-input">
                            <label>Dari</label>
                            <div className="custom-select" onClick={() => toggleDropdown('departure')}>
                                <div className="selected-value">
                                    {loadingAirports ? "Memuat bandara..." : 
                                        airportOptions.find(airport => 
                                            airport.airportCode === departureCity
                                        )?.airportName
                                    }
                                </div>
                                <div className={`select-dropdown ${isDropdownOpen.departure ? 'open' : ''}`}>
                                    {airportOptions.map((airport) => (
                                        <div
                                            key={airport.airportCode}
                                            className="select-option"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCitySelect('departure', airport.airportCode);
                                            }}
                                        >
                                            <div className="airport-info">
                                                <span className="airport-name">{airport.airportName}</span>
                                                <span className="airport-code">{airport.airportCode}</span>
                                            </div>
                                            <span className="airport-city">
                                                {airport.city}, {airport.country}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Swap Button */}
                        <button 
                            type="button" 
                            className="swap-button" 
                            onClick={handleSwapCities}
                            aria-label="Tukar kota keberangkatan dan tujuan"
                        >
                            ⇄
                        </button>

                        {/* Arrival City Input */}
                        <div className="input-field city-input">
                            <label>Ke</label>
                            <div className="custom-select" onClick={() => toggleDropdown('arrival')}>
                                <div className="selected-value">
                                    {loadingAirports ? "Memuat bandara..." : 
                                        airportOptions.find(airport => 
                                            airport.airportCode === arrivalCity
                                        )?.airportName
                                    }
                                </div>
                                <div className={`select-dropdown ${isDropdownOpen.arrival ? 'open' : ''}`}>
                                    {airportOptions.map((airport) => (
                                        <div
                                            key={airport.airportCode}
                                            className="select-option"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCitySelect('arrival', airport.airportCode);
                                            }}
                                        >
                                            <div className="airport-info">
                                                <span className="airport-name">{airport.airportName}</span>
                                                <span className="airport-code">{airport.airportCode}</span>
                                            </div>
                                            <span className="airport-city">
                                                {airport.city}, {airport.country}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Departure Date Input */}
                        <div className="input-field date-input">
                            <label>Tanggal Pergi</label>
                            <div className="date-picker-wrapper">
                                <input
                                    type="date"
                                    value={departureDate}
                                    min={today}
                                    onChange={(e) => setDepartureDate(e.target.value)}
                                />
                                <div className="date-display">
                                    <span>{formatDateForDisplay(departureDate)}</span>
                                    <svg className="calendar-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Return Date Input */}
                        <div className="input-field date-input">
                            <label>Tanggal Pulang</label>
                            <div className="date-picker-wrapper">
                                <input
                                    type="date"
                                    value={returnDate}
                                    min={departureDate}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                />
                                <div className="date-display">
                                    <span>{formatDateForDisplay(returnDate)}</span>
                                    <svg className="calendar-icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <button type="submit" className="search-button" aria-label="Cari Penerbangan">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l4.3 4.3a1 1 0 1 1-1.41 1.41l-4.3-4.3zm-4.9-1.32a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Hero;