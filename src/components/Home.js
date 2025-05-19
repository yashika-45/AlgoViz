import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Disk Scheduling Algorithm Visualizer</h1>
        <p>
          Understand and analyze different disk scheduling algorithms through interactive visualizations.
        </p>
        <Link to="/visualizer" className="cta-button">
          Try it now
        </Link>
      </div>

      <div className="features">
        <div className="feature-card">
          <h2>Interactive Visualization</h2>
          <p>
            Watch how each algorithm handles disk requests in real-time with dynamic, interactive charts.
          </p>
        </div>

        <div className="feature-card">
          <h2>Multiple Algorithms</h2>
          <p>
            Compare and contrast different disk scheduling algorithms including FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK.
          </p>
        </div>

        <div className="feature-card">
          <h2>Performance Metrics</h2>
          <p>
            Analyze total seek time, average seek time, and the complete sequence of operations for each algorithm.
          </p>
        </div>
      </div>

      <div className="algorithms-overview">
        <h2>Supported Algorithms</h2>
        
        <div className="algorithm-grid">
          <div className="algorithm-item">
            <h3>FCFS</h3>
            <p>First-Come, First-Served serves requests in the order they arrive, regardless of their location.</p>
          </div>
          
          <div className="algorithm-item">
            <h3>SSTF</h3>
            <p>Shortest Seek Time First selects the request that requires the least movement from the current head position.</p>
          </div>
          
          <div className="algorithm-item">
            <h3>SCAN</h3>
            <p>The disk arm moves in one direction servicing requests until it reaches the end, then reverses direction.</p>
          </div>
          
          <div className="algorithm-item">
            <h3>C-SCAN</h3>
            <p>Circular SCAN moves from one end to the other, servicing requests, then returns to the beginning without servicing on the return trip.</p>
          </div>
          
          <div className="algorithm-item">
            <h3>LOOK</h3>
            <p>Similar to SCAN, but the arm only goes as far as the last request in each direction.</p>
          </div>
          
          <div className="algorithm-item">
            <h3>C-LOOK</h3>
            <p>Circular LOOK only goes as far as the last request in each direction, then jumps back to the beginning.</p>
          </div>
        </div>
      </div>
      
      <div className="get-started">
        <h2>Get Started Now</h2>
        <p>Try the visualizer and see these algorithms in action!</p>
        <Link to="/visualizer" className="cta-button">
          Go to Visualizer
        </Link>
      </div>
    </div>
  );
};

export default Home; 