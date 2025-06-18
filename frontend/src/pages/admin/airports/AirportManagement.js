// src/pages/admin/airport/AirportManagement.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AirportManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [airports, setAirports] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [airportToDelete, setAirportToDelete] = useState(null);
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

    const getAirports = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/airports');
            setAirports(response.data);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load airports. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching airports:", error);
        }
    };

    useEffect(() => {
        getAirports();
    }, []);

    const confirmDelete = (airportId) => {
        setAirportToDelete(airportId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setAirportToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!airportToDelete) return;

        try {
            await axiosInstance.delete(`/airports/${airportToDelete}`);
            setMsg("Airport deleted successfully!");
            setMsgType('success');
            setAirports(prevAirports => 
                prevAirports.filter(airport => airport.airportID !== airportToDelete)
            );
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete airport. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting airport:", error);
        } finally {
            setAirportToDelete(null);
        }
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
                                <h1 className="page-title">Airport Management</h1>
                                <p className="page-subtitle">Manage all airport details.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/airports/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New Airport
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Code</th>
                                            <th>Name</th>
                                            <th>City</th>
                                            <th>Country</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {airports.length > 0 ? (
                                            airports.map((airport, index) => (
                                                <tr key={airport.airportID}>
                                                    <td>{index + 1}</td>
                                                    <td>{airport.code}</td>
                                                    <td>{airport.name}</td>
                                                    <td>{airport.city}</td>
                                                    <td>{airport.country}</td>
                                                    <td>
                                                        <Link 
                                                            to={`/admin/airports/edit/${airport.airportID}`} 
                                                            className="table-action-button edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => confirmDelete(airport.airportID)} 
                                                            className="table-action-button delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="no-data-message">
                                                    No airports found.
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
                        <p>Are you sure you want to delete this airport? This action cannot be undone.</p>
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

export default AirportManagement;