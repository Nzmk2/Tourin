import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';

// Pages
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

// User Management
import UserManagement from './pages/admin/users/UserManagement';
import AddUser from './pages/admin/users/AddUser';
import EditUser from './pages/admin/users/EditUser';

// Airline Management
import AirlineManagement from './pages/admin/airlines/AirlineManagement';
import AddAirline from './pages/admin/airlines/AddAirline';
import EditAirline from './pages/admin/airlines/EditAirline';

// Airport Management
import AirportManagement from './pages/admin/airports/AirportManagement';
import AddAirport from './pages/admin/airports/AddAirport';
import EditAirport from './pages/admin/airports/EditAirport';

// Flight Management
import FlightManagement from './pages/admin/flights/FlightManagement';
import AddFlight from './pages/admin/flights/AddFlight';
import EditFlight from './pages/admin/flights/EditFlight';

// Booking Management
import BookingManagement from './pages/admin/bookings/BookingManagement';
import AddBooking from './pages/admin/bookings/AddBooking';
import EditBooking from './pages/admin/bookings/EditBooking';

// Payment Management
import PaymentManagement from './pages/admin/payments/PaymentManagement';
import AddPayment from './pages/admin/payments/AddPayment';
import EditPayment from './pages/admin/payments/EditPayment';

// Destination Management
import DestinationManagement from './pages/admin/destinations/DestinationManagement';
import AddDestination from './pages/admin/destinations/AddDestination';
import EditDestination from './pages/admin/destinations/EditDestination';

// Package Management
import PackageManagement from './pages/admin/packages/PackageManagement';
import AddPackage from './pages/admin/packages/AddPackage';
import EditPackage from './pages/admin/packages/EditPackage';

import Utama from './pages/dashboard/Utama';
import FlightSearchPage from './pages/pencarian/FlightSearchPage';
import Pilihan from './pages/transaksi/pilihan';
import Transaksi from './pages/transaksi/transaksi';

// Current Date and Time: 2025-06-18 16:35:11
// Current User's Login: Nzmk2

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Utama />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/flight" element={<FlightSearchPage />} />
          <Route path="/flight/choose" element={<Pilihan />} />
          <Route path="/flight/choose/transaksi" element={<Transaksi />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Management */}
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

          {/* Airline Management */}
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

          {/* Airport Management */}
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

          {/* Flight Management */}
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

          {/* Booking Management */}
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

          {/* Payment Management */}
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PaymentManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditPayment />
              </ProtectedRoute>
            }
          />

          {/* Destination Management */}
          <Route
            path="/admin/destinations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DestinationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/destinations/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddDestination />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/destinations/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditDestination />
              </ProtectedRoute>
            }
          />

          {/* Package Management */}
          <Route
            path="/admin/packages"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PackageManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddPackage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/packages/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditPackage />
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