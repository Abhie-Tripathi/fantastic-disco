import type { EChartsOption } from "echarts"

export function getChartOptions(type: string): EChartsOption {
  const options: Record<string, EChartsOption> = {
    "geographic-events": {
      title: {
        text: "Geographic Event Distribution",
        left: "center",
        top: 20,
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Events",
          type: "map",
          map: "world",
          roam: true,
          emphasis: {
            label: {
              show: true
            }
          },
          data: [
            { name: "United States", value: 100 },
            { name: "China", value: 80 },
            { name: "India", value: 70 },
            { name: "United Kingdom", value: 50 },
            { name: "Germany", value: 45 },
          ]
        }
      ]
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
        text: "Visitor Distribution Analysis",
        left: "center",
        top: 20,
      },
      tooltip: {
        formatter: function (info: any) {
          const value = info.value;
          const treePathInfo = info.treePathInfo;
          const treePath = [];

          for (let i = 1; i < treePathInfo.length; i++) {
            treePath.push(treePathInfo[i].name);
          }

          return [
            '<div class="tooltip-title">' +
              treePath.join(' > ') +
              '</div>',
            'Visitors: ' + value.toLocaleString(),
            'Avg. Duration: ' + info.data.duration + ' days',
            info.data.growth ? 'YoY Growth: ' + info.data.growth + '%' : ''
          ].filter(Boolean).join('<br/>');
        }
      },
      series: [
        {
          type: "treemap",
          data: [
            {
              name: "By Geography",
              value: 40000,
              children: [
                {
                  name: "International",
                  value: 15000,
                  children: [
                    {
                      name: "Europe",
                      value: 6000,
                      children: [
                        { name: "Germany", value: 2500, itemStyle: { duration: 3.5, growth: 15 } },
                        { name: "UK", value: 2000, itemStyle: { duration: 3.2, growth: 12 } },
                        { name: "France", value: 1500, itemStyle: { duration: 3.0, growth: 8 } }
                      ]
                    },
                    {
                      name: "Asia",
                      value: 5000,
                      children: [
                        { name: "China", value: 2000, itemStyle: { duration: 4.0, growth: 25 } },
                        { name: "Japan", value: 1800, itemStyle: { duration: 3.8, growth: 10 } },
                        { name: "India", value: 1200, itemStyle: { duration: 3.5, growth: 20 } }
                      ]
                    },
                    {
                      name: "Americas",
                      value: 4000,
                      children: [
                        { name: "USA", value: 2500, itemStyle: { duration: 3.8, growth: 18 } },
                        { name: "Canada", value: 1000, itemStyle: { duration: 3.2, growth: 15 } },
                        { name: "Brazil", value: 500, itemStyle: { duration: 3.0, growth: 12 } }
                      ]
                    }
                  ]
                },
                {
                  name: "Domestic",
                  value: 25000,
                  children: [
                    { name: "Local", value: 15000, itemStyle: { duration: 1.5, growth: 8 } },
                    { name: "Regional", value: 10000, itemStyle: { duration: 2.0, growth: 10 } }
                  ]
                }
              ]
            },
            {
              name: "By Event Type",
              value: 40000,
              children: [
                {
                  name: "Business",
                  value: 25000,
                  children: [
                    {
                      name: "Tradeshows",
                      value: 12000,
                      children: [
                        { name: "Technology", value: 5000, itemStyle: { duration: 3.0, growth: 20 } },
                        { name: "Manufacturing", value: 4000, itemStyle: { duration: 2.8, growth: 15 } },
                        { name: "Healthcare", value: 3000, itemStyle: { duration: 2.5, growth: 12 } }
                      ]
                    },
                    {
                      name: "Conferences",
                      value: 8000,
                      children: [
                        { name: "Industry", value: 4000, itemStyle: { duration: 2.5, growth: 18 } },
                        { name: "Academic", value: 2500, itemStyle: { duration: 3.0, growth: 10 } },
                        { name: "Professional", value: 1500, itemStyle: { duration: 2.0, growth: 15 } }
                      ]
                    },
                    {
                      name: "Meetups",
                      value: 5000,
                      children: [
                        { name: "Tech Meetups", value: 2500, itemStyle: { duration: 1.0, growth: 25 } },
                        { name: "Business Networking", value: 2500, itemStyle: { duration: 1.0, growth: 20 } }
                      ]
                    }
                  ]
                },
                {
                  name: "Non-Business",
                  value: 15000,
                  children: [
                    {
                      name: "Entertainment",
                      value: 8000,
                      children: [
                        { name: "Concerts", value: 4000, itemStyle: { duration: 1.5, growth: 22 } },
                        { name: "Festivals", value: 4000, itemStyle: { duration: 2.5, growth: 18 } }
                      ]
                    },
                    {
                      name: "Sports",
                      value: 7000,
                      children: [
                        { name: "Professional", value: 4000, itemStyle: { duration: 1.0, growth: 15 } },
                        { name: "Amateur", value: 3000, itemStyle: { duration: 1.0, growth: 12 } }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              name: "By Size",
              value: 40000,
              children: [
                {
                  name: "Large Events",
                  value: 20000,
                  children: [
                    { name: "2000-5000 Attendees", value: 12000, itemStyle: { duration: 3.0, growth: 15 } },
                    { name: "5000+ Attendees", value: 8000, itemStyle: { duration: 3.5, growth: 20 } }
                  ]
                },
                {
                  name: "Medium Events",
                  value: 15000,
                  children: [
                    { name: "1000-1500 Attendees", value: 8000, itemStyle: { duration: 2.5, growth: 12 } },
                    { name: "1500-2000 Attendees", value: 7000, itemStyle: { duration: 2.8, growth: 14 } }
                  ]
                },
                {
                  name: "Small Events",
                  value: 5000,
                  children: [
                    { name: "500-750 Attendees", value: 3000, itemStyle: { duration: 2.0, growth: 8 } },
                    { name: "750-1000 Attendees", value: 2000, itemStyle: { duration: 2.2, growth: 10 } }
                  ]
                }
              ]
            }
          ],
          levels: [
            {
              itemStyle: {
                borderColor: '#777',
                borderWidth: 0,
                gapWidth: 1
              }
            },
            {
              itemStyle: {
                borderColor: '#555',
                borderWidth: 5,
                gapWidth: 1
              }
            },
            {
              itemStyle: {
                borderColor: '#444',
                borderWidth: 5,
                gapWidth: 1
              }
            },
            {
              itemStyle: {
                borderColor: '#333',
                borderWidth: 5,
                gapWidth: 1
              }
            }
          ],
          label: {
            show: true,
            formatter: '{b}: {c}',
            fontSize: 12
          },
          upperLabel: {
            show: true,
            height: 30
          },
          breadcrumb: {
            show: true,
            height: 30,
            bottom: 'bottom'
          }
        }
      ]
    },
  }

  return options[type] || options["geographic-events"]
}

