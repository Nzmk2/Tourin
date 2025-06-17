import React, { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AddUser from './pages/users/AddUser'; // NEW Import
import EditUser from './pages/users/EditUser'; // NEW Import
import AirlineManagement from './pages/AirlineManagement';
import AddAirline from './pages/airlines/AddAirline';
import EditAirline from './pages/airlines/EditAirline';
import AirportManagement from './pages/AirportManagement';
import AddAirport from './pages/airports/AddAirport';
import EditAirport from './pages/airports/EditAirport';
import NotFound from './pages/NotFound';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

import Utama from './pages/dashboard/Utama';
import FlightSearchPage from './pages/Pencarian/FlightSearchPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Wrap your routes with AuthProvider */}
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Utama />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/flights" element={<FlightSearchPage />} />


          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin" />}>
            <Route index element={<AdminDashboard />} /> {/* Admin Dashboard */}
            {/* User Routes */}
            <Route path="users" element={<UserManagement />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="users/edit/:id" element={<EditUser />} />
            {/* Airline Routes */}
            <Route path="airlines" element={<AirlineManagement />} />
            <Route path="airlines/add" element={<AddAirline />} />
            <Route path="airlines/edit/:id" element={<EditAirline />} />
            {/* Airport Routes */}
            <Route path="airports" element={<AirportManagement />} />
            <Route path="airports/add" element={<AddAirport />} />
            <Route path="airports/edit/:id" element={<EditAirport />} />
            {/* Tambahkan rute-rute admin-spesifik lainnya di sini (Flights, Bookings, Payments, dll.) */}
          </Route>

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;