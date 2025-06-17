// frontend/src/pages/admin/BookingManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

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

    // State baru untuk menyimpan peta flightID ke flightNumber
    const [flightsMap, setFlightsMap] = useState({});

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

    const toggleSidebar = useCallback(() => {
        setIsSidebarClosed(prevState => !prevState);
    }, []);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prevState => !prevState);
    }, []);

    // Fungsi untuk mengambil semua data (bookings, users, flights)
    const getBookings = useCallback(async () => {
        try {
            // Mengambil daftar penerbangan untuk membuat peta flightID ke flightNumber
            const flightsRes = await axiosInstance.get('/flights');
            const flightMap = flightsRes.data.reduce((acc, flight) => {
                acc[flight.flightID] = flight.flightNumber;
                return acc;
            }, {});
            setFlightsMap(flightMap);

            // Mengambil data booking, pastikan backend Anda bisa menginklusi user
            const response = await axiosInstance.get('/bookings', {
                params: {
                    // Pastikan backend Anda mendukung 'user' sebagai include
                    // Jika flight detail juga perlu diinclude secara langsung di booking,
                    // tambahkan 'flight' di sini. Namun, kita sudah punya flightMap.
                    include: ['user']
                }
            });
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
    }, []);

    useEffect(() => {
        getBookings();
    }, [getBookings]);

    const confirmDelete = (bookingId) => {
        setBookingToDelete(bookingId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setBookingToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false); // Tutup modal konfirmasi
        if (!bookingToDelete) return; // Pastikan ada booking ID yang akan dihapus

        try {
            // Lakukan permintaan DELETE ke backend
            await axiosInstance.delete(`/bookings/${bookingToDelete}`);
            setMsg("Booking deleted successfully!");
            setMsgType('success');
            // **PERBAIKAN DI SINI:** Perbarui state 'bookings' secara lokal
            // dengan memfilter booking yang baru saja dihapus.
            setBookings(prevBookings => prevBookings.filter(booking => booking.bookingID !== bookingToDelete));
            // Tidak perlu memanggil getBookings() lagi, karena state sudah diperbarui.
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
            setBookingToDelete(null); // Reset booking ID yang akan dihapus
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
                            <i className="uil uil-receipt icon"></i>
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
                                            <th>Booking ID</th>
                                            <th>User Email</th>
                                            <th>Flight Number</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.length > 0 ? (
                                            bookings.map((booking, index) => (
                                                <tr key={booking.bookingID}>
                                                    <td>{index + 1}</td>
                                                    <td>{booking.bookingID}</td>
                                                    <td>{booking.user?.email || 'N/A'}</td>
                                                    {/* Menggunakan flightsMap untuk mendapatkan flightNumber */}
                                                    <td>{flightsMap[booking.flightID] || 'N/A'}</td>
                                                    <td>
                                                        <Link to={`/admin/bookings/edit/${booking.bookingID}`} className="table-action-button edit">Edit</Link>
                                                        <button onClick={() => confirmDelete(booking.bookingID)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                {/* colSpan tetap 5 karena jumlah kolom tidak berubah */}
                                                <td colSpan="5" className="no-data-message">No bookings found.</td>
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

export default BookingManagement;