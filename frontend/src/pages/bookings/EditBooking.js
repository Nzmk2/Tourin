import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';

const EditBooking = () => {
  const [bookingNumber, setBookingNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [flightId, setFlightId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const [users, setUsers] = useState([]);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchBookingAndDependencies = async () => {
      try {
        const usersRes = await axiosInstance.get('/users');
        setUsers(usersRes.data);
        const flightsRes = await axiosInstance.get('/flights');
        setFlights(flightsRes.data);

        const response = await axiosInstance.get(`/bookings/${id}`);
        const bookingData = response.data;
        setBookingNumber(bookingData.bookingNumber);
        setUserId(bookingData.userId);
        setFlightId(bookingData.flightId);
        setBookingDate(bookingData.bookingDate.split('T')[0]);
        setTotalPrice(bookingData.totalPrice);
        setStatus(bookingData.status);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Network error or server unavailable.");
        }
        console.error("Error fetching booking data for edit:", error);
      }
    };
    fetchBookingAndDependencies();
  }, [id]);

  const updateBooking = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/bookings/${id}`, {
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
      console.error("Error updating booking:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Edit Booking</h1>
      <h2 className="subtitle is-4">Update booking details.</h2>
      <div className="box p-5">
        <p className="has-text-centered has-text-danger-dark mb-4">{msg}</p>
        <form onSubmit={updateBooking}>
          <div className="field">
            <label className="label">Booking Number</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={bookingNumber}
                readOnly
              />
            </div>
          </div>

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
                      {flight.flightNumber} ({new Date(flight.departureDate).toLocaleDateString()})
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
                placeholder="Total Price"
                min="0"
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
              <button type="submit" className="button is-success">Update Booking</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditBooking;