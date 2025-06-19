import React, { useState, useEffect } from 'react';
import './Gallery.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import axiosInstance from '../../api/axiosConfig';

const Gallery = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axiosInstance.get('/api/destinations');
        // Konversi BLOB image menjadi URL yang dapat ditampilkan
        const destinationsWithImages = response.data.map(destination => ({
          ...destination,
          imageUrl: destination.image ? 
            `data:${destination.imageType};base64,${destination.image}` : 
            '/default-destination-image.jpg' // Gambar default jika tidak ada
        }));
        setDestinations(destinationsWithImages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations');
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="highlights-section">
      <h2 className="highlights-title">Gallery Destination</h2>
      <div className="highlights-wrapper">
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="mySwiper"
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {destinations.map(destination => (
            <SwiperSlide key={destination.destinationID}>
              <div className="highlight-card">
                <img 
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="highlight-image"
                />
                <div className="destination-info">
                  <h3>{destination.name}</h3>
                  <p>{destination.city}, {destination.country}</p>
                  {destination.isPopular && <span className="popular-badge">Popular</span>}
                  <div className="rating">
                    <span>⭐ {destination.rating.toFixed(1)}</span>
                    <span className="review-count">({destination.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Gallery;