import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const EditUser = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        passportNumber: '',
        role: 'USER',
        isActive: true
    });

    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

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

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axiosInstance.get(`/api/users/${id}`);
                const user = response.data;
                setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    password: '',
                    confirmPassword: '',
                    passportNumber: user.passportNumber || '',
                    role: user.role || 'USER',
                    isActive: user.isActive !== undefined ? user.isActive : true
                });
                setLoading(false);
            } catch (error) {
                setMsg("Failed to fetch user data");
                setMsgType('danger');
                console.error("Error fetching user:", error);
                setLoading(false);
            }
        };
        getUserById();
    }, [id]);

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setMsg("First name and last name are required");
            setMsgType('danger');
            return false;
        }

        if (formData.password || formData.confirmPassword) {
            if (formData.password !== formData.confirmPassword) {
                setMsg("Passwords do not match");
                setMsgType('danger');
                return false;
            }

            if (formData.password.length < 6) {
                setMsg("Password must be at least 6 characters long");
                setMsgType('danger');
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMsg("Please enter a valid email address");
            setMsgType('danger');
            return false;
        }

        if (formData.passportNumber && !/^[A-Z0-9]{6,9}$/i.test(formData.passportNumber)) {
            setMsg("Invalid passport number format. Must be 6-9 alphanumeric characters");
            setMsgType('danger');
            return false;
        }

        return true;
    };

    const updateUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setMsg('');

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            passportNumber: formData.passportNumber,
            role: formData.role,
            isActive: formData.isActive
        };

        // Only include password if it's been changed
        if (formData.password) {
            payload.password = formData.password;
        }

        try {
            await axiosInstance.patch(`/api/users/${id}`, payload);
            setMsg("User updated successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg || 'Failed to update user');
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error updating user:", error);
        } finally {
            setIsSubmitting(false);
        }
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
                            <i className="uil uil-user-circle icon"></i>
                            <div>
                                <h1 className="page-title">Edit User</h1>
                                <p className="page-subtitle">Update user account information</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateUser}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    name="firstName"
                                                    className="form-input"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter first name"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    name="lastName"
                                                    className="form-input"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter last name"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-input"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email address"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="password" className="form-label">
                                                    New Password (Leave blank to keep current)
                                                </label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="form-input"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter new password"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="confirmPassword" className="form-label">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    className="form-input"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm new password"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="passportNumber" className="form-label">Passport Number</label>
                                                <input
                                                    type="text"
                                                    id="passportNumber"
                                                    name="passportNumber"
                                                    className="form-input"
                                                    value={formData.passportNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter passport number"
                                                    disabled={isSubmitting}
                                                />
                                                <small className="form-text text-muted">
                                                    6-9 alphanumeric characters
                                                </small>
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="role" className="form-label">User Role</label>
                                                <select
                                                    id="role"
                                                    name="role"
                                                    className="form-input"
                                                    value={formData.role}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={isSubmitting}
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                            />
                                            Account Active
                                        </label>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button" disabled={isSubmitting}>
                                            {isSubmitting ? 'Updating...' : 'Update User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EditUser;