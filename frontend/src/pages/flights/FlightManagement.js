import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

const FlightManagement = () => {
  const [flights, setFlights] = useState([]);
  const [msg, setMsg] = useState('');
  const [airlines, setAirlines] = useState({});
  const [airports, setAirports] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flightsRes = await axiosInstance.get('/flights');
        setFlights(flightsRes.data);

        const airlinesRes = await axiosInstance.get('/airlines');
        const airlineMap = airlinesRes.data.reduce((acc, airline) => {
          acc[airline.id] = airline.name;
          return acc;
        }, {});
        setAirlines(airlineMap);

        const airportsRes = await axiosInstance.get('/airports');
        const airportMap = airportsRes.data.reduce((acc, airport) => {
          acc[airport.id] = airport.name;
          return acc;
        }, {});
        setAirports(airportMap);

      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Failed to load data. Network error or server unavailable.");
        }
        console.error("Error fetching flight data:", error);
      }
    };

    fetchData();
  }, []);

  const deleteFlight = async (flightId) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/flights/${flightId}`);
      setFlights(flights.filter(flight => flight.id !== flightId));
      setMsg("Flight deleted successfully!");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to delete flight. Network error or server unavailable.");
      }
      console.error("Error deleting flight:", error);
    }
  };

  // Corrected formatTime function
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    // Use a template literal to correctly interpolate hours and minutes
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <Layout>
      <h1 className="title is-2">Flight Management</h1>
      <h2 className="subtitle is-4">Manage all flight schedules.</h2>

      <div className="container mt-5">
        <div className="columns">
          <div className="column is-full">
            <Link to="/admin/flights/add" className="button is-primary mb-3">Add New Flight</Link>
            {msg && <div className="notification is-light is-info">{msg}</div>}
            <div className="table-container">
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Flight Number</th>
                    <th>Airline</th>
                    <th>Departure Airport</th>
                    <th>Arrival Airport</th>
                    <th>Departure Date</th>
                    <th>Departure Time</th>
                    <th>Arrival Time</th>
                    <th>Price</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((flight, index) => (
                    <tr key={flight.id}>
                      <td>{index + 1}</td>
                      <td>{flight.flightNumber}</td>
                      <td>{airlines[flight.airlineId] || 'N/A'}</td>
                      <td>{airports[flight.departureAirportId] || 'N/A'}</td>
                      <td>{airports[flight.arrivalAirportId] || 'N/A'}</td>
                      <td>{new Date(flight.departureDate).toLocaleDateString()}</td>
                      <td>{formatTime(flight.departureTime)}</td>
                      <td>{formatTime(flight.arrivalTime)}</td>
                      <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(flight.price)}</td>
                      <td>{flight.capacity}</td>
                      <td>
                        <Link to={`/admin/flights/edit/${flight.id}`} className="button is-small is-info mr-2">Edit</Link>
                        <button onClick={() => deleteFlight(flight.id)} className="button is-small is-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FlightManagement;