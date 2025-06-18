// src/pages/admin/user/EditUser.js

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

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [currentProfileImage, setCurrentProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);
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
                const response = await axiosInstance.get(`/users/${id}`);
                const user = response.data;
                setName(user.name);
                setEmail(user.email);
                setPhoneNumber(user.phoneNumber || '');
                setRole(user.role);
                setIsActive(user.isActive);
                if (user.profileImage) {
                    setCurrentProfileImage(`data:${user.profileImageType};base64,${user.profileImage}`);
                    setPreviewUrl(`data:${user.profileImageType};base64,${user.profileImage}`);
                }
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

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                setMsg("File size must be less than 5MB");
                setMsgType('danger');
                return;
            }

            if (!file.type.match('image.*')) {
                setMsg("Please select an image file");
                setMsgType('danger');
                return;
            }

            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (password || confirmPassword) {
            if (password !== confirmPassword) {
                setMsg("Passwords do not match");
                setMsgType('danger');
                return false;
            }

            if (password.length < 6) {
                setMsg("Password must be at least 6 characters long");
                setMsgType('danger');
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMsg("Please enter a valid email address");
            setMsgType('danger');
            return false;
        }

        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (phoneNumber && !phoneRegex.test(phoneNumber)) {
            setMsg("Please enter a valid phone number");
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

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (password) {
            formData.append('password', password);
        }
        formData.append('phoneNumber', phoneNumber);
        formData.append('role', role);
        formData.append('isActive', isActive);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            await axiosInstance.patch(`/users/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("User updated successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error updating user:", error);
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
                                <p className="page-subtitle">Update user account information.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateUser}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter email address"
                                            required
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
                                                    className="form-input"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter new password"
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
                                                    className="form-input"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    id="phoneNumber"
                                                    className="form-input"
                                                    value={phoneNumber}
                                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="role" className="form-label">User Role</label>
                                                <select
                                                    id="role"
                                                    className="form-input"
                                                    value={role}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    required
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="profileImage" className="form-label">Profile Image</label>
                                        <input
                                            type="file"
                                            id="profileImage"
                                            className="form-input file-input"
                                            onChange={handleProfileImageChange}
                                            accept="image/*"
                                        />
                                        {previewUrl && (
                                            <div className="image-preview">
                                                <img src={previewUrl} alt="Preview" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                            />
                                            Account Active
                                        </label>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Update User
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