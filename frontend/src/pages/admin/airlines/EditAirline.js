// src/pages/admin/airline/EditAirline.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const EditAirline = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [website, setWebsite] = useState('');
    const [logo, setLogo] = useState(null);
    const [currentLogo, setCurrentLogo] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("mode", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    useEffect(() => {
        if (isSidebarClosed) {
            document.body.classList.add("close");
        } else {
            document.body.classList.remove("close");
        }
        localStorage.setItem("status", isSidebarClosed ? "close" : "open");
    }, [isSidebarClosed]);

    useEffect(() => {
        const getAirlineById = async () => {
            try {
                const response = await axiosInstance.get(`/airlines/${id}`);
                const airline = response.data;
                setName(airline.name);
                setCode(airline.code);
                setWebsite(airline.website);
                if (airline.logo) {
                    setCurrentLogo(`data:${airline.logoType};base64,${airline.logo}`);
                    setPreviewUrl(`data:${airline.logoType};base64,${airline.logo}`);
                }
                setLoading(false);
            } catch (error) {
                setMsg("Failed to fetch airline data");
                setMsgType('danger');
                console.error("Error fetching airline:", error);
                setLoading(false);
            }
        };
        getAirlineById();
    }, [id]);

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                setMsg("File size must be less than 5MB");
                setMsgType('danger');
                return;
            }

            if (!file.type.match('image.*')) {
                setMsg("Please select an image file");
                setMsgType('danger');
                return;
            }

            setLogo(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const updateAirline = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('code', code);
        formData.append('website', website);
        if (logo) {
            formData.append('logo', logo);
        }

        try {
            await axiosInstance.patch(`/airlines/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("Airline updated successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/airlines');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error updating airline:", error);
        }
    };

    if (loading) {
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
                        <div className="loading-spinner">Loading...</div>
                    </div>
                </section>
            </div>
        );
    }

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
                            <i className="uil uil-plane-fly icon"></i>
                            <div>
                                <h1 className="page-title">Edit Airline</h1>
                                <p className="page-subtitle">Update airline information.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateAirline}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Airline Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter airline name"
                                            required
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="code" className="form-label">Airline Code</label>
                                                <input
                                                    type="text"
                                                    id="code"
                                                    className="form-input"
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    placeholder="Enter airline code"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="website" className="form-label">Website</label>
                                                <input
                                                    type="url"
                                                    id="website"
                                                    className="form-input"
                                                    value={website}
                                                    onChange={(e) => setWebsite(e.target.value)}
                                                    placeholder="Enter website URL"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="logo" className="form-label">Airline Logo</label>
                                        <input
                                            type="file"
                                            id="logo"
                                            className="form-input file-input"
                                            onChange={handleLogoChange}
                                            accept="image/*"
                                        />
                                        {previewUrl && (
                                            <div className="image-preview">
                                                <img src={previewUrl} alt="Preview" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Update Airline
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

export default EditAirline;