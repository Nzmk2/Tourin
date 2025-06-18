import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
    // State untuk data input formulir
    const [departureCity, setDepartureCity] = useState(''); // Akan diisi dari data bandara
    const [arrivalCity, setArrivalCity] = useState('');   // Akan diisi dari data bandara
    // Mengatur tanggal default ke hari ini dan dua hari setelahnya dalam format YYYY-MM-DD
    const [departureDate, setDepartureDate] = useState(new Date().toISOString().slice(0, 10));
    const [returnDate, setReturnDate] = useState(new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().slice(0, 10));

    // State untuk data bandara dari backend
    const [airportOptions, setAirportOptions] = useState([]);
    const [loadingAirports, setLoadingAirports] = useState(true);
    const [errorAirports, setErrorAirports] = useState(null);

    // useEffect untuk mengambil data bandara saat komponen dimuat
    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await fetch('http://localhost:5000/airports'); // Sesuaikan URL API jika berbeda
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAirportOptions(data);
                // Set nilai default awal setelah bandara dimuat
                if (data.length > 0) {
                    setDepartureCity(data[0].airportCode); // Set bandara pertama sebagai keberangkatan default
                    if (data.length > 1) {
                        setArrivalCity(data[1].airportCode); // Set bandara kedua sebagai kedatangan default
                    } else {
                        setArrivalCity(data[0].airportCode); // Jika hanya satu, set yang sama untuk kedatangan
                    }
                }
            } catch (error) {
                console.error("Error fetching airports:", error);
                setErrorAirports(error.message);
            } finally {
                setLoadingAirports(false);
            }
        };

        fetchAirports();
    }, []); // Array dependensi kosong berarti efek ini hanya berjalan sekali saat mount

    // Fungsi helper untuk memformat tanggal agar mudah dibaca (contoh: 10 Jul 2025)
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'DD/MM/YYYY';
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options);
    };

    // Fungsi untuk menukar kota keberangkatan dan kedatangan
    const handleSwapCities = () => {
        setDepartureCity(arrivalCity);
        setArrivalCity(departureCity);
    };

    // Fungsi yang dipanggil saat formulir pencarian disubmit
    const handleSearch = (e) => {
        e.preventDefault(); // Mencegah refresh halaman
        console.log({
            departureCity,
            arrivalCity,
            departureDate,
            returnDate
        });
        // Di sini Anda biasanya akan menavigasi ke halaman hasil pencarian
        // atau membuat panggilan API ke endpoint pencarian penerbangan/tur Anda.
        // Contoh:
        // fetch('/api/search-flights', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ departureCity, arrivalCity, departureDate, returnDate }),
        // })
        // .then(response => response.json())
        // .then(data => console.log('Search results:', data))
        // .catch(error => console.error('Error during search:', error));
    };

    return (
        <div className="hero-container">
            <div className="hero-content">
                <h1 className="main-title">Tourin Aja</h1>
                <h2 className='text-title'>Tourin hadir sebagai sahabat perjalanan terbaikmu! Kami menawarkan pengalaman wisata yang menyenangkan, nyaman, dan penuh petualangan ke berbagai destinasi impian. Dengan harga terjangkau dan layanan profesional, setiap perjalanan bersama Tourin akan menjadi kenangan tak terlupakan. Nikmati keindahan alam, kekayaan budaya, hingga kuliner khas daerah dengan cara yang seru dan aman. Saatnya wujudkan liburan impianmu bersama Tourin – #TravelWithTourin!</h2>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="input-group origin-destination">
                        <div className="input-field city-input">
                            <label>Dari</label>
                            {loadingAirports ? (
                                <p>Memuat bandara...</p>
                            ) : errorAirports ? (
                                <p>Error: {errorAirports}</p>
                            ) : (
                                <select
                                    value={departureCity}
                                    onChange={(e) => setDepartureCity(e.target.value)}
                                >
                                    {/* Opsi default jika belum ada bandara terpilih atau untuk instruksi */}
                                    {airportOptions.length === 0 && <option value="">Tidak ada bandara tersedia</option>}
                                    {airportOptions.map((airport) => (
                                        <option key={airport.airportCode} value={airport.airportCode}>
                                            {airport.airportName} ({airport.airportCode})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <button type="button" className="swap-button" onClick={handleSwapCities}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 16v-3h8v-2H6V8L2 12l4 4zm10-5V8h-8v2h8v3l4-4-4-4z"/>
                            </svg>
                        </button>
                        <div className="input-field city-input">
                            <label>Ke</label>
                            {loadingAirports ? (
                                <p>Memuat bandara...</p>
                            ) : errorAirports ? (
                                <p>Error: {errorAirports}</p>
                            ) : (
                                <select
                                    value={arrivalCity}
                                    onChange={(e) => setArrivalCity(e.target.value)}
                                >
                                    {/* Opsi default jika belum ada bandara terpilih atau untuk instruksi */}
                                    {airportOptions.length === 0 && <option value="">Tidak ada bandara tersedia</option>}
                                    {airportOptions.map((airport) => (
                                        <option key={airport.airportCode} value={airport.airportCode}>
                                            {airport.airportName} ({airport.airportCode})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="input-group dates-search">
                        <div className="input-field date-input">
                            <label>Tanggal Pergi</label>
                            <input
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                            />
                            <span className="date-display">{formatDateForDisplay(departureDate)}</span>
                            <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM5 7V6h14v1H5z"/>
                            </svg>
                        </div>
                        <div className="input-field date-input">
                            <label>Tanggal Pulang</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                            <span className="date-display">{formatDateForDisplay(returnDate)}</span>
                            <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM5 7V6h14v1H5z"/>
                            </svg>
                        </div>
                        <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="search-inspirations">
                    <button className="inspiration-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        Cari Inspirasi Terbang
                    </button>
                    <button className="inspiration-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z"/>
                        </svg>
                        Notifikasi Harga
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;