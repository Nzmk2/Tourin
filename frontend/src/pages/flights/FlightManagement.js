// frontend/src/pages/admin/FlightManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const FlightManagement = () => {
    // State untuk mengelola status sidebar (buka/tutup) dan mode gelap/terang
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [flights, setFlights] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info'); // State untuk tipe pesan
    const [airlines, setAirlines] = useState({});
    const [airports, setAirports] = useState({});
    const [showModal, setShowModal] = useState(false); // State untuk modal konfirmasi
    const [flightToDelete, setFlightToDelete] = useState(null); // State untuk menyimpan ID yang akan dihapus

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
    const toggleSidebar = useCallback(() => {
        setIsSidebarClosed(prevState => !prevState);
    }, []);

    // Handler untuk toggle dark mode
    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prevState => !prevState);
    }, []);

    // Fungsi untuk mengambil semua data yang dibutuhkan (penerbangan, maskapai, bandara)
    const fetchData = useCallback(async () => {
        try {
            const flightsRes = await axiosInstance.get('/flights');
            setFlights(flightsRes.data);

            const airlinesRes = await axiosInstance.get('/airlines');
            // Membuat map airlineID ke airlineName untuk pencarian cepat
            const airlineMap = airlinesRes.data.reduce((acc, airline) => {
                acc[airline.airlineID] = airline.airlineName;
                return acc;
            }, {});
            setAirlines(airlineMap);

            const airportsRes = await axiosInstance.get('/airports');
            // Membuat map airportCode ke airportName untuk pencarian cepat
            const airportMap = airportsRes.data.reduce((acc, airport) => {
                acc[airport.airportCode] = airport.airportName;
                return acc;
            }, {});
            setAirports(airportMap);
            setMsg('');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load data. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching flight data:", error);
        }
    }, []);

    // Efek untuk memuat data saat komponen pertama kali di-mount
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Fungsi untuk menampilkan modal konfirmasi penghapusan
    const confirmDelete = (flightId) => {
    setFlightToDelete(flightId);
    setShowModal(true);
};

    // Fungsi untuk menutup modal konfirmasi
    const cancelDelete = () => {
        setShowModal(false);
        setFlightToDelete(null);
    };

    // Fungsi untuk mengeksekusi penghapusan penerbangan
    const executeDelete = async () => {
        //console.log("Melaksanakan penghapusan untuk Flight ID:", flightToDelete); // <-- INI JUGA PENTING!
        setShowModal(false);
        if (!flightToDelete) {
            //console.log("Flight ID untuk dihapus kosong."); // Tambah log ini
            return;
        }
        try {
            await axiosInstance.delete(`/flights/${flightToDelete}`);
            setMsg("Flight deleted successfully!");
            setMsgType('success');
            // Perbarui state `flights` setelah penghapusan berhasil
            setFlights(prevFlights => prevFlights.filter(flight => flight.flightID !== flightToDelete));
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete flight. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting flight:", error);
        } finally {
            setFlightToDelete(null);
        }
    };

    // Fungsi helper untuk memformat waktu dari string ISO atau hanya HH:MM:SS
    const formatTime = (timeData) => {
        if (!timeData) return '';

        // Coba parsing sebagai Date jika formatnya adalah ISO string (misal: "2024-06-17T09:00:00.000Z")
        if (typeof timeData === 'string' && timeData.includes('T')) {
            const date = new Date(timeData);
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }
        // Jika hanya string waktu (misal: "09:00:00")
        else if (typeof timeData === 'string' && timeData.includes(':')) {
            const parts = timeData.split(':');
            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
        return '';
    };

    // Fungsi helper untuk memformat tanggal dari string ISO
    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Pastikan kita membuat objek Date dari string ISO
        return new Date(dateString).toLocaleDateString('id-ID');
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
                            <i className="uil uil-plane-fly icon"></i> {/* Ikon Flight */}
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
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Flight Number</th>
                                            <th>Airline</th>
                                            <th>Departure Airport</th>
                                            <th>Arrival Airport</th>
                                            <th>Departure Date</th>
                                            <th>Departure Time</th>
                                            <th>Arrival Time</th>
                                            <th>Available Seats</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flights.length > 0 ? (
                                            flights.map((flight, index) => (
                                                <tr key={flight.flightID}> {/* Menggunakan flightID sebagai key */}
                                                    <td>{index + 1}</td>
                                                    <td>{flight.flightNumber}</td>
                                                    <td>{airlines[flight.airlineID] || 'N/A'}</td> {/* Menggunakan airlineID */}
                                                    <td>{airports[flight.departureAirportCode] || 'N/A'}</td> {/* Menggunakan departureAirportCode */}
                                                    <td>{airports[flight.destinationAirportCode] || 'N/A'}</td> {/* Menggunakan destinationAirportCode */}
                                                    <td>{formatDate(flight.departureTime)}</td>
                                                    <td>{formatTime(flight.departureTime)}</td>
                                                    <td>{formatTime(flight.arrivalTime)}</td>
                                                    <td>{flight.availableSeats}</td> {/* Menampilkan availableSeats */}
                                                    <td>
                                                        <Link to={`/admin/flights/edit/${flight.flightID}`} className="table-action-button edit">Edit</Link>
                                                        <button onClick={() => confirmDelete(flight.flightID)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                {/* colSpan disesuaikan dengan jumlah kolom (10) */}
                                                <td colSpan="10" className="no-data-message">No flights found.</td>
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

export default FlightManagement;