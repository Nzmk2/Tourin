import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const AddFlight = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [airlineId, setAirlineId] = useState('');
  const [departureAirportId, setDepartureAirportId] = useState('');
  const [arrivalAirportId, setArrivalAirportId] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const airlinesRes = await axiosInstance.get('/airlines');
        setAirlines(airlinesRes.data);
        if (airlinesRes.data.length > 0) {
          setAirlineId(airlinesRes.data[0].id);
        }

        const airportsRes = await axiosInstance.get('/airports');
        setAirports(airportsRes.data);
        if (airportsRes.data.length > 0) {
          setDepartureAirportId(airportsRes.data[0].id);
          setArrivalAirportId(airportsRes.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching airlines/airports:", error);
        setMsg("Failed to load dependencies (airlines/airports).");
      }
    };
    fetchDependencies();
  }, []);

  const saveFlight = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/flights', {
        flightNumber,
        airlineId,
        departureAirportId,
        arrivalAirportId,
        departureDate,
        departureTime,
        arrivalTime,
        price: parseFloat(price),
        capacity: parseInt(capacity, 10)
      });
      navigate('/admin/flights');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Network error or server unavailable.");
      }
      console.error("Error adding flight:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Add New Flight</h1>
      <h2 className="subtitle is-4">Fill in the flight details.</h2>
      <div className="box p-5">
        <p className="has-text-centered has-text-danger-dark mb-4">{msg}</p>
        <form onSubmit={saveFlight}>
          <div className="field">
            <label className="label">Flight Number</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g., GA-123"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Airline</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={airlineId} onChange={(e) => setAirlineId(e.target.value)}>
                  <option value="">Select Airline</option>
                  {airlines.map((airline) => (
                    <option key={airline.id} value={airline.id}>
                      {airline.name} ({airline.iataCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Departure Airport</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={departureAirportId} onChange={(e) => setDepartureAirportId(e.target.value)}>
                  <option value="">Select Departure Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.name} ({airport.iataCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Arrival Airport</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={arrivalAirportId} onChange={(e) => setArrivalAirportId(e.target.value)}>
                  <option value="">Select Arrival Airport</option>
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      {airport.name} ({airport.iataCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Departure Date</label>
            <div className="control">
              <input
                type="date"
                className="input"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Departure Time</label>
            <div className="control">
              <input
                type="time"
                className="input"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Arrival Time</label>
            <div className="control">
              <input
                type="time"
                className="input"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Price (IDR)</label>
            <div className="control">
              <input
                type="number"
                className="input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 1500000"
                min="0"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Capacity</label>
            <div className="control">
              <input
                type="number"
                className="input"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g., 150"
                min="1"
              />
            </div>
          </div>

          <div className="field mt-4">
            <div className="control">
              <button type="submit" className="button is-success">Save Flight</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddFlight;