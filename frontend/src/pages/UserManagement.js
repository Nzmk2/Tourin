import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/users/${userId}`);
        getUsers(); // Refresh the list
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Failed to delete user: " + (error.response?.data?.msg || error.message));
      }
    }
  };

  if (loading) return <Layout><p>Loading users...</p></Layout>;
  if (error) return <Layout><p className="has-text-danger">{error}</p></Layout>;

  return (
    <Layout>
      <h1 className="title is-2">User Management</h1>
      <Link to="/admin/users/add" className="button is-primary mb-3">Add New User</Link>
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
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.userID}>
                  <td>{index + 1}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.passportNumber}</td>
                  <td>{user.role}</td>
                  <td>
                    <Link to={`/admin/users/edit/${user.userID}`} className="button is-small is-info mr-2">Edit</Link>
                    <button onClick={() => deleteUser(user.userID)} className="button is-small is-danger">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="has-text-centered">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UserManagement;