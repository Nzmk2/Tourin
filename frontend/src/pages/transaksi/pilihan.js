import React, { useState } from 'react';
import './pilihan.css';
import emiratesLogo from '../../assets/img/login.jpg';
import Header from '../dashboard/Header';

const Pilihan = () => {
    const [paymentOption, setPaymentOption] = useState('full'); // 'full' or 'part'

    return (
        <div className="pilihan-body"> {/* Added a body-like container for centering */}
            <div className="pilihan-container">
                {/* Header / Breadcrumbs */}
                <div className="pilihan-header">
                    <span className="pilihan-breadcrumb">Turkey &gt;</span>
                    <span className="pilihan-breadcrumb">Istanbul &gt;</span>
                    <span className="pilihan-breadcrumb">CVK Park Bosphorus Hotel Istanbul</span>
                </div>

                <div className="pilihan-content-wrapper">
                    {/* Left Section: Flight Details & Payment Options */}
                    <div className="pilihan-left-section">
                        {/* Flight Details Card */}
                        <div className="pilihan-flight-details-card">
                            <div className="pilihan-flight-title-price">
                                <h3 className="pilihan-flight-type">Emirates A380 Airbus</h3>
                                <div className="pilihan-price-tag">
                                    <span className="pilihan-currency">$</span>
                                    <span className="pilihan-price-value">240</span>
                                </div>
                            </div>
                            <div className="pilihan-return-date-duration">
                                <span className="pilihan-return-date">Return Wed, Dec 8</span>
                                <span className="pilihan-duration">2h 28m</span>
                            </div>

                            <div className="pilihan-airline-info">
                                <img src={emiratesLogo} alt="Emirates Logo" className="pilihan-airline-logo" />
                                <div className="pilihan-airline-text">
                                    <div className="pilihan-airline-name">Emirates</div>
                                    <div className="pilihan-aircraft-type">Airbus A320</div>
                                </div>
                                <div className="pilihan-flight-icons">
                                    <span className="pilihan-icon">✈️</span>
                                    <span className="pilihan-icon">📶</span>
                                    <span className="pilihan-icon">💺</span>
                                    <span className="pilihan-icon">🍱</span>
                                    <span className="pilihan-icon">🎧</span>
                                    <span className="pilihan-icon">♿</span>
                                </div>
                            </div>

                            <div className="pilihan-flight-times">
                                <div className="pilihan-departure">
                                    <div className="pilihan-time">12:00 pm</div>
                                    <div className="pilihan-airport">Newark(EWR)</div>
                                </div>
                                <div className="pilihan-flight-arrow">✈️</div>
                                <div className="pilihan-arrival">
                                    <div className="pilihan-time">12:00 pm</div>
                                    <div className="pilihan-airport">Newark(EWR)</div>
                                </div>
                            </div>
                        </div>

                        {/* Pay in full / Pay part now, part later */}
                        <div className="pilihan-payment-options-section">
                            <div
                                className={`pilihan-payment-option-card ${paymentOption === 'full' ? 'selected' : ''}`}
                                onClick={() => setPaymentOption('full')}
                            >
                                <div className="pilihan-option-text">
                                    <div className="pilihan-option-title">Pay in full</div>
                                    <div className="pilihan-option-description">Pay the total and you are all set</div>
                                </div>
                                <div className="pilihan-radio-button">
                                    {paymentOption === 'full' && <div className="pilihan-radio-inner-circle"></div>}
                                </div>
                            </div>

                            <div
                                className={`pilihan-payment-option-card ${paymentOption === 'part' ? 'selected' : ''}`}
                                onClick={() => setPaymentOption('part')}
                            >
                                <div className="pilihan-option-text">
                                    <div className="pilihan-option-title">Pay part now, part later</div>
                                    <div className="pilihan-option-description">
                                        Pay $297.43 now, and the rest ($297.43) will be automatically charged to the same
                                        payment method on Nov 14, 2022. No extra fees.
                                    </div>
                                </div>
                                <div className="pilihan-radio-button">
                                    {paymentOption === 'part' && <div className="pilihan-radio-inner-circle"></div>}
                                </div>
                            </div>
                            <div className="pilihan-more-info">More info</div>
                        </div>

                        {/* Credit Card Section */}
                        <div className="pilihan-credit-card-section">
                            <div className="pilihan-card-header">
                                <div className="pilihan-card-type-logo">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Visa_2021.svg/1200px-Visa_2021.svg.png" alt="Visa Logo" className="pilihan-visa-logo" /> {/* Placeholder for Visa logo */}
                                    <span className="pilihan-card-number">**** 4321</span>
                                    <span className="pilihan-expiry-date">02/27</span>
                                </div>
                                <div className="pilihan-radio-button selected">
                                    <div className="pilihan-radio-inner-circle"></div>
                                </div>
                            </div>
                            <div className="pilihan-add-new-card">
                                <div className="pilihan-add-icon">+</div>
                                <div className="pilihan-add-text">Add a new card</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Booking Summary */}
                    <div className="pilihan-right-section">
                        <div className="pilihan-booking-summary-card">
                            <div className="pilihan-booking-header">
                                <div className="pilihan-summary-flight-info">
                                    <div className="pilihan-summary-economy">Economy</div>
                                    <div className="pilihan-summary-flight-name">Emirates A380 Airbus</div>
                                </div>
                                <img src="https://via.placeholder.com/60" alt="Flight Image" className="pilihan-summary-flight-image" /> {/* Placeholder image */}
                            </div>
                            <div className="pilihan-rating">
                                <span className="pilihan-stars">⭐⭐⭐⭐</span>
                                <span className="pilihan-rating-text">Very Good</span>
                                <span className="pilihan-reviews">4 reviews</span>
                            </div>
                            <div className="pilihan-booking-protection">Your booking is protected by <span className="pilihan-golobe">golobe</span></div>

                            <div className="pilihan-price-details">
                                <div className="pilihan-price-item">
                                    <span className="pilihan-label">Base Fare</span>
                                    <span className="pilihan-value">$400</span>
                                </div>
                                <div className="pilihan-price-item">
                                    <span className="pilihan-label">Discount</span>
                                    <span className="pilihan-value">$400</span>
                                </div>
                                <div className="pilihan-price-item">
                                    <span className="pilihan-label">Taxes</span>
                                    <span className="pilihan-value">$400</span>
                                </div>
                                <div className="pilihan-price-item">
                                    <span className="pilihan-label">Service Fee</span>
                                    <span className="pilihan-value">$400</span>
                                </div>
                                <div className="pilihan-price-item pilihan-total">
                                    <span className="pilihan-label">Total</span>
                                    <span className="pilihan-value">$400</span>
                                </div>
                            </div>

                            {/* New Transaction Button */}
                            <button className="pilihan-proceed-button">Proceed to Transaction</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pilihan;