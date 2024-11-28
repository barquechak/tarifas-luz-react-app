import React, { useRef, useEffect } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import "../styles/GraphContainer.css";

const GraphContainer: React.FC = () => {
  Chart.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Legend,
    Tooltip
  );

  const barCanvasRef = useRef<HTMLCanvasElement>(null);
  const barChartInstance = useRef<Chart | null>(null); // Use ref to keep track of the chart instance

  // Data for the graph
  const dataBar = {
    labels: [
      "1 AM",
      "2 AM",
      "3 AM",
      "4 AM",
      "5 AM",
      "6 AM",
      "7 AM",
      "8 AM",
      "9 AM",
      "10 AM",
      "11 AM",
      "12 PM",
      "1 PM",
      "2 PM",
      "3 PM",
      "4 PM",
      "5 PM",
      "6 PM",
      "7 PM",
      "8 PM",
      "9 PM",
      "10 PM",
      "11 PM",
      "12 AM",
    ],
    datasets: [
      {
        label: "Costo Tarifa (₡)",
        data: [
          28.3, 28.3, 28.3, 28.3, 28.3, 67.65, 67.65, 67.65, 67.65, 165.01,
          165.01, 165.01, 67.65, 67.65, 67.65, 67.65, 165.01, 165.01, 165.01,
          28.3, 28.3, 28.3, 28.3, 28.3,
        ],
        backgroundColor: [
          "green",
          "green",
          "green",
          "green",
          "green",
          "orange",
          "orange",
          "orange",
          "orange",
          "red",
          "red",
          "red",
          "orange",
          "orange",
          "orange",
          "orange",
          "red",
          "red",
          "red",
          "green",
          "green",
          "green",
          "green",
          "green",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart configuration (Typed)
  const configBar: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true, // Let Chart.js handle resizing
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { autoSkip: false },
        title: { display: true, text: "Horario (AM/PM)" },
      },
      y: {
        title: { display: true, text: "Costo (₡)" },
        min: 0,
        max: 200,
        ticks: { stepSize: 50 },
      },
    },
  };

  // Create or recreate the chart
  const createBarGraph = () => {
    if (barChartInstance.current) {
      barChartInstance.current.destroy(); // Destroy the existing chart instance
    }

    if (barCanvasRef.current) {
      barChartInstance.current = new Chart(barCanvasRef.current, {
        type: "bar",
        data: dataBar,
        options: configBar,
      }); // Create a new chart instance
    }
  };

  // Use effect to handle chart creation and resizing
  useEffect(() => {
    createBarGraph(); // Initial render

    // Clean up the chart on component unmount
    return () => {
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
      }
    };
  }, []); // Empty dependency array, so it runs only once

  return (
    <div className="graph-container">
      <canvas ref={barCanvasRef}></canvas>
    </div>
  );
};

export default GraphContainer;
