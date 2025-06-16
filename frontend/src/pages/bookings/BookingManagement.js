import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const BookingManagement = () => {
    // State untuk mengelola status sidebar (buka/tutup) dan mode gelap/terang
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [bookings, setBookings] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info'); // State untuk tipe pesan
    const [showModal, setShowModal] = useState(false); // State untuk modal konfirmasi
    const [bookingToDelete, setBookingToDelete] = useState(null); // State untuk menyimpan ID yang akan dihapus

    // Efek samping untuk menerapkan kelas 'dark' ke elemen <body>
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Efek samping untuk menerapkan kelas 'close' ke elemen <body>
    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    // Handler untuk toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    // Handler untuk toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    useEffect(() => {
        getBookings();
    }, []);

    const getBookings = async () => {
        try {
            const response = await axiosInstance.get('/bookings');
            setBookings(response.data);
            setMsg('');
        } catch (error) {
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

    // Fungsi untuk menampilkan modal konfirmasi
    const confirmDelete = (bookingId) => {
        setBookingToDelete(bookingId);
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const cancelDelete = () => {
        setShowModal(false);
        setBookingToDelete(null);
    };

    // Fungsi untuk melanjutkan penghapusan setelah konfirmasi
    const executeDelete = async () => {
        setShowModal(false); // Tutup modal
        if (!bookingToDelete) return; // Pastikan ada ID untuk dihapus

        try {
            await axiosInstance.delete(`/bookings/${bookingToDelete}`);
            setMsg("Booking deleted successfully!");
            setMsgType('success');
            getBookings(); // Muat ulang daftar booking
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
            setBookingToDelete(null); // Reset ID yang akan dihapus
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'confirmed': return 'status-confirmed';
            case 'cancelled': return 'status-cancelled';
            default: return '';
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
                            <i className="uil uil-receipt icon"></i> {/* Ikon Booking */}
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
                                            <th>Booking Number</th>
                                            <th>User Email</th>
                                            <th>Flight Number</th>
                                            <th>Booking Date</th>
                                            <th>Total Price</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length > 0 ? (
                                            bookings.map((booking, index) => (
                                                <tr key={booking.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{booking.bookingNumber}</td>
                                                    <td>{booking.user?.email || 'N/A'}</td>
                                                    <td>{booking.flight?.flightNumber || 'N/A'}</td>
                                                    <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                                                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(booking.totalPrice)}</td>
                                                    <td className={getStatusColorClass(booking.status)}>{booking.status}</td>
                                                    <td>
                                                        <Link to={`/admin/bookings/edit/${booking.id}`} className="table-action-button edit">Edit</Link>
                                                        <button onClick={() => confirmDelete(booking.id)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" className="no-data-message">No bookings found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this booking? This action cannot be undone.</p>
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

export default BookingManagement;
