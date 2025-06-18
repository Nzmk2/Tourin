// src/pages/admin/destination/AddDestination.js

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const AddDestination = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPopular, setIsPopular] = useState(false);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();

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

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const handleImageChange = (e) => {
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

            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const saveDestination = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('country', country);
        formData.append('city', city);
        formData.append('description', description);
        formData.append('isPopular', isPopular);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axiosInstance.post('/destinations', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("Destination added successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/destinations');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error adding destination:", error);
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
                            <i className="uil uil-map-marker icon"></i>
                            <div>
                                <h1 className="page-title">Add New Destination</h1>
                                <p className="page-subtitle">Create a new destination record.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={saveDestination}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Destination Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-input"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter destination name"
                                            required
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="city" className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    className="form-input"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="Enter city"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="country" className="form-label">Country</label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    className="form-input"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    placeholder="Enter country"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            className="form-input"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter destination description"
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image" className="form-label">Destination Image</label>
                                        <input
                                            type="file"
                                            id="image"
                                            className="form-input file-input"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                        />
                                        {previewUrl && (
                                            <div className="image-preview">
                                                <img src={previewUrl} alt="Preview" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={isPopular}
                                                onChange={(e) => setIsPopular(e.target.checked)}
                                            />
                                            Mark as Popular Destination
                                        </label>
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Add Destination
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

export default AddDestination;