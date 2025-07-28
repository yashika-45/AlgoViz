import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaHdd, FaFileAlt } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">ALGOVIZ</div>

      <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}><FaHome className="icon" /> Home</Link>
        </li>
        <li>
          <Link to="/visualizer" onClick={() => setMenuOpen(false)}><FaHdd className="icon" /> Disk</Link>
        </li>
        <li>
          <Link to="/page-replacement" onClick={() => setMenuOpen(false)}><FaFileAlt className="icon" /> Page</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
