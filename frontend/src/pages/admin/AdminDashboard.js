import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import '../../assets/styles/Admin.css'; // Mengimpor gaya dasar admin
// Impor komponen yang baru dipisahkan
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
    const { user } = useAuth(); // Menggunakan useAuth dari AuthContext Anda

    // State untuk mengelola status sidebar (buka/tutup) dan mode gelap/terang
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    // --- State untuk Data Real dari Backend ---
    const [totalUsers, setTotalUsers] = useState('...');
    const [totalBookings, setTotalBookings] = useState('...');
    const [totalFlights, setTotalFlights] = useState('...');
    const [recentBookings, setRecentBookings] = useState([]); // State untuk log booking
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fungsi helper untuk format tanggal dan waktu
    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false // 24-hour format
        });
    };

    // Efek samping untuk mengambil data dari backend saat komponen dimuat
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // --- Ambil Data Total Count ---
                const [usersRes, bookingsRes, flightsRes] = await Promise.all([
                    fetch('http://localhost:5000/users/count'),
                    fetch('http://localhost:5000/bookings/count'),
                    fetch('http://localhost:5000/flights/count')
                ]);

                if (!usersRes.ok) throw new Error(`Failed to fetch user count: ${usersRes.statusText}`);
                if (!bookingsRes.ok) throw new Error(`Failed to fetch booking count: ${bookingsRes.statusText}`);
                if (!flightsRes.ok) throw new Error(`Failed to fetch flight count: ${flightsRes.statusText}`);

                const usersData = await usersRes.json();
                const bookingsData = await bookingsRes.json();
                const flightsData = await flightsRes.json();

                setTotalUsers(usersData.count.toLocaleString());
                setTotalBookings(bookingsData.count.toLocaleString());
                setTotalFlights(flightsData.count.toLocaleString());

                // --- Ambil Data Recent Bookings ---
                const recentBookingsRes = await fetch('http://localhost:5000/bookings/recent'); // URL API baru
                if (!recentBookingsRes.ok) {
                    throw new Error(`Failed to fetch recent bookings: ${recentBookingsRes.statusText}`);
                }
                const recentBookingsData = await recentBookingsRes.json();
                setRecentBookings(recentBookingsData);

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please ensure your backend is running and accessible.");
                setTotalUsers('N/A');
                setTotalBookings('N/A');
                setTotalFlights('N/A');
                setRecentBookings([]); // Reset recent bookings on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali saat mount

    // Data untuk Boxes yang kini menggunakan state dari data real
    const boxData = [
        { icon: "uil-users-alt", text: "Total Users", number: totalUsers, className: "box1" },
        { icon: "uil-receipt", text: "Total Bookings", number: totalBookings, className: "box2" },
        { icon: "uil-plane", text: "Total Flights", number: totalFlights, className: "box3" },
    ];


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

    return (
        <div className="admin-dashboard-container">
            {/* Menggunakan komponen Sidebar */}
            <Sidebar
                isSidebarClosed={isSidebarClosed}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />

            <section className="dashboard">
                {/* Menggunakan komponen Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                <div className="dash-content">
                    <div className="overview">
                        <div className="title">
                            <i className="uil uil-tachometer-fast-alt"></i>
                            <span className="text">Dashboard</span>
                        </div>

                        <h2 className="subtitle">
                            Welcome back, <span className="highlight-text">{user?.firstName || 'Super'}</span>!
                        </h2>

                        {/* Menampilkan pesan loading/error atau kotak data */}
                        {loading && <p className="loading-message">Loading dashboard data...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && (
                            <div className="boxes">
                                {boxData.map((box, index) => (
                                    <div key={index} className={`box ${box.className}`}>
                                        <i className={`uil ${box.icon}`}></i>
                                        <span className="text">{box.text}</span>
                                        <span className="number">{box.number}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="activity">
                        <div className="title">
                            <i className="uil uil-clock-three"></i>
                            <span className="text">Recent Activity</span>
                        </div>

                        {/* Menampilkan pesan loading/error atau tabel log booking */}
                        {loading && <p className="loading-message">Loading recent bookings...</p>}
                        {error && <p className="error-message">{error}</p>}
                        {!loading && !error && (
                            <div className="activity-data">
                                <div className="data-header-row">
                                    <span className="data-title">Booker Name</span>
                                    <span className="data-title">Email</span>
                                    <span className="data-title">Flight Time</span>
                                    <span className="data-title">From</span>
                                    <span className="data-title">To</span>
                                    <span className="data-title">Payment Status</span>
                                </div>

                                {recentBookings.length > 0 ? (
                                    recentBookings.map((booking, index) => (
                                        <div key={booking.bookingID || index} className="data-row">
                                            <span className="data-list">{booking.bookerName}</span>
                                            <span className="data-list">{booking.bookerEmail}</span>
                                            <span className="data-list">{formatDateTime(booking.bookingDate)}</span>
                                            <span className="data-list">{booking.departureAirport}</span>
                                            <span className="data-list">{booking.destinationAirport}</span>
                                            <span className="data-list">{booking.paymentStatus}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-data-message">No recent bookings found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
