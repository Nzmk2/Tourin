import React, { useState } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }
    try {
      await API.post('/register', { // Using the /register endpoint for new users
        firstName,
        lastName,
        email,
        password,
        confPassword,
        passportNumber,
        role // The backend will default this to 'user' if not explicitly sent, but send it for clarity
      });
      navigate('/admin/users'); // Redirect to user list after successful creation
    } catch (error) {
      console.error("Failed to add user:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to add user. Please try again.");
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Add New User</h1>
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={saveUser}>
            {error && <div className="notification is-danger">{error}</div>}

            <div className="field">
              <label className="label">First Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
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
                  className="input"
                  type="text"
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
                  className="input"
                  type="email"
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
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirm Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Passport Number</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  placeholder="Passport Number (Optional)"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Role</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button type="submit" className="button is-primary">Save</button>
              </div>
              <div className="control">
                <button type="button" onClick={() => navigate('/admin/users')} className="button is-light">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddUser;