import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import '../../assets/styles/Register.css';
import loginImage from '../../assets/img/login.jpg';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMsg('');
        try {
            await axiosInstance.post('/register', {
                firstName,
                lastName,
                email,
                password,
                confPassword,
                passportNumber,
                role: 'user'
            });
            setMsg("Registration successful! You can now log in.");
            navigate('/login');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            } else {
                setMsg("Registration failed. Network error or server unavailable.");
            }
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="session">
            <div className="left" style={{ backgroundImage: `url(${loginImage})` }}>
                <svg enableBackground="new 0 0 300 302.5" version="1.1" viewBox="0 0 300 302.5" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                    <style type="text/css">
                        {`.st01{fill:#fff;}`}
                    </style>
                    <path className="st01" d="m126 302.2c-2.3 0.7-5.7 0.2-7.7-1.2l-105-71.6c-2-1.3-3.7-4.4-3.9-6.7l-9.4-126.7c-0.2-2.4 1.1-5.6 2.8-7.2l93.2-86.4c1.7-1.6 5.1-2.6 7.4-2.3l125.6 18.9c2.3 0.4 5.2 2.3 6.4 4.4l63.5 110.1c1.2 2 1.4 5.5 0.6 7.7l-46.4 118.3c-0.9 2.2-3.4 4.6-5.7 5.3l-121.4 37.4zm63.4-102.7c2.3-0.7 4.8-3.1 5.7-5.3l19.9-50.8c0.9-2.2 0.6-5.7-0.6-7.7l-27.3-47.3c-1.2-2-4.1-4-6.4-4.4l-53.9-8c-2.3-0.4-5.7 0.7-7.4 2.3l-40 37.1c-1.7 1.6-3 4.9-2.8 7.2l4.1 54.4c0.2 2.4 1.9 5.4 3.9 6.7l45.1 30.8c2 1.3 5.4 1.9 7.7 1.2l52-16.2z"/>
                </svg>
            </div>
            <form onSubmit={handleRegister} className="log-in" autoComplete="off">
                <h1 className="app-title">Tourin</h1>
                <h1 className="welcome-message">Create your Tourin account</h1>
                {msg && (
                    <div className={`notification ${msg.includes('successful') ? 'is-success' : 'is-danger'} is-light`}>
                        {msg}
                    </div>
                )}

                <div className="floating-label">
                    <input
                        placeholder="First Name"
                        type="text"
                        name="firstName"
                        id="firstName"
                        autoComplete="off"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <label htmlFor="firstName">First Name:</label>
                    <div className="icon">
                        <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </div>
                </div>

                <div className="floating-label">
                    <input
                        placeholder="Last Name"
                        type="text"
                        name="lastName"
                        id="lastName"
                        autoComplete="off"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <label htmlFor="lastName">Last Name:</label>
                    <div className="icon">
                        <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </div>
                </div>

                <div className="floating-label">
                    <input
                        placeholder="Email"
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="off"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="email">Email:</label>
                    <div className="icon">
                        <svg enableBackground="new 0 0 100 100" version="1.1" viewBox="0 0 100 100" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                            <style type="text/css">
                                {`.st0{fill:none;}`}
                            </style>
                            <g transform="translate(0 -952.36)">
                                <path d="m17.5 977c-1.3 0-2.4 1.1-2.4 2.4v45.9c0 1.3 1.1 2.4 2.4 2.4h64.9c1.3 0 2.4-1.1 2.4-2.4v-45.9c0-1.3-1.1-2.4-2.4-2.4h-64.9zm2.4 4.8h60.2v1.2l-30.1 22-30.1-22v-1.2zm0 7l28.7 21c0.8 0.6 2 0.6 2.8 0l28.7-21v34.1h-60.2v-34.1z"/>
                            </g>
                            <rect className="st0" width="100" height="100"/>
                        </svg>
                    </div>
                </div>

                <div className="floating-label">
                    <input
                        placeholder="Password"
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <div className="icon">
                        <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                            <style type="text/css">
                                {`.st0{fill:none;}.st1{fill:#010101;}`}
                            </style>
                            <rect className="st0" width="24" height="24"/>
                            <path className="st1" d="M19,21H5V9h14V21z M6,20h12V10H6V20z"/>
                            <path className="st1" d="M16.5,10h-1V7c0-1.9-1.6-3.5-3.5-3.5S8.5,5.1,8.5,7v3h-1V7c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5V10z"/>
                            <path className="st1" d="m12 16.5c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.5 1.5-1.5 1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5zm0-2c-0.3 0-0.5 0.2-0.5 0.5s0.2 0.5 0.5 0.5 0.5-0.2 0.5-0.5-0.2-0.5-0.5-0.5z"/>
                        </svg>
                    </div>
                </div>

                <div className="floating-label">
                    <input
                        placeholder="Confirm Password"
                        type="password"
                        name="confPassword"
                        id="confPassword"
                        autoComplete="off"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        required
                    />
                    <label htmlFor="confPassword">Confirm Password:</label>
                    <div className="icon">
                        <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                            <style type="text/css">
                                {`.st0{fill:none;}.st1{fill:#010101;}`}
                            </style>
                            <rect className="st0" width="24" height="24"/>
                            <path className="st1" d="M19,21H5V9h14V21z M6,20h12V10H6V20z"/>
                            <path className="st1" d="M16.5,10h-1V7c0-1.9-1.6-3.5-3.5-3.5S8.5,5.1,8.5,7v3h-1V7c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5V10z"/>
                            <path className="st1" d="m12 16.5c-0.8 0-1.5-0.7-1.5-1.5s0.7-1.5 1.5-1.5 1.5 0.7 1.5 1.5-0.7 1.5-1.5 1.5zm0-2c-0.3 0-0.5 0.2-0.5 0.5s0.2 0.5 0.5 0.5 0.5-0.2 0.5-0.5-0.2-0.5-0.5-0.5z"/>
                        </svg>
                    </div>
                </div>

                <div className="floating-label">
                    <input
                        placeholder="Passport Number (Optional)"
                        type="text"
                        name="passportNumber"
                        id="passportNumber"
                        autoComplete="off"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                    />
                    <label htmlFor="passportNumber">Passport Number (Optional):</label>
                    <div className="icon">
                        <svg enableBackground="new 0 0 24 24" version="1.1" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 16H7v-2h10v2zm0-4H7V8h10v6z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" className="register-button">Register</button> {/* <--- Tambahkan className="register-button" di sini */}
                    <p className="login-text">Already have an account?{' '}
                        <Link to="/login" className="login-link">Sign In</Link>
                    </p>
                </div>

            </form>
        </div>
    );
};

export default Register;