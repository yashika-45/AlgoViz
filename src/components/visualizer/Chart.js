import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import "../../styles/Chart.css";

const DiskChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (data && data.sequence && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const formattedData = data.sequence.map((cylinder, index) => ({
        x: cylinder,
        y: index,
      }));

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: `${data.name} Disk Movement`,
              data: formattedData,
              borderColor: "red",
              borderWidth: 2,
              showLine: true,
              fill: false,
              pointBackgroundColor: "#fff",
              pointBorderColor: "red",
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0, 
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Disk Head Movement Visualization",
              font: {
                size: 18,
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `Step ${context.raw.y}: Cylinder ${context.raw.x}`;
                },
              },
            },
          },
          scales: {
            x: {
              type: "linear",
              position: "bottom",
              title: {
                display: true,
                text: "Cylinder Number",
              },
              min: 0,
              suggestedMax: Math.max(...data.sequence) + 5,
            },
            y: {
              type: "linear",
              title: {
                display: true,
                text: "Step",
              },
              beginAtZero: true,
              reverse: true, 
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }
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
