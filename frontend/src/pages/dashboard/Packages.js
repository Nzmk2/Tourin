import React from 'react';
import './Packages.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

// Import images
import beachHolidayImg from './shanghai.jpg'; // Adjust path as needed
import riverHolidayImg from './shanghai.jpg'; // Adjust path as needed
import santoriniImg from './shanghai.jpg';     // Adjust path as needed

const Packages = () => {
  const packageData = [
    {
      id: 1,
      image: beachHolidayImg,
      title: 'EXPERIENCE THE GREAT HOLIDAY ON BEACH',
      description: 'Laoreet, voluptatum nihil dolor esse quaerat mattis explicabo maiores, est aliquet porttitor eaque, cras, aspermatur.',
      duration: '7D / 6N',
      pax: '10 Pax',
      location: 'Malaysia',
      reviews: 25,
      rating: 5,
      price: 750
    },
    {
      id: 2,
      image: riverHolidayImg,
      title: 'SUMMER HOLIDAY TO THE OXOLOTAN RIVER',
      description: 'Laoreet, voluptatum nihil dolor esse quaerat mattis explicabo maiores, est aliquet porttitor eaque, cras, aspermatur.',
      duration: '7D / 6N',
      pax: '10 Pax',
      location: 'Malaysia', // Changed to reflect the image placeholder
      reviews: 20,
      rating: 5,
      price: 520
    },
    {
      id: 3,
      image: santoriniImg,
      title: 'SANTORINI ISLAND\'S WEEKEND VACATION',
      description: 'Laoreet, voluptatum nihil dolor esse quaerat mattis explicabo maiores, est aliquet porttitor eaque, cras, aspermatur.',
      duration: '7D / 6N',
      pax: '10 Pax',
      location: 'Malaysia', // Changed to reflect the image placeholder
      reviews: 40,
      rating: 5,
      price: 660
    },
  ];

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
        {packageData.map(pkg => (
          <div className="package-card" key={pkg.id}>
            <div className="package-card-left">
              <img src={pkg.image} alt={pkg.title} className="package-image" />
            </div>
            <div className="package-card-center">
              <h3 className="package-title">{pkg.title}</h3>
              <p className="package-description">{pkg.description}</p>
              <div className="package-meta">
                <span><FontAwesomeIcon icon={faClock} /> {pkg.duration}</span>
                <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {pkg.pax} | {pkg.location}</span>
              </div>
            </div>
            <div className="package-card-right">
              <div className="review-section">
                <span>({pkg.reviews} reviews)</span>
                <div className="rating-stars">
                  {renderStars(pkg.rating)}
                </div>
              </div>
              <div className="price-section">
                <span className="price">${pkg.price}</span>
                <span className="per-person">/ per person</span>
              </div>
              <button className="book-now-btn">BOOK NOW</button>
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-packages-btn">VIEW ALL PACKAGES</button>
    </section>
  );
};

export default Packages;