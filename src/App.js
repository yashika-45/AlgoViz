import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/common/Footer';
import Home from './components/Home';
import Visualizer from './components/visualizer/Visualizer';
import PageVisualizer from './components/PageVisualizer';
import Learn from './components/Learn';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar /> {/* ✅ Global Navbar */}
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualizer" element={<Visualizer />} />
            <Route path="/page-replacement" element={<PageVisualizer />} />
           <Route path="/learn" element={<Learn />} /> {/* ← define the route */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
