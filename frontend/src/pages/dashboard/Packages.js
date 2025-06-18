import React, { useEffect, useState } from 'react';
import './Packages.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

const Packages = () => {
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Assuming your backend is running on http://localhost:5000
        // Use /packages to get all packages including destination data
        const response = await fetch('http://localhost:5000/packages'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPackageData(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={i < rating ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return <section className="packages-section">Loading packages...</section>;
  }

  if (error) {
    return <section className="packages-section">Error: {error.message}</section>;
  }

  return (
    <section className="packages-section">
      <div className="section-header">
        <p className="subtitle">POPULAR PACKAGES</p>
        <h2 className="title">CHECKOUT OUR PACKAGES</h2>
        <p className="description">
          Fusce hic augue velit wisi quisibusdam pariatur, iusto primis, nec nemo, <br />
          rutrum. Vestibulum cumque laudantium. Sit ornare mollitia tenetur, aptent.
        </p>
      </div>

      <div className="packages-list-container">
        {packageData.length > 0 ? (
          packageData.map(pkg => (
            <div className="package-card" key={pkg.packageID}>
              <div className="package-card-left">
                {/* Use pkg.imageUrl for the package image if available, otherwise fallback to destination image */}
                <img 
                  src={pkg.imageUrl || (pkg.Destination && pkg.Destination.imageUrl)} 
                  alt={pkg.title} 
                  className="package-image" 
                />
              </div>
              <div className="package-card-center">
                <h3 className="package-title">{pkg.title}</h3>
                <p className="package-description">{pkg.description}</p>
                <div className="package-meta">
                  <span><FontAwesomeIcon icon={faClock} /> {pkg.duration}</span>
                  {/* Access location and maxPax from fetched data, fallback to Destination's city/country */}
                  <span>
                    <FontAwesomeIcon icon={faMapMarkerAlt} /> 
                    {pkg.maxPax} Pax | {pkg.location || (pkg.Destination && `${pkg.Destination.city}, ${pkg.Destination.country}`)}
                  </span>
                </div>
              </div>
              <div className="package-card-right">
                <div className="review-section">
                  {/* Assuming your Package model has a reviewCount field, otherwise default */}
                  <span>({pkg.reviewCount || 0} reviews)</span>
                  {/* Assuming your Package model has a rating field, otherwise default */}
                  <div className="rating-stars">
                    {renderStars(pkg.rating || 5)}
                  </div>
                </div>
                <div className="price-section">
                  <span className="price">${pkg.price}</span>
                  <span className="per-person">/ per person</span>
                </div>
                <button className="book-now-btn">BOOK NOW</button>
              </div>
            </div>
          ))
        ) : (
          <p>No packages found.</p>
        )}
      </div>

      <button className="view-all-packages-btn">VIEW ALL PACKAGES</button>
    </section>
  );
};

export default Packages;