import React, { useRef, useEffect, useState, useCallback } from "react";
import "../../styles/Visualizer.css";
import {
  Chart,
  LineElement,
  LineController,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

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
    seekTime: requests.reduce(
      (sum, req, i) =>
        sum + Math.abs(req - (i === 0 ? headPos : requests[i - 1])),
      0
    ),
    averageSeekTime: 0,
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
      remaining = remaining.filter((r) => r !== closest);
    }

    return { sequence, seekTime, averageSeekTime: seekTime / requests.length };
  },
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
      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Head Position",
              data: [],
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.3,
              pointRadius: 6,
              pointHoverRadius: 8,
              pointBackgroundColor: "rgb(59, 130, 246)",
              pointBorderColor: "white",
              pointBorderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: speed * 0.8,
          },
          interaction: {
            intersect: false,
          },
          plugins: {
            title: {
              display: true,
              text: title || "Real-Time Disk Head Movement",
              font: {
                size: 16,
                weight: "bold",
              },
              padding: {
                top: 10,
                bottom: 20,
              },
            },
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              callbacks: {
                title: (context) => {
                  return `Step ${context[0].dataIndex + 1}`;
                },
                label: (context) => {
                  return `Cylinder: ${context.parsed.y}`;
                },
              },
            },
          },
          layout: {
            padding: {
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            },
          },
          elements: {
            point: {
              hoverRadius: 8,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 200,
              title: {
                display: true,
                text: "Cylinder Number",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Request Sequence",
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
              grid: {
                color: "rgba(0, 0, 0, 0.1)",
              },
            },
          },
        },
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
      chartInstance.current.update("none");
    }

    let stepIndex = 0;

    const animate = () => {
      if (stepIndex < data.sequence.length && chartInstance.current) {
        const position = data.sequence[stepIndex];
        const label = stepIndex === 0 ? "Start" : `Req ${stepIndex}`;

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
      chartInstance.current.update("none");
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
            {isAnimating ? "Running..." : "Start Animation"}
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

      <div
        style={{
          position: "relative",
          height: "400px",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <canvas
          ref={chartRef}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: "100%",
            position: "relative",
            zIndex: 1,
          }}
        />
      </div>

      {data && (
        <div className="mt-4 text-sm">
          <p>
            <strong>Progress:</strong> {currentStep + 1}/{data.sequence.length}
          </p>
          {currentStep > 0 && (
            <p>
              <strong>Current Position:</strong> {data.sequence[currentStep]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Visualizer = () => {
  const [requests, setRequests] = useState("98,183,37,122,14,124,65,67");
  const [headPosition, setHeadPosition] = useState("53");
  const [direction, setDirection] = useState("right");
  const [algorithm, setAlgorithm] = useState("fcfs");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const runSimulation = () => {
    const requestArray = requests
      .split(",")
      .map((str) => parseInt(str.trim()))
      .filter((num) => !isNaN(num));

    const headPos = parseInt(headPosition);

    const inputData = {
      requests: requestArray,
      initialPosition: headPos,
      diskSize: 200,
    };

    const validation = validateInput(inputData);

    if (!validation.valid) {
      setError(validation.message);
      setResult(null);
      return;
    }

    setError("");
    setShowResult(false); // hide result panel before animation

    let simulationResult;
    if (mockAlgorithms[algorithm]) {
      simulationResult = mockAlgorithms[algorithm](requestArray, headPos);
      simulationResult.averageSeekTime =
        simulationResult.seekTime / requestArray.length;
    } else {
      simulationResult = mockAlgorithms.fcfs(requestArray, headPos);
    }

    setResult(simulationResult); // this will trigger chart animation
  };

  const navigate = useNavigate();
  return (
    <div className="visualizer-container">
      <h1 className="page-title">Disk Scheduling Simulator</h1>

      <div className="form-wrapper">
        <h2 class="simul-head">Simulation Inputs</h2>

        <div className="simulation-inputs">
          <div>
            <label>Request Sequence (comma separated):</label>
            <input
              type="text"
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              placeholder="e.g., 98,183,37,122,14,124,65,67"
            />
          </div>

          <div>
            <label>Initial Head Position:</label>
            <input
              type="number"
              value={headPosition}
              onChange={(e) => setHeadPosition(e.target.value)}
              placeholder="e.g., 53"
            />
          </div>

          <div>
            <label>Direction:</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div>
            <label>Algorithm:</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
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

        <button onClick={runSimulation} className="run-button">
          Run Simulation
        </button>

        {error && <div className="error-box">{error}</div>}
      </div>

      {result && (
        <div className="results-wrapper">
          {showResult && (
            <div className="result-card">
              <h2>Algorithm Results</h2>

              <div className="stat-grid">
                <div className="stat-box blue">
                  <h3>Total Seek Time</h3>
                  <p>{result.seekTime}</p>
                </div>

                <div className="stat-box green">
                  <h3>Average Seek Time</h3>
                  <p>{result.averageSeekTime?.toFixed(2) || 0}</p>
                </div>

                <div className="stat-box purple">
                  <h3>Algorithm</h3>
                  <p>{algorithm.toUpperCase()}</p>
                </div>
              </div>

              <div className="sequence-box">
                <h3>Sequence of Execution:</h3>
                <p>{result.sequence.join(" → ")}</p>
              </div>
            </div>
          )}

          <RealTimeChart
            data={result}
            title={`${algorithm.toUpperCase()} Algorithm Visualization`}
            onAnimationComplete={() => setShowResult(true)}
          />
        </div>
      )}
    </div>
  );
};

export default Visualizer;
