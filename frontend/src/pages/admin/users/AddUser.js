import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AddUser = () => {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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

    const saveUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setMsg('');

        try {
            const response = await axiosInstance.post('/api/users', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                passportNumber: formData.passportNumber,
                role: formData.role
            });

            setMsg("User added successfully!");
            setMsgType('success');
            console.log('Server response:', response.data);

            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);
        } catch (error) {
            console.error('Error adding user:', error);
            if (error.response) {
                setMsg(error.response.data.msg || 'Failed to add user');
            } else {
                setMsg("Network error or server unavailable");
            }
            setMsgType('danger');
        } finally {
            setIsSubmitting(false);
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
                            <i className="uil uil-user-plus icon"></i>
                            <div>
                                <h1 className="page-title">Add New User</h1>
                                <p className="page-subtitle">Create a new user account</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveUser}>
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
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    name="password"
                                                    className="form-input"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter password"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    className="form-input"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm password"
                                                    required
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

                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="form-submit-button"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Adding...' : 'Add User'}
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

export default AddUser;