import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../api/axiosConfig'; // Sesuaikan path jika perlu
import Sidebar from '../../../components/Sidebar'; // Sesuaikan path jika perlu
import Navbar from '../../../components/Navbar';   // Sesuaikan path jika perlu

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const PaymentManagement = () => {
    // State untuk mengelola status sidebar (buka/tutup) dan mode gelap/terang
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [payments, setPayments] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info'); // State untuk tipe pesan
    const [showModal, setShowModal] = useState(false); // State untuk modal konfirmasi
    const [paymentToDelete, setPaymentToDelete] = useState(null); // State untuk menyimpan ID yang akan dihapus

    // Efek samping untuk menerapkan kelas 'dark' ke elemen <body>
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Efek samping untuk menerapkan kelas 'close' ke elemen <body>
    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    // Handler untuk toggle sidebar
    const toggleSidebar = useCallback(() => {
        setIsSidebarClosed(prevState => !prevState);
    }, []);

    // Handler untuk toggle dark mode
    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prevState => !prevState);
    }, []);

    const getPayments = useCallback(async () => {
        try {
            const response = await axiosInstance.get('/payments');
            setPayments(response.data);
            setMsg('');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load payments. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching payments:", error);
        }
    }, []);

    useEffect(() => {
        getPayments();
    }, [getPayments]);

    // Fungsi untuk menampilkan modal konfirmasi
    const confirmDelete = (paymentId) => {
        setPaymentToDelete(paymentId);
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const cancelDelete = () => {
        setShowModal(false);
        setPaymentToDelete(null);
    };

    // Fungsi untuk melanjutkan penghapusan setelah konfirmasi
    const executeDelete = async () => {
        setShowModal(false); // Tutup modal
        if (!paymentToDelete) return; // Pastikan ada ID untuk dihapus

        try {
            // Menggunakan paymentID sesuai model
            await axiosInstance.delete(`/payments/${paymentToDelete}`);
            setMsg("Payment record deleted successfully!");
            setMsgType('success');
            // Update state secara lokal, filter berdasarkan paymentID
            setPayments(payments.filter(payment => payment.paymentID !== paymentToDelete));
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete payment record. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting payment:", error);
        } finally {
            setPaymentToDelete(null); // Reset ID yang akan dihapus
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'completed': return 'status-completed';
            case 'failed': return 'status-failed';
            case 'refunded': return 'status-refunded';
            default: return '';
        }
    };

    // formatDate function to handle Date objects
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('id-ID');
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
                            <i className="uil uil-paypal icon"></i> {/* Ikon Payment */}
                            <div>
                                <h1 className="page-title">Payment Management</h1>
                                <p className="page-subtitle">View and manage flight payment records.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            {/* Tidak ada tombol 'Add New' di sini karena pembayaran biasanya dibuat melalui booking */}
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Payment ID</th>
                                            <th>Booking ID</th>
                                            <th>User Email</th> {/* Ini mungkin perlu disesuaikan jika data user tidak langsung ada di payment */}
                                            <th>Amount</th>
                                            <th>Method</th>
                                            <th>Payment Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.length > 0 ? (
                                            payments.map((payment, index) => (
                                                <tr key={payment.paymentID}> {/* Gunakan paymentID sebagai key */}
                                                    <td>{index + 1}</td>
                                                    <td>{payment.paymentID}</td>
                                                    <td>{payment.bookingID || 'N/A'}</td> {/* Gunakan bookingID */}
                                                    {/* Asumsi data user di-include bersama booking atau langsung di payment */}
                                                    <td>{payment.user?.email || 'N/A'}</td>
                                                    <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount)}</td>
                                                    <td>{payment.paymentMethod}</td> {/* Gunakan paymentMethod */}
                                                    <td>{formatDate(payment.transactionDateTime)}</td> {/* Gunakan transactionDateTime */}
                                                    <td className={getStatusColorClass(payment.paymentStatus)}>{payment.paymentStatus}</td> {/* Gunakan paymentStatus */}
                                                    <td>
                                                        {/* Tidak ada tombol edit untuk pembayaran */}
                                                        <button onClick={() => confirmDelete(payment.paymentID)} className="table-action-button delete">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="no-data-message">No payment records found.</td>
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
                <div className={`modal-overlay ${showModal ? 'active' : ''}`}> {/* Tambahkan class 'active' */}
                    <div className="modal-content">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this flight? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button onClick={executeDelete} className="modal-button confirm">Delete</button>
                            <button onClick={cancelDelete} className="modal-button cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;