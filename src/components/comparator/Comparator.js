// src/components/comparator/Comparator.js
import React, { useState } from 'react';
import '../../styles/Comparator.css';
import ComparisonChart from './ComparisonChart';
import { fcfs } from '../../algorithms/fcfs';
import { sstf } from '../../algorithms/sstf';
import { look } from '../../algorithms/look';
import { clook } from '../../algorithms/clook';
import { scan } from '../../algorithms/scan';
import { cscan } from '../../algorithms/cscan';

function Comparator() {
  const [requestSequence, setRequestSequence] = useState('');
  const [headPosition, setHeadPosition] = useState('');
  const [direction, setDirection] = useState('right');
  const [comparisonResults, setComparisonResults] = useState(null);

  const parseRequests = (input) => {
    return input.split(',')
      .map(item => parseInt(item.trim()))
      .filter(num => !isNaN(num));
  };

  const compareAlgorithms = () => {
    const requests = parseRequests(requestSequence);
    const initialHead = parseInt(headPosition);

    if (requests.length === 0 || isNaN(initialHead)) {
      alert('Please enter valid request sequence and head position.');
      return;
    }

    // Run all algorithms
    const fcfsResult = fcfs(requests, initialHead);
    const sstfResult = sstf(requests, initialHead);
    const lookResult = look(requests, initialHead, direction);
    const clookResult = clook(requests, initialHead, direction);
    const scanResult = scan(requests, initialHead, direction);
    const cscanResult = cscan(requests, initialHead, direction);

    // Compile results
    const results = [
      { name: 'FCFS', totalSeekTime: fcfsResult.totalSeekTime, averageSeekTime: fcfsResult.averageSeekTime, sequence: fcfsResult.sequence },
      { name: 'SSTF', totalSeekTime: sstfResult.totalSeekTime, averageSeekTime: sstfResult.averageSeekTime, sequence: sstfResult.sequence },
      { name: 'LOOK', totalSeekTime: lookResult.totalSeekTime, averageSeekTime: lookResult.averageSeekTime, sequence: lookResult.sequence },
      { name: 'CLOOK', totalSeekTime: clookResult.totalSeekTime, averageSeekTime: clookResult.averageSeekTime, sequence: clookResult.sequence },
      { name: 'SCAN', totalSeekTime: scanResult.totalSeekTime, averageSeekTime: scanResult.averageSeekTime, sequence: scanResult.sequence },
      { name: 'CSCAN', totalSeekTime: cscanResult.totalSeekTime, averageSeekTime: cscanResult.averageSeekTime, sequence: cscanResult.sequence }
    ];

    // Sort by total seek time (ascending)
    results.sort((a, b) => a.totalSeekTime - b.totalSeekTime);

    // Prepare chart data
    const chartData = {
      labels: results.map(result => result.name),
      values: results.map(result => result.totalSeekTime)
    };

    setComparisonResults({ results, chartData });
  };

  return (
    <div className="comparator-container">
      <h1>Compare Disk Scheduling Algorithms</h1>
      
      <section className="input-section">
        <div className="form-group">
          <label htmlFor="request-sequence">Request Sequence (comma separated):</label>
          <input 
            type="text" 
            id="request-sequence" 
            value={requestSequence} 
            onChange={(e) => setRequestSequence(e.target.value)} 
            placeholder="e.g., 98,183,37,122,14" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="head-position">Initial Head Position:</label>
          <input 
            type="number" 
            id="head-position" 
            value={headPosition} 
            onChange={(e) => setHeadPosition(e.target.value)} 
            placeholder="e.g., 53" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="direction">Direction:</label>
          <select 
            id="direction" 
            value={direction} 
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>

        <button className="compare-button" onClick={compareAlgorithms}>Compare Algorithms</button>
      </section>

      {comparisonResults && (
        <section className="output-section">
          <h2>Comparison Results</h2>
          
          <div className="chart-container">
            <ComparisonChart data={comparisonResults.chartData} />
          </div>
          
          <div className="results-table">
            <h3>Detailed Results</h3>
            <table>
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Total Seek Time</th>
                  <th>Average Seek Time</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                {comparisonResults.results.map((result, index) => (
                  <tr key={result.name} className={index === 0 ? 'best-result' : ''}>
                    <td>{result.name}</td>
                    <td>{result.totalSeekTime}</td>
                    <td>{result.averageSeekTime.toFixed(2)}</td>
                    <td>
                      {index === 0 ? 'Best overall ✓' : 
                       index === 1 ? 'Good alternative' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default Comparator;