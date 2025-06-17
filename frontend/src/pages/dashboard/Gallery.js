import React from 'react';
import './Gallery.css'; // Import CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'; // For the arrow icon

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation'; // Only if you use default navigation buttons
import 'swiper/css/pagination'; // Only if you use default pagination (dots)

// Import required modules
import { Navigation, Pagination } from 'swiper/modules'; // For navigation and pagination

// Import images
import promoBlibli from './shanghai.jpg'; // Adjust path as needed
import visaProtection from './shanghai.jpg'; // Adjust path as needed
import danaPromo from './shanghai.jpg';     // Adjust path as needed
import dummyImage4 from './shanghai.jpg';     // Adjust path as needed
import dummyImage5 from './shanghai.jpg';     // Adjust path as needed

const Gallery = () => {
  const highlightsData = [
    {
      id: 1,
      image: promoBlibli,
      alt: 'Promo Menarik dari Blibli',
      link: '#',
    },
    {
      id: 2,
      image: visaProtection,
      alt: 'Mau ke luar negeri? Pakai Proteksi Visa & Perjalanan!',
      link: '#',
    },
    {
      id: 3,
      image: danaPromo,
      alt: 'Liburanmu! Bayar tiket pakai DANA',
      link: '#',
    },
    {
      id: 4,
      image: dummyImage4, // Dummy data
      alt: 'Dummy Promo 4',
      link: '#',
    },
    {
      id: 5,
      image: dummyImage5, // Dummy data
      alt: 'Dummy Promo 5',
      link: '#',
    },
  ];

  return (
    <section className="highlights-section">
      <h2 className="highlights-title">Gallery Destination</h2>
      <div className="highlights-wrapper"> {/* New wrapper for Swiper */}
        <Swiper
          spaceBetween={20} // Space between slides
          slidesPerView={3} // How many slides visible at once
          navigation={true} // Enable navigation arrows (prev/next)
          pagination={{ clickable: true }} // Enable pagination dots
          modules={[Navigation, Pagination]} // Add navigation and pagination modules
          className="mySwiper" // Class for custom styling if needed
          loop={true} // Loop the slides
          breakpoints={{
            // when window width is >= 320px
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {highlightsData.map(highlight => (
            <SwiperSlide key={highlight.id}>
              <a href={highlight.link} className="highlight-card" target="_blank" rel="noopener noreferrer">
                <img src={highlight.image} alt={highlight.alt} className="highlight-image" />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Gallery;