import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';

const EditAirline = () => {
  const [name, setName] = useState('');
  const [iataCode, setIataCode] = useState('');
  const [icaoCode, setIcaoCode] = useState('');
  const [country, setCountry] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getAirlineById = async () => {
      try {
        const response = await axiosInstance.get(`/airlines/${id}`);
        const airlineData = response.data;
        setName(airlineData.name);
        setIataCode(airlineData.iataCode);
        setIcaoCode(airlineData.icaoCode);
        setCountry(airlineData.country);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Network error or server unavailable.");
        }
        console.error("Error fetching airline data for edit:", error);
      }
    };
    getAirlineById();
  }, [id]);

  const updateAirline = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/airlines/${id}`, {
        name,
        iataCode,
        icaoCode,
        country
      });
      navigate('/admin/airlines');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Network error or server unavailable.");
      }
      console.error("Error updating airline:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Edit Airline</h1>
      <h2 className="subtitle is-4">Update airline details.</h2>
      <div className="box p-5">
        <p className="has-text-centered has-text-danger-dark mb-4">{msg}</p>
        <form onSubmit={updateAirline}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Airline Name"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">IATA Code</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={iataCode}
                onChange={(e) => setIataCode(e.target.value)}
                placeholder="Two-letter IATA Code (e.g., GA)"
                maxLength="2"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">ICAO Code</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={icaoCode}
                onChange={(e) => setIcaoCode(e.target.value)}
                placeholder="Three-letter ICAO Code (e.g., GIA)"
                maxLength="3"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Country</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country of origin (e.g., Indonesia)"
              />
            </div>
          </div>

          <div className="field mt-4">
            <div className="control">
              <button type="submit" className="button is-success">Update Airline</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditAirline;