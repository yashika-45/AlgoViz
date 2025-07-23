import React, { useState, useEffect, useRef } from 'react';
import { fifo, lru, optimal, clock } from '../algorithms/pageAlgorithms';
import '../styles/pageVisualizer.css';
import { useNavigate } from 'react-router-dom';

const algorithms = {
  FIFO: fifo,
  LRU: lru,
  Optimal: optimal,
};
function PageVisualizer() {
  const [algorithm, setAlgorithm] = useState('FIFO');
  const [input, setInput] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2');
  const [capacity, setCapacity] = useState(3);
  const [history, setHistory] = useState([]);
  const [pageStates, setPageStates] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [faults, setFaults] = useState(0);
  const intervalRef = useRef(null);

  const handleRun = () => {
    const pages = input.trim().split(/\s+/).map(Number);
    const fn = algorithms[algorithm];
    const { history, faults } = fn(pages, parseInt(capacity));

   const states = [];
const seenPages = new Set();

for (let i = 0; i < pages.length; i++) {
  const current = pages[i];
  const frameBefore = i === 0 ? [] : history[i - 1][0];

  const hit = frameBefore.includes(current);
  states.push(hit ? 'HIT' : 'MISS');
}


    setHistory(history);
    setPageStates(states);
    setFaults(faults);
    setCurrentStep(0);
    setPlaying(true);
  };

  useEffect(() => {
    if (playing && history.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= history.length - 1) {
            clearInterval(intervalRef.current);
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, history]);

  const pages = input.trim().split(/\s+/).map(Number);
 
 const navigate = useNavigate();
  return (
    <div className="page-visualizer">
      <h1>📄 Page Replacement Visualizer</h1>
        <div className="mb-6">
  <button
    onClick={() => navigate('/')}
    className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded shadow transition-all"
  >
    ← Back to Home
  </button>
</div>
      <div className="controls">
        <label>Algorithm:</label>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
          {Object.keys(algorithms).map(algo => (
            <option key={algo}>{algo}</option>
          ))}
        </select>

        <label>Page Reference String:</label>
        <input value={input} onChange={(e) => setInput(e.target.value)} />

        <label>Frame Capacity:</label>
        <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />

       <div className="button-group">
  <button onClick={handleRun}>Start</button>
  <button
    onClick={() => {
      clearInterval(intervalRef.current);
      setPlaying(false);
    }}
    disabled={!playing}
  >
    Stop
  </button>
</div>

      </div>

      {history.length > 0 && (
        <div className="visualization-grid">
          <div className="table-wrapper">
            <table className="memory-table">
              <thead>
                <tr>
                  <th></th>
                  {pages.slice(0, currentStep + 1).map((page, idx) => (
                    <th key={idx}>{page}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: capacity }, (_, frameIdx) => (
                  <tr key={frameIdx}>
                    <td className="frame-label">Frame {frameIdx}</td>
                    {history.slice(0, currentStep + 1).map((step, stepIdx) => (
                      <td key={stepIdx} className="frame-cell">
                        {step[0][frameIdx] !== undefined ? step[0][frameIdx] : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="frame-label">Result</td>
                  {pageStates.slice(0, currentStep + 1).map((state, i) => (
                    <td
                      key={i}
                      className={`state-cell ${state === 'HIT' ? 'hit' : 'miss'}`}
                    >
                      {state}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            {!playing && (
              <h3 className="result">Total Page Faults: {faults}</h3>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PageVisualizer;
