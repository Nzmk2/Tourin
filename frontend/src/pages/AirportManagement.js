import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const AirportManagement = () => {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAirports();
  }, []);

  const getAirports = async () => {
    try {
      setLoading(true);
      const response = await API.get('/airports');
      setAirports(response.data);
    } catch (error) {
      console.error("Failed to fetch airports:", error);
      setError("Failed to load airports. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAirport = async (airportCode) => {
    if (window.confirm("Are you sure you want to delete this airport? This action cannot be undone.")) {
      try {
        await API.delete(`/airports/${airportCode}`);
        getAirports(); // Refresh the list
        alert("Airport deleted successfully!");
      } catch (error) {
        console.error("Failed to delete airport:", error);
        alert("Failed to delete airport: " + (error.response?.data?.msg || error.message));
      }
    }
  };

  if (loading) return <Layout><p>Loading airports...</p></Layout>;
  if (error) return <Layout><p className="has-text-danger">{error}</p></Layout>;

  return (
    <Layout>
      <h1 className="title is-2">Airport Management</h1>
      <Link to="/admin/airports/add" className="button is-primary mb-3">Add New Airport</Link>
      <div className="table-container">
        <table className="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>No</th>
              <th>Airport Code</th>
              <th>Airport Name</th>
              <th>Facilities</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {airports.length > 0 ? (
              airports.map((airport, index) => (
                <tr key={airport.airportCode}>
                  <td>{index + 1}</td>
                  <td>{airport.airportCode}</td>
                  <td>{airport.airportName}</td>
                  <td>{airport.facilities}</td>
                  <td>{airport.location}</td>
                  <td>
                    <Link to={`/admin/airports/edit/${airport.airportCode}`} className="button is-small is-info mr-2">Edit</Link>
                    <button onClick={() => deleteAirport(airport.airportCode)} className="button is-small is-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="has-text-centered">No airports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AirportManagement;