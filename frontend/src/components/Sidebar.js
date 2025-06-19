import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import logoImage from '../assets/img/logo.png';

const Sidebar = ({ isSidebarClosed, toggleDarkMode, isDarkMode }) => {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await axiosInstance.delete('/api/auth/logout');
            localStorage.removeItem('accessToken');
            setShowLogoutModal(false);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
            setShowLogoutModal(false);
            window.alert("Logout failed. Please try again. If the problem persists, try clearing your browser's site data for localhost.");
            localStorage.removeItem('accessToken');
            navigate('/login');
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
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
                        {/* ... (link menu lain sama persis seperti sebelumnya) */}
                        <li><Link to="/admin/dashboard"><i className="uil uil-estate"></i><span className="link-name">Dashboard</span></Link></li>
                        <li><Link to="/admin/airlines"><i className="uil uil-plane-departure"></i><span className="link-name">Airline</span></Link></li>
                        <li><Link to="/admin/airports"><i className="uil uil-building"></i><span className="link-name">Airport</span></Link></li>
                        <li><Link to="/admin/destinations"><i className="uil uil-map-marker"></i><span className="link-name">Destination</span></Link></li>
                        <li><Link to="/admin/packages"><i className="uil uil-box"></i><span className="link-name">Package</span></Link></li>
                        <li><Link to="/admin/bookings"><i className="uil uil-receipt"></i><span className="link-name">Booking</span></Link></li>
                        <li><Link to="/admin/flights"><i className="uil uil-plane-fly"></i><span className="link-name">Flight</span></Link></li>
                        <li><Link to="/admin/payments"><i className="uil uil-bill"></i><span className="link-name">Payment</span></Link></li>
                        <li><Link to="/admin/users"><i className="uil uil-users-alt"></i><span className="link-name">User</span></Link></li>
                    </ul>
                    <ul className="logout-mode">
                        <li>
                            <button
                                onClick={handleLogoutClick}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    color: 'inherit'
                                }}
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
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
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

            {/* Modal Logout Confirmation */}
            {showLogoutModal && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to logout?</p>
                        <div className="modal-buttons">
                            <button onClick={handleLogoutConfirm} className="modal-button confirm">
                                Yes, Logout
                            </button>
                            <button onClick={handleLogoutCancel} className="modal-button cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;