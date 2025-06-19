import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const BookingManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [bookings, setBookings] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const getBookings = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/bookings');
            setBookings(response.data);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load bookings. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        getBookings();
    }, []);

    const confirmDelete = (bookingId) => {
        setBookingToDelete(bookingId);
        setShowModal(true);
    };

    const cancelModal = () => {
        setShowModal(false);
        setBookingToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!bookingToDelete) return;

        try {
            await axiosInstance.delete(`/api/bookings/${bookingToDelete}`);
            setMsg("Booking deleted successfully!");
            setMsgType('success');
            setBookings(prevBookings =>
                prevBookings.filter(booking => booking.bookingID !== bookingToDelete)
            );
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete booking. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting booking:", error);
        } finally {
            setBookingToDelete(null);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'status-badge confirmed';
            case 'cancelled':
                return 'status-badge cancelled';
            default:
                return 'status-badge pending';
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
                            <i className="uil uil-ticket icon"></i>
                            <div>
                                <h1 className="page-title">Booking Management</h1>
                                <p className="page-subtitle">Manage all flight bookings.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/bookings/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New Booking
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Booking Date</th>
                                            <th>Customer</th>
                                            <th>Flight Details</th>
                                            <th>Total Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length > 0 ? (
                                            bookings.map((booking, index) => (
                                                <tr key={booking.bookingID}>
                                                    <td>{index + 1}</td>
                                                    <td>{formatDate(booking.bookingDate)}</td>
                                                    <td>{booking.User?.name || booking.user?.name || '-'}</td>
                                                    <td>
                                                        {booking.Flight?.flightNumber || booking.flight?.flightNumber || ''}
                                                        {booking.Flight?.departureAirport?.code
                                                            ? ` - ${booking.Flight.departureAirport.code}`
                                                            : booking.flight?.departureAirport?.code
                                                            ? ` - ${booking.flight.departureAirport.code}` : ''
                                                        }
                                                        {booking.Flight?.arrivalAirport?.code
                                                            ? ` to ${booking.Flight.arrivalAirport.code}`
                                                            : booking.flight?.arrivalAirport?.code
                                                            ? ` to ${booking.flight.arrivalAirport.code}` : ''
                                                        }
                                                    </td>
                                                    <td>{formatPrice(booking.totalPrice)}</td>
                                                    <td>
                                                        <span className={getStatusBadgeClass(booking.status)}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/bookings/edit/${booking.bookingID}`}
                                                            className="table-action-button edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmDelete(booking.bookingID)}
                                                            className="table-action-button delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="no-data-message">
                                                    No bookings found.
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
                        <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button onClick={executeDelete} className="modal-button confirm">
                                Delete
                            </button>
                            <button onClick={cancelModal} className="modal-button cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingManagement;