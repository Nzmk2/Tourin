import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const AddBooking = () => {
  const [userId, setUserId] = useState('');
  const [flightId, setFlightId] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [totalPrice, setTotalPrice] = useState('');
  const [status, setStatus] = useState('pending'); // Default status
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const usersRes = await axiosInstance.get('/users');
        setUsers(usersRes.data);
        if (usersRes.data.length > 0) {
          setUserId(usersRes.data[0].id); // Set default user
        }

        const flightsRes = await axiosInstance.get('/flights');
        setFlights(flightsRes.data);
        if (flightsRes.data.length > 0) {
          setFlightId(flightsRes.data[0].id); // Set default flight
        }
      } catch (error) {
        console.error("Error fetching dependencies (users/flights):", error);
        setMsg("Failed to load users or flights for selection.");
      }
    };
    fetchDependencies();
  }, []);

  const saveBooking = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/bookings', {
        userId,
        flightId,
        bookingDate,
        totalPrice: parseFloat(totalPrice),
        status
      });
      navigate('/admin/bookings');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Network error or server unavailable.");
      }
      console.error("Error adding booking:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Add New Booking</h1>
      <h2 className="subtitle is-4">Fill in the booking details.</h2>
      <div className="box p-5">
        <p className="has-text-centered has-text-danger-dark mb-4">{msg}</p>
        <form onSubmit={saveBooking}>
          <div className="field">
            <label className="label">User</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={userId} onChange={(e) => setUserId(e.target.value)}>
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.email} ({user.firstName} {user.lastName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Flight</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={flightId} onChange={(e) => setFlightId(e.target.value)}>
                  <option value="">Select Flight</option>
                  {flights.map(flight => (
                    <option key={flight.id} value={flight.id}>
                      {flight.flightNumber} - {new Date(flight.departureDate).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Booking Date</label>
            <div className="control">
              <input
                type="date"
                className="input"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Total Price (IDR)</label>
            <div className="control">
              <input
                type="number"
                className="input"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="e.g., 1500000"
                min="0"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Status</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field mt-4">
            <div className="control">
              <button type="submit" className="button is-success">Save Booking</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddBooking;