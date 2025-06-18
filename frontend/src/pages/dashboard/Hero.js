// src/Hero.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();

    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date().toISOString().slice(0, 10));
    const [returnDate, setReturnDate] = useState(new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10));
    const [airportOptions, setAirportOptions] = useState([]);
    const [loadingAirports, setLoadingAirports] = useState(true);
    const [errorAirports, setErrorAirports] = useState(null);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await fetch('http://localhost:5000/airports');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setAirportOptions(data);
                if (data.length > 0) {
                    setDepartureCity(data[0].airportCode);
                    setArrivalCity(data.length > 1 ? data[1].airportCode : data[0].airportCode);
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
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handleSwapCities = () => {
        setDepartureCity(arrivalCity);
        setArrivalCity(departureCity);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/flight', {
            state: {
                departureCity,
                arrivalCity,
                departureDate,
                returnDate
            }
        });
    };

    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1 className="main-title">Tourin Aja</h1>
                <h2 className="text-title">Tourin hadir sebagai sahabat perjalanan terbaikmu! Kami menawarkan pengalaman wisata yang menyenangkan, nyaman, dan penuh petualangan ke berbagai destinasi impian. Dengan harga terjangkau dan layanan profesional, setiap perjalanan bersama Tourin akan menjadi kenangan tak terlupakan. Nikmati keindahan alam, kekayaan budaya, hingga kuliner khas daerah dengan cara yang seru dan aman. Saatnya wujudkan liburan impianmu bersama Tourin – #TravelWithTourin!</h2>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="input-group origin-destination">
                        <div className="input-field city-input">
                            <label>Dari</label>
                            {loadingAirports ? <p>Memuat bandara...</p> :
                                <select value={departureCity} onChange={(e) => setDepartureCity(e.target.value)}>
                                    {airportOptions.map((airport) => (
                                        <option key={airport.airportCode} value={airport.airportCode}>
                                            {airport.airportName} ({airport.airportCode})
                                        </option>
                                    ))}
                                </select>}
                        </div>
                        <button type="button" className="swap-button" onClick={handleSwapCities}>
                            ⇄
                        </button>
                        <div className="input-field city-input">
                            <label>Ke</label>
                            {loadingAirports ? <p>Memuat bandara...</p> :
                                <select value={arrivalCity} onChange={(e) => setArrivalCity(e.target.value)}>
                                    {airportOptions.map((airport) => (
                                        <option key={airport.airportCode} value={airport.airportCode}>
                                            {airport.airportName} ({airport.airportCode})
                                        </option>
                                    ))}
                                </select>}
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
                        </div>
                        <div className="input-field date-input">
                            <label>Tanggal Pulang</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                            <span className="date-display">{formatDateForDisplay(returnDate)}</span>
                        </div>
                        <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Hero;
