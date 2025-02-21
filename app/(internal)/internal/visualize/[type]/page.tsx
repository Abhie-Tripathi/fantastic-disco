"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as echarts from "echarts";
// Import all necessary echarts modules
import "echarts/lib/chart/treemap";
import "echarts/lib/chart/map";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import "echarts/lib/component/grid";

import { Button } from "@/components/ui/button";
import { ChartFilters } from "@/components/trendsChart/chart-filters";
import { getChartOptions } from "@/utils/chart-options";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function VisualizePage() {
  const params = useParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLevelOption = () => {
    return [
      {
        itemStyle: {
          borderWidth: 0,
          gapWidth: 5
        }
      },
      {
        itemStyle: {
          gapWidth: 1
        }
      },
      {
        colorSaturation: [0.35, 0.5],
        itemStyle: {
          gapWidth: 1,
          borderColorSaturation: 0.6
        }
      }
    ];
  };

  useEffect(() => {
    const cleanup = () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };

    const initChart = async () => {
      if (!chartRef.current) return;

      try {
        cleanup();

        // Make sure container is visible and has dimensions
        chartRef.current.style.display = "block";
        chartRef.current.style.height = "600px";
        chartRef.current.style.width = "100%";

        // Initialize new chart
        chartInstance.current = echarts.init(chartRef.current);
        
        // Show loading state
        chartInstance.current.showLoading();

        // If it's a treemap, use the special configuration
        if (params.type === 'visitor-flow') {
          const options = {
            title: {
              text: 'Visitor Distribution',
              left: 'center'
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
                    echarts.format.encodeHTML(treePath.join('/')) +
                    '</div>',
                  'Visitors: ' + echarts.format.addCommas(value)
                ].join('');
              }
            },
            series: [
              {
                name: 'Visitor Distribution',
                type: 'treemap',
                visibleMin: 300,
                label: {
                  show: true,
                  formatter: '{b}'
                },
                itemStyle: {
                  borderColor: '#fff'
                },
                levels: getLevelOption(),
                data: [
                  {
                    name: 'International',
                    value: 1000,
                    children: [
                      { name: 'Europe', value: 400 },
                      { name: 'Asia', value: 300 },
                      { name: 'Americas', value: 200 },
                      { name: 'Others', value: 100 }
                    ]
                  },
                  {
                    name: 'Domestic',
                    value: 800,
                    children: [
                      { name: 'Local', value: 500 },
                      { name: 'Regional', value: 300 }
                    ]
                  }
                ]
              }
            ]
          };
          chartInstance.current.setOption(options);
        } else {
          // For other chart types, use the default options
          const options = getChartOptions(params.type as string);
          chartInstance.current.setOption(options);
        }

        // Hide loading state
        chartInstance.current.hideLoading();

        // Handle resize
        const handleResize = () => {
          chartInstance.current?.resize();
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        setIsLoading(false);

        return () => {
          window.removeEventListener("resize", handleResize);
        };
      } catch (error) {
        console.error("Error initializing chart:", error);
        setIsLoading(false);
      }
    };

    const timer = setTimeout(initChart, 100);

    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [params.type]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>

        <div className="grid lg:grid-cols-[350px,1fr] gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <ChartFilters type={params.type as string} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border relative w-full">
            <div
              ref={chartRef}
              className="w-full"
              style={{
                height: "600px",
                visibility: isLoading ? "hidden" : "visible",
                position: "relative",
              }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
