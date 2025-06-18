import React, { useState, useEffect, useRef } from 'react';
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

    const [formData, setFormData] = useState({
        name: '',
        code: ''
    });
    const [logo, setLogo] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getAirlineById = async () => {
            try {
                const response = await axiosInstance.get(`/api/airlines/${id}`);
                const airline = response.data;
                setFormData({
                    name: airline.name,
                    code: airline.code
                });
                if (airline.logo) {
                    const logoUrl = `data:${airline.logoType};base64,${airline.logo}`;
                    setPreviewUrl(logoUrl);
                }
                setLoading(false);
            } catch (error) {
                setMsg(error.response?.data?.msg || "Failed to fetch airline data");
                setMsgType('danger');
                console.error("Error fetching airline:", error);
                setLoading(false);
            }
        };
        getAirlineById();
    }, [id]);

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

    const toggleSidebar = () => setIsSidebarClosed(prev => !prev);
    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const validateForm = () => {
        if (!formData.name.trim()) {
            setMsg("Airline name is required");
            setMsgType('danger');
            return false;
        }

        if (!formData.code.trim()) {
            setMsg("Airline code is required");
            setMsgType('danger');
            return false;
        }

        if (formData.code.length > 10) {
            setMsg("Airline code must be 10 characters or less");
            setMsgType('danger');
            return false;
        }

        return true;
    };

    const updateAirline = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const formPayload = new FormData();
        formPayload.append('name', formData.name.trim());
        formPayload.append('code', formData.code.trim());
        if (logo) {
            formPayload.append('logo', logo);
        }

        try {
            await axiosInstance.patch(`/api/airlines/${id}`, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("Airline updated successfully!");
            setMsgType('success');
            setTimeout(() => navigate('/admin/airlines'), 1500);
        } catch (error) {
            console.error('Error updating airline:', error);
            setMsg(error.response?.data?.msg || "Failed to update airline");
            setMsgType('danger');
        } finally {
            setIsSubmitting(false);
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
                                <p className="page-subtitle">Update airline information</p>
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
                                            name="name"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter airline name"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="code" className="form-label">Airline Code</label>
                                        <input
                                            type="text"
                                            id="code"
                                            name="code"
                                            className="form-input"
                                            value={formData.code}
                                            onChange={handleInputChange}
                                            placeholder="Enter airline code (max 10 characters)"
                                            maxLength={10}
                                            required
                                            disabled={isSubmitting}
                                        />
                                        <small className="form-text text-muted">
                                            Maximum 10 characters
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="logo" className="form-label">Airline Logo</label>
                                        <div className="custom-file-upload">
                                            <input
                                                type="file"
                                                id="logo"
                                                ref={fileInputRef}
                                                onChange={handleLogoChange}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                disabled={isSubmitting}
                                            />
                                            <button 
                                                type="button" 
                                                className="upload-button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isSubmitting}
                                            >
                                                <i className="uil uil-image-upload"></i>
                                                Choose Logo
                                            </button>
                                            {logo && <span className="file-name">{logo.name}</span>}
                                        </div>
                                        {previewUrl && (
                                            <div className="image-preview">
                                                <img src={previewUrl} alt="Preview" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="form-submit-button"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Updating...' : 'Update Airline'}
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