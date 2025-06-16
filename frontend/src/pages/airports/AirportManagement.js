import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const AirportManagement = () => {
    // State untuk mengelola status sidebar (buka/tutup) dan mode gelap/terang
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [airports, setAirports] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info'); // State untuk tipe pesan
    const [showModal, setShowModal] = useState(false); // State untuk modal konfirmasi
    const [airportToDelete, setAirportToDelete] = useState(null); // State untuk menyimpan ID yang akan dihapus

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

    // Fungsi untuk menampilkan modal konfirmasi
    const confirmDelete = (airportId) => {
        setAirportToDelete(airportId);
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const cancelDelete = () => {
        setShowModal(false);
        setAirportToDelete(null);
    };

    // Fungsi untuk melanjutkan penghapusan setelah konfirmasi
    const executeDelete = async () => {
        setShowModal(false); // Tutup modal
        if (!airportToDelete) return; // Pastikan ada ID untuk dihapus

        try {
            await axiosInstance.delete(`/airports/${airportToDelete}`);
            setMsg("Airport deleted successfully!");
            setMsgType('success');
            getAirports(); // Muat ulang daftar bandara
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
            setAirportToDelete(null); // Reset ID yang akan dihapus
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
                            <i className="uil uil-building icon"></i> {/* Ikon Bandara */}
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
                                            <th>Name</th>
                                            <th>IATA Code</th>
                                            <th>ICAO Code</th>
                                            <th>City</th>
                                            <th>Country</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {airports.length > 0 ? (
                                            airports.map((airport, index) => (
                                                <tr key={airport.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{airport.name}</td>
                                                    <td>{airport.iataCode}</td>
                                                    <td>{airport.icaoCode}</td>
                                                    <td>{airport.city}</td>
                                                    <td>{airport.country}</td>
                                                    <td>
                                                        <Link to={`/admin/airports/edit/${airport.id}`} className="table-action-button edit">Edit</Link>
                                                        <button onClick={() => confirmDelete(airport.id)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="no-data-message">No airports found.</td>
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
                        <p>Are you sure you want to delete this airport? This action cannot be undone.</p>
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
