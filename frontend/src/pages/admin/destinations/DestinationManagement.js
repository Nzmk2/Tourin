import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const DestinationManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [destinations, setDestinations] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [destinationToDelete, setDestinationToDelete] = useState(null);
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

    const getDestinations = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/destinations');
            setDestinations(response.data);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load destinations. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching destinations:", error);
        }
    };

    useEffect(() => {
        getDestinations();
    }, []);

    const confirmDelete = (destinationId) => {
        setDestinationToDelete(destinationId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setDestinationToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!destinationToDelete) return;

        try {
            await axiosInstance.delete(`/destinations/${destinationToDelete}`);
            setMsg("Destination deleted successfully!");
            setMsgType('success');
            setDestinations(prevDestinations => 
                prevDestinations.filter(destination => destination.destinationID !== destinationToDelete)
            );
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete destination. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting destination:", error);
        } finally {
            setDestinationToDelete(null);
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
                            <i className="uil uil-map-marker icon"></i>
                            <div>
                                <h1 className="page-title">Destination Management</h1>
                                <p className="page-subtitle">Manage all destination details.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/destinations/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New Destination
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>City</th>
                                            <th>Country</th>
                                            <th>Rating</th>
                                            <th>Popular</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {destinations.length > 0 ? (
                                            destinations.map((destination, index) => (
                                                <tr key={destination.destinationID}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {destination.image ? (
                                                            <img 
                                                                src={`data:${destination.imageType};base64,${destination.image}`}
                                                                alt={destination.name}
                                                                className="destination-thumbnail"
                                                            />
                                                        ) : (
                                                            'No Image'
                                                        )}
                                                    </td>
                                                    <td>{destination.name}</td>
                                                    <td>{destination.city}</td>
                                                    <td>{destination.country}</td>
                                                    <td>{destination.rating.toFixed(1)}</td>
                                                    <td>
                                                        <span className={`status-badge ${destination.isPopular ? 'active' : 'inactive'}`}>
                                                            {destination.isPopular ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link 
                                                            to={`/admin/destinations/edit/${destination.destinationID}`} 
                                                            className="table-action-button edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => confirmDelete(destination.destinationID)} 
                                                            className="table-action-button delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="no-data-message">
                                                    No destinations found.
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
                        <p>Are you sure you want to delete this destination? This action cannot be undone.</p>
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

export default DestinationManagement;