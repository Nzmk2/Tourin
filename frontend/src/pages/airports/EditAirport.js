import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';

const EditAirport = () => {
  const [name, setName] = useState('');
  const [iataCode, setIataCode] = useState('');
  const [icaoCode, setIcaoCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getAirportById = async () => {
      try {
        const response = await axiosInstance.get(`/airports/${id}`);
        const airportData = response.data;
        setName(airportData.name);
        setIataCode(airportData.iataCode);
        setIcaoCode(airportData.icaoCode);
        setCity(airportData.city);
        setCountry(airportData.country);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Network error or server unavailable.");
        }
        console.error("Error fetching airport data for edit:", error);
      }
    };
    getAirportById();
  }, [id]);

  const updateAirport = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/airports/${id}`, {
        name,
        iataCode,
        icaoCode,
        city,
        country
      });
      navigate('/admin/airports');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Network error or server unavailable.");
      }
      console.error("Error updating airport:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Edit Airport</h1>
      <h2 className="subtitle is-4">Update airport details.</h2>
      <div className="box p-5">
        <p className="has-text-centered has-text-danger-dark mb-4">{msg}</p>
        <form onSubmit={updateAirport}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Airport Name (e.g., Soekarno-Hatta International Airport)"
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
                placeholder="Three-letter IATA Code (e.g., CGK)"
                maxLength="3"
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
                placeholder="Four-letter ICAO Code (e.g., WIII)"
                maxLength="4"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">City</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g., Jakarta)"
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
                placeholder="Country (e.g., Indonesia)"
              />
            </div>
          </div>

          <div className="field mt-4">
            <div className="control">
              <button type="submit" className="button is-success">Update Airport</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditAirport;