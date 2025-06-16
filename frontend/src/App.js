import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext'; // <-- IMPORTANT: Make sure this import is here

// Pages
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

// User Management
import UserManagement from './pages/users/UserManagement';
import AddUser from './pages/users/AddUser';
import EditUser from './pages/users/EditUser';

// Airline Management
import AirlineManagement from './pages/airlines/AirlineManagement';
import AddAirline from './pages/airlines/AddAirline'; // Assuming you have this component for adding
import EditAirline from './pages/airlines/EditAirline'; // Assuming you have this component for editing

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
      {/* AuthProvider HARUS membungkus konten yang menggunakan router hooks (seperti useNavigate) */}
      {/* Ini berarti AuthProvider harus berada DI DALAM BrowserRouter */}
      <AuthProvider>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rute Terlindungi Admin */}
          {/* Rute spesifik untuk /admin/dashboard - Penting untuk tautan langsung */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          {/* Rute umum /admin - juga mengarah ke AdminDashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Manajemen Pengguna */}
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

          {/* Manajemen Maskapai */}
          <Route
            path="/admin/airlines"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AirlineManagement /> {/* Jika AirlineManagement adalah daftar/tabel */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airlines/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddAirline /> {/* Ini adalah rute untuk komponen form penambahan */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/airlines/edit/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <EditAirline /> {/* Ini adalah rute untuk komponen form pengeditan */}
              </ProtectedRoute>
            }
          />

          {/* Manajemen Bandara */}
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

          {/* Manajemen Penerbangan */}
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

          {/* Manajemen Pemesanan */}
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

          {/* Manajemen Pembayaran */}
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PaymentManagement />
              </ProtectedRoute>
            }
          />

          {/* Rute Catch-all untuk 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
