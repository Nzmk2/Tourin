import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../auth/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <h1 className="title is-2">Dashboard</h1>
      <h2 className="subtitle is-4">
        Welcome back, <span className="has-text-info">{user?.firstName || 'Admin'}</span>!
      </h2>
      <div className="columns mt-5">
        <div className="column is-one-third">
          <div className="box has-background-primary-light has-text-primary-dark has-text-centered p-5">
            <p className="title is-4">Users</p>
            <p className="subtitle is-6">Manage all user accounts.</p>
            <p className="icon is-large"><i className="fas fa-users fa-3x"></i></p>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box has-background-link-light has-text-link-dark has-text-centered p-5">
            <p className="title is-4">Flights</p>
            <p className="subtitle is-6">View and update flight schedules.</p>
            <p className="icon is-large"><i className="fas fa-plane fa-3x"></i></p>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box has-background-warning-light has-text-warning-dark has-text-centered p-5">
            <p className="title is-4">Bookings</p>
            <p className="subtitle is-6">Handle flight reservations.</p>
            <p className="icon is-large"><i className="fas fa-ticket-alt fa-3x"></i></p>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-one-third">
          <div className="box has-background-success-light has-text-success-dark has-text-centered p-5">
            <p className="title is-4">Airlines</p>
            <p className="subtitle is-6">Add and manage airlines.</p>
            <p className="icon is-large"><i className="fas fa-plane-departure fa-3x"></i></p>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box has-background-danger-light has-text-danger-dark has-text-centered p-5">
            <p className="title is-4">Airports</p>
            <p className="subtitle is-6">Manage airport information.</p>
            <p className="icon is-large"><i className="fas fa-building fa-3x"></i></p>
          </div>
        </div>
        <div className="column is-one-third">
          <div className="box has-background-info-light has-text-info-dark has-text-centered p-5">
            <p className="title is-4">Payments</p>
            <p className="subtitle is-6">Review payment transactions.</p>
            <p className="icon is-large"><i className="fas fa-money-check-alt fa-3x"></i></p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;