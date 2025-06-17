import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Import CSS
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';

const EditAirport = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    // State variables for airport data, strictly matching the Sequelize model
    const [airportCode, setAirportCode] = useState(''); // Matches airportCode in model
    const [airportName, setAirportName] = useState(''); // Matches airportName in model
    const [facilities, setFacilities] = useState('');   // Matches facilities in model (TEXT type, so likely a string)
    const [location, setLocation] = useState('');       // Matches location in model
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();
    const { id } = useParams(); // 'id' from URL will be 'airportCode'

    // Effect for Dark Mode
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Effect for Sidebar State
    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    // Toggle Sidebar Function
    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    // Toggle Dark Mode Function
    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    // Fetch Airport Data by ID (using airportCode from params)
    useEffect(() => {
        const getAirportById = async () => {
            try {
                // Assuming your API endpoint uses 'airportCode' for the ID
                const response = await axiosInstance.get(`/airports/${id}`);
                const airportData = response.data;

                // Populate the state variables with fetched data, matching model fields
                setAirportCode(airportData.airportCode || '');
                setAirportName(airportData.airportName || '');
                setFacilities(airportData.facilities || ''); // Facilities is TEXT, so directly set string
                setLocation(airportData.location || '');
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                    setMsgType('danger');
                } else {
                    setMsg("Network error or server unavailable.");
                    setMsgType('danger');
                }
                console.error("Error fetching airport data for edit:", error);
            }
        };
        getAirportById();
    }, [id]); // Dependency array includes 'id' (which is airportCode)

    // Update Airport Function
    const updateAirport = async (e) => {
        e.preventDefault();
        try {
            // Send data matching the Sequelize model fields
            await axiosInstance.patch(`/airports/${id}`, {
                airportName,
                facilities,
                location
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
                                <p className="page-subtitle">Update the airport details below.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateAirport}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="airportCode" className="form-label">Airport Code</label>
                                        <input
                                            type="text"
                                            name="airportCode"
                                            id="airportCode"
                                            placeholder="e.g., CGK"
                                            className="form-input"
                                            value={airportCode}
                                            // airportCode is primary key, usually not editable after creation
                                            // You might want to make this readonly or display it as text.
                                            // For this example, it's kept as input but is not sent in PATCH.
                                            // If it's editable and you need to change it, your backend PATCH
                                            // will need to support changing primary keys, which is unusual.
                                            readOnly // Makes it non-editable
                                            disabled // Makes it non-editable and visually different
                                        />
                                    </div>

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