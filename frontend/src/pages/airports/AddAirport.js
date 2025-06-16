import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';

const AddAirport = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [airportName, setAirportName] = useState('');
    const [facilities, setFacilities] = useState('');
    const [location, setLocation] = useState('');
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

    const saveAirport = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/airports', {
                airportName,
                facilities,
                location
            });
            setMsg("Airport added successfully!");
            setMsgType('success');
            // Reset form fields
            setAirportName('');
            setFacilities('');
            setLocation('');
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
            console.error("Error adding airport:", error);
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
                            <i className="uil uil-building icon"></i> {/* Ikon untuk Airport */}
                            <div>
                                <h1 className="page-title">Add New Airport</h1>
                                <p className="page-subtitle">Fill in the airport details to create a record.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveAirport}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="airportName" className="form-label">Airport Name</label>
                                        <input
                                            type="text"
                                            name="airportName"
                                            id="airportName"
                                            placeholder="e.g., Soekarno-Hatta International Airport"
                                            className="form-input"
                                            value={airportName}
                                            onChange={(e) => setAirportName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="facilities" className="form-label">Facilities (Comma Separated)</label>
                                        <textarea
                                            name="facilities"
                                            id="facilities"
                                            placeholder="e.g., WiFi, Lounges, Shops"
                                            className="form-input"
                                            value={facilities}
                                            onChange={(e) => setFacilities(e.target.value)}
                                            rows="3"
                                        ></textarea>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="location" className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            id="location"
                                            placeholder="e.g., Jakarta, Indonesia"
                                            className="form-input"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <button type="submit" className="form-submit-button">
                                            Add Airport
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

export default AddAirport;
