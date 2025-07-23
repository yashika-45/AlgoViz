import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Chart,
  LineElement,
  LineController,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

Chart.register(
  LineElement,
  LineController,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);


// Mock algorithm functions for demo - replace with your actual imports
const mockAlgorithms = {
  fcfs: (requests, headPos) => ({
    sequence: [headPos, ...requests],
    seekTime: requests.reduce((sum, req, i) => sum + Math.abs(req - (i === 0 ? headPos : requests[i-1])), 0),
    averageSeekTime: 0
  }),
  sstf: (requests, headPos) => {
      // Simple SSTF implementation for demo
    let current = headPos;
    let remaining = [...requests];
    let sequence = [headPos];
    let seekTime = 0;
    
    while (remaining.length > 0) {
      let closest = remaining.reduce((prev, curr) => 
        Math.abs(curr - current) < Math.abs(prev - current) ? curr : prev
      );
      seekTime += Math.abs(closest - current);
      current = closest;
      sequence.push(closest);
      remaining = remaining.filter(r => r !== closest);
    }
    
    return { sequence, seekTime, averageSeekTime: seekTime / requests.length };
  }
};

const validateInput = (input) => {
  if (!input.requests || input.requests.length === 0) {
    return { valid: false, message: "Please enter request sequence" };
  }
  if (input.initialPosition < 0 || input.initialPosition > 199) {
    return { valid: false, message: "Head position must be between 0-199" };
  }
  return { valid: true, requests: input.requests };
};

const RealTimeChart = ({ data, title, onAnimationComplete }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);

  const initChart = useCallback(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Head Position',
            data: [],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointBorderColor: 'white',
            pointBorderWidth: 2,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: speed * 0.8
          },
          interaction: {
            intersect: false
          },
          plugins: {
            title: {
              display: true,
              text: title || 'Real-Time Disk Head Movement',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            },
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                title: (context) => {
                  return `Step ${context[0].dataIndex + 1}`;
                },
                label: (context) => {
                  return `Cylinder: ${context.parsed.y}`;
                }
              }
            }
            },
            layout: {
              padding: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
              }
            },
            elements: {
              point: {
                hoverRadius: 8
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 200,
                title: {
                  display: true,
                  text: 'Cylinder Number',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Request Sequence',
                  font: {
                    size: 14,
                    weight: 'bold'
                  }
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            }
        }
      });
    }
  }, [title, speed]);

  const startAnimation = useCallback(() => {
    if (!data || isAnimating) return;
    
    setIsAnimating(true);
    setCurrentStep(0);
    
    // Reset chart
    if (chartInstance.current) {
      chartInstance.current.data.labels = [];
      chartInstance.current.data.datasets[0].data = [];
      chartInstance.current.update('none');
    }
    
    let stepIndex = 0;
    
    const animate = () => {
      if (stepIndex < data.sequence.length && chartInstance.current) {
        const position = data.sequence[stepIndex];
        const label = stepIndex === 0 ? 'Start' : `Req ${stepIndex}`;
        
        // Add new data point
        chartInstance.current.data.labels.push(label);
        chartInstance.current.data.datasets[0].data.push(position);
        
        // Update chart with animation
        chartInstance.current.update();
        
        setCurrentStep(stepIndex);
        stepIndex++;
        
        if (stepIndex < data.sequence.length) {
          animationRef.current = setTimeout(animate, speed);
        } else {
          setIsAnimating(false);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }
      }
    };
    
    animate();
  }, [data, speed, isAnimating, onAnimationComplete]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsAnimating(false);
  }, []);

  const resetChart = useCallback(() => {
    stopAnimation();
    setCurrentStep(0);
    if (chartInstance.current) {
      chartInstance.current.data.labels = [];
      chartInstance.current.data.datasets[0].data = [];
      chartInstance.current.update('none');
    }
  }, [stopAnimation]);

  useEffect(() => {
    initChart();
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [initChart]);

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Speed:</label>
          <select 
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isAnimating}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={500}>Fast (500ms)</option>
            <option value={1000}>Medium (1s)</option>
            <option value={2000}>Slow (2s)</option>
          </select>
        </div>
        
        <div className="flex gap-2 ml-auto">
          <button
            onClick={startAnimation}
            disabled={isAnimating || !data}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
          >
            {isAnimating ? 'Running...' : 'Start Animation'}
          </button>
          
          <button
            onClick={stopAnimation}
            disabled={!isAnimating}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
          >
            Stop
          </button>
          
          <button
            onClick={resetChart}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div style={{ position: 'relative', height: '400px', width: '100%', overflow: 'hidden' }}>
        <canvas 
          ref={chartRef} 
          style={{ 
            display: 'block', 
            maxWidth: '100%', 
            maxHeight: '100%',
            position: 'relative',
            zIndex: 1
          }} 
        />
      </div>
      
      {data && (
        <div className="mt-4 text-sm">
          <p><strong>Progress:</strong> {currentStep + 1}/{data.sequence.length}</p>
          {currentStep > 0 && (
            <p><strong>Current Position:</strong> {data.sequence[currentStep]}</p>
          )}
        </div>
      )}
    </div>
  );
};

const IntegratedVisualizer = () => {
  const [requests, setRequests] = useState('98,183,37,122,14,124,65,67');
  const [headPosition, setHeadPosition] = useState('53');
  const [direction, setDirection] = useState('right');
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const runSimulation = () => {
    // Parse requests from string to array
    const requestArray = requests
      .split(',')
      .map(str => parseInt(str.trim()))
      .filter(num => !isNaN(num));
    
    const headPos = parseInt(headPosition);
    
    // Create input object for validation
    const inputData = {
      requests: requestArray,
      initialPosition: headPos,
      diskSize: 200
    };
    
    // Validate input
    const validation = validateInput(inputData);
    
    if (!validation.valid) {
      setError(validation.message);
      setResult(null);
      return;
    }
    
    setError('');
    
    // Run selected algorithm (using mock implementations)
    let simulationResult;
    if (mockAlgorithms[algorithm]) {
      simulationResult = mockAlgorithms[algorithm](requestArray, headPos);
      simulationResult.averageSeekTime = simulationResult.seekTime / requestArray.length;
    } else {
      simulationResult = mockAlgorithms.fcfs(requestArray, headPos);
    }
    
    setResult(simulationResult);
  };
 const navigate = useNavigate();
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
  Disk Scheduling Simulator
</h1>

      <div className="mb-6">
  <button
    onClick={() => navigate('/')}
    className="text-sm bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded shadow transition-all"
  >
    ← Back to Home
  </button>
</div>

      <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">Simulation Inputs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Request Sequence (comma separated):</label>
            <input 
              type="text" 
              value={requests} 
              onChange={(e) => setRequests(e.target.value)}
              placeholder="e.g., 98,183,37,122,14,124,65,67"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Initial Head Position:</label>
            <input 
              type="number" 
              value={headPosition} 
              onChange={(e) => setHeadPosition(e.target.value)}
              placeholder="e.g., 53"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Direction:</label>
            <select 
              value={direction} 
              onChange={(e) => setDirection(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Algorithm:</label>
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fcfs">FCFS</option>
              <option value="sstf">SSTF</option>
              <option value="look">LOOK</option>
              <option value="clook">CLOOK</option>
              <option value="scan">SCAN</option>
              <option value="cscan">CSCAN</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={runSimulation} 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition-colors"
        >
          Run Simulation
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
      
      {result && (
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Algorithm Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-medium text-blue-800">Total Seek Time</h3>
                <p className="text-2xl font-bold text-blue-600">{result.seekTime}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded">
                <h3 className="font-medium text-green-800">Average Seek Time</h3>
                <p className="text-2xl font-bold text-green-600">{result.averageSeekTime?.toFixed(2) || 0}</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-medium text-purple-800">Algorithm</h3>
                <p className="text-2xl font-bold text-purple-600 uppercase">{algorithm}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium mb-2">Sequence of Execution:</h3>
              <p className="text-lg font-mono">{result.sequence.join(' → ')}</p>
            </div>
          </div>
          
          <RealTimeChart 
            data={result} 
            title={`${algorithm.toUpperCase()} Algorithm Visualization`}
            onAnimationComplete={() => console.log('Animation completed!')}
          />
        </div>
      )}
    </div>
  );
};

export default IntegratedVisualizer;