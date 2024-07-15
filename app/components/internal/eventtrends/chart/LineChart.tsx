import { Line } from "react-chartjs-2";
import styles from "./linechart.style.module.css";
import Chart from "chart.js/auto";
import { LinearScale, TimeScale } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(LinearScale, TimeScale);

interface GraphProps {
  activeChip: string;
  groupedData: any;
}

const LineChart = ({ activeChip, groupedData }: GraphProps) => {
  const { groupingByDate }: any = groupedData;

  const labels = Object.keys(groupingByDate);

  const firstDate = new Date(labels[0]);
  const previousDate = new Date(firstDate);
  previousDate.setDate(firstDate.getDate() - 1);
  const previousDateString = previousDate.toISOString().split("T")[0];

  const data = labels.map((date) =>
    groupingByDate[date].reduce((total: any, event: any) => {
      return total + (event.attendance || event.events || 0);
    }, 0)
  );

  labels.unshift(previousDateString);
  data.unshift(-1);
  const chartData: any = {
    labels: labels,
    datasets: [
      {
        label: "Total Attendance",
        data: [, ...data],
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
                text: activeChip,
              },
              min: Math.min(...data),
              max: Math.max(...data),
              ticks: {
                source: "auto",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
              type: "time",
              time: {
                unit: "day",
              },
              ticks: {
                source: "auto",
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                padding: 10, // Add padding to ensure the first point is visible
              },
              grid: {
                display: false, // Hide the vertical grid lines
              },
            },
          },
          maintainAspectRatio: false,
          responsive: true,
          layout: {
            padding: {
              left: 10,
              right: 10,
              top: 10,
              bottom: 10,
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
