import React, { useState, useEffect } from 'react';
import DiskChart from './Chart';
import { validateInput } from '../../algorithms/common';
import fcfs from '../../algorithms/fcfs';
import sstf from '../../algorithms/sstf';
import scan from '../../algorithms/scan';
import cscan from '../../algorithms/cscan';
import look from '../../algorithms/look';
import clook from '../../algorithms/clook';
import '../../styles/Visualizer.css';

const Visualizer = () => {
  const [requests, setRequests] = useState('');
  const [headPosition, setHeadPosition] = useState('');
  const [direction, setDirection] = useState('right');
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate example values when component mounts
  useEffect(() => {
    handleGenerateRandomRequests();
    setHeadPosition('50');
  }, []);

  const handleRequestChange = (e) => {
    setRequests(e.target.value);
    // Clear previous results when input changes
    setResult(null);
  };

  const handleHeadPositionChange = (e) => {
    setHeadPosition(e.target.value);
    // Clear previous results when input changes
    setResult(null);
  };

  const handleDirectionChange = (e) => {
    setDirection(e.target.value);
    // Clear previous results when input changes
    setResult(null);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    // Clear previous results when algorithm changes
    setResult(null);
  };

  const runSimulation = () => {
    // Clear previous error
    setError('');
    setIsLoading(true);
    
    // Validate input
    const validation = validateInput(requests, headPosition);
    
    if (!validation.valid) {
      setError(validation.message);
      setResult(null);
      setIsLoading(false);
      return;
    }
    
    // Simulate small delay to show loading state (better UX)
    setTimeout(() => {
      try {
        // Run selected algorithm
        let simulationResult;
        switch (algorithm) {
          case 'fcfs':
            simulationResult = fcfs(validation.requests, validation.headPosition);
            break;
          case 'sstf':
            simulationResult = sstf(validation.requests, validation.headPosition);
            break;
          case 'scan':
            simulationResult = scan(validation.requests, validation.headPosition, direction);
            break;
          case 'cscan':
            simulationResult = cscan(validation.requests, validation.headPosition);
            break;
          case 'look':
            simulationResult = look(validation.requests, validation.headPosition, direction);
            break;
          case 'clook':
            simulationResult = clook(validation.requests, validation.headPosition);
            break;
          default:
            simulationResult = fcfs(validation.requests, validation.headPosition);
        }
        
        setResult(simulationResult);
      } catch (err) {
        setError('An error occurred while running the simulation. Please check your inputs.');
        console.error('Simulation error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleGenerateRandomRequests = () => {
    const count = 8; // Number of random requests
    const maxCylinder = 199; // Maximum cylinder number
    
    // Generate random requests
    const randomRequests = Array.from({ length: count }, () => 
      Math.floor(Math.random() * (maxCylinder + 1))
    );
    
    setRequests(randomRequests.join(','));
    // Clear previous results when generating new requests
    setResult(null);
  };

  return (
    <div className="visualizer">
      <h2>Disk Scheduling Algorithm Visualizer</h2>
      
      <div className="controls">
        <div className="input-group">
          <label htmlFor="requests">Request Sequence (comma separated):</label>
          <div className="input-with-button">
            <input
              type="text"
              id="requests"
              value={requests}
              onChange={handleRequestChange}
              placeholder="e.g., 98,183,37,122,14,124,65,67"
            />
            <button 
              type="button" 
              className="random-btn"
              onClick={handleGenerateRandomRequests}
              title="Generate random requests"
            >
              Random
            </button>
          </div>
        </div>
        
        <div className="input-group">
          <label htmlFor="head-position">Initial Head Position:</label>
          <input
            type="number"
            id="head-position"
            value={headPosition}
            onChange={handleHeadPositionChange}
            placeholder="e.g., 53"
            min="0"
            max="199"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="algorithm">Algorithm:</label>
          <select
            id="algorithm"
            value={algorithm}
            onChange={handleAlgorithmChange}
          >
            <option value="fcfs">First-Come, First-Served (FCFS)</option>
            <option value="sstf">Shortest Seek Time First (SSTF)</option>
            <option value="scan">SCAN (Elevator)</option>
            <option value="cscan">C-SCAN (Circular SCAN)</option>
            <option value="look">LOOK</option>
            <option value="clook">C-LOOK</option>
          </select>
        </div>
        
        <div className="input-group">
          <label htmlFor="direction">Direction (for SCAN/LOOK):</label>
          <select
            id="direction"
            value={direction}
            onChange={handleDirectionChange}
            disabled={!['scan', 'look'].includes(algorithm)}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
        
        <button 
          type="button" 
          className={`run-btn ${isLoading ? 'loading' : ''}`}
          onClick={runSimulation}
          disabled={isLoading || !requests.trim() || !headPosition.trim()}
        >
          {isLoading ? 'Running...' : 'Run Simulation'}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="results">
          <div className="result-summary">
            <h3>Simulation Results for {result.name}</h3>
            <div className="metrics">
              <div className="metric">
                <span className="metric-label">Total Seek Time:</span>
                <span className="metric-value">{result.seekTime}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Average Seek Time:</span>
                <span className="metric-value">{result.averageSeekTime.toFixed(2)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Sequence:</span>
                <span className="metric-value sequence">{result.sequence.join(' → ')}</span>
              </div>
            </div>
          </div>
          
          <div className="chart">
            <DiskChart data={result} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Visualizer; 