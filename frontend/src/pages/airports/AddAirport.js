import React, { useState } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddAirport = () => {
  const [airportCode, setAirportCode] = useState(''); // User inputs custom code
  const [airportName, setAirportName] = useState('');
  const [facilities, setFacilities] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const saveAirport = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await API.post('/airports', {
        airportCode, // Use the code provided by the user
        airportName,
        facilities,
        location
      });
      navigate('/admin/airports');
    } catch (error) {
      console.error("Failed to add airport:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to add airport. Please try again.");
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Add New Airport</h1>
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={saveAirport}>
            {error && <div className="notification is-danger">{error}</div>}

            <div className="field">
              <label className="label">Airport Code</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={airportCode}
                  onChange={(e) => setAirportCode(e.target.value.toUpperCase())} // Convert to uppercase for codes
                  placeholder="e.g., CGK, SIN"
                  maxLength="3" // Common max length for airport codes
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Airport Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={airportName}
                  onChange={(e) => setAirportName(e.target.value)}
                  placeholder="e.g., Soekarno-Hatta International Airport"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Facilities</label>
              <div className="control">
                <textarea
                  className="textarea"
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  placeholder="e.g., WiFi, Restaurants, Lounges"
                ></textarea>
              </div>
            </div>

            <div className="field">
              <label className="label">Location</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Jakarta, Indonesia"
                />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-primary">Save</button>
              </div>
              <div className="control">
                <button type="button" onClick={() => navigate('/admin/airports')} className="button is-light">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddAirport;