import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import './pilihan.css';

const Pilihan = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = "Nzmk2"; // Sesuai dengan user yang sedang login
  const currentDate = "2025-06-19 15:28:22"; // Sesuai dengan waktu saat ini
  
  const location = useLocation();
  const navigate = useNavigate();
  const selectedFlight = location.state?.flight;

  // Format harga dalam Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  useEffect(() => {
    if (selectedFlight) {
      setBookingData({
        flightID: selectedFlight.flightID,
        totalPrice: selectedFlight.price,
        airline: selectedFlight.Airline,
        departureTime: selectedFlight.departureTime,
        departureAirport: selectedFlight.DepartureAirport,
        destinationAirport: selectedFlight.DestinationAirport,
        arrivalTime: selectedFlight.arrivalTime
      });
    }
  }, [selectedFlight]);

  const handlePaymentSubmit = async () => {
    if (!bookingData) return;

    setLoading(true);
    setError(null);

    try {
      // Buat booking terlebih dahulu
      const bookingResponse = await axiosInstance.post('/bookings', {
        flightID: bookingData.flightID,
        totalPrice: bookingData.totalPrice,
        status: 'pending'
      });

      // Jika booking berhasil, buat payment
      if (bookingResponse.status === 201) {
        const paymentResponse = await axiosInstance.post('/payments', {
          bookingID: bookingResponse.data.bookingID,
          amount: bookingData.totalPrice,
          paymentMethod: paymentMethod,
          status: 'pending'
        });

        if (paymentResponse.status === 201) {
          navigate('/pilihan/transaksi', { 
            state: { 
              bookingID: bookingResponse.data.bookingID,
              paymentID: paymentResponse.data.paymentID
            }
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Gagal membuat pemesanan');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <div>Tidak ada penerbangan yang dipilih</div>;
  }

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(bookingData.totalPrice);
    const tax = basePrice * 0.1; // Pajak 10%
    const serviceFee = 25000; // Biaya layanan tetap Rp 25.000
    return {
      basePrice,
      tax,
      serviceFee,
      total: basePrice + tax + serviceFee
    };
  };

  const prices = calculateTotalPrice();

  return (
    <div className="nzmk-flight-booking-container">
      <div className="nzmk-flight-details">
        <div className="nzmk-flight-header">
          <div className="nzmk-flight-title">
            <h2>{bookingData.airline?.name || 'Maskapai'}</h2>
            <p>{new Date(bookingData.departureTime).toLocaleDateString('id-ID')}</p>
          </div>
          <div className="nzmk-flight-price">{formatPrice(prices.total)}</div>
        </div>

        <div className="nzmk-flight-user-info">
          <span className="nzmk-flight-user">Selamat datang, {currentUser}</span>
          <span className="nzmk-flight-datetime">{currentDate}</span>
        </div>

        <div className="nzmk-flight-airline-info">
          {bookingData.airline?.logoUrl && (
            <img 
              src={bookingData.airline.logoUrl} 
              alt={bookingData.airline.name} 
              className="nzmk-flight-airline-logo" 
            />
          )}
          <div className="nzmk-flight-airline-name">
            <h3>{bookingData.airline?.name}</h3>
            <p>Detail Penerbangan</p>
          </div>
        </div>

        <div className="nzmk-flight-schedule">
          <div className="nzmk-flight-time">
            {new Date(bookingData.departureTime).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </div>
          <div className="nzmk-flight-line">
            <span className="nzmk-flight-plane-icon">✈</span>
          </div>
          <div className="nzmk-flight-time">
            {new Date(bookingData.arrivalTime).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </div>
          <div className="nzmk-flight-location">
            {`${bookingData.departureAirport?.code} → ${bookingData.destinationAirport?.code}`}
          </div>
        </div>

        <div className="nzmk-flight-payment-section">
          <h3>Metode Pembayaran</h3>
          <div className="nzmk-flight-payment-select">
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="nzmk-flight-payment-dropdown"
            >
              <option value="credit">Kartu Kredit</option>
              <option value="debit">Kartu Debit</option>
              <option value="transfer">Transfer Bank</option>
              <option value="ewallet">E-Wallet</option>
            </select>
          </div>

          {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
            <div className="nzmk-flight-payment-details">
              <input 
                type="text" 
                placeholder="Nomor Kartu" 
                className="nzmk-flight-input-full"
              />
              <div className="nzmk-flight-input-group">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  className="nzmk-flight-input-half"
                />
                <input 
                  type="text" 
                  placeholder="CVV" 
                  className="nzmk-flight-input-half"
                />
              </div>
            </div>
          )}

          {paymentMethod === 'transfer' && (
            <div className="nzmk-flight-payment-details">
              <select className="nzmk-flight-input-full">
                <option value="">Pilih Bank</option>
                <option value="bca">BCA</option>
                <option value="mandiri">Mandiri</option>
                <option value="bni">BNI</option>
              </select>
              <input 
                type="text" 
                placeholder="Nomor Rekening" 
                className="nzmk-flight-input-full"
              />
            </div>
          )}

          {paymentMethod === 'ewallet' && (
            <div className="nzmk-flight-payment-details">
              <select className="nzmk-flight-input-full">
                <option value="">Pilih E-Wallet</option>
                <option value="ovo">OVO</option>
                <option value="gopay">GoPay</option>
                <option value="dana">DANA</option>
              </select>
              <input 
                type="text" 
                placeholder="Nomor Telepon" 
                className="nzmk-flight-input-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="nzmk-flight-summary">
        <div className="nzmk-flight-summary-header">
          <div className="nzmk-flight-summary-details">
            <p className="nzmk-flight-economy">Ekonomi</p>
            <h3>{bookingData.airline?.name}</h3>
            <div className="nzmk-flight-route">
              {`${bookingData.departureAirport?.name} → ${bookingData.destinationAirport?.name}`}
            </div>
          </div>
        </div>

        <div className="nzmk-flight-price-details">
          <h3>Detail Harga</h3>
          <div className="nzmk-flight-price-item">
            <span>Harga Dasar</span>
            <span>{formatPrice(prices.basePrice)}</span>
          </div>
          <div className="nzmk-flight-price-item">
            <span>Pajak</span>
            <span>{formatPrice(prices.tax)}</span>
          </div>
          <div className="nzmk-flight-price-item">
            <span>Biaya Layanan</span>
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
          {loading ? 'Memproses...' : 'Konfirmasi Pembayaran'}
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