import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import axiosInstance from '../../api/axiosConfig';
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

  const transformBookingData = (data) => {
    try {
      return {
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
        gate: data.Flight?.gate || 'TBA',
        terminal: data.Flight?.terminal || 'TBA',
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
        seatNumber: 'TBA',
        totalPrice: parseFloat(data.totalPrice || 0)
      };
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
    
    const departure = new Date(`2000-01-01T${departureTime}`);
    const arrival = new Date(`2000-01-01T${arrivalTime}`);
    const diffInMinutes = (arrival - departure) / (1000 * 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleDownloadTicket = () => {
    window.print();
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
        Home &gt; Flight Booking &gt; Payment Confirmation
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
              <div className="tf-barcode-image">||||||||||||||||||||||||</div>
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
          <button className="tf-btn-download" onClick={handleDownloadTicket}>
            Download E-Ticket
          </button>
          <button className="tf-btn-print" onClick={handlePrintTicket}>
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