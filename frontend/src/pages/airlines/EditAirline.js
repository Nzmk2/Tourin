import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

const EditAirline = () => {
  const [airlineName, setAirlineName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [operatingRegion, setOperatingRegion] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the airlineID from the URL

  useEffect(() => {
    getAirlineById();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getAirlineById = async () => {
    try {
      const response = await API.get(`/airlines/${id}`);
      setAirlineName(response.data.airlineName);
      setContactNumber(response.data.contactNumber);
      setOperatingRegion(response.data.operatingRegion);
    } catch (error) {
      console.error("Failed to fetch airline:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to load airline data.");
    }
  };

  const updateAirline = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await API.patch(`/airlines/${id}`, {
        airlineName,
        contactNumber,
        operatingRegion
      });
      navigate('/admin/airlines');
    } catch (error) {
      console.error("Failed to update airline:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to update airline. Please try again.");
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Edit Airline</h1>
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={updateAirline}>
            {error && <div className="notification is-danger">{error}</div>}

            <div className="field">
              <label className="label">Airline ID</label>
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
                <button type="submit" className="button is-primary">Update</button>
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

export default EditAirline;