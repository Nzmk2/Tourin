import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [role, setRole] = useState('user');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/users', {
        firstName,
        lastName,
        email,
        password,
        confPassword,
        passportNumber,
        role
      });
      navigate('/admin/users');
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Network error or server unavailable.");
      }
      console.error("Error adding user:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Add New User</h1>
      <h2 className="subtitle is-4">Fill in the user details.</h2>
      <div className="box p-5">
        <p className="has-text-centered has-text-danger-dark mb-4">{msg}</p>
        <form onSubmit={saveUser}>
          <div className="field">
            <label className="label">First Name</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
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
                placeholder="Password"
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
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Passport Number</label>
            <div className="control">
              <input
                type="text"
                className="input"
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

          <div className="field mt-4">
            <div className="control">
              <button type="submit" className="button is-success">Save User</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddUser;