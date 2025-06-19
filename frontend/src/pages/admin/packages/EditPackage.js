import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

const EditPackage = () => {
    const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
        return localStorage.getItem("status") === "close";
    });
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("mode") === "dark";
    });

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [maxPax, setMaxPax] = useState('');
    const [location, setLocation] = useState('');
    const [destinationID, setDestinationID] = useState('');
    const [destinations, setDestinations] = useState([]);
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [packageRes, destinationsRes] = await Promise.all([
                    axiosInstance.get(`/api/packages/${id}`),
                    axiosInstance.get('/api/destinations')
                ]);

                const packageData = packageRes.data;
                setTitle(packageData.title);
                setDescription(packageData.description);
                setPrice(packageData.price.toString());
                setDuration(packageData.duration);
                setMaxPax(packageData.maxPax.toString());
                setLocation(packageData.location);
                setDestinationID(packageData.destinationID);

                // Preview image
                if (packageData.imageUrl) {
                    setCurrentImage(packageData.imageUrl);
                    setPreviewUrl(packageData.imageUrl);
                } else if (packageData.image && packageData.imageType) {
                    const url = `data:${packageData.imageType};base64,${packageData.image}`;
                    setCurrentImage(url);
                    setPreviewUrl(url);
                } else {
                    setCurrentImage(null);
                    setPreviewUrl(null);
                }

                setDestinations(destinationsRes.data);
                setLoading(false);
            } catch (error) {
                let errorMsg = "Failed to fetch package data";
                if (error.response?.data?.msg) {
                    errorMsg += `: ${error.response.data.msg}`;
                }
                setMsg(errorMsg);
                setMsgType('danger');
                setLoading(false);
                console.error("Error fetching package:", error);
                if (error.response) {
                    console.error("Backend response:", error.response.data);
                }
            }
        };

        fetchData();
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

    const toggleSidebar = () => {
        setIsSidebarClosed(prevState => !prevState);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevState => !prevState);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) {
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

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setPrice(value);
    };

    const updatePackage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('duration', duration);
        formData.append('maxPax', maxPax);
        formData.append('location', location);
        formData.append('destinationID', destinationID);
        if (image) {
            formData.append('image', image);
        }

        try {
            // PATCH juga harus ke /api/packages/:id
            await axiosInstance.patch(`/api/packages/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("Package updated successfully!");
            setMsgType('success');
            setTimeout(() => {
                navigate('/admin/packages');
            }, 1500);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
                setMsgType('danger');
            } else {
                setMsg("Network error or server unavailable.");
                setMsgType('danger');
            }
            console.error("Error updating package:", error);
        }
    };

    const formatPrice = (value) => {
        if (!value) return '';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
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
                            <i className="uil uil-box icon"></i>
                            <div>
                                <h1 className="page-title">Edit Package</h1>
                                <p className="page-subtitle">Update package information.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={updatePackage}>
                                    {msg && <div className={`notification-message ${msgType}`}>{msg}</div>}

                                    <div className="form-group">
                                        <label htmlFor="title" className="form-label">Package Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            className="form-input"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter package title"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea
                                            id="description"
                                            className="form-input"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter package description"
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="price" className="form-label">Price (IDR)</label>
                                                <input
                                                    type="text"
                                                    id="price"
                                                    className="form-input"
                                                    value={formatPrice(price)}
                                                    onChange={handlePriceChange}
                                                    placeholder="Enter price"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="duration" className="form-label">Duration</label>
                                                <input
                                                    type="text"
                                                    id="duration"
                                                    className="form-input"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    placeholder="e.g., 3D/2N"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-row">
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="maxPax" className="form-label">Maximum Participants</label>
                                                <input
                                                    type="number"
                                                    id="maxPax"
                                                    className="form-input"
                                                    value={maxPax}
                                                    onChange={(e) => setMaxPax(e.target.value)}
                                                    placeholder="Enter max participants"
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-col-half">
                                            <div className="form-group">
                                                <label htmlFor="location" className="form-label">Location</label>
                                                <input
                                                    type="text"
                                                    id="location"
                                                    className="form-input"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    placeholder="Enter location"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="destinationID" className="form-label">Destination</label>
                                        <select
                                            id="destinationID"
                                            className="form-input"
                                            value={destinationID}
                                            onChange={(e) => setDestinationID(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a destination</option>
                                            {destinations.map(dest => (
                                                <option key={dest.destinationID} value={dest.destinationID}>
                                                    {dest.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="image" className="form-label">Package Image</label>
                                        <div className="custom-file-upload">
                                            <input
                                                type="file"
                                                id="image"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                            <button 
                                                type="button" 
                                                className="upload-button"
                                                onClick={handleUploadClick}
                                            >
                                                <i className="uil uil-image-upload"></i>
                                                Choose Image
                                            </button>
                                            {image && <span className="file-name">{image.name}</span>}
                                            {!image && currentImage && <span className="file-name">Current image loaded</span>}
                                        </div>
                                        {previewUrl && (
                                            <div className="image-preview">
                                                <img src={previewUrl} alt="Preview" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Update Package
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

export default EditPackage;