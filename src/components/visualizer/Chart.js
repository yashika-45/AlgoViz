
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


const SeekChart = ({ onSeekComplete, title, speed: initialSpeed = 1000 }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [seekData, setSeekData] = useState([]);
  const [speed, setSpeed] = useState(initialSpeed);

  // Sample disk scheduling algorithms data
  const algorithms = {
    FCFS: {
      name: "First Come First Serve (FCFS)",
      requests: [98, 183, 37, 122, 14, 124, 65, 67],
      startPosition: 53
    },
    SSTF: {
      name: "Shortest Seek Time First (SSTF)", 
      requests: [98, 183, 37, 122, 14, 124, 65, 67],
      startPosition: 53,
      order: [65, 67, 37, 14, 98, 122, 124, 183] // Optimized order
    },
    SCAN: {
      name: "SCAN (Elevator Algorithm)",
      requests: [98, 183, 37, 122, 14, 124, 65, 67],
      startPosition: 53,
      order: [37, 14, 65, 67, 98, 122, 124, 183] // Scan direction
    }
  };

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('FCFS');

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
            // Disable any watermarks or overlays
            watermark: false,
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

  const calculateSeekSequence = useCallback((algorithm) => {
    const alg = algorithms[algorithm];
    let sequence = [];
    let currentPos = alg.startPosition;
    
    sequence.push({
      position: currentPos,
      label: 'Start',
      isStart: true
    });

    const requestOrder = alg.order || alg.requests;
    
    requestOrder.forEach((request, index) => {
      sequence.push({
        position: request,
        label: `Req ${index + 1}`,
        request: request,
        seekDistance: Math.abs(request - currentPos)
      });
      currentPos = request;
    });

    return sequence;
  }, []);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentStep(0);
    
    const sequence = calculateSeekSequence(selectedAlgorithm);
    setSeekData(sequence);
    
    // Reset chart
    if (chartInstance.current) {
      chartInstance.current.data.labels = [];
      chartInstance.current.data.datasets[0].data = [];
      chartInstance.current.update('none');
    }
    
    let stepIndex = 0;
    
    const animate = () => {
      if (stepIndex < sequence.length && chartInstance.current) {
        const step = sequence[stepIndex];
        
        // Add new data point
        chartInstance.current.data.labels.push(step.label);
        chartInstance.current.data.datasets[0].data.push(step.position);
        
        // Update chart with animation
        chartInstance.current.update();
        
        setCurrentStep(stepIndex);
        stepIndex++;
        
        if (stepIndex < sequence.length) {
          animationRef.current = setTimeout(animate, speed);
        } else {
          setIsAnimating(false);
          if (onSeekComplete) {
            const totalSeekDistance = sequence
              .filter(s => !s.isStart)
              .reduce((sum, s) => sum + s.seekDistance, 0);
            onSeekComplete({
              algorithm: selectedAlgorithm,
              totalSeekDistance,
              sequence
            });
          }
        }
      }
    };
    
    animate();
  }, [selectedAlgorithm, speed, calculateSeekSequence, onSeekComplete, isAnimating]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setIsAnimating(false);
  }, []);

  const resetChart = useCallback(() => {
    stopAnimation();
    setCurrentStep(0);
    setSeekData([]);
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

  const currentAlg = algorithms[selectedAlgorithm];
  const totalSeekDistance = seekData
    .filter(s => !s.isStart)
    .slice(0, currentStep)
    .reduce((sum, s) => sum + s.seekDistance, 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Real-Time Disk Scheduling Visualizer</h1>
      
      {/* Controls */}
      <div className="bg-white border rounded-lg p-4 shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Algorithm:</label>
            <select 
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              disabled={isAnimating}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FCFS">FCFS</option>
              <option value="SSTF">SSTF</option>
              <option value="SCAN">SCAN</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Speed (ms):</label>
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
              disabled={isAnimating}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              {isAnimating ? 'Running...' : 'Start Animation'}
            </button>
            
            <button
              onClick={stopAnimation}
              disabled={!isAnimating}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Stop
            </button>
            
            <button
              onClick={resetChart}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Current Status */}
        <div className="bg-gray-50 p-3 rounded">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Algorithm:</span> {currentAlg.name}
            </div>
            <div>
              <span className="font-medium">Current Step:</span> {currentStep}/{seekData.length || 0}
            </div>
            <div>
              <span className="font-medium">Total Seek Distance:</span> {totalSeekDistance}
            </div>
            <div>
              <span className="font-medium">Start Position:</span> {currentAlg.startPosition}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
        <div style={{ position: 'relative', height: '450px', width: '100%', overflow: 'hidden' }}>
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
      </div>

      {/* Request Queue */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Request Queue</h3>
        <div className="flex flex-wrap gap-2">
          {currentAlg.requests.map((request, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded border ${
                seekData[currentStep]?.request === request && currentStep > 0
                  ? 'bg-blue-500 text-white border-blue-500'
                  : seekData.slice(0, currentStep).some(s => s.request === request)
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {request}
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          <span className="inline-block w-4 h-4 bg-blue-500 rounded mr-2"></span>Current
          <span className="inline-block w-4 h-4 bg-green-100 border border-green-300 rounded mr-2 ml-4"></span>Completed
          <span className="inline-block w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2 ml-4"></span>Pending
        </div>
      </div>
    </div>
  );
};

export default SeekChart;
