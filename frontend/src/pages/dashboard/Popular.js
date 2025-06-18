import React, { useEffect, useState } from 'react';
import './Popular.css'; // Import the CSS file

const Popular = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Assuming your backend is running on http://localhost:5000
        // You might need to adjust this URL based on your actual backend setup
        const response = await fetch('http://localhost:5000/destinations'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDestinations(data);
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
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${i < rating ? 'star-filled' : 'star-empty'}`}
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
                <img src={dest.imageUrl} alt={dest.city} className="card-image" />
                {/* Assuming your backend provides a 'rating' field, otherwise you might need to add it or default it */}
                {renderStars(dest.rating || 5)} 
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