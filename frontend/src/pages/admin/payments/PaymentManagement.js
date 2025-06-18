// src/pages/admin/payment/PaymentManagement.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const PaymentManagement = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [showModal, setShowModal] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const getPayments = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/payments');
            setPayments(response.data);
            setMsg('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load payments. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching payments:", error);
        }
    };

    useEffect(() => {
        getPayments();
    }, []);

    const confirmDelete = (paymentId) => {
        setPaymentToDelete(paymentId);
        setShowModal(true);
    };

    const cancelDelete = () => {
        setShowModal(false);
        setPaymentToDelete(null);
    };

    const executeDelete = async () => {
        setShowModal(false);
        if (!paymentToDelete) return;

        try {
            await axiosInstance.delete(`/payments/${paymentToDelete}`);
            setMsg("Payment deleted successfully!");
            setMsgType('success');
            setPayments(prevPayments => 
                prevPayments.filter(payment => payment.paymentID !== paymentToDelete)
            );
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete payment. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting payment:", error);
        } finally {
            setPaymentToDelete(null);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'status-badge confirmed';
            case 'failed':
                return 'status-badge cancelled';
            default:
                return 'status-badge pending';
        }
    };

    if (loading) {
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
                        <div className="loading-spinner">Loading...</div>
                    </div>
                </section>
            </div>
        );
    }

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
                                <h1 className="page-title">Payment Management</h1>
                                <p className="page-subtitle">Manage all payment transactions.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/payments/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New Payment
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Booking ID</th>
                                            <th>Payment Date</th>
                                            <th>Amount</th>
                                            <th>Payment Method</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.length > 0 ? (
                                            payments.map((payment, index) => (
                                                <tr key={payment.paymentID}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <Link to={`/admin/bookings/view/${payment.bookingID}`}>
                                                            {payment.bookingID}
                                                        </Link>
                                                    </td>
                                                    <td>{formatDate(payment.paymentDate)}</td>
                                                    <td>{formatPrice(payment.amount)}</td>
                                                    <td>{payment.paymentMethod}</td>
                                                    <td>
                                                        <span className={getStatusBadgeClass(payment.paymentStatus)}>
                                                            {payment.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link 
                                                            to={`/admin/payments/edit/${payment.paymentID}`} 
                                                            className="table-action-button edit"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button 
                                                            onClick={() => confirmDelete(payment.paymentID)} 
                                                            className="table-action-button delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="no-data-message">
                                                    No payments found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showModal && (
                <div className={`modal-overlay ${showModal ? 'active' : ''}`}>
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this payment? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button onClick={executeDelete} className="modal-button confirm">
                                Delete
                            </button>
                            <button onClick={cancelDelete} className="modal-button cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;