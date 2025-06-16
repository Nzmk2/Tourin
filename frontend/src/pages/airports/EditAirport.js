import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

const EditAirport = () => {
  // airportCode will be from params, so no state for it
  const [airportName, setAirportName] = useState('');
  const [facilities, setFacilities] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the airportCode from the URL

  useEffect(() => {
    getAirportById();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAirportById = async () => {
    try {
      const response = await API.get(`/airports/${id}`);
      setAirportName(response.data.airportName);
      setFacilities(response.data.facilities);
      setLocation(response.data.location);
    } catch (error) {
      console.error("Failed to fetch airport:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to load airport data.");
    }
  };

  const updateAirport = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await API.patch(`/airports/${id}`, {
        airportName,
        facilities,
        location
      });
      navigate('/admin/airports');
    } catch (error) {
      console.error("Failed to update airport:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to update airport. Please try again.");
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Edit Airport</h1>
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={updateAirport}>
            {error && <div className="notification is-danger">{error}</div>}

            <div className="field">
              <label className="label">Airport Code</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={id} // Display the ID, but keep it read-only
                  disabled
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
                <button type="submit" className="button is-primary">Update</button>
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

export default EditAirport;