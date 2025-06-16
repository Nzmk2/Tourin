import React, { useState } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const AddAirline = () => {
  const [airlineName, setAirlineName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [operatingRegion, setOperatingRegion] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const saveAirline = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await API.post('/airlines', {
        airlineID: uuidv4(), // Generate a UUID for the new airline
        airlineName,
        contactNumber,
        operatingRegion
      });
      navigate('/admin/airlines'); // Redirect to airline list after successful creation
    } catch (error) {
      console.error("Failed to add airline:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to add airline. Please try again.");
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Add New Airline</h1>
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={saveAirline}>
            {error && <div className="notification is-danger">{error}</div>}

            <div className="field">
              <label className="label">Airline Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={airlineName}
                  onChange={(e) => setAirlineName(e.target.value)}
                  placeholder="e.g., Garuda Indonesia"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Contact Number</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g., +628123456789"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Operating Region</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={operatingRegion}
                  onChange={(e) => setOperatingRegion(e.target.value)}
                  placeholder="e.g., Asia"
                />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-primary">Save</button>
              </div>
              <div className="control">
                <button type="button" onClick={() => navigate('/admin/airlines')} className="button is-light">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddAirline;