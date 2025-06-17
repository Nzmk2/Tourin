import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig'; // Sesuaikan path jika perlu
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; // Sesuaikan path jika perlu
import Navbar from '../../components/Navbar';   // Sesuaikan path jika perlu

// Import CSS
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';


const AddAirline = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [airlineName, setAirlineName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [operatingRegion, setOperatingRegion] = useState('');
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

    const saveAirline = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/airlines', {
                airlineName,
                contactNumber,
                operatingRegion
            });
            setMsg("Airline added successfully!");
            setMsgType('success');
            // Reset form fields after successful submission
            setAirlineName('');
            setContactNumber('');
            setOperatingRegion('');
            // Optional: navigate back to airlines list after a short delay
            setTimeout(() => {
                navigate('/admin/airlines');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error adding airline:", error);
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
                            <i className="uil uil-plane-departure icon"></i>
                            <div>
                                <h1 className="page-title">Add New Airline</h1>
                                <p className="page-subtitle">Fill in the new airline details to create a record.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveAirline}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="airlineName" className="form-label">Airline Name</label>
                                        <input
                                            type="text"
                                            name="airlineName"
                                            id="airlineName"
                                            placeholder="Enter airline name"
                                            className="form-input"
                                            value={airlineName}
                                            onChange={(e) => setAirlineName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                                <input
                                                    type="text"
                                                    name="contactNumber"
                                                    id="contactNumber"
                                                    placeholder="e.g., +6281234567890"
                                                    className="form-input"
                                                    value={contactNumber}
                                                    onChange={(e) => setContactNumber(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="operatingRegion" className="form-label">Operating Region</label>
                                                <input
                                                    type="text"
                                                    name="operatingRegion"
                                                    id="operatingRegion"
                                                    placeholder="e.g., Asia, Global"
                                                    className="form-input"
                                                    value={operatingRegion}
                                                    onChange={(e) => setOperatingRegion(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="form-submit-button">
                                            Add Airline
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

export default AddAirline;