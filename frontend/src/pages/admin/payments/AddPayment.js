// src/pages/admin/payment/AddPayment.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AddPayment = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [bookingID, setBookingID] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [bookings, setBookings] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get('/bookings');
                // Filter only bookings that don't have payments or have failed payments
                const availableBookings = response.data.filter(booking => 
                    booking.status !== 'cancelled' &&
                    (!booking.payment || booking.payment.paymentStatus === 'failed')
                );
                setBookings(availableBookings);
            } catch (error) {
                setMsg("Failed to load bookings");
                setMsgType('danger');
                console.error("Error fetching bookings:", error);
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setAmount(value);
    };

    const handleBookingChange = (e) => {
        const selectedBookingId = e.target.value;
        setBookingID(selectedBookingId);
        
        const booking = bookings.find(b => b.bookingID.toString() === selectedBookingId);
        if (booking) {
            setSelectedBooking(booking);
            setAmount(booking.totalPrice.toString());
        }
    };

    const savePayment = async (e) => {
        e.preventDefault();

        try {
            await axiosInstance.post('/payments', {
                bookingID,
                amount,
                paymentMethod,
                paymentStatus
            });
            setMsg("Payment added successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/payments');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error adding payment:", error);
        }
    };

    const formatPrice = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-dashboard-container">
            <Sidebar
                isSidebarClosed={isSidebarClosed}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />

            <section className="dashboard">
                <Navbar toggleSidebar={toggleSidebar} />

                <div className="dash-content">
                    <div className="management-page-wrapper">
                        <div className="page-header">
                            <i className="uil uil-bill icon"></i>
                            <div>
                                <h1 className="page-title">Add New Payment</h1>
                                <p className="page-subtitle">Create a new payment record.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={savePayment}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="bookingID" className="form-label">Select Booking</label>
                                        <select
                                            id="bookingID"
                                            className="form-input"
                                            value={bookingID}
                                            onChange={handleBookingChange}
                                            required
                                        >
                                            <option value="">Select a booking</option>
                                            {bookings.map(booking => (
                                                <option key={booking.bookingID} value={booking.bookingID}>
                                                    {`Booking #${booking.bookingID} - ${booking.user.name} - ${formatDateTime(booking.bookingDate)}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedBooking && (
                                        <div className="booking-details">
                                            <h3>Booking Details</h3>
                                            <p>Customer: {selectedBooking.user.name}</p>
                                            <p>Flight: {selectedBooking.flight.flightNumber}</p>
                                            <p>Status: {selectedBooking.status}</p>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                                        <select
                                            id="paymentMethod"
                                            className="form-input"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            required
                                        >
                                            <option value="">Select payment method</option>
                                            <option value="Credit Card">Credit Card</option>
                                            <option value="Debit Card">Debit Card</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="E-Wallet">E-Wallet</option>
                                        </select>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="amount" className="form-label">Amount (IDR)</label>
                                                <input
                                                    type="text"
                                                    id="amount"
                                                    className="form-input"
                                                    value={formatPrice(amount)}
                                                    onChange={handleAmountChange}
                                                    placeholder="Enter amount"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="paymentStatus" className="form-label">Payment Status</label>
                                                <select
                                                    id="paymentStatus"
                                                    className="form-input"
                                                    value={paymentStatus}
                                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                                    required
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="failed">Failed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Add Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AddPayment;