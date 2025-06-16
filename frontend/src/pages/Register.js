import React, { useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [passportNumber, setPassportNumber] = useState(''); // Optional for users
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
        role: 'user' // Default to 'user' for public registration
      });
      setMsg("Registration successful! You can now log in.");
      navigate('/login'); // Redirect to login page after successful registration
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
    <section className="hero is-fullheight is-fullwidth has-background-light">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-one-third">
              <form onSubmit={handleRegister} className="box p-5 has-shadow-2">
                <p className="has-text-centered has-text-info is-size-3 has-text-weight-bold mb-5">Register Tourin Account</p>
                {msg && (
                  <div className={`notification ${msg.includes('successful') ? 'is-success' : 'is-danger'} is-light`}>
                    {msg}
                  </div>
                )}
                <div className="field">
                  <label className="label">First Name</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Last Name</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="email"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Confirm Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      value={confPassword}
                      onChange={(e) => setConfPassword(e.target.value)}
                      placeholder="******"
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Passport Number (Optional)</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="e.g., A1234567"
                    />
                  </div>
                </div>

                <div className="field mt-5">
                  <button type="submit" className="button is-info is-fullwidth">Register</button>
                </div>
                <div className="has-text-centered mt-4">
                  <Link to="/login">Already have an account? Login here</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;