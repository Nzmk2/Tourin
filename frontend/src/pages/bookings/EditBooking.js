import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Import CSS
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';

const EditBooking = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    // State variables for booking data, strictly matching the Sequelize model
    const [bookingID, setBookingID] = useState(''); // Corresponds to bookingID in model (primary key)
    const [userID, setUserID] = useState('');       // Corresponds to userID in model (foreign key)
    const [flightID, setFlightID] = useState('');   // Corresponds to flightID in model (foreign key)

    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();
    const { id } = useParams(); // 'id' from URL will be 'bookingID'

    // State for dropdowns (users and flights)
    const [users, setUsers] = useState([]);
    const [flights, setFlights] = useState([]);

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

    // Fetch Booking Data and related Users/Flights
    useEffect(() => {
        const fetchBookingAndDependencies = async () => {
            try {
                // Fetch users for the dropdown
                const usersRes = await axiosInstance.get('/users');
                setUsers(usersRes.data);

                // Fetch flights for the dropdown
                const flightsRes = await axiosInstance.get('/flights');
                setFlights(flightsRes.data);

                // Fetch the specific booking data using the ID (bookingID) from params
                const response = await axiosInstance.get(`/bookings/${id}`);
                const bookingData = response.data;

                // Populate the state variables with fetched data, strictly matching model fields
                setBookingID(bookingData.bookingID || '');
                setUserID(bookingData.userID || '');
                setFlightID(bookingData.flightID || '');

                // Removed state updates for bookingDate, totalPrice, status as they are not in the model
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                    setMsgType('danger');
                } else {
                    setMsg("Network error or server unavailable.");
                    setMsgType('danger');
                }
                console.error("Error fetching booking data for edit:", error);
            }
        };
        fetchBookingAndDependencies();
    }, [id]); // Dependency array includes 'id' (which is bookingID)

    // Update Booking Function
    const updateBooking = async (e) => {
        e.preventDefault();
        try {
            // Send data matching the Sequelize model fields
            // bookingID is the primary key and likely shouldn't be updated via PATCH,
            // it's used in the URL to identify the record.
            await axiosInstance.patch(`/bookings/${id}`, {
                userID,   // Only update foreign keys
                flightID  // Only update foreign keys
                // Removed bookingDate, totalPrice, status from payload as they are not in the model
            });
            setMsg("Booking updated successfully!");
            setMsgType('success');
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
            console.error("Error updating booking:", error);
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
                                <h1 className="page-title">Edit Booking</h1>
                                <p className="page-subtitle">Update the booking details below.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateBooking}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="bookingID" className="form-label">Booking ID</label>
                                        <input
                                            type="text"
                                            name="bookingID"
                                            id="bookingID"
                                            placeholder="e.g., BKNG12345"
                                            className="form-input"
                                            value={bookingID}
                                            readOnly // Primary key, not editable
                                            disabled // Visually indicates it's disabled
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="userID" className="form-label">User</label>
                                        <div className="custom-select-wrapper">
                                            <select
                                                name="userID"
                                                id="userID"
                                                className="form-input custom-select"
                                                value={userID}
                                                onChange={(e) => setUserID(e.target.value)}
                                                required
                                            >
                                                <option value="">Select User</option>
                                                {users.map(user => (
                                                    <option key={user.userID} value={user.userID}>
                                                        {user.email} ({user.firstName} {user.lastName})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="flightID" className="form-label">Flight</label>
                                        <div className="custom-select-wrapper">
                                            <select
                                                name="flightID"
                                                id="flightID"
                                                className="form-input custom-select"
                                                value={flightID}
                                                onChange={(e) => setFlightID(e.target.value)}
                                                required
                                            >
                                                <option value="">Select Flight</option>
                                                {flights.map(flight => (
                                                    <option key={flight.flightID} value={flight.flightID}>
                                                        {flight.flightNumber} ({new Date(flight.departureDate).toLocaleDateString()} - {flight.departureAirportCode} to {flight.arrivalAirportCode})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="form-submit-button">
                                            Update Booking
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

export default EditBooking;