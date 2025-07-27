import React from 'react';
import '../../styles/Chart.css';

const Chart = ({
  selectedAlgorithm,
  setSelectedAlgorithm,
  animationSpeed,
  setAnimationSpeed,
  isAnimating,
  startAnimation,
  stopAnimation,
  resetChart,
  currentAlg,
  currentStep,
  seekData,
  totalSeekDistance,
  chartRef
}) => {
  return (
    <div className="visualizer-container max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Real-Time Disk Scheduling Visualizer</h1>

      {/* Controls */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Algorithm Selector */}
          <div className="flex flex-col gap-1">
            <label htmlFor="algorithm" className="text-gray-300 font-medium">Algorithm:</label>
            <select
              id="algorithm"
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              disabled={isAnimating}
              className="speed-select"
            >
              <option value="FCFS">FCFS</option>
              <option value="SSTF">SSTF</option>
              <option value="SCAN">SCAN</option>
            </select>
          </div>

          {/* Speed Selector */}
          <div className="speed-section">
            <label htmlFor="speed" className="speed-label">Speed:</label>
            <select
              id="speed"
              className="speed-select"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            >
              <option value={1000}>Medium (1s)</option>
              <option value={500}>Fast (0.5s)</option>
              <option value={2000}>Slow (2s)</option>
            </select>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="run-button bg-blue-600 hover:bg-blue-700"
            >
              Start Animation
            </button>

            <button
              onClick={stopAnimation}
              disabled={!isAnimating}
              className="run-button bg-red-600 hover:bg-red-700"
            >
              Stop
            </button>

            <button
              onClick={resetChart}
              className="run-button bg-gray-600 hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Current Simulation Status */}
        <div className="bg-gray-800 p-4 rounded-lg text-sm text-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><span className="font-semibold">Algorithm:</span> {currentAlg.name}</div>
            <div><span className="font-semibold">Current Step:</span> {currentStep}/{seekData.length || 0}</div>
            <div><span className="font-semibold">Total Seek Distance:</span> {totalSeekDistance}</div>
            <div><span className="font-semibold">Start Position:</span> {currentAlg.startPosition}</div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="chart-container mb-6">
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

      {/* Request Queue Display */}
      <div className="bg-gray-900 p-5 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-white mb-3">Request Queue</h3>
        <div className="flex flex-wrap gap-2">
          {currentAlg.requests.map((request, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded text-sm font-medium border ${
                seekData[currentStep]?.request === request && currentStep > 0
                  ? 'bg-blue-600 text-white border-blue-500'
                  : seekData.slice(0, currentStep).some(s => s.request === request)
                  ? 'bg-green-600 text-white border-green-500'
                  : 'bg-gray-700 text-gray-300 border-gray-600'
              }`}
            >
              {request}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 text-sm text-gray-400">
          <span className="inline-block w-4 h-4 bg-blue-500 rounded mr-2"></span>Current
          <span className="inline-block w-4 h-4 bg-green-600 rounded border border-green-500 mr-2 ml-4"></span>Completed
          <span className="inline-block w-4 h-4 bg-gray-700 rounded border border-gray-600 mr-2 ml-4"></span>Pending
        </div>
      </div>
    </div>
  );
};

export default Chart;
