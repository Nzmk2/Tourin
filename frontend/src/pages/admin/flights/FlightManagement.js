import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-message">
                    <h2>Something went wrong.</h2>
                    <button onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

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

    // Dark mode effect
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Sidebar effect
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

    // Format helpers with error handling
    const formatPrice = (price) => {
        if (!price || isNaN(price)) return 'N/A';
        try {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(price);
        } catch (error) {
            console.error('Price formatting error:', error);
            return 'Invalid Price';
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        try {
            // Parse the date string and adjust for local timezone
            const date = new Date(dateTime);
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() + (offset * 60 * 1000));

            return localDate.toLocaleString('id-ID', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Jakarta' // Explicitly set to Jakarta timezone
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Invalid Date';
        }
    };

    // Fetch flights with detailed error handling
    const getFlights = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/flights');
            console.log('Flight response data:', response.data);

            if (Array.isArray(response.data)) {
                const validFlights = response.data.map(flight => {
                    console.log('Processing flight:', flight);
                    return {
                        ...flight,
                        airlineName: flight.Airline?.name || `Airline ${flight.airlineID}` // Fallback ke ID jika tidak ada nama
                    };
                });
                
                console.log('Processed flights:', validFlights);
                setFlights(validFlights);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMsg(error.response?.data?.msg || "Failed to load flights");
            setMsgType('danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFlights();
    }, []);

    // Delete handlers
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
            await axiosInstance.delete(`/api/flights/${flightToDelete}`);
            setMsg("Flight deleted successfully!");
            setMsgType('success');
            getFlights(); // Refresh the list instead of filtering locally
        } catch (error) {
            setMsg(error.response?.data?.msg || "Failed to delete flight. Please try again.");
            setMsgType('danger');
            console.error("Delete error:", error);
        } finally {
            setFlightToDelete(null);
        }
    };

    // Loading state
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

    // Main render
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
                            
                            <ErrorBoundary>
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
                                                        <td>{flight.airlineName || (flight.airlineID ? `Airline ${flight.airlineID}` : 'No Airline Data')}</td>
                                                        <td>{flight.DepartureAirport ? flight.DepartureAirport.name : 'No Airport Data'}</td>
                                                        <td>{flight.DestinationAirport ? flight.DestinationAirport.name : 'No Airport Data'}</td>
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
                            </ErrorBoundary>
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