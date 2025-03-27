import type { EChartsOption } from "echarts";
import * as echarts from 'echarts';
import { registerMap } from 'echarts';

const indianZones = [
  {
    name: "North India",
    value: 2000,
    children: [
      { name: "Delhi", value: 1100 },
      { name: "Lucknow", value: 300 },
      { name: "Kanpur", value: 250 },
      { name: "Jaipur", value: 350 },
    ],
  },
  {
    name: "South India",
    value: 2550,
    children: [
      { name: "Bangalore", value: 1000 },
      { name: "Hyderabad", value: 800 },
      { name: "Chennai", value: 750 },
    ],
  },
  {
    name: "West India",
    value: 2750,
    children: [
      { name: "Mumbai", value: 1200 },
      { name: "Pune", value: 500 },
      { name: "Ahmedabad", value: 450 },
      { name: "Surat", value: 400 },
      { name: "Indore", value: 200 },
    ],
  },
  {
    name: "East India",
    value: 850,
    children: [
      { name: "Kolkata", value: 700 },
      { name: "Bhopal", value: 150 },
    ],
  },
].map((zone) => ({
  ...zone,
  value: zone.children.reduce((sum, city) => sum + city.value, 0), // Calculate value dynamically
}));

const maturityLevels = [
  { name: "New", baseValue: 0.25 },
  { name: "Growing", baseValue: 0.35 },
  { name: "Established", baseValue: 0.25 },
  { name: "Flagship", baseValue: 0.15 },
];

const categories = [
  { name: "Agriculture & Forestry", baseValue: 0.08 },
  { name: "Animals & Pets", baseValue: 0.05 },
  { name: "Apparel & Clothing", baseValue: 0.1 },
  { name: "Arts & Crafts", baseValue: 0.07 },
  { name: "Auto & Automotive", baseValue: 0.09 },
  { name: "Baby, Kids & Maternity", baseValue: 0.08 },
  { name: "Banking & Finance", baseValue: 0.1 },
  { name: "Building & Construction", baseValue: 0.09 },
  { name: "Business Services", baseValue: 0.1 },
  { name: "Education & Training", baseValue: 0.08 },
  { name: "Electric & Electronics", baseValue: 0.08 },
  { name: "Entertainment & Media", baseValue: 0.08 },
];

const generateCategoryData = (baseValue: number) => {
  return categories.map((category) => ({
    name: category.name,
    value: Math.floor(baseValue * category.baseValue),
  }));
};

const generateMaturityData = (cityValue: number) => {
  return maturityLevels.map((maturity) => ({
    name: maturity.name,
    value: Math.floor(cityValue * maturity.baseValue),
    children: generateCategoryData(cityValue * maturity.baseValue),
  }));
};

// Register the world map data

export type HierarchyLevel = {
  id: string;
  label: string;
  value: string;
};

// Simplified dummy data with more realistic values and cities
const dummyData = {
  cities: [
    { name: "Mumbai", value: 12500 },
    { name: "Delhi", value: 11800 },
    { name: "Bangalore", value: 10200 },
    { name: "Hyderabad", value: 8500 },
    { name: "Chennai", value: 7800 },
    { name: "Kolkata", value: 7200 },
    { name: "Pune", value: 6500 },
    { name: "Ahmedabad", value: 5800 },
    { name: "Jaipur", value: 4200 },
    { name: "Lucknow", value: 3800 },
    { name: "Chandigarh", value: 3200 },
    { name: "Kochi", value: 2800 },
  ],
  categories: [
    { name: "Electronics & Technology", baseValue: 0.18 },
    { name: "Fashion & Apparel", baseValue: 0.15 },
    { name: "Food & Beverages", baseValue: 0.14 },
    { name: "Healthcare & Wellness", baseValue: 0.12 },
    { name: "Home & Furniture", baseValue: 0.10 },
    { name: "Beauty & Personal Care", baseValue: 0.08 },
    { name: "Sports & Fitness", baseValue: 0.07 },
    { name: "Books & Education", baseValue: 0.06 },
    { name: "Travel & Leisure", baseValue: 0.05 },
    { name: "Automotive", baseValue: 0.03 },
    { name: "Jewelry & Accessories", baseValue: 0.02 },
  ],
};

interface TreeNode {
  name: string;
  value: number;
  children?: TreeNode[];
  rawData?: Record<string, any>;
}

function generateHierarchicalData(hierarchyLevels: HierarchyLevel[], apiData?: { data: Array<{ count: number; id: string; name: string; latitude: string; longitude: string }> }): TreeNode[] {
  console.log("Generating hierarchical data with:", { hierarchyLevels, apiData });
  
  if (hierarchyLevels.length === 0) {
    const result = apiData?.data.map(city => ({
      name: city.name,
      value: city.count,
      rawData: {
        location: city.name,
        category: null,
      }
    })) || [];
    console.log("No hierarchy levels, returning:", result);
    return result;
  }

  const processLevel = (
    level: HierarchyLevel,
    remainingLevels: HierarchyLevel[]
  ): TreeNode[] => {
    const isLastLevel = remainingLevels.length === 0;
    console.log("Processing level:", { level, isLastLevel, remainingLevels });

    switch (level.value) {
      case "location":
        const locationResult = (apiData?.data || []).map(city => ({
          name: city.name,
          value: city.count,
          children: isLastLevel ? undefined : 
            remainingLevels.length > 0 
              ? processLevel(remainingLevels[0], remainingLevels.slice(1))
              : undefined
        }));
        console.log("Location level result:", locationResult);
        return locationResult;

      case "category":
        const categoryResult = dummyData.categories.map(category => {
          const categoryValue = (value: number) => Math.floor(value * (category.baseValue || 0));
          const totalCount = apiData?.data.reduce((sum, city) => sum + city.count, 0) || 0;
          
          if (isLastLevel) {
            return {
              name: category.name,
              value: categoryValue(totalCount)
            };
          }

          const children = remainingLevels.length > 0 
            ? processLevel(remainingLevels[0], remainingLevels.slice(1))
            : undefined;

          return {
            name: category.name,
            value: children 
              ? children.reduce((sum, child) => sum + child.value, 0)
              : categoryValue(totalCount),
            children
          };
        });
        console.log("Category level result:", categoryResult);
        return categoryResult;

      default:
        return [];
    }
  };

  const result = processLevel(hierarchyLevels[0], hierarchyLevels.slice(1));
  console.log("Final hierarchical data:", result);
  return result;
}

export function getChartOptions(type: string, hierarchyLevels: HierarchyLevel[] = [], apiData?: { data: Array<{ count: number; id: string; name: string; latitude: string; longitude: string }> }): EChartsOption {
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
      title: {
        text: "Visitor Distribution",
        left: "center",
        top: 20,
      },
      tooltip: {
        formatter: (params: any) => {
          const value = params.value;
          const percent = params.treePathInfo
            ? ((value / params.treePathInfo[0].value) * 100).toFixed(1) + "%"
            : "100%";
          return `${params.name}<br/>Value: ${value.toLocaleString()}<br/>Share: ${percent}`;
        },
      },
      series: [
        {
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
          breadcrumb: {
            show: true,
            height: 30,
            bottom: "bottom",
            emphasis: {
              // itemStyle: {
              //   color: '#fff'
              // }
            }
          },
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