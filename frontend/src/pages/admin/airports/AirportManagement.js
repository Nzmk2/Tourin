import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig'; // Sesuaikan path jika perlu
import Sidebar from '../../../components/Sidebar'; // Sesuaikan path jika perlu
import Navbar from '../../../components/Navbar';   // Sesuaikan path jika perlu

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
        getAirports();
    }, []);

    const getAirports = async () => {
        try {
            const response = await axiosInstance.get('/airports');
            setAirports(response.data);
            setMsg('');
        } catch (error) {
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
            getAirports();
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
                            <i className="uil uil-building icon"></i>
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
                                            <th>Airport Code</th> {/* Changed to reflect model */}
                                            <th>Airport Name</th> {/* Changed to reflect model */}
                                            <th>Facilities</th> {/* Added as per model */}
                                            <th>Location</th> {/* Added as per model */}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {airports.length > 0 ? (
                                            airports.map((airport, index) => (
                                                <tr key={airport.airportCode}> {/* Changed key to airportCode */}
                                                    <td>{index + 1}</td>
                                                    <td>{airport.airportCode}</td>
                                                    <td>{airport.airportName}</td>
                                                    <td>{airport.facilities || 'N/A'}</td>
                                                    <td>{airport.location || 'N/A'}</td>
                                                    <td>
                                                        <Link to={`/admin/airports/edit/${airport.airportCode}`} className="table-action-button edit">Edit</Link>
                                                        <button onClick={() => confirmDelete(airport.airportCode)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="no-data-message">No airports found.</td> {/* Adjusted colSpan */}
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
                <div className={`modal-overlay ${showModal ? 'active' : ''}`}> {/* Tambahkan class 'active' */}
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this flight? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button onClick={executeDelete} className="modal-button confirm">Delete</button>
                            <button onClick={cancelDelete} className="modal-button cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AirportManagement;