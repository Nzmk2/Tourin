import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const EditDestination = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [formData, setFormData] = useState({
        name: '',
        country: '',
        city: '',
        description: '',
        isPopular: false
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const getDestinationById = async () => {
            try {
                const response = await axiosInstance.get(`/api/destinations/${id}`);
                const destination = response.data;
                setFormData({
                    name: destination.name,
                    country: destination.country,
                    city: destination.city,
                    description: destination.description,
                    isPopular: destination.isPopular
                });
                if (destination.image) {
                    const imageUrl = `data:${destination.imageType};base64,${destination.image}`;
                    setPreviewUrl(imageUrl);
                }
                setLoading(false);
            } catch (error) {
                setMsg(error.response?.data?.msg || "Failed to fetch destination data");
                setMsgType('danger');
                console.error("Error fetching destination:", error);
                setLoading(false);
            }
        };
        getDestinationById();
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
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const validateForm = () => {
        if (!formData.name.trim()) {
            setMsg("Destination name is required");
            setMsgType('danger');
            return false;
        }

        if (!formData.country.trim()) {
            setMsg("Country is required");
            setMsgType('danger');
            return false;
        }

        if (!formData.city.trim()) {
            setMsg("City is required");
            setMsgType('danger');
            return false;
        }

        if (!formData.description.trim()) {
            setMsg("Description is required");
            setMsgType('danger');
            return false;
        }

        return true;
    };

    const updateDestination = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const formPayload = new FormData();
        formPayload.append('name', formData.name.trim());
        formPayload.append('country', formData.country.trim());
        formPayload.append('city', formData.city.trim());
        formPayload.append('description', formData.description.trim());
        formPayload.append('isPopular', formData.isPopular);
        if (image) {
            formPayload.append('image', image);
        }

        try {
            await axiosInstance.patch(`/api/destinations/${id}`, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("Destination updated successfully!");
            setMsgType('success');
            setTimeout(() => navigate('/admin/destinations'), 1500);
        } catch (error) {
            console.error('Error updating destination:', error);
            setMsg(error.response?.data?.msg || "Failed to update destination");
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
                            <i className="uil uil-map-marker icon"></i>
                            <div>
                                <h1 className="page-title">Edit Destination</h1>
                                <p className="page-subtitle">Update destination information</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updateDestination}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">Destination Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter destination name"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="city" className="form-label">City</label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    className="form-input"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter city"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="country" className="form-label">Country</label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                    className="form-input"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter country"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-input"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter destination description"
                                            rows="4"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image" className="form-label">Destination Image</label>
                                        <div className="custom-file-upload">
                                            <input
                                                type="file"
                                                id="image"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
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
                                                Choose Image
                                            </button>
                                            {image && <span className="file-name">{image.name}</span>}
                                        </div>
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
                                                name="isPopular"
                                                checked={formData.isPopular}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting}
                                            />
                                            Mark as Popular Destination
                                        </label>
                                    </div>

                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="form-submit-button"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Updating...' : 'Update Destination'}
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

export default EditDestination;