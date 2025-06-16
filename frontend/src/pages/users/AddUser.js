import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';

const AddUser = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [role, setRole] = useState('user'); // Default role
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
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

    const saveUser = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/users', {
                firstName,
                lastName,
                email,
                password,
                // confPassword tidak dikirim ke backend, hanya untuk validasi frontend
                passportNumber,
                role
            });
            setMsg("User added successfully!");
            setMsgType('success');
            // Reset form fields
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfPassword('');
            setPassportNumber('');
            setRole('user'); // Reset role ke default 'user'

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
            console.error("Error adding user:", error);
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
                                <p className="page-subtitle">Fill in the user details to create a new account.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveUser}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    placeholder="First Name"
                                                    className="form-input"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    placeholder="Last Name"
                                                    className="form-input"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Email"
                                            className="form-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    placeholder="Password"
                                                    className="form-input"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="confPassword" className="form-label">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    name="confPassword"
                                                    id="confPassword"
                                                    placeholder="Confirm Password"
                                                    className="form-input"
                                                    value={confPassword}
                                                    onChange={(e) => setConfPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="passportNumber" className="form-label">Passport Number</label>
                                        <input
                                            type="text"
                                            name="passportNumber"
                                            id="passportNumber"
                                            placeholder="Passport Number (Optional)"
                                            className="form-input"
                                            value={passportNumber}
                                            onChange={(e) => setPassportNumber(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <div className="form-control-wrapper">
                                            <select
                                                name="role"
                                                id="role"
                                                className="form-input"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                required
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="form-submit-button">
                                            Add User
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
