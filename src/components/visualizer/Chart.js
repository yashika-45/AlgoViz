import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';
import '../../styles/Chart.css';

const DiskChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // If chart exists, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // If we have data, create the chart
    if (data && data.sequence && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Create step labels (0, 1, 2, ...)
      const labels = Array.from({ length: data.sequence.length }, (_, i) => i);
      
      // Create the chart
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${data.name} Disk Movement`,
            data: data.sequence,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Disk Head Movement Visualization',
              font: {
                size: 16
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const pointIndex = context.dataIndex;
                  const value = context.raw;
                  if (pointIndex === 0) {
                    return `Initial Head Position: ${value}`;
                  }
                  return `Cylinder: ${value}`;
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: 'Cylinder Number'
              },
              beginAtZero: true,
              suggestedMax: 200
            },
            x: {
              title: {
                display: true,
                text: 'Sequence Step'
              }
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);
  
  if (!data || !data.sequence) {
    return <div className="chart-container">No data to display</div>;
  }
  
  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default DiskChart; 