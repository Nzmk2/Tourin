import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';

const EditUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [role, setRole] = useState('user');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        const userData = response.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPassportNumber(userData.passportNumber || '');
        setRole(userData.role);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        } else {
          setMsg("Network error or server unavailable.");
        }
        console.error("Error fetching user data for edit:", error);
      }
    };
    getUserById();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/users/${id}`, {
        firstName,
        lastName,
        email,
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
      console.error("Error updating user:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">Edit User</h1>
      <h2 className="subtitle is-4">Update user details.</h2>
      <div className="box p-5">
        <p className="has-text-centered has-text-danger-dark mb-4">{msg}</p>
        <form onSubmit={updateUser}>
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
              <button type="submit" className="button is-success">Update User</button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditUser;