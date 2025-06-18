// src/pages/admin/flight/AddFlight.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AddFlight = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [flightNumber, setFlightNumber] = useState('');
    const [airlineId, setAirlineId] = useState('');
    const [departureAirportId, setDepartureAirportId] = useState('');
    const [arrivalAirportId, setArrivalAirportId] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');

    const [airlines, setAirlines] = useState([]);
    const [airports, setAirports] = useState([]);
    
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [airlinesRes, airportsRes] = await Promise.all([
                    axiosInstance.get('/airlines'),
                    axiosInstance.get('/airports')
                ]);
                setAirlines(airlinesRes.data);
                setAirports(airportsRes.data);
            } catch (error) {
                setMsg("Failed to load form data");
                setMsgType('danger');
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setPrice(value);
    };

    const formatDateTime = (dateTime) => {
        // Format datetime-local value to ISO string format
        if (!dateTime) return '';
        const date = new Date(dateTime);
        return date.toISOString().slice(0, 16);
    };

    const saveFlight = async (e) => {
        e.preventDefault();
        
        // Validate departure and arrival airports are different
        if (departureAirportId === arrivalAirportId) {
            setMsg("Departure and arrival airports cannot be the same");
            setMsgType('danger');
            return;
        }

        // Validate departure time is before arrival time
        const departureDate = new Date(departureTime);
        const arrivalDate = new Date(arrivalTime);
        if (departureDate >= arrivalDate) {
            setMsg("Departure time must be before arrival time");
            setMsgType('danger');
            return;
        }

        try {
            await axiosInstance.post('/flights', {
                flightNumber,
                airlineId,
                departureAirportId,
                arrivalAirportId,
                departureTime,
                arrivalTime,
                price,
                capacity
            });
            setMsg("Flight added successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/flights');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error adding flight:", error);
        }
    };

    const formatPrice = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="admin-dashboard-container">
            <Sidebar
                isSidebarClosed={isSidebarClosed}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />

            <section className="dashboard">
                <Navbar toggleSidebar={toggleSidebar} />

                <div className="dash-content">
                    <div className="management-page-wrapper">
                        <div className="page-header">
                            <i className="uil uil-plane icon"></i>
                            <div>
                                <h1 className="page-title">Add New Flight</h1>
                                <p className="page-subtitle">Create a new flight schedule.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveFlight}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="flightNumber" className="form-label">Flight Number</label>
                                                <input
                                                    type="text"
                                                    id="flightNumber"
                                                    className="form-input"
                                                    value={flightNumber}
                                                    onChange={(e) => setFlightNumber(e.target.value)}
                                                    placeholder="Enter flight number"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="airlineId" className="form-label">Airline</label>
                                                <select
                                                    id="airlineId"
                                                    className="form-input"
                                                    value={airlineId}
                                                    onChange={(e) => setAirlineId(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select an airline</option>
                                                    {airlines.map(airline => (
                                                        <option key={airline.airlineID} value={airline.airlineID}>
                                                            {airline.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="departureAirportId" className="form-label">Departure Airport</label>
                                                <select
                                                    id="departureAirportId"
                                                    className="form-input"
                                                    value={departureAirportId}
                                                    onChange={(e) => setDepartureAirportId(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select departure airport</option>
                                                    {airports.map(airport => (
                                                        <option key={airport.airportID} value={airport.airportID}>
                                                            {airport.code} - {airport.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="arrivalAirportId" className="form-label">Arrival Airport</label>
                                                <select
                                                    id="arrivalAirportId"
                                                    className="form-input"
                                                    value={arrivalAirportId}
                                                    onChange={(e) => setArrivalAirportId(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select arrival airport</option>
                                                    {airports.map(airport => (
                                                        <option key={airport.airportID} value={airport.airportID}>
                                                            {airport.code} - {airport.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="departureTime" className="form-label">Departure Time</label>
                                                <input
                                                    type="datetime-local"
                                                    id="departureTime"
                                                    className="form-input"
                                                    value={formatDateTime(departureTime)}
                                                    onChange={(e) => setDepartureTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="arrivalTime" className="form-label">Arrival Time</label>
                                                <input
                                                    type="datetime-local"
                                                    id="arrivalTime"
                                                    className="form-input"
                                                    value={formatDateTime(arrivalTime)}
                                                    onChange={(e) => setArrivalTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="price" className="form-label">Price (IDR)</label>
                                                <input
                                                    type="text"
                                                    id="price"
                                                    className="form-input"
                                                    value={formatPrice(price)}
                                                    onChange={handlePriceChange}
                                                    placeholder="Enter price"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="capacity" className="form-label">Seat Capacity</label>
                                                <input
                                                    type="number"
                                                    id="capacity"
                                                    className="form-input"
                                                    value={capacity}
                                                    onChange={(e) => setCapacity(e.target.value)}
                                                    placeholder="Enter seat capacity"
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Add Flight
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AddFlight;