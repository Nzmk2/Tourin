import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext'; // <-- IMPORTANT: Make sure this import is here

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// User Management
import UserManagement from './pages/users/UserManagement';
import AddUser from './pages/users/AddUser';
import EditUser from './pages/users/EditUser';

// Airline Management
import AirlineManagement from './pages/airlines/AirlineManagement';
import AddAirline from './pages/airlines/AddAirline';
import EditAirline from './pages/airlines/EditAirline';

// Airport Management
import AirportManagement from './pages/airports/AirportManagement';
import AddAirport from './pages/airports/AddAirport';
import EditAirport from './pages/airports/EditAirport';

// Flight Management
import FlightManagement from './pages/flights/FlightManagement';
import AddFlight from './pages/flights/AddFlight';
import EditFlight from './pages/flights/EditFlight';

// Booking Management
import BookingManagement from './pages/bookings/BookingManagement';
import AddBooking from './pages/bookings/AddBooking';
import EditBooking from './pages/bookings/EditBooking';

// Payment Management
import PaymentManagement from './pages/payments/PaymentManagement';

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider MUST wrap the content that uses router hooks (like useNavigate) */}
      {/* This means AuthProvider should be INSIDE BrowserRouter */}
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airlines"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AirlineManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airlines/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddAirline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airlines/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditAirline />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AirportManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airports/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddAirport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airports/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditAirport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/flights"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FlightManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/flights/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddFlight />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/flights/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditFlight />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BookingManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PaymentManagement />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;