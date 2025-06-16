import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import '../../assets/styles/Admin.css'; // Import Admin.css untuk layout dashboard (Sidebar & Navbar styles)
import '../../assets/styles/management.css'; // Pertahankan management.css untuk gaya spesifik tabel/form

// Impor komponen yang baru dipisahkan
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const UserManagement = () => {
    // State untuk mengelola status sidebar (buka/tutup) dan mode gelap/terang
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info'); // State untuk tipe pesan
    const [showModal, setShowModal] = useState(false); // State untuk modal konfirmasi
    const [userToDelete, setUserToDelete] = useState(null); // State untuk menyimpan ID yang akan dihapus

    // Efek samping untuk menerapkan kelas 'dark' ke elemen <body>
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Efek samping untuk menerapkan kelas 'close' ke elemen <body>
    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    // Handler untuk toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    // Handler untuk toggle dark mode
    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axiosInstance.get('/users');
            console.log("Data pengguna dari API:", response.data); // Ini untuk debugging, bisa dihapus nanti
            setUsers(response.data);
            setMsg('');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to load users. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error fetching users:", error);
        }
    };

    // Fungsi untuk menampilkan modal konfirmasi
    const confirmDelete = (userId) => {
        setUserToDelete(userId);
        setShowModal(true);
    };

    // Fungsi untuk menutup modal
    const cancelDelete = () => {
        setShowModal(false);
        setUserToDelete(null);
    };

    // Fungsi untuk melanjutkan penghapusan setelah konfirmasi
    const executeDelete = async () => {
        setShowModal(false); // Tutup modal
        if (!userToDelete) return; // Pastikan ada ID untuk dihapus

        try {
            await axiosInstance.delete(`/users/${userToDelete}`);
            setMsg("User deleted successfully!");
            setMsgType('success');
            getUsers(); // Muat ulang daftar pengguna
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Failed to delete user. Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error deleting user:", error);
        } finally {
            setUserToDelete(null); // Reset ID yang akan dihapus
        }
    };

    // Filter pengguna hanya yang memiliki role 'user' (menambahkan .toLowerCase() untuk case-insensitivity)
    const filteredUsers = users.filter(userItem => userItem.role && userItem.role.toLowerCase() === 'user');

    return (
        <div className="admin-dashboard-container">
            {/* Menggunakan komponen Sidebar */}
            <Sidebar
                isSidebarClosed={isSidebarClosed}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />

            <section className="dashboard">
                {/* Menggunakan komponen Navbar */}
                <Navbar toggleSidebar={toggleSidebar} />

                <div className="dash-content">
                    <div className="management-page-wrapper">
                        <div className="page-header">
                            <i className="uil uil-users-alt icon"></i> {/* Ikon Pengguna */}
                            <div>
                                <h1 className="page-title">User Management</h1>
                                <p className="page-subtitle">Manage all user accounts.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <Link to="/admin/users/add" className="action-button">
                                <i className="uil uil-plus"></i> Add New User
                            </Link>
                            {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}
                            <div className="data-table-container">
                                <table className="data-table">
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
                                        {/* Menggunakan filteredUsers */}
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((userItem, index) => (
                                                <tr key={userItem.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{userItem.firstName}</td>
                                                    <td>{userItem.lastName}</td>
                                                    <td>{userItem.email}</td>
                                                    <td>{userItem.passportNumber || 'N/A'}</td>
                                                    <td>{userItem.role}</td>
                                                    <td>
                                                        <Link to={`/admin/users/edit/${userItem.id}`} className="table-action-button edit">Edit</Link>
                                                        {/* Tombol Delete dengan ikon */}
                                                        <button onClick={() => confirmDelete(userItem.id)} className="table-action-button delete">
                                                            <i className="uil uil-trash"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="no-data-message">Tidak ada pengguna dengan peran 'user' yang ditemukan.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Konfirmasi Penghapusan</h3>
                        <p>Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="modal-buttons">
                            <button onClick={executeDelete} className="modal-button confirm">Hapus</button>
                            <button onClick={cancelDelete} className="modal-button cancel">Batal</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
