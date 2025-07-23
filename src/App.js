import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/common/Footer';
import Home from './components/Home';
import Visualizer from './components/visualizer/Visualizer';
import PageVisualizer from './components/PageVisualizer';
import About from './components/About';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualizer" element={<Visualizer />} />
             <Route path="/page-replacement" element={<PageVisualizer />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 