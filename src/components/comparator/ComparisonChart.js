
// src/components/comparator/ComparisonChart.js
import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const ComparisonChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // If chart exists, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // If we have data, create the chart
    if (data && data.labels && data.values && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Define color palette for algorithms
      const backgroundColors = [
        'rgba(75, 192, 192, 0.5)',  // teal
        'rgba(255, 99, 132, 0.5)',   // red
        'rgba(54, 162, 235, 0.5)',   // blue
        'rgba(255, 206, 86, 0.5)',   // yellow
        'rgba(153, 102, 255, 0.5)',  // purple
        'rgba(255, 159, 64, 0.5)'    // orange
      ];
      
      const borderColors = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ];
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Total Seek Time',
            data: data.values,
            backgroundColor: backgroundColors.slice(0, data.labels.length),
            borderColor: borderColors.slice(0, data.labels.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Algorithm Comparison - Total Seek Time'
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Seek Time: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Seek Time'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Algorithms'
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

  return <canvas ref={chartRef} />;
};

export default ComparisonChart;
