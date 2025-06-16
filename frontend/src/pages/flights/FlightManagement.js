import React, { useState, useEffect } from 'react';
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
    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    // Handler untuk toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flightsRes = await axiosInstance.get('/flights');
                setFlights(flightsRes.data);

                const airlinesRes = await axiosInstance.get('/airlines');
                const airlineMap = airlinesRes.data.reduce((acc, airline) => {
                    acc[airline.airlineID] = airline.airlineName; // Sesuaikan dengan properti airline
                    return acc;
                }, {});
                setAirlines(airlineMap);

                const airportsRes = await axiosInstance.get('/airports');
                const airportMap = airportsRes.data.reduce((acc, airport) => {
                    acc[airport.airportID] = airport.airportName; // Sesuaikan dengan properti airport
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
        };

        fetchData();
    }, []);

    // Fungsi untuk menampilkan modal konfirmasi
    const confirmDelete = (flightId) => {
        setFlightToDelete(flightId);
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const cancelDelete = () => {
        setShowModal(false);
        setFlightToDelete(null);
    };

    // Fungsi untuk melanjutkan penghapusan setelah konfirmasi
    const executeDelete = async () => {
        setShowModal(false); // Tutup modal
        if (!flightToDelete) return; // Pastikan ada ID untuk dihapus

        try {
            await axiosInstance.delete(`/flights/${flightToDelete}`);
            setMsg("Flight deleted successfully!");
            setMsgType('success');
            setFlights(flights.filter(flight => flight.id !== flightToDelete)); // Update state secara lokal
            // Atau panggil fetchData() lagi jika ingin reload penuh: fetchData();
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
            setFlightToDelete(null); // Reset ID yang akan dihapus
        }
    };

    // Corrected formatTime function
    const formatTime = (timeString) => {
        if (!timeString) return '';
        // Asumsi timeString adalah "HH:MM:SS" atau "HH:MM"
        const parts = timeString.split(':');
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
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
                                            <th>Price</th>
                                            <th>Capacity</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {flights.length > 0 ? (
                                            flights.map((flight, index) => (
                                                <tr key={flight.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{flight.flightNumber}</td>
                                                    <td>{airlines[flight.airlineId] || 'N/A'}</td>
                                                    <td>{airports[flight.departureAirportId] || 'N/A'}</td>
                                                    <td>{airports[flight.arrivalAirportId] || 'N/A'}</td>
                                                    <td>{new Date(flight.departureDate).toLocaleDateString('id-ID')}</td>
                                                    <td>{formatTime(flight.departureTime)}</td>
                                                    <td>{formatTime(flight.arrivalTime)}</td>
                                                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(flight.price)}</td>
                                                    <td>{flight.capacity}</td>
                                                    <td>
                                                        <Link to={`/admin/flights/edit/${flight.id}`} className="table-action-button edit">Edit</Link>
                                                        <button onClick={() => confirmDelete(flight.id)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="no-data-message">No flights found.</td>
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
