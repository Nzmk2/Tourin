import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../api/axiosConfig'; // Make sure this path is correct
import logoImage from '../assets/img/logo.png';

/**
 * Komponen Sidebar untuk dashboard admin.
 * Mengelola tampilan sidebar (terbuka/tertutup) dan toggle mode gelap/terang.
 * @param {object} props - Properti komponen.
 * @param {boolean} props.isSidebarClosed - Status sidebar (true jika tertutup).
 * @param {function} props.toggleDarkMode - Fungsi untuk mengubah mode gelap/terang.
 * @param {boolean} props.isDarkMode - Status mode gelap/terang (true jika mode gelap).
 */
const Sidebar = ({ isSidebarClosed, toggleDarkMode, isDarkMode }) => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogout = async () => {
        try {
            // *** PENTING: Gunakan axiosInstance.post karena backend Anda menggunakan router.post('/logout') ***
            await axiosInstance.post('/logout'); 

            // Setelah logout berhasil dari backend (cookie dihapus),
            // Anda juga mungkin ingin membersihkan token apa pun yang mungkin disimpan di Local Storage
            // (Meskipun refresh token ada di cookie, mungkin Anda menyimpan Access Token di Local Storage)
            localStorage.removeItem('accessToken'); 
            // Jika ada data user yang tersimpan di state global (misalnya Context API atau Redux),
            // pastikan untuk meresetnya juga di sini.

            // Redirect ke halaman login setelah logout berhasil
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            // Meskipun ada error dari backend (misalnya server tidak responsif),
            // kita tetap bisa mencoba mengarahkan ke halaman login dan membersihkan sisi klien
            // karena user kemungkinan besar sudah tidak terautentikasi (cookie mungkin sudah expired atau error)
            alert("Logout failed. Please try again. If the problem persists, try clearing your browser's site data for localhost.");
            localStorage.removeItem('accessToken'); // Tetap coba hapus accessToken
            navigate('/login'); // Tetap arahkan ke halaman login
        }
    };

    return (
        <nav className={isSidebarClosed ? "close" : ""}>
            <div className="logo-name">
                <Link to="/admin/dashboard" className="logo-link-area">
                    <div className="logo-image">
                        <img src={logoImage} alt="Tourin Logo" />
                    </div>
                    <span className="logo_name">Tourin</span>
                </Link>
            </div>

            <div className="menu-items">
                <ul className="nav-links">
                    <li><Link to="/admin/dashboard">
                        <i className="uil uil-estate"></i>
                        <span className="link-name">Dashboard</span>
                    </Link></li>
                    <li><Link to="/admin/airlines">
                        <i className="uil uil-plane-departure"></i>
                        <span className="link-name">Airline</span>
                    </Link></li>
                    <li><Link to="/admin/airports">
                        <i className="uil uil-building"></i>
                        <span className="link-name">Airport</span>
                    </Link></li>
                    <li><Link to="/admin/bookings">
                        <i className="uil uil-receipt"></i>
                        <span className="link-name">Booking</span>
                    </Link></li>
                    <li><Link to="/admin/flights">
                        <i className="uil uil-plane-fly"></i>
                        <span className="link-name">Flight</span>
                    </Link></li>
                    {/* <li><Link to="/admin/payments">
                        <i className="uil uil-paypal"></i>
                        <span className="link-name">Payment</span>
                    </Link></li> */}
                    <li><Link to="/admin/users">
                        <i className="uil uil-users-alt"></i>
                        <span className="link-name">User</span>
                    </Link></li>
                </ul>

                <ul className="logout-mode">
                    <li>
                        <button 
                            onClick={handleLogout} 
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', width: '100%', color: 'inherit' }}
                            aria-label="Logout"
                        >
                            <i className="uil uil-signout"></i>
                            <span className="link-name">Logout</span>
                        </button>
                    </li>

                    <li className="mode">
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            aria-label="Toggle Dark Mode"
                        >
                            <i className="uil uil-moon"></i>
                            <span className="link-name">Dark Mode</span>
                        </button>
                        <div className="mode-toggle" onClick={toggleDarkMode}>
                            <span className="switch"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;