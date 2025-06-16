import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const AirlineManagement = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAirlines();
  }, []);

  const getAirlines = async () => {
    try {
      setLoading(true);
      const response = await API.get('/airlines');
      setAirlines(response.data);
    } catch (error) {
      console.error("Failed to fetch airlines:", error);
      setError("Failed to load airlines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAirline = async (airlineId) => {
    if (window.confirm("Are you sure you want to delete this airline? This action cannot be undone.")) {
      try {
        await API.delete(`/airlines/${airlineId}`);
        getAirlines(); // Refresh the list
        alert("Airline deleted successfully!");
      } catch (error) {
        console.error("Failed to delete airline:", error);
        alert("Failed to delete airline: " + (error.response?.data?.msg || error.message));
      }
    }
  };

  if (loading) return <Layout><p>Loading airlines...</p></Layout>;
  if (error) return <Layout><p className="has-text-danger">{error}</p></Layout>;

  return (
    <Layout>
      <h1 className="title is-2">Airline Management</h1>
      <Link to="/admin/airlines/add" className="button is-primary mb-3">Add New Airline</Link>
      <div className="table-container">
        <table className="table is-striped is-fullwidth is-hoverable">
          <thead>
            <tr>
              <th>No</th>
              <th>Airline ID</th>
              <th>Airline Name</th>
              <th>Contact Number</th>
              <th>Operating Region</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {airlines.length > 0 ? (
              airlines.map((airline, index) => (
                <tr key={airline.airlineID}>
                  <td>{index + 1}</td>
                  <td>{airline.airlineID}</td>
                  <td>{airline.airlineName}</td>
                  <td>{airline.contactNumber}</td>
                  <td>{airline.operatingRegion}</td>
                  <td>
                    <Link to={`/admin/airlines/edit/${airline.airlineID}`} className="button is-small is-info mr-2">Edit</Link>
                    <button onClick={() => deleteAirline(airline.airlineID)} className="button is-small is-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="has-text-centered">No airlines found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AirlineManagement;