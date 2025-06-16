import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import API from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Allow optional password change
  const [confPassword, setConfPassword] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the userID from the URL

  useEffect(() => {
    getUserById();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserById = async () => {
    try {
      const response = await API.get(`/users/${id}`);
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);
      setEmail(response.data.email);
      setPassportNumber(response.data.passportNumber || ''); // Handle null if no passport
      setRole(response.data.role);
    } catch (error) {
      console.error("Failed to fetch user:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to load user data.");
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    setError(null);
    if (password && password !== confPassword) { // Only check if password fields are used
      setError("Password and Confirm Password do not match.");
      return;
    }
    try {
      const updateData = {
        firstName,
        lastName,
        email,
        passportNumber,
        role,
      };
      if (password) { // Only send password if user wants to change it
        updateData.password = password;
        updateData.confPassword = confPassword; // Backend expects both for validation
      }

      await API.patch(`/users/${id}`, updateData);
      navigate('/admin/users');
    } catch (error) {
      console.error("Failed to update user:", error.response?.data || error.message);
      setError(error.response?.data?.msg || "Failed to update user. Please try again.");
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Edit User</h1>
      <div className="columns is-centered">
        <div className="column is-half">
          <form onSubmit={updateUser}>
            {error && <div className="notification is-danger">{error}</div>}

            <div className="field">
              <label className="label">User ID</label>
              <div className="control">
                <input className="input" type="text" value={id} disabled />
              </div>
            </div>

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
              <label className="label">New Password (leave blank to keep current)</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Confirm New Password</label>
              <div className="control">
                <input
                  className="input"
                  type="password"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                  placeholder="Confirm New Password"
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
                  placeholder="Passport Number"
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
                <button type="submit" className="button is-primary">Update</button>
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

export default EditUser;