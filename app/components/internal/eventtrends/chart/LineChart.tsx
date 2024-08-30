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
  
  let labels = Object.keys(groupingByDate);
  
  const data = labels.map((date) =>
    groupingByDate[date].reduce((total: any, event: any) => {
      return total + (event.attendance || event.events || 0);
    }, 0)
  );
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
  
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
  
    return formattedDate.replace(',', '');
  }
  
  let updatedLabels=[];
  updatedLabels=labels.map((label)=>formatDate(label))
  if(updatedLabels.length===1) {
    updatedLabels.unshift(updatedLabels[0]);
    data.unshift(data[0]);
  }
  const chartData: any = {
    labels: updatedLabels,
    datasets: [
      {
        label: "Total Attendance",
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
                text: activeChip,
               },
              min: labels.length === 1 ? 0 : Math.min(...data),
            },
            x: {
              title: {
                display: true,
                text: "Date",
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
