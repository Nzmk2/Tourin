import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../auth/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth(); // Get user info from context

  return (
    <Layout>
      <h1 className="title is-2">Welcome to Admin Dashboard, {user?.firstName}!</h1>
      <p className="subtitle is-4">Manage your flight booking system here.</p>

      <div className="columns is-multiline mt-5">
        <div className="column is-one-third">
          <div className="box">
            <p className="title is-5">Users</p>
            <p className="subtitle is-6">Manage user accounts, roles, and profiles.</p>
            <a href="/admin/users" className="button is-info is-small">Go to Users</a>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box">
            <p className="title is-5">Airlines</p>
            <p className="subtitle is-6">Add, edit, or remove airline information.</p>
            <a href="/admin/airlines" className="button is-info is-small">Go to Airlines</a>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box">
            <p className="title is-5">Airports</p>
            <p className="subtitle is-6">Manage airport details and facilities.</p>
            <a href="/admin/airports" className="button is-info is-small">Go to Airports</a>
          </div>
        </div>
        {/* Add more dashboard cards for other entities */}
        <div className="column is-one-third">
          <div className="box">
            <p className="title is-5">Flights</p>
            <p className="subtitle is-6">Manage flight schedules and availability.</p>
            <a href="/admin/flights" className="button is-info is-small">Go to Flights</a>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box">
            <p className="title is-5">Bookings</p>
            <p className="subtitle is-6">Oversee flight bookings and reservations.</p>
            <a href="/admin/bookings" className="button is-info is-small">Go to Bookings</a>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box">
            <p className="title is-5">Payments</p>
            <p className="subtitle is-6">Track payment transactions.</p>
            <a href="/admin/payments" className="button is-info is-small">Go to Payments</a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;