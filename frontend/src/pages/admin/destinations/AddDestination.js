import React, { useState, useEffect, useRef } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

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
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setMsg("File size must be less than 5MB");
                setMsgType('danger');
                return;
            }

            // Validate file type
            if (!file.type.match('image.*')) {
                setMsg("Please select an image file");
                setMsgType('danger');
                return;
            }

            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMsg(''); // Clear any previous error messages
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const clearMessage = () => {
        setTimeout(() => {
            setMsg('');
        }, 5000);
    };

    const validateForm = () => {
        const { name, country, city, description } = formData;
        
        if (!name.trim()) {
            setMsg("Destination name is required");
            setMsgType('danger');
            return false;
        }
        
        if (!country.trim()) {
            setMsg("Country is required");
            setMsgType('danger');
            return false;
        }
        
        if (!city.trim()) {
            setMsg("City is required");
            setMsgType('danger');
            return false;
        }
        
        if (!description.trim()) {
            setMsg("Description is required");
            setMsgType('danger');
            return false;
        }
        
        return true;
    };

    const saveDestination = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            clearMessage();
            return;
        }

        setIsLoading(true);
        setMsg('');

        // Log data yang akan dikirim
        console.log('Form Data:', formData);
        console.log('Image:', image);

        const submitFormData = new FormData();
        submitFormData.append('name', formData.name.trim());
        submitFormData.append('country', formData.country.trim());
        submitFormData.append('city', formData.city.trim());
        submitFormData.append('description', formData.description.trim());
        submitFormData.append('isPopular', String(formData.isPopular));
        
        if (image) {
            submitFormData.append('image', image);
        }

        // Log FormData entries
        for (let pair of submitFormData.entries()) {
            console.log('FormData Entry:', pair[0], pair[1]);
        }

        try {
            const response = await axiosInstance.post('/api/destinations', submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            console.log('Response:', response.data);

            if (response.data) {
                setMsg("Destination added successfully!");
                setMsgType('success');
                setTimeout(() => navigate('/admin/destinations'), 1500);
            }
        } catch (error) {
            console.error("Error adding destination:", error);
            
            if (error.response) {
                console.error('Error response:', error.response.data);
                setMsg(error.response.data.msg || "Failed to add destination");
            } else if (error.request) {
                console.error('Error request:', error.request);
                setMsg("Network error - no response received");
            } else {
                console.error('Error message:', error.message);
                setMsg("An error occurred while adding destination");
            }
            
            setMsgType('danger');
        } finally {
            setIsLoading(false);
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
                                    {msg && (
                                        <div className={`notification-message ${msgType}`}>
                                            {msg}
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="name" className="form-label">
                                            Destination Name <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            className="form-input"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter destination name"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="city" className="form-label">
                                                    City <span className="required">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    className="form-input"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter city"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="country" className="form-label">
                                                    Country <span className="required">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                    className="form-input"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter country"
                                                    required
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">
                                            Description <span className="required">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            className="form-input"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter destination description"
                                            rows="4"
                                            required
                                            disabled={isLoading}
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
                                                disabled={isLoading}
                                            />
                                            <button 
                                                type="button" 
                                                className="upload-button"
                                                onClick={handleUploadClick}
                                                disabled={isLoading}
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
                                                disabled={isLoading}
                                            />
                                            Mark as Popular Destination
                                        </label>
                                    </div>

                                    <div className="form-actions">
                                        <button 
                                            type="submit" 
                                            className="form-submit-button"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <i className="uil uil-spinner-alt rotating"></i>
                                                    Adding Destination...
                                                </>
                                            ) : (
                                                'Add Destination'
                                            )}
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