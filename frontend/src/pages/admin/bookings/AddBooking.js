// src/pages/admin/booking/AddBooking.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AddBooking = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [userID, setUserID] = useState('');
    const [flightID, setFlightID] = useState('');
    const [status, setStatus] = useState('pending');
    const [totalPrice, setTotalPrice] = useState('');
    const [users, setUsers] = useState([]);
    const [flights, setFlights] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, flightsRes] = await Promise.all([
                    axiosInstance.get('/api/users'),        // Add /api prefix
                    axiosInstance.get('/api/flights')       // Add /api prefix
                ]);
                setUsers(usersRes.data);
                setFlights(flightsRes.data);
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

    const handleTotalPriceChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setTotalPrice(value);
    };

    // Handle flight selection and auto-fill price
    const handleFlightChange = (e) => {
        const selectedFlightId = e.target.value;
        setFlightID(selectedFlightId);
        
        const selectedFlight = flights.find(flight => flight.flightID === parseInt(selectedFlightId));
        if (selectedFlight) {
            setTotalPrice(selectedFlight.price.toString());
        }
    };

    const saveBooking = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.post('/api/bookings', {
                userID,
                flightID,
                status,
                totalPrice
            });
            setMsg("Booking added successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/bookings');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error adding booking:", error);
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
                            <i className="uil uil-ticket icon"></i>
                            <div>
                                <h1 className="page-title">Add New Booking</h1>
                                <p className="page-subtitle">Create a new booking record.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveBooking}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="userID" className="form-label">Customer</label>
                                        <select
                                            id="userID"
                                            className="form-input"
                                            value={userID}
                                            onChange={(e) => setUserID(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a customer</option>
                                            {users.map(user => (
                                                <option key={user.userID} value={user.userID}>
                                                    {user.name} - {user.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="flightID" className="form-label">Flight</label>
                                        <select
                                            id="flightID"
                                            className="form-input"
                                            value={flightID}
                                            onChange={handleFlightChange}
                                            required
                                        >
                                            <option value="">Select a flight</option>
                                            {flights.map(flight => (
                                                <option key={flight.flightID} value={flight.flightID}>
                                                    {`${flight.flightNumber} - ${flight.departureAirport.code} to ${flight.arrivalAirport.code}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="status" className="form-label">Status</label>
                                                <select
                                                    id="status"
                                                    className="form-input"
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    required
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="totalPrice" className="form-label">Total Price (IDR)</label>
                                                <input
                                                    type="text"
                                                    id="totalPrice"
                                                    className="form-input"
                                                    value={formatPrice(totalPrice)}
                                                    onChange={handleTotalPriceChange}
                                                    placeholder="Enter total price"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Add Booking
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

export default AddBooking;