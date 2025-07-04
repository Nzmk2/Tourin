import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AirlineManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [airlines, setAirlines] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [airlineToDelete, setAirlineToDelete] = useState(null);
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

    const getAirlines = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/airlines');
            setAirlines(response.data);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load airlines. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching airlines:", error);
        }
    };

    useEffect(() => {
        getAirlines();
    }, []);

    const confirmDelete = (airlineId) => {
        setAirlineToDelete(airlineId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setAirlineToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!airlineToDelete) return;

        try {
            await axiosInstance.delete(`/api/airlines/${airlineToDelete}`);
            setMsg("Airline deleted successfully!");
            setMsgType('success');
            setAirlines(prevAirlines => 
                prevAirlines.filter(airline => airline.airlineID !== airlineToDelete)
            );
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete airline. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting airline:", error);
        } finally {
            setAirlineToDelete(null);
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
                            <i className="uil uil-plane-fly icon"></i>
                            <div>
                                <h1 className="page-title">Airline Management</h1>
                                <p className="page-subtitle">Manage all airlines</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/airlines/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New Airline
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Logo</th>
                                            <th>Name</th>
                                            <th>Code</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {airlines.length > 0 ? (
                                            airlines.map((airline, index) => (
                                                <tr key={airline.airlineID}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {airline.logo ? (
                                                            <img 
                                                                src={`data:${airline.logoType};base64,${airline.logo}`}
                                                                alt={airline.name}
                                                                className="airline-logo"
                                                            />
                                                        ) : (
                                                            'No Logo'
                                                        )}
                                                    </td>
                                                    <td>{airline.name}</td>
                                                    <td>{airline.code}</td>
                                                    <td>
                                                        <Link 
                                                            to={`/admin/airlines/edit/${airline.airlineID}`} 
                                                            className="table-action-button edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => confirmDelete(airline.airlineID)} 
                                                            className="table-action-button delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="no-data-message">
                                                    No airlines found.
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
                        <p>Are you sure you want to delete this airline? This action cannot be undone.</p>
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

export default AirlineManagement;