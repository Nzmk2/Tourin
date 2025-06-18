// src/pages/admin/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import '../../assets/styles/Admin.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
    const { user } = useAuth();

    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [totalUsers, setTotalUsers] = useState('0');
    const [totalBookings, setTotalBookings] = useState('0');
    const [totalFlights, setTotalFlights] = useState('0');
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState('');

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    useEffect(() => {
        // Update current date time
        const updateDateTime = () => {
            const now = new Date();
            const formatted = now.toISOString().slice(0, 19).replace('T', ' ');
            setCurrentDateTime(formatted);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [usersCount, bookingsCount, flightsCount, recentBookingsData] = await Promise.all([
                    axiosInstance.get('/api/users/count'),
                    axiosInstance.get('/api/bookings/count'),
                    axiosInstance.get('/api/flights/count'),
                    axiosInstance.get('/api/bookings/recent')
                ]);

                setTotalUsers(usersCount.data.count.toLocaleString());
                setTotalBookings(bookingsCount.data.count.toLocaleString());
                setTotalFlights(flightsCount.data.count.toLocaleString());

                const formattedBookings = recentBookingsData.data.map(booking => ({
                    bookingID: booking.bookingID,
                    bookerName: booking.user.name,
                    bookerEmail: booking.user.email,
                    bookingDate: booking.bookingDate,
                    departureAirport: booking.flight.departureAirport.code,
                    destinationAirport: booking.flight.arrivalAirport.code,
                    paymentStatus: booking.payment ? booking.payment.paymentStatus : 'Pending'
                }));

                setRecentBookings(formattedBookings);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                if (err.response) {
                    console.log('Error response:', err.response);
                    setError(`Error: ${err.response.data.msg || err.response.statusText}`);
                } else if (err.request) {
                    console.log('Error request:', err.request);
                    setError("Network error. Please check your connection.");
                } else {
                    console.log('Error:', err.message);
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh data every 5 minutes
        const refreshInterval = setInterval(fetchData, 300000);
        return () => clearInterval(refreshInterval);
    }, []);

    const boxData = [
        { 
            icon: "uil-users-alt", 
            text: "Total Users", 
            number: loading ? '...' : totalUsers, 
            className: "box1" 
        },
        { 
            icon: "uil-receipt", 
            text: "Total Bookings", 
            number: loading ? '...' : totalBookings, 
            className: "box2" 
        },
        { 
            icon: "uil-plane", 
            text: "Total Flights", 
            number: loading ? '...' : totalFlights, 
            className: "box3" 
        },
    ];

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
                    <div className="overview">
                        <div className="title">
                            <i className="uil uil-tachometer-fast-alt"></i>
                            <span className="text">Dashboard</span>
                        </div>

                        <div className="dashboard-header">
                            <h2 className="subtitle">
                                Welcome back, <span className="highlight-text">{user?.name || 'Admin'}</span>!
                            </h2>
                            <p className="current-datetime">{currentDateTime} UTC</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="boxes">
                            {boxData.map((box, index) => (
                                <div key={index} className={`box ${box.className} ${loading ? 'loading' : ''}`}>
                                    <i className={`uil ${box.icon}`}></i>
                                    <span className="text">{box.text}</span>
                                    <span className="number">
                                        {loading ? (
                                            <span className="loading-dots">...</span>
                                        ) : (
                                            box.number || '0'
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="activity">
                        <div className="title">
                            <i className="uil uil-clock-three"></i>
                            <span className="text">Recent Activity</span>
                        </div>

                        {loading && <div className="loading-message">Loading recent bookings...</div>}
                        {error && <div className="error-message">{error}</div>}
                        
                        {!loading && !error && (
                            <div className="activity-data">
                                <div className="data-header-row">
                                    <span className="data-title">Booker Name</span>
                                    <span className="data-title">Email</span>
                                    <span className="data-title">Booking Time</span>
                                    <span className="data-title">From</span>
                                    <span className="data-title">To</span>
                                    <span className="data-title">Payment Status</span>
                                </div>

                                {recentBookings.length > 0 ? (
                                    <div className="data-rows">
                                        {recentBookings.map((booking) => (
                                            <div key={booking.bookingID} className="data-row">
                                                <span className="data-list">{booking.bookerName}</span>
                                                <span className="data-list">{booking.bookerEmail}</span>
                                                <span className="data-list">
                                                    {formatDateTime(booking.bookingDate)}
                                                </span>
                                                <span className="data-list">{booking.departureAirport}</span>
                                                <span className="data-list">{booking.destinationAirport}</span>
                                                <span className={`data-list status-${booking.paymentStatus.toLowerCase()}`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-data-message">
                                        No recent bookings found.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;