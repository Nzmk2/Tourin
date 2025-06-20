import React from 'react';
import profileImage from '../assets/img/profile.png'; // <<<--- Import gambar profil di sini

/**
 * Komponen Navbar (Top Bar) untuk dashboard admin.
 * Berisi tombol toggle sidebar, kotak pencarian, dan gambar profil.
 * @param {object} props - Properti komponen.
 * @param {function} props.toggleSidebar - Fungsi untuk mengubah status sidebar.
 */
const Navbar = ({ toggleSidebar }) => {
    return (
        <div className="top">
            <i className="uil uil-bars sidebar-toggle" onClick={toggleSidebar}></i>
            <img src={profileImage} alt="Profile" />
        </div>
    );
};

export default Navbar;
