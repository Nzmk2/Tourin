import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to load bookings. Network error or server unavailable.");
      }
      console.error("Error fetching bookings:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      setMsg("Booking deleted successfully!");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to delete booking. Network error or server unavailable.");
      }
      console.error("Error deleting booking:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'has-text-warning';
      case 'confirmed': return 'has-text-success';
      case 'cancelled': return 'has-text-danger';
      default: return '';
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Booking Management</h1>
      <h2 className="subtitle is-4">Manage all flight bookings.</h2>

      <div className="container mt-5">
        <div className="columns">
          <div className="column is-full">
            <Link to="/admin/bookings/add" className="button is-primary mb-3">Add New Booking</Link> {/* New Button */}
            {msg && <div className="notification is-light is-info">{msg}</div>}
            <div className="table-container">
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Booking Number</th>
                    <th>User Email</th>
                    <th>Flight Number</th>
                    <th>Booking Date</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.bookingNumber}</td>
                      <td>{booking.user?.email || 'N/A'}</td>
                      <td>{booking.flight?.flightNumber || 'N/A'}</td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(booking.totalPrice)}</td>
                      <td className={getStatusColor(booking.status)}>{booking.status}</td>
                      <td>
                        <Link to={`/admin/bookings/edit/${booking.id}`} className="button is-small is-info mr-2">Edit</Link>
                        <button onClick={() => deleteBooking(booking.id)} className="button is-small is-danger">Delete</button>
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

export default BookingManagement;