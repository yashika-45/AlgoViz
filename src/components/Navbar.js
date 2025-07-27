import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaHdd, FaFileAlt } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">ALGOVIZ</div>
      <ul className="navbar-links">
        <li>
          <Link to="/"><FaHome className="icon" /> Home</Link>
        </li>
        <li>
          <Link to="/visualizer"><FaHdd className="icon" /> Disk</Link>
        </li>
        <li>
          <Link to="/page-replacement"><FaFileAlt className="icon" /> Page</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
