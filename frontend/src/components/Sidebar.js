import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="menu p-4">
      <p className="menu-label">
        General
      </p>
      <ul className="menu-list">
        <li><NavLink to="/admin">Dashboard</NavLink></li>
      </ul>
      {user && user.role === 'admin' && (
        <>
          <p className="menu-label">
            Administration
          </p>
          <ul className="menu-list">
            <li><NavLink to="/admin/users">Users</NavLink></li>
            <li><NavLink to="/admin/airlines">Airlines</NavLink></li>
            <li><NavLink to="/admin/airports">Airports</NavLink></li>
            <li><NavLink to="/admin/flights">Flights</NavLink></li>
            <li><NavLink to="/admin/bookings">Bookings</NavLink></li>
            <li><NavLink to="/admin/payments">Payments</NavLink></li>
          </ul>
        </>
      )}
      {/* Anda bisa menambahkan menu untuk role 'user' di sini jika ada */}
      {/* Ini adalah contoh, Anda mungkin ingin membuat dashboard terpisah untuk user normal */}
      {/* {user && user.role === 'user' && (
        <>
          <p className="menu-label">
            User Actions
          </p>
          <ul className="menu-list">
            <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
            <li><NavLink to="/search-flights">Search Flights</NavLink></li>
          </ul>
        </>
      )} */}
    </aside>
  );
};

export default Sidebar;