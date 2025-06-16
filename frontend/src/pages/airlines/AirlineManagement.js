import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

const AirlineManagement = () => {
  const [airlines, setAirlines] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAirlines();
  }, []);

  const getAirlines = async () => {
    try {
      const response = await axiosInstance.get('/airlines');
      setAirlines(response.data);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to load airlines. Network error or server unavailable.");
      }
      console.error("Error fetching airlines:", error);
    }
  };

  const deleteAirline = async (airlineId) => {
    if (!window.confirm("Are you sure you want to delete this airline?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/airlines/${airlineId}`);
      getAirlines();
      setMsg("Airline deleted successfully!");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to delete airline. Network error or server unavailable.");
      }
      console.error("Error deleting airline:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Airline Management</h1>
      <h2 className="subtitle is-4">Manage all airline information.</h2>

      <div className="container mt-5">
        <div className="columns">
          <div className="column is-full">
            <Link to="/admin/airlines/add" className="button is-primary mb-3">Add New Airline</Link>
            {msg && <div className="notification is-light is-info">{msg}</div>}
            <div className="table-container">
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>IATA Code</th>
                    <th>ICAO Code</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airlines.map((airline, index) => (
                    <tr key={airline.id}>
                      <td>{index + 1}</td>
                      <td>{airline.name}</td>
                      <td>{airline.iataCode}</td>
                      <td>{airline.icaoCode}</td>
                      <td>{airline.country}</td>
                      <td>
                        <Link to={`/admin/airlines/edit/${airline.id}`} className="button is-small is-info mr-2">Edit</Link>
                        <button onClick={() => deleteAirline(airline.id)} className="button is-small is-danger">Delete</button>
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

export default AirlineManagement;