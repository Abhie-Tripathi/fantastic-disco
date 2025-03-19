//@ts-nocheck
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
import { getChartOptions, HierarchyLevel } from "@/utils/chart-options";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function VisualizePage() {
  const params = useParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([]);

  const handleChartClick = (params: any) => {
    if (chartInstance.current && params.treePathInfo) {
      // Only allow drill down if there are more levels to show
      if (currentLevel < hierarchyLevels.length - 1) {
        setCurrentLevel(currentLevel + 1);
      }
    }
  };

  const handleBreadcrumbClick = (params: any) => {
    if (chartInstance.current) {
      setCurrentLevel(params.nodeIndex);
    }
  };

  const handleFiltersChange = (filters: any) => {
    if (chartInstance.current) {
      setCurrentLevel(0);
      setHierarchyLevels(filters.hierarchyLevels);
      const options = getChartOptions(params.type as string, filters.hierarchyLevels);
      chartInstance.current.setOption(options);
    }
  };

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;

      try {
        if (chartInstance.current) {
          chartInstance.current.dispose();
        }

        chartRef.current.style.height = "600px";
        chartInstance.current = echarts.init(chartRef.current);
        
        const options = getChartOptions(params.type as string);
        chartInstance.current.setOption(options);
        
        // Add click event handlers
        chartInstance.current.on('click', handleChartClick);
        chartInstance.current.on('breadcrumbclick', handleBreadcrumbClick);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing chart:", error);
        setIsLoading(false);
      }
    };

    initChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
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
            <ChartFilters 
              type={params.type as string} 
              onFiltersChange={handleFiltersChange}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border relative">
            <div ref={chartRef} className="w-full" />
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
