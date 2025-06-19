import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import Barcode from 'react-barcode'; 
import html2pdf from 'html2pdf.js';
import './transaksi.css';

const Transaksi = () => {
  const { isAuthenticated } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingID, bookingDetails } = location.state || {};
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (bookingDetails) {
      setBookingData(bookingDetails);
      setLoading(false);
    } else if (bookingID) {
      fetchBookingData();
    } else {
      setError('No booking data available');
      setLoading(false);
    }
  }, [bookingID, bookingDetails, isAuthenticated, navigate]);

  const fetchBookingData = async () => {
    try {
      const response = await axiosInstance.get(`/api/bookings/${bookingID}`);
      setBookingData(transformBookingData(response.data));
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError(err.response?.data?.msg || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk generate random gate
  const generateRandomGate = () => {
    const gates = ['A', 'B', 'C', 'D'];
    const number = Math.floor(Math.random() * 20) + 1;
    return `${gates[Math.floor(Math.random() * gates.length)]}${number}`;
  };

  // Fungsi untuk generate random terminal
  const generateRandomTerminal = () => {
    const terminals = ['1', '2', '3'];
    return terminals[Math.floor(Math.random() * terminals.length)];
  };

  // Fungsi untuk generate random seat
  const generateRandomSeat = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const number = Math.floor(Math.random() * 30) + 1;
    return `${number}${rows[Math.floor(Math.random() * rows.length)]}`;
  };

  // Update fungsi transformBookingData
  const transformBookingData = (data) => {
    try {
      // Generate nilai random di awal
      const gate = generateRandomGate();
      const terminal = generateRandomTerminal(); 
      const seatNumber = generateRandomSeat();

      const transformedData = {
        bookingId: `BK-${data.bookingID.toString().padStart(6, '0')}`,
        userId: `USR-${data.userID}`,
        flightId: `FL-${data.flightID}`,
        airline: data.Flight?.Airline?.name || 'TBA',
        airlineLogo: data.Flight?.Airline?.logoUrl,
        flightNumber: data.Flight?.flightNumber || 'TBA',
        departureTime: data.Flight?.departureTime
          ? new Date(data.Flight.departureTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          : 'TBA',
        arrivalTime: data.Flight?.arrivalTime
          ? new Date(data.Flight.arrivalTime).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          : 'TBA',
        // Gunakan nilai random yang sudah di-generate
        gate: gate,
        terminal: terminal,
        seatNumber: seatNumber,
        departureAirport: {
          code: data.Flight?.DepartureAirport?.code || 'TBA',
          name: data.Flight?.DepartureAirport?.name || 'TBA'
        },
        arrivalAirport: {
          code: data.Flight?.DestinationAirport?.code || 'TBA',
          name: data.Flight?.DestinationAirport?.name || 'TBA'
        },
        bookingDate: new Date(data.bookingDate).toLocaleDateString(),
        bookingTime: new Date(data.bookingDate).toLocaleTimeString(),
        passengerName: data.User
          ? `${data.User.firstName} ${data.User.lastName || ''}`
          : 'Guest',
        seatClass: 'Economy Class',
        totalPrice: parseFloat(data.totalPrice || 0)
      };

      console.log('Generated values:', { gate, terminal, seatNumber }); // Debugging
      console.log('Transformed data:', transformedData); // Debugging

      return transformedData;
    } catch (error) {
      console.error('Transform error:', error);
      throw error;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateFlightDuration = (departureTime, arrivalTime) => {
    if (departureTime === 'TBA' || arrivalTime === 'TBA') return 'TBA';
    
    try {
      // Pastikan format waktu valid
      if (!departureTime || !arrivalTime) return 'TBA';

      // Ambil jam dan menit dari string waktu (format "HH:MM")
      const [depHours, depMinutes] = departureTime.split(':').map(Number);
      const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

      // Hitung total menit
      let totalMinutes = (arrHours * 60 + arrMinutes) - (depHours * 60 + depMinutes);

      // Handle kasus ketika penerbangan melewati tengah malam
      if (totalMinutes < 0) {
        totalMinutes += 24 * 60; // Tambah 24 jam dalam menit
      }

      // Konversi ke jam dan menit
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 'TBA';
    }
  };

  const handleDownloadTicket = () => {
    // Dapatkan elemen yang akan di-convert ke PDF
    const ticket = document.querySelector('.tf-ticket');
    
    // Generate nama file
    const currentDate = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const fileName = `${bookingData.bookingId}_${bookingData.passengerName.replace(/\s+/g, '_')}_${currentDate}.pdf`;

    // Konfigurasi PDF
    const opt = {
      margin: [10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      },
      pagebreak: { mode: ['avoid-all'] }
    };

    // Generate PDF
    html2pdf().from(ticket).set(opt).save().catch(err => {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    });
  };

  const formatDateForFileName = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  const handlePrintTicket = () => {
    window.print();
  };

  if (loading) {
    return <div className="tf-loading">Loading...</div>;
  }

  if (error) {
    return <div className="tf-error">{error}</div>;
  }

  if (!bookingData) {
    return <div className="tf-error">No booking data available</div>;
  }

  return (
    <div className="tf-container">
      <div className="tf-breadcrumbs">
        <Link to="/" className="tf-breadcrumb-link">Home</Link>
        <span className="tf-breadcrumb-separator">&gt;</span>
        <Link to="/flight" className="tf-breadcrumb-link">Flight Search</Link>
        <span className="tf-breadcrumb-separator">&gt;</span>
        <Link to="/pilihan" className="tf-breadcrumb-link">Flight Booking</Link>
        <span className="tf-breadcrumb-separator">&gt;</span>
        <span className="tf-breadcrumb-current">Payment Confirmation</span>
      </div>

      <div className="tf-header">
        <div className="tf-header-left">
          <h2>{bookingData.airline}</h2>
          <p className="tf-flight-number">Flight {bookingData.flightNumber}</p>
        </div>
        <div className="tf-header-right">
          <p className="tf-booking-reference">Booking ID: {bookingData.bookingId}</p>
          <p className="tf-booking-date">
            Booked on: {bookingData.bookingDate} {bookingData.bookingTime}
          </p>
        </div>
      </div>

      <div className="tf-ticket">
        <div className="tf-ticket-header">
          <div className="tf-airline-logo">
            {bookingData.airlineLogo && (
              <img src={bookingData.airlineLogo} alt={`${bookingData.airline} Logo`} />
            )}
          </div>
          <div className="tf-ticket-type">E-TICKET / BOARDING PASS</div>
        </div>

        <div className="tf-ticket-main">
          <div className="tf-flight-info-container">
            <div className="tf-flight-route">
              <div className="tf-departure">
                <h3>{bookingData.departureAirport.code}</h3>
                <p>{bookingData.departureTime}</p>
                <span>{bookingData.departureAirport.name}</span>
              </div>
              
              <div className="tf-flight-duration">
                <div className="tf-duration-line">
                  <span className="tf-plane-icon">✈</span>
                </div>
                <span>
                  {calculateFlightDuration(
                    bookingData.departureTime,
                    bookingData.arrivalTime
                  )}
                </span>
              </div>

              <div className="tf-arrival">
                <h3>{bookingData.arrivalAirport.code}</h3>
                <p>{bookingData.arrivalTime}</p>
                <span>{bookingData.arrivalAirport.name}</span>
              </div>
            </div>

            <div className="tf-passenger-info">
              <div className="tf-info-group">
                <label>Passenger Name</label>
                <span>{bookingData.passengerName}</span>
              </div>
              <div className="tf-info-group">
                <label>Flight</label>
                <span>{bookingData.flightNumber}</span>
              </div>
              <div className="tf-info-group">
                <label>Date</label>
                <span>{bookingData.bookingDate}</span>
              </div>
              <div className="tf-info-group">
                <label>Gate</label>
                <span>{bookingData.gate}</span>
              </div>
              <div className="tf-info-group">
                <label>Terminal</label>
                <span>{bookingData.terminal}</span>
              </div>
              <div className="tf-info-group">
                <label>Seat</label>
                <span>{bookingData.seatNumber}</span>
              </div>
              <div className="tf-info-group">
                <label>Class</label>
                <span>{bookingData.seatClass}</span>
              </div>
            </div>
          </div>

          <div className="tf-ticket-footer">
            <div className="tf-barcode">
              <div className="tf-barcode-image">
                <Barcode
                  value={bookingData.bookingId}
                  width={1.5}
                  height={50}
                  format="CODE128"
                  displayValue={false} // Tidak menampilkan text di bawah barcode
                  background="#ffffff"
                  lineColor="#000000"
                  margin={0}
                />
              </div>
              <div className="tf-barcode-text">{bookingData.bookingId}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="tf-summary">
        <div className="tf-summary-header">
          <h3>Price Details</h3>
        </div>
        <div className="tf-summary-content">
          <div className="tf-price-row">
            <span>Base Fare</span>
            <span>{formatPrice(bookingData.totalPrice * 0.8)}</span>
          </div>
          <div className="tf-price-row">
            <span>Tax</span>
            <span>{formatPrice(bookingData.totalPrice * 0.1)}</span>
          </div>
          <div className="tf-price-row">
            <span>Service Fee</span>
            <span>{formatPrice(bookingData.totalPrice * 0.1)}</span>
          </div>
          <div className="tf-price-row tf-total">
            <span>Total Price</span>
            <span>{formatPrice(bookingData.totalPrice)}</span>
          </div>
        </div>
        <div className="tf-summary-actions">
          <button 
            className="tf-btn-download" 
            onClick={handleDownloadTicket}
            title="Download ticket as PDF"
          >
            <span className="tf-btn-icon">📥</span>
            Download E-Ticket
          </button>
          <button className="tf-btn-print" onClick={handlePrintTicket}>
            <span className="tf-btn-icon">🖨️</span>
            Print Ticket
          </button>
        </div>
      </div>

      <div className="tf-notes">
        <div className="tf-note-section">
          <h4>Important Information</h4>
          <ul>
            <li>Please arrive at the airport at least 2 hours before departure</li>
            <li>Bring valid identification (ID Card/Passport)</li>
            <li>Check-in closes 1 hour before departure</li>
            <li>Maximum cabin baggage: 7kg</li>
          </ul>
        </div>

        <div className="tf-note-section">
          <h4>Contact Information</h4>
          <p>
            {bookingData.airline}<br />
            Call Center: 0804-1-807-807<br />
            Email: customer@{bookingData.airline.toLowerCase().replace(/\s+/g, '-')}.com<br />
            Website: www.{bookingData.airline.toLowerCase().replace(/\s+/g, '-')}.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Transaksi;