import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

const AirportManagement = () => {
  const [airports, setAirports] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAirports();
  }, []);

  const getAirports = async () => {
    try {
      const response = await axiosInstance.get('/airports');
      setAirports(response.data);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to load airports. Network error or server unavailable.");
      }
      console.error("Error fetching airports:", error);
    }
  };

  const deleteAirport = async (airportId) => {
    if (!window.confirm("Are you sure you want to delete this airport?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/airports/${airportId}`);
      getAirports();
      setMsg("Airport deleted successfully!");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to delete airport. Network error or server unavailable.");
      }
      console.error("Error deleting airport:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Airport Management</h1>
      <h2 className="subtitle is-4">Manage all airport details.</h2>

      <div className="container mt-5">
        <div className="columns">
          <div className="column is-full">
            <Link to="/admin/airports/add" className="button is-primary mb-3">Add New Airport</Link>
            {msg && <div className="notification is-light is-info">{msg}</div>}
            <div className="table-container">
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>IATA Code</th>
                    <th>ICAO Code</th>
                    <th>City</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airports.map((airport, index) => (
                    <tr key={airport.id}>
                      <td>{index + 1}</td>
                      <td>{airport.name}</td>
                      <td>{airport.iataCode}</td>
                      <td>{airport.icaoCode}</td>
                      <td>{airport.city}</td>
                      <td>{airport.country}</td>
                      <td>
                        <Link to={`/admin/airports/edit/${airport.id}`} className="button is-small is-info mr-2">Edit</Link>
                        <button onClick={() => deleteAirport(airport.id)} className="button is-small is-danger">Delete</button>
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

export default AirportManagement;