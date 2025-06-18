// src/pages/admin/flight/FlightManagement.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const FlightManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [flights, setFlights] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [flightToDelete, setFlightToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const getFlights = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/flights');
            setFlights(response.data);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load flights. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching flights:", error);
        }
    };

    useEffect(() => {
        getFlights();
    }, []);

    const confirmDelete = (flightId) => {
        setFlightToDelete(flightId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setFlightToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!flightToDelete) return;

        try {
            await axiosInstance.delete(`/flights/${flightToDelete}`);
            setMsg("Flight deleted successfully!");
            setMsgType('success');
            setFlights(prevFlights => 
                prevFlights.filter(flight => flight.flightID !== flightToDelete)
            );
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete flight. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting flight:", error);
        } finally {
            setFlightToDelete(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
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
                            <i className="uil uil-plane icon"></i>
                            <div>
                                <h1 className="page-title">Flight Management</h1>
                                <p className="page-subtitle">Manage all flight schedules.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/flights/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New Flight
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Flight No</th>
                                            <th>Airline</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Departure</th>
                                            <th>Arrival</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flights.length > 0 ? (
                                            flights.map((flight, index) => (
                                                <tr key={flight.flightID}>
                                                    <td>{index + 1}</td>
                                                    <td>{flight.flightNumber}</td>
                                                    <td>
                                                        {flight.airline.logo ? (
                                                            <div className="airline-logo-wrapper">
                                                                <img 
                                                                    src={`data:${flight.airline.logoType};base64,${flight.airline.logo}`}
                                                                    alt={flight.airline.name}
                                                                    className="airline-logo"
                                                                />
                                                                <span>{flight.airline.name}</span>
                                                            </div>
                                                        ) : (
                                                            flight.airline.name
                                                        )}
                                                    </td>
                                                    <td>{flight.departureAirport.code}</td>
                                                    <td>{flight.arrivalAirport.code}</td>
                                                    <td>{formatDateTime(flight.departureTime)}</td>
                                                    <td>{formatDateTime(flight.arrivalTime)}</td>
                                                    <td>{formatPrice(flight.price)}</td>
                                                    <td>
                                                        <Link 
                                                            to={`/admin/flights/edit/${flight.flightID}`} 
                                                            className="table-action-button edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => confirmDelete(flight.flightID)} 
                                                            className="table-action-button delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="no-data-message">
                                                    No flights found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this flight? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button onClick={executeDelete} className="modal-button confirm">
                                Delete
                            </button>
                            <button onClick={cancelDelete} className="modal-button cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightManagement;