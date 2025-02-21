import type { EChartsOption } from "echarts"

export function getChartOptions(type: string): EChartsOption {
  const options: Record<string, EChartsOption> = {
    "geographic-events": {
      title: {
        text: "Geographic Event Distribution",
        left: "center",
        top: 20,
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "item",
      },
      visualMap: {
        min: 0,
        max: 100,
        text: ["High", "Low"],
        realtime: false,
        calculable: true,
        inRange: {
          color: ["#f3e7ff", "#9333ea"],
        },
      },
      series: [
        {
          type: "treemap",
          data: [
            {
              name: "North America",
              value: 150,
              children: [
                { name: "USA", value: 100 },
                { name: "Canada", value: 30 },
                { name: "Mexico", value: 20 },
              ],
            },
            {
              name: "Europe",
              value: 120,
              children: [
                { name: "UK", value: 50 },
                { name: "Germany", value: 40 },
                { name: "France", value: 30 },
              ],
            },
            {
              name: "Asia",
              value: 180,
              children: [
                { name: "China", value: 80 },
                { name: "Japan", value: 60 },
                { name: "India", value: 40 },
              ],
            },
          ],
        },
      ],
    },
    "economic-impact": {
      title: {
        text: "Economic Impact by Region",
        left: "center",
        top: 20,
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["Direct", "Indirect", "Induced"],
        top: 60,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: 100,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["Q1", "Q2", "Q3", "Q4"],
      },
      yAxis: {
        type: "value",
        name: "Economic Impact ($M)",
      },
      series: [
        {
          name: "Direct",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: [320, 302, 301, 334],
          itemStyle: {
            color: "#9333ea",
          },
        },
        {
          name: "Indirect",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134],
          itemStyle: {
            color: "#a855f7",
          },
        },
        {
          name: "Induced",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: [220, 182, 191, 234],
          itemStyle: {
            color: "#c084fc",
          },
        },
      ],
    },
    "visitor-flow": {
      title: {
        text: "Visitor Flow Distribution",
        left: "center",
        top: 20,
        textStyle: {
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: 10,
        top: "center",
      },
      series: [
        {
          name: "Visitor Source",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: "Local", itemStyle: { color: "#9333ea" } },
            { value: 735, name: "Regional", itemStyle: { color: "#a855f7" } },
            { value: 580, name: "National", itemStyle: { color: "#c084fc" } },
            { value: 484, name: "International", itemStyle: { color: "#d8b4fe" } },
          ],
        },
      ],
    },
  }

  return options[type] || options["geographic-events"]
}

