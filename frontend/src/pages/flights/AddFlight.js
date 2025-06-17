// frontend/src/pages/admin/AddFlight.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';

const AddFlight = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [airlineID, setAirlineID] = useState('');
    const [departureAirportCode, setDepartureAirportCode] = useState('');
    const [destinationAirportCode, setDestinationAirportCode] = useState('');
    
    // ✅ Tambahkan state untuk tanggal
    const [departureDate, setDepartureDate] = useState(''); 
    const [departureTime, setDepartureTime] = useState('');
    
    // ✅ Tambahkan state untuk tanggal
    const [arrivalTime, setArrivalTime] = useState('');
    const [arrivalDate, setArrivalDate] = useState(''); 
    
    const [availableSeats, setAvailableSeats] = useState('');
    const [airlines, setAirlines] = useState([]);
    const [airports, setAirports] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const airlinesRes = await axiosInstance.get('/airlines');
                setAirlines(airlinesRes.data);
                if (airlinesRes.data.length > 0) {
                    setAirlineID(airlinesRes.data[0].airlineID);
                }

                const airportsRes = await axiosInstance.get('/airports');
                setAirports(airportsRes.data);
                if (airportsRes.data.length > 0) {
                    setDepartureAirportCode(airportsRes.data[0].airportCode);
                    setDestinationAirportCode(airportsRes.data[0].airportCode);
                }
            } catch (error) {
                console.error("Error fetching airlines/airports:", error);
                setMsg("Failed to load dependencies (airlines/airports).");
                setMsgType('danger');
            }
        };
        fetchDependencies();
    }, []);

    const saveFlight = async (e) => {
        e.preventDefault();
        try {
            // ✅ Kirim departureDate dan arrivalDate ke backend
            await axiosInstance.post('/flights', {
                airlineID,
                departureAirportCode,
                destinationAirportCode,
                departureDate, // Kirim tanggal keberangkatan
                departureTime, // Kirim waktu keberangkatan
                arrivalDate,   // Kirim tanggal kedatangan
                arrivalTime,   // Kirim waktu kedatangan
                availableSeats: parseInt(availableSeats, 10)
            });
            setMsg("Flight added successfully!");
            setMsgType('success');
            // Reset form fields
            setAirlineID(airlines.length > 0 ? airlines[0].airlineID : '');
            setDepartureAirportCode(airports.length > 0 ? airports[0].airportCode : '');
            setDestinationAirportCode(airports.length > 0 ? airports[0].airportCode : '');
            setDepartureDate(''); // Reset tanggal
            setDepartureTime('');
            setArrivalDate('');   // Reset tanggal
            setArrivalTime('');
            setAvailableSeats('');

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
                            <i className="uil uil-plane-fly icon"></i>
                            <div>
                                <h1 className="page-title">Add New Flight</h1>
                                <p className="page-subtitle">Fill in the flight details to create a record.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveFlight}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="airlineID" className="form-label">Airline</label>
                                        <div className="form-control-wrapper">
                                            <select
                                                name="airlineID"
                                                id="airlineID"
                                                className="form-input"
                                                value={airlineID}
                                                onChange={(e) => setAirlineID(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Airline</option>
                                                {airlines.map((airline) => (
                                                    <option key={airline.airlineID} value={airline.airlineID}>
                                                        {airline.airlineName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="departureAirportCode" className="form-label">Departure Airport</label>
                                                <div className="form-control-wrapper">
                                                    <select
                                                        name="departureAirportCode"
                                                        id="departureAirportCode"
                                                        className="form-input"
                                                        value={departureAirportCode}
                                                        onChange={(e) => setDepartureAirportCode(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Departure Airport</option>
                                                        {airports.map((airport) => (
                                                            <option key={airport.airportCode} value={airport.airportCode}>
                                                                {airport.airportName} ({airport.location})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="destinationAirportCode" className="form-label">Destination Airport</label>
                                                <div className="form-control-wrapper">
                                                    <select
                                                        name="destinationAirportCode"
                                                        id="destinationAirportCode"
                                                        className="form-input"
                                                        value={destinationAirportCode}
                                                        onChange={(e) => setDestinationAirportCode(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Destination Airport</option>
                                                        {airports.map((airport) => (
                                                            <option key={airport.airportCode} value={airport.airportCode}>
                                                                {airport.airportName} ({airport.location})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="departureDate" className="form-label">Departure Date</label>
                                                <input
                                                    type="date" // ✅ Input type date
                                                    name="departureDate"
                                                    id="departureDate"
                                                    className="form-input"
                                                    value={departureDate}
                                                    onChange={(e) => setDepartureDate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="departureTime" className="form-label">Departure Time</label>
                                                <input
                                                    type="time"
                                                    name="departureTime"
                                                    id="departureTime"
                                                    className="form-input"
                                                    value={departureTime}
                                                    onChange={(e) => setDepartureTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="arrivalDate" className="form-label">Arrival Date</label>
                                                <input
                                                    type="date" // ✅ Input type date
                                                    name="arrivalDate"
                                                    id="arrivalDate"
                                                    className="form-input"
                                                    value={arrivalDate}
                                                    onChange={(e) => setArrivalDate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="arrivalTime" className="form-label">Arrival Time</label>
                                                <input
                                                    type="time"
                                                    name="arrivalTime"
                                                    id="arrivalTime"
                                                    className="form-input"
                                                    value={arrivalTime}
                                                    onChange={(e) => setArrivalTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="availableSeats" className="form-label">Available Seats</label>
                                        <input
                                            type="number"
                                            name="availableSeats"
                                            id="availableSeats"
                                            placeholder="e.g., 150"
                                            className="form-input"
                                            value={availableSeats}
                                            onChange={(e) => setAvailableSeats(e.target.value)}
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
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