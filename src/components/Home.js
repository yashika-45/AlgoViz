import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';


const Home = () => {
  return (
    <main className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">OS Algorithm Visualizer</h1>
          <p className="hero-subtitle">
            Experience seamless and interactive visualizations of core Operating System algorithms designed for learning and research-grade simulation.
          </p>
          <div className="button-group">
            <Link to="/visualizer" className="btn primary">Disk Scheduling</Link>
            <Link to="/page-replacement" className="btn secondary">Page Replacement</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>🔍 Explore Algorithm Categories</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔄 Disk Scheduling</h3>
            <p>Understand how disk heads manage I/O requests using various scheduling techniques.</p>
            <ul>
              <li><strong>FCFS:</strong> First Come First Serve</li>
              <li><strong>SSTF:</strong> Shortest Seek Time First</li>
              <li><strong>SCAN / C-SCAN:</strong> Elevator-style scanning</li>
              <li><strong>LOOK / C-LOOK:</strong> Optimized bi-directional scanning</li>
            </ul>
          </div>

          <div className="feature-card">
            <h3>📄 Page Replacement</h3>
            <p>Visualize memory management and replacement policies in action.</p>
            <ul>
              <li><strong>FIFO:</strong> Replace oldest loaded page</li>
              <li><strong>LRU:</strong> Replace least recently used</li>
              <li><strong>Optimal:</strong> Theoretical best replacement</li>
              <li><strong>Clock:</strong> Second chance page replacement</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>🚀 Ready to Get Started?</h2>
          <p>Select your simulation path and begin exploring powerful visual learning tools tailored for academia and professionals.</p>
          <div className="button-group">
            <Link to="/visualizer" className="btn primary">Launch Disk Scheduler</Link>
            <Link to="/page-replacement" className="btn secondary">Launch Page Replacement</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
