import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const PackageManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [packages, setPackages] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [packageToDelete, setPackageToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const getPackages = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/packages');
            setPackages(response.data);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load packages. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching packages:", error);
        }
    };

    useEffect(() => {
        getPackages();
    }, []);

    const confirmDelete = (packageId) => {
        setPackageToDelete(packageId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setPackageToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!packageToDelete) return;

        try {
            await axiosInstance.delete(`/api/packages/${packageToDelete}`);
            setMsg("Package deleted successfully!");
            setMsgType('success');
            setPackages(prevPackages => 
                prevPackages.filter(pkg => pkg.packageID !== packageToDelete)
            );
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete package. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting package:", error);
        } finally {
            setPackageToDelete(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(price);
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
                            <i className="uil uil-box icon"></i>
                            <div>
                                <h1 className="page-title">Package Management</h1>
                                <p className="page-subtitle">Manage all travel packages.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/packages/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New Package
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Description</th>
                                            <th>Duration</th>
                                            <th>Location</th>
                                            <th>Price</th>
                                            <th>Max Pax</th>
                                            <th>Rating</th>
                                            <th>Review Count</th>
                                            <th>Destination</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {packages.length > 0 ? (
                                            packages.map((pkg, index) => (
                                                <tr key={pkg.packageID}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {pkg.imageUrl ? (
                                                            <img 
                                                                src={pkg.imageUrl}
                                                                alt={pkg.title}
                                                                className="package-thumbnail"
                                                            />
                                                        ) : (
                                                            'No Image'
                                                        )}
                                                    </td>
                                                    <td>{pkg.title}</td>
                                                    <td>{pkg.description}</td>
                                                    <td>{pkg.duration}</td>
                                                    <td>{pkg.location}</td>
                                                    <td>{formatPrice(pkg.price)}</td>
                                                    <td>{pkg.maxPax}</td>
                                                    <td>{pkg.rating ? pkg.rating.toFixed(1) : '-'}</td>
                                                    <td>{pkg.reviewCount}</td>
                                                    <td>
                                                        {pkg.Destination && pkg.Destination.name
                                                            ? pkg.Destination.name
                                                            : (
                                                                pkg.destinationID
                                                                ? <span style={{color:"red"}}>ID {pkg.destinationID} (not found in destinations table)</span>
                                                                : '-'
                                                            )
                                                        }
                                                    </td>
                                                    <td>
                                                        <Link 
                                                            to={`/admin/packages/edit/${pkg.packageID}`} 
                                                            className="table-action-button edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => confirmDelete(pkg.packageID)} 
                                                            className="table-action-button delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12" className="no-data-message">
                                                    No packages found.
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
                        <p>Are you sure you want to delete this package? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button onClick={executeDelete} className="modal-button confirm">
                                Delete
                            </button>
                            <button onClick={cancelDelete} className="modal-button cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackageManagement;