import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

// Import CSS
import '../../assets/styles/Admin.css';
import '../../assets/styles/management.css';

const EditFlight = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [flightNumber, setFlightNumber] = useState('');
    // Changed to airlineID to match model
    const [airlineID, setAirlineID] = useState('');
    // Changed to departureAirportCode to match model
    const [departureAirportCode, setDepartureAirportCode] = useState('');
    // Changed to destinationAirportCode to match model
    const [destinationAirportCode, setDestinationAirportCode] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');
    // Changed to availableSeats to match model
    const [availableSeats, setAvailableSeats] = useState('');
    const [airlines, setAirlines] = useState([]);
    const [airports, setAirports] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();
    // Changed to flightID to match model's primary key
    const { id: flightID } = useParams();

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
        const fetchFlightAndDependencies = async () => {
            try {
                const airlinesRes = await axiosInstance.get('/airlines');
                setAirlines(airlinesRes.data);

                const airportsRes = await axiosInstance.get('/airports');
                setAirports(airportsRes.data);

                // Use flightID from useParams
                const flightRes = await axiosInstance.get(`/flights/${flightID}`);
                const flightData = flightRes.data;

                setFlightNumber(flightData.flightNumber);
                // Set airlineID
                setAirlineID(flightData.airlineID);
                // Set departureAirportCode
                setDepartureAirportCode(flightData.departureAirportCode);
                // Set destinationAirportCode
                setDestinationAirportCode(flightData.destinationAirportCode);

                // Extract date part for departureDate
                setDepartureDate(new Date(flightData.departureTime).toISOString().split('T')[0]);
                // Extract time part for departureTime
                setDepartureTime(new Date(flightData.departureTime).toTimeString().substring(0, 5));
                // Extract time part for arrivalTime
                setArrivalTime(new Date(flightData.arrivalTime).toTimeString().substring(0, 5));
                setPrice(flightData.price);
                // Set availableSeats
                setAvailableSeats(flightData.availableSeats);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                    setMsgType('danger');
                } else {
                    setMsg("Network error or server unavailable.");
                    setMsgType('danger');
                }
                console.error("Error fetching flight data for edit:", error);
            }
        };
        fetchFlightAndDependencies();
    }, [flightID]); // Dependency on flightID

    const updateFlight = async (e) => {
        e.preventDefault();
        try {
            // Combine departureDate and departureTime into a single Date object
            const combinedDepartureDateTime = new Date(`${departureDate}T${departureTime}:00`);
            // Combine departureDate (or arrivalDate) and arrivalTime into a single Date object
            const combinedArrivalDateTime = new Date(`${departureDate}T${arrivalTime}:00`); // Assuming arrival is on the same day for simplicity, adjust if flights can span days

            await axiosInstance.patch(`/flights/${flightID}`, { // Use flightID for patch request
                flightNumber,
                airlineID, // Use airlineID
                departureAirportCode, // Use departureAirportCode
                destinationAirportCode, // Use destinationAirportCode
                departureTime: combinedDepartureDateTime.toISOString(), // Send as ISO string
                arrivalTime: combinedArrivalDateTime.toISOString(), // Send as ISO string
                price: parseFloat(price),
                availableSeats: parseInt(availableSeats, 10) // Use availableSeats
            });
            setMsg("Flight updated successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/flights');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error updating flight:", error);
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
                            <i className="uil uil-plane-fly icon"></i>
                            <div>
                                <h1 className="page-title">Edit Flight</h1>
                                <p className="page-subtitle">Update the flight details below.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateFlight}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="flightNumber" className="form-label">Flight Number</label>
                                        <input
                                            type="text"
                                            name="flightNumber"
                                            id="flightNumber"
                                            placeholder="e.g., GA-123"
                                            className="form-input"
                                            value={flightNumber}
                                            onChange={(e) => setFlightNumber(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="airlineID" className="form-label">Airline</label>
                                                <div className="custom-select-wrapper">
                                                    <select
                                                        name="airlineID"
                                                        id="airlineID"
                                                        className="form-input custom-select"
                                                        value={airlineID}
                                                        onChange={(e) => setAirlineID(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Airline</option>
                                                        {airlines.map((airline) => (
                                                            <option key={airline.airlineID} value={airline.airlineID}>
                                                                {airline.airlineName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="price" className="form-label">Price (IDR)</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    id="price"
                                                    placeholder="e.g., 1500000"
                                                    className="form-input"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="departureAirportCode" className="form-label">Departure Airport</label>
                                                <div className="custom-select-wrapper">
                                                    <select
                                                        name="departureAirportCode"
                                                        id="departureAirportCode"
                                                        className="form-input custom-select"
                                                        value={departureAirportCode}
                                                        onChange={(e) => setDepartureAirportCode(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Departure Airport</option>
                                                        {airports.map((airport) => (
                                                            <option key={airport.airportCode} value={airport.airportCode}>
                                                                {airport.name} ({airport.airportCode})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="destinationAirportCode" className="form-label">Arrival Airport</label>
                                                <div className="custom-select-wrapper">
                                                    <select
                                                        name="destinationAirportCode"
                                                        id="destinationAirportCode"
                                                        className="form-input custom-select"
                                                        value={destinationAirportCode}
                                                        onChange={(e) => setDestinationAirportCode(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select Arrival Airport</option>
                                                        {airports.map((airport) => (
                                                            <option key={airport.airportCode} value={airport.airportCode}>
                                                                {airport.name} ({airport.airportCode})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="departureDate" className="form-label">Departure Date</label>
                                                <input
                                                    type="date"
                                                    name="departureDate"
                                                    id="departureDate"
                                                    className="form-input"
                                                    value={departureDate}
                                                    onChange={(e) => setDepartureDate(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="availableSeats" className="form-label">Capacity</label>
                                                <input
                                                    type="number"
                                                    name="availableSeats"
                                                    id="availableSeats"
                                                    placeholder="e.g., 150"
                                                    className="form-input"
                                                    value={availableSeats}
                                                    onChange={(e) => setAvailableSeats(e.target.value)}
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="departureTime" className="form-label">Departure Time</label>
                                                <input
                                                    type="time"
                                                    name="departureTime"
                                                    id="departureTime"
                                                    className="form-input"
                                                    value={departureTime}
                                                    onChange={(e) => setDepartureTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="arrivalTime" className="form-label">Arrival Time</label>
                                                <input
                                                    type="time"
                                                    name="arrivalTime"
                                                    id="arrivalTime"
                                                    className="form-input"
                                                    value={arrivalTime}
                                                    onChange={(e) => setArrivalTime(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="form-submit-button">
                                            Update Flight
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

export default EditFlight;