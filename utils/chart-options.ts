import type { EChartsOption } from "echarts";
import * as echarts from 'echarts';
import { registerMap } from 'echarts';



const maturityLevels = [
  { name: "New", baseValue: 0.25 },
  { name: "Growing", baseValue: 0.35 },
  { name: "Established", baseValue: 0.25 },
  { name: "Flagship", baseValue: 0.15 },
];



// Register the world map data

export type HierarchyLevel = {
  id: string;
  label: string;
  value: string;
};


interface TreeNode {
  name: string;
  value: number;
  children?: TreeNode[];
  rawData?: {
    id?: string;
    category?: string | null;
    location?: string;
    maturity?: string;
  };
}

type LocationData = {
  count: number;
  id: string;
  name: string;
  latitude: string;
  longitude: string;
};

type CategoryData = {
  category: string;
  count: number;
  children?: LocationData[];
};

type ApiData = LocationData | CategoryData;

function isLocationData(item: ApiData | undefined | null): item is LocationData {
  return item !== undefined && item !== null && 'name' in item && 'id' in item && 'latitude' in item && 'longitude' in item;
}

function isCategoryData(item: ApiData | undefined | null): item is CategoryData {
  return item !== undefined && item !== null && 'category' in item;
}

function generateHierarchicalData(hierarchyLevels: HierarchyLevel[], apiData?: ApiData[]): TreeNode[] {
  console.log("Generating hierarchical data with:", { hierarchyLevels, apiData });

  if (!apiData || apiData.length === 0) return [];

  // Check if we're dealing with category-first data
  const isCategoryFirst = hierarchyLevels[0]?.value === "category" &&
    isCategoryData(apiData[0]);

  console.log("isCategoryFirst", isCategoryFirst);

  console.log("hierarchyLevels", hierarchyLevels);

  if (hierarchyLevels.length === 0) {
    const result = apiData.map(item => {
      if (isCategoryFirst && isCategoryData(item)) {
        const node: TreeNode = {
          name: item.category,
          value: item.count,
          rawData: {
            category: item.category
          }
        };
        return node;
      } else if (isLocationData(item)) {
        const node: TreeNode = {
          name: item.name,
          value: item.count,
          rawData: {
            location: item.name,
            category: null,
            id: item.id,
          }
        };
        return node;
      }
      return null;
    }).filter((item): item is TreeNode => item !== null);
    console.log("No hierarchy levels, returning:", result);
    return result;
  }

  const level = hierarchyLevels[0];
  console.log("Processing level:", { level });

  switch (level.value) {
    case "category": {
      if (isCategoryFirst) {
        // For category-first hierarchy, we'll use the actual category data from API
        const categoryResult = apiData
          .filter(isCategoryData)
          .map(item => ({
            name: item.category,
            value: item.count,
            rawData: {
              category: item.category
            },
            children: item.children?.map(child => ({
              name: child.name,
              value: child.count,
              rawData: {
                location: child.name,
                category: item.category,
                id: child.id
              }
            }))
          }));
        console.log("Category level result:", categoryResult);
        return categoryResult;
      }
    }

    case "location": {
      if (isCategoryData(apiData[0])) {
        const categoryResult = apiData
          .filter(isCategoryData)
          .map(item => ({
            name: item.category,
            value: item.count,
            rawData: {
              category: item.category
            },
            children: item.children?.map(child => ({
              name: child.name,
              value: child.count,
              rawData: {
                location: child.name,
                category: item.category,
                id: child.id
              }
            }))
          }));
        return categoryResult;
      }
      // For location level, we'll use the location data directly
      const locationResult = apiData
        .filter(isLocationData)
        .map(item => ({
          name: item.name,
          value: item.count,
          rawData: {
            location: item.name,
            category: null,
            id: item.id,
          }
        }));
      console.log("Location level result:", locationResult);
      return locationResult;
    }

    case "maturity": {
      // For maturity level, we'll distribute the total value across maturity levels
      const totalValue = apiData.reduce((sum, item) => sum + (isLocationData(item) ? item.count : 0), 0);
      const maturityResult = maturityLevels.map(maturity => ({
        name: maturity.name,
        value: Math.floor(totalValue * maturity.baseValue),
        rawData: {
          maturity: maturity.name
        }
      }));
      console.log("Maturity level result:", maturityResult);
      return maturityResult;
    }

    default:
      return [];
  }
}

export function getChartOptions(type: string, hierarchyLevels: HierarchyLevel[] = [], apiData?: ApiData[]): EChartsOption {

  const options: Record<string, EChartsOption> = {
    "geographic-events": {
      title: {
        text: "Visitor Distribution",
        left: "left",
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
              show: true,
            },
          },
          data: [
            { name: "United States", value: 100 },
            { name: "China", value: 80 },
            { name: "India", value: 70 },
            { name: "United Kingdom", value: 50 },
            { name: "Germany", value: 45 },
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
      tooltip: {
        formatter: (params: any) => {
          const value = params.value;
          const percent = params.treePathInfo
            ? ((value / params.treePathInfo[0].value) * 100).toFixed(1)
            : "100";
          return `${params.name}<br/>${value.toLocaleString()} (${percent}%)`;
        },
      },
      
      series: [
        {
          height: "100%",
          width: "100%",
          name: "Distribution",
          type: "treemap",
          visibleMin: 100,
          data: generateHierarchicalData(hierarchyLevels, apiData),
          leafDepth: 1,
          drillDownIcon: '▶',
          levels: [
            {
              itemStyle: {
                borderColor: "#555",
                borderWidth: 4,
                gapWidth: 4,
              },
              label: {
                show: true,
                fontSize: 16,
                fontWeight: "bold",
              },
              upperLabel: {
                show: false,
              },
            },
            {
              colorSaturation: [0.3, 0.6],
              itemStyle: {
                borderColorSaturation: 0.7,
                gapWidth: 2,
                borderWidth: 2,
              },
              emphasis: {
                itemStyle: {
                  borderColor: '#fff'
                }
              },
            }
          ],
          label: {
            show: true,
            formatter: (params: any) => {
              if (params.treePathInfo.length === 1) {
                return `${params.name}\n${params.value.toLocaleString()}`;
              }
              const percent = (
                (params.value / params.treePathInfo[0].value) *
                100
              ).toFixed(1);
              return `${params.name}\n${percent}%`;
            },
            fontSize: 14,
          },
        },
      ],
    },
  };

  return options[type] || options["visitor-flow"];
}