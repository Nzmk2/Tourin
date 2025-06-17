import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig'; // Sesuaikan path jika perlu
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar'; // Sesuaikan path jika perlu
import Navbar from '../../../components/Navbar';   // Sesuaikan path jika perlu

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const EditUser = () => {
    // State untuk kontrol UI Sidebar dan Dark Mode
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    // State untuk data form user
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [role, setRole] = useState('user'); // Default value 'user'
    
    // State untuk pesan notifikasi
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info'); // 'info', 'success', 'danger'

    const navigate = useNavigate();
    // Mengambil parameter ID dari URL dan mengaliasnya menjadi userID
    const { id: userID } = useParams(); 

    // Effect untuk mengelola status sidebar (open/close)
    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    // Effect untuk mengelola dark mode
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    // Fungsi untuk mengubah status sidebar
    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    // Fungsi untuk mengubah mode gelap/terang
    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    // Effect untuk mengambil data user berdasarkan ID saat komponen dimuat atau userID berubah
    useEffect(() => {
        const getUserById = async () => {
            try {
                // Pastikan userID ada sebelum memanggil API
                if (!userID) {
                    setMsg("No user ID provided for editing.");
                    setMsgType('danger');
                    // Opsional: Redirect jika ID tidak ada
                    // navigate('/admin/users'); 
                    return; 
                }

                const response = await axiosInstance.get(`/users/${userID}`);
                const userData = response.data;

                // Pastikan data user tidak null atau undefined
                if (!userData) {
                    setMsg("User data not found for the given ID.");
                    setMsgType('danger');
                    // Opsional: Redirect jika user tidak ditemukan
                    // navigate('/admin/users'); 
                    return;
                }

                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setEmail(userData.email);
                // Pastikan passportNumber selalu string, bahkan jika null dari backend
                setPassportNumber(userData.passportNumber || ''); 
                setRole(userData.role);

            } catch (error) {
                // Tangani error dari respons backend (misal: 404 Not Found)
                if (error.response) {
                    setMsg(error.response.data.msg || "Error fetching user data from server.");
                    setMsgType('danger');
                } else {
                    // Tangani error jaringan atau server tidak responsif
                    setMsg("Network error or server unavailable. Please check your connection.");
                    setMsgType('danger');
                }
                console.error("Error fetching user data for edit:", error);
            }
        };
        getUserById();
    }, [userID, navigate]); // `Maps` ditambahkan ke dependency array karena digunakan di dalam effect

    // Fungsi untuk mengupdate data user
    const updateUser = async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        try {
            await axiosInstance.patch(`/users/${userID}`, {
                firstName,
                lastName,
                email,
                passportNumber,
                role
            });
            setMsg("User updated successfully!");
            setMsgType('success');
            // Redirect ke halaman daftar user setelah 1.5 detik
            setTimeout(() => {
                navigate('/admin/users');
            }, 1500);
        } catch (error) {
            // Tangani error dari respons backend (misal: validasi gagal, email duplikat)
            if (error.response) {
                setMsg(error.response.data.msg || "Failed to update user.");
                setMsgType('danger');
            } else {
                // Tangani error jaringan
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error updating user:", error);
        }
    };

    return (
        <div className="admin-dashboard-container">
            <Sidebar
                isSidebarClosed={isSidebarClosed}
                toggleDarkMode={toggleDarkMode}
                isDarkMode={isDarkMode}
            />

            <section className="dashboard">
                <Navbar toggleSidebar={toggleSidebar} />

                <div className="dash-content">
                    <div className="management-page-wrapper">
                        <div className="page-header">
                            <i className="uil uil-user icon"></i> {/* Icon untuk user */}
                            <div>
                                <h1 className="page-title">Edit User</h1>
                                <p className="page-subtitle">Update the user details below.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateUser}>
                                    {/* Tampilkan pesan notifikasi jika ada */}
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="flex-row">
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="firstName" className="form-label">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    id="firstName"
                                                    placeholder="First Name"
                                                    className="form-input"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half sm">
                                            <div className="form-group">
                                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    id="lastName"
                                                    placeholder="Last Name"
                                                    className="form-input"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Email"
                                            className="form-input"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="passportNumber" className="form-label">Passport Number</label>
                                        <input
                                            type="text"
                                            name="passportNumber"
                                            id="passportNumber"
                                            placeholder="Passport Number (Optional)"
                                            className="form-input"
                                            value={passportNumber}
                                            onChange={(e) => setPassportNumber(e.target.value)}
                                            // passportNumber tidak required di model Sequelize, jadi tidak perlu `required` di sini
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="role" className="form-label">Role</label>
                                        <div className="custom-select-wrapper">
                                            <select
                                                name="role"
                                                id="role"
                                                className="form-input custom-select"
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                required
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="form-submit-button">
                                            Update User
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EditUser;