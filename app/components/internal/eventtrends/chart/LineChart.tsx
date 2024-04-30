import { Line } from "react-chartjs-2";
import styles from "./linechart.style.module.css";
import Data from "@/public/data/chartData.json";
import Chart from "chart.js/auto";
import { LinearScale, TimeScale } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(LinearScale, TimeScale);

interface GraphProps {
  activeChipY: string,
  activeChipX: string
}

const LineChart = ({ activeChipX, activeChipY }: GraphProps) => {
  const chartData: any = {
    labels: Data.map((data) => data.date),
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.attendance),
        backgroundColor: ["rgb(255 207 215)"],
        borderColor: "rgb(253,29,133)",
        borderWidth: 2,
        fill: true,
        pointStyle: false,
      },
    ],
  };
  return (
    <div className={styles.chart_container}>
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: activeChipY,
              },
              min: 0,
              max: 80000,
              ticks: {
                stepSize: 20000,
              },
            },
            x: {
              title: {
                display: true,
                text: activeChipX,
              },
              type: "time",
              time: {
                unit: "day",
              },
              ticks: {
                stepSize: 3,
              },
              grid: {
                display: false, // Hide the vertical grid lines
              },
            },
          },
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    </div>
  );
};

export default LineChart;