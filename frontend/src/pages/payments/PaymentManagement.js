import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosConfig';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getPayments();
  }, []);

  const getPayments = async () => {
    try {
      const response = await axiosInstance.get('/payments');
      setPayments(response.data);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to load payments. Network error or server unavailable.");
      }
      console.error("Error fetching payments:", error);
    }
  };

  const deletePayment = async (paymentId) => {
    if (!window.confirm("Are you sure you want to delete this payment record?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/payments/${paymentId}`);
      setPayments(payments.filter(payment => payment.id !== paymentId));
      setMsg("Payment record deleted successfully!");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to delete payment record. Network error or server unavailable.");
      }
      console.error("Error deleting payment:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'has-text-warning';
      case 'completed': return 'has-text-success';
      case 'failed': return 'has-text-danger';
      case 'refunded': return 'has-text-info';
      default: return '';
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Payment Management</h1>
      <h2 className="subtitle is-4">View and manage flight payment records.</h2>

      <div className="container mt-5">
        <div className="columns">
          <div className="column is-full">
            {msg && <div className="notification is-light is-info">{msg}</div>}
            <div className="table-container">
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Payment ID</th>
                    <th>Booking ID</th>
                    <th>User Email</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td>{index + 1}</td>
                      <td>{payment.paymentId}</td>
                      <td>{payment.booking?.id || 'N/A'}</td>
                      <td>{payment.user?.email || 'N/A'}</td>
                      <td>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(payment.amount)}</td>
                      <td>{payment.method}</td>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className={getStatusColor(payment.status)}>{payment.status}</td>
                      <td>
                        <button onClick={() => deletePayment(payment.id)} className="button is-small is-danger">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentManagement;