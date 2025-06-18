// src/pages/admin/booking/EditBooking.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const EditBooking = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [userID, setUserID] = useState('');
    const [flightID, setFlightID] = useState('');
    const [status, setStatus] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [users, setUsers] = useState([]);
    const [flights, setFlights] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingRes, usersRes, flightsRes] = await Promise.all([
                    axiosInstance.get(`/api/bookings/${id}`),    // Add /api prefix
                    axiosInstance.get('/api/users'),             // Add /api prefix
                    axiosInstance.get('/api/flights')            // Add /api prefix
                ]);

                const booking = bookingRes.data;
                setUserID(booking.userID.toString());
                setFlightID(booking.flightID.toString());
                setStatus(booking.status);
                setTotalPrice(booking.totalPrice.toString());
                setBookingDate(booking.bookingDate);
                setUsers(usersRes.data);
                setFlights(flightsRes.data);
                setLoading(false);
            } catch (error) {
                setMsg("Failed to fetch booking data");
                setMsgType('danger');
                console.error("Error fetching booking:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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

    const handleFlightChange = (e) => {
        const selectedFlightId = e.target.value;
        setFlightID(selectedFlightId);
        
        const selectedFlight = flights.find(flight => flight.flightID === parseInt(selectedFlightId));
        if (selectedFlight) {
            setTotalPrice(selectedFlight.price.toString());
        }
    };

    const updateBooking = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.patch(`/api/bookings/${id}`, {
                userID,
                flightID,
                status,
                totalPrice
            });
            setMsg("Booking updated successfully!");
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
            console.error("Error updating booking:", error);
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

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '';
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
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
                        <div className="loading-spinner">Loading...</div>
                    </div>
                </section>
            </div>
        );
    }

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
                                <h1 className="page-title">Edit Booking</h1>
                                <p className="page-subtitle">Update booking information.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateBooking}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="bookingDate" className="form-label">Booking Date</label>
                                        <input
                                            type="text"
                                            id="bookingDate"
                                            className="form-input"
                                            value={formatDateTime(bookingDate)}
                                            disabled
                                        />
                                    </div>

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
                                            Update Booking
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

export default EditBooking;