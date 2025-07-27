import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-wrapper">
      <h1 className="home-title">AlgoViz</h1>
      <p className="home-subtitle">
        Interactive <span className="text-blue">💽 Disk</span> & <span className="text-green">📄 Page Replacement</span> Scheduling Simulator
      </p>

      <div className="button-row">
        <Link to="/visualizer" className="nav-button">💽 Launch Disk Scheduling</Link>
        <Link to="/page-replacement" className="nav-button secondary">📄 Launch Page Replacement</Link>
      </div>

      <section className="info-section">
        <h2 className="section-heading">What is <span className="highlight-text">Disk Scheduling?</span></h2>
        <p className="section-desc">
          Disk scheduling refers to the way an operating system decides the order in which I/O requests to the disk are processed.
          Efficient scheduling reduces seek time and improves overall system performance.
        </p>
      </section>

      <section className="info-section">
        <h2 className="section-heading">What is <span className="highlight-text">Page Replacement?</span></h2>
        <p className="section-desc">
          Page replacement algorithms manage which memory pages to swap out when new pages need to be loaded into RAM.
          These algorithms aim to reduce page faults and improve memory access efficiency in virtual memory systems.
        </p>
      </section>

      <section className="card-section">
        <h2 className="section-heading">Explore Algorithms</h2>
        <div className="card-container">
          <div className="algo-card">
            <h3>💽 Disk Scheduling</h3>
            <ul>
              <li><strong>FCFS:</strong> Serve requests in arrival order</li>
              <li><strong>SSTF:</strong> Nearest request first</li>
              <li><strong>SCAN / C-SCAN:</strong> Elevator-style sweeping</li>
              <li><strong>LOOK / C-LOOK:</strong> Optimized head movement</li>
            </ul>
            <div className="card-buttons">
              <Link to="/visualizer" className="card-btn">🎯 Visualize</Link>
              <Link to="/learn" state={{ section: "disk" }} className="learn-link">📘 Learn More</Link>
            </div>
          </div>

          <div className="algo-card">
            <h3>📄 Page Replacement</h3>
            <ul>
              <li><strong>FIFO:</strong> Evict oldest page first</li>
              <li><strong>LRU:</strong> Evict least recently used page</li>
              <li><strong>Optimal:</strong> Replace page not needed soon</li>
              <li><strong>Clock:</strong> Circular second-chance strategy</li>
            </ul>
            <div className="card-buttons">
              <Link to="/page-replacement" className="card-btn">🎯 Visualize</Link>
             <Link to="/learn" state={{ section: "page" }} className="learn-link">📘 Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
