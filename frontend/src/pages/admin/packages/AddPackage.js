import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar from '../../../components/Navbar';

// Import CSS
import '../../../assets/styles/Admin.css';
import '../../../assets/styles/management.css';

// Current Date and Time: 2025-06-18 20:05:39
// Current User's Login: Nzmk2

const AddPackage = () => {
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
    const [previewUrl, setPreviewUrl] = useState(null);
    const [msg, setMsg] = useState('');
    const [msgType, setMsgType] = useState('info');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await axiosInstance.get('/destinations');
                setDestinations(response.data);
            } catch (error) {
                console.error("Error fetching destinations:", error);
                setMsg("Failed to load destinations");
                setMsgType('danger');
            }
        };
        fetchDestinations();
    }, []);

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

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handlePriceChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setPrice(value);
    };

    const savePackage = async (e) => {
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
            await axiosInstance.post('/packages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg("Package added successfully!");
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
            console.error("Error adding package:", error);
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
                                <h1 className="page-title">Add New Package</h1>
                                <p className="page-subtitle">Create a new travel package.</p>
                            </div>
                        </div>

                        <div className="management-container">
                            <div className="form-wrapper">
                                <form onSubmit={savePackage}>
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
                                        </div>
                                        {previewUrl && (
                                            <div className="image-preview">
                                                <img src={previewUrl} alt="Preview" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="form-submit-button">
                                            Add Package
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

export default AddPackage;