import React from 'react';
import './transaksi.css';

export default function Transaksi() {
  // Sample data - in real implementation, this would come from props or API
  const ticketData = {
    bookingId: "BK-" + new Date().toISOString().slice(0,10).replace(/-/g, ''),
    userId: "USR-Nzmk2",
    flightId: "FL-EK380",
    bookingDate: "2025-06-19",
    bookingTime: "15:42:32",
    totalPrice: 240.00,
    departureAirport: {
      code: "CGK",
      name: "Soekarno-Hatta International Airport"
    },
    arrivalAirport: {
      code: "DPS",
      name: "Ngurah Rai International Airport"
    },
    airline: "Garuda Indonesia",
    passengerName: "Nzmk2",
    flightNumber: "GA-7514",
    seatClass: "Economy Class",
    seatNumber: "14F",
    departureTime: "08:00",
    arrivalTime: "10:45",
    gate: "D12",
    terminal: "3"
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  return (
    <div className="transaksi-container">
      <div className="transaksi-breadcrumbs">
        Home &gt; Flight Booking &gt; Payment Confirmation
      </div>

      <div className="transaksi-header">
        <div className="header-left">
          <h2>{ticketData.airline}</h2>
          <p className="flight-number">Flight {ticketData.flightNumber}</p>
        </div>
        <div className="header-right">
          <p className="booking-reference">Booking ID: {ticketData.bookingId}</p>
          <p className="booking-date">Booked on: {ticketData.bookingDate} {ticketData.bookingTime}</p>
        </div>
      </div>

      <div className="transaksi-ticket">
        <div className="ticket-header">
          <div className="airline-logo">
            <img src="/airline-logo.png" alt="Airline Logo" />
          </div>
          <div className="ticket-type">E-TICKET / BOARDING PASS</div>
        </div>

        <div className="ticket-main">
          <div className="flight-info-container">
            <div className="flight-route">
              <div className="departure">
                <h3>{ticketData.departureAirport.code}</h3>
                <p>{ticketData.departureTime}</p>
                <span>{ticketData.departureAirport.name}</span>
              </div>
              
              <div className="flight-duration">
                <div className="duration-line">
                  <span className="plane-icon">✈</span>
                </div>
                <span>2h 45m</span>
              </div>

              <div className="arrival">
                <h3>{ticketData.arrivalAirport.code}</h3>
                <p>{ticketData.arrivalTime}</p>
                <span>{ticketData.arrivalAirport.name}</span>
              </div>
            </div>

            <div className="passenger-info">
              <div className="info-group">
                <label>Passenger Name</label>
                <span>{ticketData.passengerName}</span>
              </div>
              <div className="info-group">
                <label>Flight</label>
                <span>{ticketData.flightNumber}</span>
              </div>
              <div className="info-group">
                <label>Date</label>
                <span>{ticketData.bookingDate}</span>
              </div>
              <div className="info-group">
                <label>Gate</label>
                <span>{ticketData.gate}</span>
              </div>
              <div className="info-group">
                <label>Terminal</label>
                <span>{ticketData.terminal}</span>
              </div>
              <div className="info-group">
                <label>Seat</label>
                <span>{ticketData.seatNumber}</span>
              </div>
              <div className="info-group">
                <label>Class</label>
                <span>{ticketData.seatClass}</span>
              </div>
            </div>
          </div>

          <div className="ticket-footer">
            <div className="barcode">
              <div className="barcode-image">||||||||||||||||||||||||</div>
              <div className="barcode-text">{ticketData.bookingId}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="transaksi-summary">
        <div className="summary-header">
          <h3>Price Details</h3>
        </div>
        <div className="summary-content">
          <div className="price-row">
            <span>Base Fare</span>
            <span>{formatPrice(ticketData.totalPrice * 0.8)}</span>
          </div>
          <div className="price-row">
            <span>Tax</span>
            <span>{formatPrice(ticketData.totalPrice * 0.1)}</span>
          </div>
          <div className="price-row">
            <span>Service Fee</span>
            <span>{formatPrice(ticketData.totalPrice * 0.1)}</span>
          </div>
          <div className="price-row total">
            <span>Total Price</span>
            <span>{formatPrice(ticketData.totalPrice)}</span>
          </div>
        </div>
        <div className="summary-actions">
          <button className="btn-download">Download E-Ticket</button>
          <button className="btn-print">Print Ticket</button>
        </div>
      </div>

      <div className="transaksi-notes">
        <div className="note-section">
          <h4>Important Information</h4>
          <ul>
            <li>Please arrive at the airport at least 2 hours before departure</li>
            <li>Bring valid identification (ID Card/Passport)</li>
            <li>Check-in closes 1 hour before departure</li>
            <li>Maximum cabin baggage: 7kg</li>
          </ul>
        </div>

        <div className="note-section">
          <h4>Contact Information</h4>
          <p>
            {ticketData.airline}<br />
            Call Center: 0804-1-807-807<br />
            Email: customer@garuda-indonesia.com<br />
            Website: www.garuda-indonesia.com
          </p>
        </div>
      </div>
    </div>
  );
}