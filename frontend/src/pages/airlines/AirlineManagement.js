// frontend/src/pages/admin/AirlineManagement.jsx
import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

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

    // Efek untuk mengelola mode gelap/terang pada body
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Efek untuk mengelola status sidebar (terbuka/tertutup) pada body
    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    // Menggunakan useCallback untuk fungsi toggleSidebar agar tidak dibuat ulang pada setiap render
    const toggleSidebar = useCallback(() => {
        setIsSidebarClosed(prevState => !prevState);
    }, []);

    // Menggunakan useCallback untuk fungsi toggleDarkMode agar tidak dibuat ulang pada setiap render
    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prevState => !prevState);
    }, []);

    // Fungsi untuk mengambil data maskapai
    const getAirlines = useCallback(async () => { // Menggunakan useCallback
        try {
            const response = await axiosInstance.get('/airlines');
            setAirlines(response.data);
            setMsg(''); // Bersihkan pesan setelah berhasil memuat data
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load airlines. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching airlines:", error);
        }
    }, []); // Dependensi kosong karena tidak ada nilai dari scope luar yang berubah

    // Panggil getAirlines saat komponen pertama kali di-mount
    useEffect(() => {
        getAirlines();
    }, [getAirlines]); // Tambahkan getAirlines sebagai dependensi useEffect

    // Fungsi untuk menampilkan modal konfirmasi penghapusan
    const confirmDelete = (airlineId) => {
        setAirlineToDelete(airlineId);
        setShowModal(true);
    };

    // Fungsi untuk membatalkan penghapusan (menutup modal)
    const cancelDelete = () => {
        setShowModal(false);
        setAirlineToDelete(null);
    };

    // Fungsi untuk mengeksekusi penghapusan setelah konfirmasi
    const executeDelete = async () => {
        setShowModal(false); // Tutup modal terlebih dahulu
        if (!airlineToDelete) return; // Pastikan ada ID yang akan dihapus

        try {
            // Lakukan permintaan DELETE ke backend
            await axiosInstance.delete(`/airlines/${airlineToDelete}`);
            setMsg("Airline deleted successfully!");
            setMsgType('success');
            // Perbarui state 'airlines' secara lokal dengan memfilter data yang dihapus
            setAirlines(prevAirlines => prevAirlines.filter(airline => airline.airlineID !== airlineToDelete));
            // Tidak perlu memanggil getAirlines() lagi karena state sudah diperbarui
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
            setAirlineToDelete(null); // Reset ID yang akan dihapus
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
                            <i className="uil uil-plane-departure icon"></i>
                            <div>
                                <h1 className="page-title">Airline Management</h1>
                                <p className="page-subtitle">Manage all airline details.</p>
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
                                            <th>Airline ID</th>
                                            <th>Airline Name</th>
                                            <th>Contact Number</th>
                                            <th>Operating Region</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {airlines.length > 0 ? (
                                            airlines.map((airline, index) => (
                                                <tr key={airline.airlineID}>
                                                    <td>{index + 1}</td>
                                                    <td>{airline.airlineID}</td>
                                                    <td>{airline.airlineName}</td>
                                                    <td>{airline.contactNumber || 'N/A'}</td> {/* Pastikan properti sesuai dengan model backend Anda */}
                                                    <td>{airline.operatingRegion || 'N/A'}</td> {/* Pastikan properti sesuai dengan model backend Anda */}
                                                    <td>
                                                        <Link to={`/admin/airlines/edit/${airline.airlineID}`} className="table-action-button edit">Edit</Link>
                                                        <button onClick={() => confirmDelete(airline.airlineID)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                {/* colSpan disesuaikan dengan jumlah kolom (6) */}
                                                <td colSpan="6" className="no-data-message">No airlines found.</td>
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

export default AirlineManagement;