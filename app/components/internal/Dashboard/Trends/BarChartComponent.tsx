import React from 'react'
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Filler
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const BarChartComponent = () => {
  // Chart data
  const data: ChartData<'line'> = {
    labels: ['0', '1', '2', '3', '4', '5','6', '7', '8', '9', '10'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 8, 30,-10],
        borderColor: 'rgba(218, 47, 53)',
        backgroundColor: 'rgba(218, 47, 53, 0.3)',
        fill: 'true', 
        tension: 0, // Smooth curves
        borderWidth: 1.5
      },
    ],
  };
  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: 'Months',
        },
        ticks : {
          display : false
        }
      },
      y: {
        title: {
          display: false,
          text: 'Values',
        },
        ticks : {
          display : false
        },
        beginAtZero: true,
      },
    },
  };
  return (
    <div style={{ width: '100%'}}>
      <Line data={data} options={options} />
    </div>
  );
}

export default BarChartComponent