import { Line } from "react-chartjs-2";
import styles from "./linechart.style.module.css";
import Chart from "chart.js/auto";
import { LinearScale, TimeScale } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(LinearScale, TimeScale);

interface GraphProps {
  activeChipY: string;
  activeChipX: string;
  groupedData: any;
}

const LineChart = ({ activeChipX, activeChipY, groupedData }: GraphProps) => {
  const { groupingByDate }: any = groupedData;

  const labels = Object.keys(groupingByDate);
  const data = labels.map((date) =>
    groupingByDate[date].reduce(
      (total: any, event: any) => total + event.attendance,
      0
    )
  );
  const chartData: any = {
    labels: labels,
    datasets: [
      {
        label: "Total Attendance ",
        data: data,
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
              min: Math.min(...data) - 10,
              max: Math.max(...data) + 10,
              ticks: {
                stepSize: 5,
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
                source: "auto",
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
