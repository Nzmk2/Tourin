import React from 'react';
import './transaksi.css';

export default function Transaksi() {
  return (
    <div className="transaksi-container">
      <div className="transaksi-breadcrumbs">
        Turkey &gt; Istanbul &gt; CVK Park Bosphorus Hotel Istanbul
      </div>

      <div className="transaksi-header">
        <h2>Emirates A380 Airbus</h2>
        <p>Gümüssuyu Mah. Inönü Cad. No:8, Istanbul 34437</p>
      </div>

      <div className="transaksi-ticket">
        <div className="transaksi-ticket-left">
          <div className="transaksi-time">12:00 pm</div>
          <div className="transaksi-airport">Newark (EWR)</div>
        </div>

        <div className="transaksi-ticket-center">
          <div className="transaksi-passenger">
            <div className="transaksi-passenger-name">James Doe</div>
            <div className="transaksi-boarding-pass">Boarding Pass N°123</div>
            <div className="transaksi-class">Business Class</div>
          </div>

          <div className="transaksi-flight-info">
            <div><span>Date</span><br />Newark (EWR)</div>
            <div><span>Flight time</span><br />12:00</div>
            <div><span>Gate</span><br />A12</div>
            <div><span>Seat</span><br />12B</div>
          </div>
        </div>

        <div className="transaksi-ticket-right">
          <div className="transaksi-time">12:00 pm</div>
          <div className="transaksi-airport">Newark (EWR)</div>
          <div className="transaksi-barcode">||||||||||||||||||||||||</div>
          <div className="transaksi-code">EK ABC12345</div>
        </div>
      </div>

      <div className="transaksi-price-download">
        <div className="transaksi-price">$240</div>
        <button className="transaksi-download">Download</button>
      </div>

      <div className="transaksi-terms">
        <h3>Terms and Conditions</h3>
        <h4>Payments</h4>
        <ul>
          <li>All card payments are processed securely and may be screened for fraud.</li>
          <li>Incorrect billing info may result in cancellation and additional charges.</li>
          <li>Verification may be required at check-in if the cardholder does not match.</li>
        </ul>

        <h4>Contact Us</h4>
        <p>
          Golobe Group Q.C.S.C<br />
          Golobe Tower<br />
          P.O. Box 22550<br />
          Doha, State of Qatar<br />
          <a href="https://golobe.com/help" target="_blank" rel="noreferrer">golobe.com/help</a>
        </p>
      </div>
    </div>
  );
}
