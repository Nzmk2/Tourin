// src/pages/admin/airport/EditAirport.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const EditAirport = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
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
        const getAirportById = async () => {
            try {
                const response = await axiosInstance.get(`/airports/${id}`);
                const airport = response.data;
                setCode(airport.code);
                setName(airport.name);
                setCity(airport.city);
                setCountry(airport.country);
                setLoading(false);
            } catch (error) {
                setMsg("Failed to fetch airport data");
                setMsgType('danger');
                console.error("Error fetching airport:", error);
                setLoading(false);
            }
        };
        getAirportById();
    }, [id]);

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const updateAirport = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.patch(`/airports/${id}`, {
                code,
                name,
                city,
                country
            });
            setMsg("Airport updated successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/airports');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error updating airport:", error);
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
                            <i className="uil uil-plane icon"></i>
                            <div>
                                <h1 className="page-title">Edit Airport</h1>
                                <p className="page-subtitle">Update airport information.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateAirport}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="code" className="form-label">Airport Code</label>
                                        <input
                                            type="text"
                                            id="code"
                                            className="form-input"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="Enter airport code (e.g., CGK, DPS)"
                                            maxLength="10"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Airport Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter airport name"
                                            required
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="city" className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    className="form-input"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="Enter city"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="country" className="form-label">Country</label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    className="form-input"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    placeholder="Enter country"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Update Airport
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

export default EditAirport;