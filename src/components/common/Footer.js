import React from 'react';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Disk Scheduling Visualizer</p>
        <p>Made By: Yashika Goyal</p>
      </div>
    </footer>
  );
};

export default Footer; 