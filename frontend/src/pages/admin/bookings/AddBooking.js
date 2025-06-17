import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig'; // Sesuaikan path jika perlu
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../../components/Sidebar'; // Sesuaikan path jika perlu
import Navbar from '../../../components/Navbar';   // Sesuaikan path jika perlu

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AddBooking = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [userEmailInput, setUserEmailInput] = useState(''); // State for manual email input
    const [flightID, setFlightID] = useState('');
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();

    const [flights, setFlights] = useState([]); // Keep fetching flights

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

    useEffect(() => {
        // Fetch flights only, as user selection is now via email input
        const fetchFlights = async () => {
            try {
                const flightsRes = await axiosInstance.get('/flights');
                setFlights(flightsRes.data);
                if (flightsRes.data.length > 0) {
                    setFlightID(flightsRes.data[0].flightID); // Set default flightID
                }
            } catch (error) {
                console.error("Error fetching flights:", error);
                setMsg("Failed to load flights for selection.");
                setMsgType('danger');
            }
        };
        fetchFlights();
    }, []);

    // Function to resolve user ID from email
    const resolveUserByEmail = async (email) => {
        setMsg(''); // Clear previous messages
        setMsgType('info');
        if (!email) {
            setMsg("User email cannot be empty.");
            setMsgType('danger');
            return null;
        }
        try {
            // Asumsi backend memiliki endpoint untuk mendapatkan user berdasarkan email
            // This endpoint might need to be created if not already existing.
            // For example, if /users?email=... is not supported, you'd need a dedicated endpoint.
            const response = await axiosInstance.get(`/users`, { params: { email: email } });
            if (response.data && response.data.length > 0 && response.data[0].userID) {
                setMsg(`User found: ${response.data[0].firstName} ${response.data[0].lastName}`);
                setMsgType('success');
                return response.data[0].userID;
            } else {
                setMsg("User with this email not found. Please ensure the email is registered.");
                setMsgType('danger');
                return null;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMsg("User with this email not found. Please ensure the email is registered.");
            } else {
                setMsg("Error searching for user email. Network issue or server error.");
            }
            setMsgType('danger');
            console.error("Error resolving user by email:", error);
            return null;
        }
    };

    const saveBooking = async (e) => {
        e.preventDefault();

        // First, try to resolve the user email to a userID
        const userIDToBook = await resolveUserByEmail(userEmailInput);

        if (!userIDToBook) {
            // If user ID couldn't be resolved, stop submission
            return;
        }

        try {
            await axiosInstance.post('/bookings', {
                userID: userIDToBook, // Use the resolved userID
                flightID
            });
            setMsg("Booking added successfully!");
            setMsgType('success');
            // Reset form fields
            setUserEmailInput('');
            setFlightID(flights.length > 0 ? flights[0].flightID : ''); // Reset to default flight

            setTimeout(() => {
                navigate('/admin/bookings');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error adding booking:", error);
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
                            <i className="uil uil-receipt icon"></i>
                            <div>
                                <h1 className="page-title">Add New Booking</h1>
                                <p className="page-subtitle">Fill in the booking details to create a record.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveBooking}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="userEmail" className="form-label">User Email</label>
                                        <input
                                            type="email"
                                            name="userEmail"
                                            id="userEmail"
                                            placeholder="Enter user email (e.g., john.doe@example.com)"
                                            className="form-input"
                                            value={userEmailInput}
                                            onChange={(e) => setUserEmailInput(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="flightID" className="form-label">Flight</label>
                                        <div className="form-control-wrapper">
                                            <select
                                                name="flightID"
                                                id="flightID"
                                                className="form-input"
                                                value={flightID}
                                                onChange={(e) => setFlightID(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Flight</option>
                                                {flights.map(flightItem => (
                                                    <option key={flightItem.flightID} value={flightItem.flightID}>
                                                        {flightItem.flightNumber} - {new Date(flightItem.departureTime).toLocaleDateString()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="form-submit-button">
                                            Add Booking
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

export default AddBooking;