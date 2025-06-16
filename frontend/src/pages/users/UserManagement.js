import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to load users. Network error or server unavailable.");
      }
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      await axiosInstance.delete(`/users/${userId}`);
      getUsers();
      setMsg("User deleted successfully!");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Failed to delete user. Network error or server unavailable.");
      }
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Layout>
      <h1 className="title is-2">User Management</h1>
      <h2 className="subtitle is-4">Manage all user accounts.</h2>

      <div className="container mt-5">
        <div className="columns">
          <div className="column is-full">
            <Link to="/admin/users/add" className="button is-primary mb-3">Add New User</Link>
            {msg && <div className="notification is-light is-info">{msg}</div>}
            <div className="table-container">
              <table className="table is-striped is-fullwidth is-hoverable">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Passport Number</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userItem, index) => (
                    <tr key={userItem.id}>
                      <td>{index + 1}</td>
                      <td>{userItem.firstName}</td>
                      <td>{userItem.lastName}</td>
                      <td>{userItem.email}</td>
                      <td>{userItem.passportNumber || 'N/A'}</td>
                      <td>{userItem.role}</td>
                      <td>
                        <Link to={`/admin/users/edit/${userItem.id}`} className="button is-small is-info mr-2">Edit</Link>
                        {user && user.role === 'admin' && user.id !== userItem.id && (
                          <button onClick={() => deleteUser(userItem.id)} className="button is-small is-danger">Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserManagement;