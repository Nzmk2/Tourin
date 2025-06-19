import React, { useEffect, useState } from 'react';
import './Popular.css'; // Import the CSS file
import axiosInstance from '../../api/axiosConfig.js'; // Import axios instance

const Popular = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Corrected endpoint for popular destinations, prefixed with /api
        const response = await axiosInstance.get('/api/destinations/popular');
        setDestinations(response.data.data); // Accessing the 'data' array from the response
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    // Ensure rating is a number and within 0-5 for rendering stars
    const numRating = Math.max(0, Math.min(5, Math.round(rating)));
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i < numRating ? 'star-filled' : 'star-empty'}`}
        ></i>
      );
    }
    return <div className="card-rating">{stars}</div>;
  };

  if (loading) {
    return <section className="popular-destination-section">Loading popular destinations...</section>;
  }

  if (error) {
    return <section className="popular-destination-section">Error: {error.message}</section>;
  }

  return (
    <section className="popular-destination-section">
      <div className="section-header">
        <p className="subtitle">UNCOVER PLACE</p>
        <h2 className="title">POPULAR DESTINATION</h2>
        <p className="description">
          Fusce hic augue velit wisi quisibusdam pariatur, iusto primis, nec nemo, <br />
          rutrum. Vestibulum cumque laudantium. Sit ornare mollitia tenetur, aptent.
        </p>
      </div>

      <div className="destination-cards-container">
        {destinations.length > 0 ? (
          destinations.map(dest => (
            <div className="destination-card" key={dest.destinationID}>
              <div className="card-image-wrapper">
                {/* Use imageType to construct data URL */}
                <img src={`data:${dest.imageType};base64,${dest.image}`} alt={dest.city} className="card-image" />
                {renderStars(dest.rating)}
              </div>
              <div className="card-content">
                <p className="card-country">{dest.country}</p>
                <h3 className="card-city">{dest.city}</h3>
                <p className="card-description">{dest.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No popular destinations found.</p>
        )}
      </div>

      <div className='button-container'>
        <button className="more-destination-btn">MORE DESTINATION</button>
      </div>
    </section>
  );
};

export default Popular;