import React from 'react';
import './Popular.css'; // Import the CSS file

// Import your images. Make sure these paths are correct relative to Popular.js
import italySanMiguelImg from './shanghai.jpg'; // Assuming you have this image
import dubaiBurjKhalifaImg from './shanghai.jpg'; // Assuming you have this image
import japanKyotoTempleImg from './shanghai.jpg'; // Assuming you have this image

const Popular = () => {
  // Data for the destination cards
  const destinations = [
    {
      id: 1,
      country: 'ITALY',
      city: 'SAN MIGUEL',
      image: italySanMiguelImg,
      description: 'Fusce hic augue velit wisi quisibusdam pariatur, iusto.',
      rating: 5 // Or an array like [1, 1, 1, 1, 1] if you want to render stars dynamically
    },
    {
      id: 2,
      country: 'DUBAI',
      city: 'BURJ KHALIFA',
      image: dubaiBurjKhalifaImg,
      description: 'Fusce hic augue velit wisi quisibusdam pariatur, iusto.',
      rating: 5
    },
    {
      id: 3,
      country: 'JAPAN',
      city: 'KYOTO TEMPLE',
      image: japanKyotoTempleImg,
      description: 'Fusce hic augue velit wisi quisibusdam pariatur, iusto.',
      rating: 5
    },
  ];

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
        {destinations.map(dest => (
          <div className="destination-card" key={dest.id}>
            <div className="card-image-wrapper">
              <img src={dest.image} alt={dest.city} className="card-image" />
              {renderStars(dest.rating)} {/* Render stars here */}
            </div>
            <div className="card-content">
              <p className="card-country">{dest.country}</p>
              <h3 className="card-city">{dest.city}</h3>
              <p className="card-description">{dest.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='button-container'>
        <button className="more-destination-btn">MORE DESTINATION</button>
      </div>
    </section>
  );
};

export default Popular;