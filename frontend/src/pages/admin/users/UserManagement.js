import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const UserManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
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

    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/users');
            console.log('Users data received:', response.data);
            // Filter hanya user dengan role USER
            const filteredUsers = response.data.filter(user => user.role === 'USER');
            setUsers(filteredUsers);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load users. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const confirmDelete = (userId) => {
        setUserToDelete(userId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setUserToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!userToDelete) return;

        try {
            await axiosInstance.delete(`/api/users/${userToDelete}`);
            setMsg("User deleted successfully!");
            setMsgType('success');
            getUsers(); // Refresh the user list after deletion
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete user. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting user:", error);
        } finally {
            setUserToDelete(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                            <i className="uil uil-users-alt icon"></i>
                            <div>
                                <h1 className="page-title">User Management</h1>
                                <p className="page-subtitle">Manage all users</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/users/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New User
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Profile</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Passport Number</th>
                                            <th>Joined Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user, index) => {
                                                const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
                                                
                                                return (
                                                    <tr key={user?.userID || index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="default-avatar">
                                                                {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                                                            </div>
                                                        </td>
                                                        <td>{fullName || 'N/A'}</td>
                                                        <td>{user?.email || 'N/A'}</td>
                                                        <td>{user?.passportNumber || 'N/A'}</td>
                                                        <td>{formatDate(user?.createdAt)}</td>
                                                        <td>
                                                            <Link 
                                                                to={`/admin/users/edit/${user?.userID}`} 
                                                                className="table-action-button edit"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button 
                                                                onClick={() => confirmDelete(user?.userID)} 
                                                                className="table-action-button delete"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="no-data-message">
                                                    No users found.
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
                        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
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

export default UserManagement;