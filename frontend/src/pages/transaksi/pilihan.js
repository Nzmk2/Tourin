import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { useAuth } from '../../auth/AuthContext';
import './pilihan.css';

const Pilihan = () => {
  const { user, isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  
  const currentDate = "2025-06-19 17:13:35";
  
  const location = useLocation();
  const navigate = useNavigate();
  const selectedFlight = location.state?.flight;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedFlight) {
      navigate('/flight');
      return;
    }

    setBookingData({
      flightID: selectedFlight.flightID,
      totalPrice: selectedFlight.price,
      airline: selectedFlight.Airline,
      departureTime: selectedFlight.departureTime,
      departureAirport: selectedFlight.DepartureAirport,
      destinationAirport: selectedFlight.DestinationAirport,
      arrivalTime: selectedFlight.arrivalTime,
      flightNumber: selectedFlight.flightNumber,
      gate: selectedFlight.gate || 'TBA',
      terminal: selectedFlight.terminal || 'TBA'
    });
  }, [selectedFlight, isAuthenticated, navigate]);

  const validatePaymentDetails = () => {
    switch (paymentMethod) {
      case 'credit':
      case 'debit':
        if (!cardNumber || !expiryDate || !cvv) {
          setError('Please fill in all card details');
          return false;
        }
        break;
      case 'transfer':
        if (!selectedBank || !bankAccount) {
          setError('Please fill in all bank transfer details');
          return false;
        }
        break;
      case 'ewallet':
        if (!selectedWallet || !phoneNumber) {
          setError('Please fill in all e-wallet details');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const getPaymentDetails = () => {
    const baseDetails = {
      username: user.firstName,
      timestamp: currentDate
    };

    switch (paymentMethod) {
      case 'credit':
      case 'debit':
        return {
          ...baseDetails,
          cardNumber: cardNumber.replace(/\s/g, '').slice(-4),
          expiryDate,
          cardType: paymentMethod
        };
      case 'transfer':
        return {
          ...baseDetails,
          bankName: selectedBank,
          accountNumber: bankAccount.slice(-4)
        };
      case 'ewallet':
        return {
          ...baseDetails,
          provider: selectedWallet,
          phoneNumber: phoneNumber
        };
      default:
        return baseDetails;
    }
  };

  const calculateTotalPrice = () => {
    if (!bookingData) return { basePrice: 0, tax: 0, serviceFee: 0, total: 0 };
    
    const basePrice = parseFloat(bookingData.totalPrice);
    const tax = basePrice * 0.1;
    const serviceFee = 25000;
    return {
      basePrice,
      tax,
      serviceFee,
      total: basePrice + tax + serviceFee
    };
  };

  const handlePaymentSubmit = async () => {
    if (!isAuthenticated) {
      setError('Please login first');
      navigate('/login');
      return;
    }

    if (!bookingData) {
      setError('No flight selected');
      return;
    }

    if (!validatePaymentDetails()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prices = calculateTotalPrice();
      const bookingBody = {
        flightID: bookingData.flightID,
        totalPrice: prices.total,
        status: "booked",
        bookingDate: currentDate,
        username: user.firstName,
        userID: user.userID,
        paymentMethod: paymentMethod,
        paymentDetails: getPaymentDetails()
      };

      const bookingResponse = await axiosInstance.post('/api/bookings', bookingBody);

      if (bookingResponse.data && bookingResponse.data.bookingID) {
        const paymentBody = {
          bookingID: bookingResponse.data.bookingID,
          userID: user.userID,
          amount: prices.total,
          paymentMethod: paymentMethod,
          paymentStatus: 'completed',
          paymentDate: currentDate,
          details: getPaymentDetails()
        };

        const paymentResponse = await axiosInstance.post('/api/payments', paymentBody);

        if (paymentResponse.data) {
          navigate('/pilihan/transaksi', {
            state: {
              bookingID: bookingResponse.data.bookingID,
              paymentID: paymentResponse.data.paymentID,
              bookingDetails: {
                bookingId: `BK-${bookingResponse.data.bookingID.toString().padStart(6, '0')}`,
                userId: `USR-${user.userID}`,
                flightId: `FL-${bookingData.flightID}`,
                airline: bookingData.airline?.name || 'TBA',
                airlineLogo: bookingData.airline?.logoUrl,
                flightNumber: bookingData.flightNumber,
                departureTime: new Date(bookingData.departureTime).toLocaleTimeString(),
                arrivalTime: new Date(bookingData.arrivalTime).toLocaleTimeString(),
                gate: bookingData.gate,
                terminal: bookingData.terminal,
                departureAirport: {
                  code: bookingData.departureAirport?.code || 'TBA',
                  name: bookingData.departureAirport?.name || 'TBA'
                },
                arrivalAirport: {
                  code: bookingData.destinationAirport?.code || 'TBA',
                  name: bookingData.destinationAirport?.name || 'TBA'
                },
                bookingDate: new Date(currentDate).toLocaleDateString(),
                bookingTime: new Date(currentDate).toLocaleTimeString(),
                passengerName: `${user.firstName} ${user.lastName || ''}`,
                seatClass: "Economy Class",
                seatNumber: "TBA",
                price: prices,
                totalPrice: prices.total,
                payment: {
                  method: paymentMethod,
                  details: getPaymentDetails()
                }
              }
            }
          });
        }
      }
    } catch (err) {
      console.error('Payment Error:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.msg || 'Failed to process payment');
      }
    } finally {
      setLoading(false);
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

  if (!bookingData) {
    return <div className="nzmk-flight-error-container">No flight selected</div>;
  }

  const prices = calculateTotalPrice();

  return (
    <div className="nzmk-flight-booking-container">
      <div className="nzmk-flight-details">
        <div className="tf-breadcrumbs">
          <Link to="/" className="tf-breadcrumb-link">Home</Link>
        </div>
        <div className="nzmk-flight-header">
          <div className="nzmk-flight-title">
            <h2>{bookingData.airline?.name || 'Airline'}</h2>
            <p>{new Date(bookingData.departureTime).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="nzmk-flight-price">{formatPrice(prices.total)}</div>
        </div>

        <div className="nzmk-flight-user-info">
          <span className="nzmk-flight-user">Welcome, {user?.firstName || 'Guest'}</span>
          <span className="nzmk-flight-datetime">{currentDate}</span>
        </div>

        <div className="nzmk-flight-schedule">
          <div className="nzmk-flight-route-info">
            <div className="nzmk-flight-time">
              {new Date(bookingData.departureTime).toLocaleTimeString('id-ID')}
            </div>
            <div className="nzmk-flight-airport">
              {bookingData.departureAirport?.code}
            </div>
          </div>
          
          <div className="nzmk-flight-line">
            <span className="nzmk-flight-plane-icon">✈</span>
          </div>
          
          <div className="nzmk-flight-route-info">
            <div className="nzmk-flight-time">
              {new Date(bookingData.arrivalTime).toLocaleTimeString('id-ID')}
            </div>
            <div className="nzmk-flight-airport">
              {bookingData.destinationAirport?.code}
            </div>
          </div>
        </div>

        <div className="nzmk-flight-payment-section">
          <h3>Payment Method</h3>
          <div className="nzmk-flight-payment-select">
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="nzmk-flight-payment-dropdown"
            >
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
              <option value="transfer">Bank Transfer</option>
              <option value="ewallet">E-Wallet</option>
            </select>
          </div>

          {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
            <div className="nzmk-flight-payment-details">
              <input 
                type="text" 
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                className="nzmk-flight-input-full"
                maxLength="16"
              />
              <div className="nzmk-flight-input-group">
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="nzmk-flight-input-half"
                  maxLength="5"
                />
                <input 
                  type="password" 
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  className="nzmk-flight-input-half"
                  maxLength="3"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="nzmk-flight-payment-details">
              <select 
                className="nzmk-flight-input-full"
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
              >
                <option value="">Select Bank</option>
                <option value="bca">BCA</option>
                <option value="mandiri">Mandiri</option>
                <option value="bni">BNI</option>
              </select>
              <input 
                type="text" 
                placeholder="Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                className="nzmk-flight-input-full"
                maxLength="16"
              />
            </div>
          )}

          {paymentMethod === 'ewallet' && (
            <div className="nzmk-flight-payment-details">
              <select 
                className="nzmk-flight-input-full"
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
              >
                <option value="">Select E-Wallet</option>
                <option value="ovo">OVO</option>
                <option value="gopay">GoPay</option>
                <option value="dana">DANA</option>
              </select>
              <input 
                type="text" 
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="nzmk-flight-input-full"
                maxLength="13"
              />
            </div>
          )}
        </div>
      </div>

      <div className="nzmk-flight-summary">
        <div className="nzmk-flight-summary-header">
          <div className="nzmk-flight-summary-details">
            <p className="nzmk-flight-economy">Economy</p>
            <h3>{bookingData.airline?.name}</h3>
            <div className="nzmk-flight-route">
              {`${bookingData.departureAirport?.name} → ${bookingData.destinationAirport?.name}`}
            </div>
          </div>
        </div>

        <div className="nzmk-flight-price-details">
          <h3>Price Details</h3>
          <div className="nzmk-flight-price-item">
            <span>Base Price</span>
            <span>{formatPrice(prices.basePrice)}</span>
          </div>
          <div className="nzmk-flight-price-item">
            <span>Tax (10%)</span>
            <span>{formatPrice(prices.tax)}</span>
          </div>
          <div className="nzmk-flight-price-item">
            <span>Service Fee</span>
            <span>{formatPrice(prices.serviceFee)}</span>
          </div>
          <div className="nzmk-flight-price-item total">
            <span>Total</span>
            <span>{formatPrice(prices.total)}</span>
          </div>
        </div>

        <button 
          className="nzmk-flight-confirm-button"
          onClick={handlePaymentSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>
        
        {error && (
          <div className="nzmk-flight-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pilihan;