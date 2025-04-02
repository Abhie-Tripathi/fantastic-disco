"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as echarts from "echarts";

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
import { useEventsService } from "@/services/eventsService";
import { useQuery } from "@tanstack/react-query";
import { useFilterContext } from "@/context/filterContext";
import { useFilterState } from "@/hooks/useFilterState";

export default function VisualizePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hierarchyLevels, setHierarchyLevels] = useState<HierarchyLevel[]>([{
    id: "location",
    label: "Location",
    value: "location"
  }, {
    id: "category",
    label: "Category",
    value: "category"
  }]);
  const { getEventCountByCity, getEventsCount } = useEventsService();
  const { getFilterValue } = useFilterState();
  const [queryParams, setQueryParams] = useState("");

  const locationId = getFilterValue("locationIds");
  const activeGte = getFilterValue("active_gte");
  const activeLte = getFilterValue("active_lte");

  const buildQueryParams = (category?: string, groupBy?: string) => {
    const params = new URLSearchParams();

    if (locationId) {
      params.append("locationIds", locationId);
    }

    if (activeGte) {
      params.append("active_gte", activeGte);
    }

    if (activeLte) {
      params.append("active_lte", activeLte);
    }

    if (category) {
      params.append("categories", category);
    }

    // Add groupBy=state when location is first in hierarchy
    const isLocationFirst = hierarchyLevels[0]?.value === "location";
    if (isLocationFirst || groupBy === "state") {
      params.append("groupBy", "state");
    }

    if (!locationId && !activeGte && !activeLte && !category && !isLocationFirst) {
      return null;
    }

    console.log("params", params.toString());

    return params.toString();
  };

  const categories = [
    "agriculture-forestry",
    "animals-pets",
    "apparel-fashion",
    "arts-crafts",
    "automotive",
    "baby-kids"
  ];

  const { data: eventCountData, refetch } = useQuery({
    queryKey: ["eventCount", params.type, searchParams.toString(), hierarchyLevels, selectedCategory],
    queryFn: async () => {
      // Check if category is the first level
      const isCategoryFirst = hierarchyLevels[0]?.value === "category";
      const isLocationFirst = hierarchyLevels[0]?.value === "location";

      if (isCategoryFirst) {
        if (selectedCategory) {
          // If a category is selected, fetch state-wise data for that category
          const queryParams = buildQueryParams(selectedCategory, "state");
          if (!queryParams) return null;
          return await getEventCountByCity(queryParams);
        } else {
          // Initial load - fetch category counts
          const results = await Promise.all(
            categories.map(async (category) => {
              const queryParams = buildQueryParams(category);
              if (!queryParams) return null;
              const response = await getEventsCount({ 
                locationIds: locationId, 
                active_gte: activeGte, 
                active_lte: activeLte, 
                categories: category 
              });
              if (!response) return null;

              return {
                category: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                count: (response as any).count
              };
            })
          );

          return results;
        }
      } else if (isLocationFirst) {
        if (selectedCategory) {
          // If a location is selected, fetch category data for all categories for that location
          const results = await Promise.all(
            categories.map(async (category) => {
              const queryParams = buildQueryParams(category);
              if (!queryParams) return null;
              const response = await getEventsCount({ 
                locationIds: selectedCategory, // Use selected location ID
                active_gte: activeGte, 
                active_lte: activeLte, 
                categories: category 
              });
              if (!response) return null;

              return {
                category: category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                count: (response as any).count
              };
            })
          );

          return results.filter(Boolean);
        } else {
          // Initial load - fetch state-wise data
          const queryParams = buildQueryParams(undefined, "state");
          if (!queryParams) return null;
          return await getEventCountByCity(queryParams);
        }
      } else {
        // Use the original API call for other cases
        const queryParams = buildQueryParams();
        if (!queryParams) return null;
        return await getEventCountByCity(queryParams);
      }
    },
    enabled: params.type === "visitor-flow",
  });

  console.log("eventCountData", eventCountData);

  const handleChartClick = (params: any) => {
    if (chartInstance.current && params.treePathInfo) {
      const isCategoryFirst = hierarchyLevels[0]?.value === "category";
      const isLocationFirst = hierarchyLevels[0]?.value === "location";
      
      if ((isCategoryFirst || isLocationFirst) && currentLevel === 0) {
        // When clicking a category/location in first level

        const selectedValue = isCategoryFirst 
          ? params.data.rawData?.category?.toLowerCase().replace(/\s+/g, '-')
          : params.data.rawData?.id;
        setSelectedCategory(selectedValue);
        setCurrentLevel(1);
      } else if (currentLevel < hierarchyLevels.length - 1) {
        setCurrentLevel(currentLevel + 1);
      }
    }
  };

  const handleBreadcrumbClick = (params: any) => {
    if (chartInstance.current) {
      setCurrentLevel(params.nodeIndex);
      if (params.nodeIndex === 0) {
        setSelectedCategory(null);
      }
    }
  };

  const handleFiltersChange = async (filters: any) => {
    if (chartInstance.current) {
      setCurrentLevel(0);
      setSelectedCategory(null);
      setHierarchyLevels(filters.hierarchyLevels);

      await refetch();

      const options = getChartOptions(params.type as string, filters.hierarchyLevels, eventCountData as any);
      chartInstance.current.setOption(options);
    }
  };

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;

      // try {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      chartRef.current.style.height = "600px";
      chartInstance.current = echarts.init(chartRef.current);

      console.log("Initializing chart with data:", eventCountData, hierarchyLevels);
      const options = getChartOptions(params.type as string, hierarchyLevels, eventCountData as any);
      chartInstance.current.setOption(options);

      chartInstance.current.on('click', handleChartClick);
      chartInstance.current.on('breadcrumbclick', handleBreadcrumbClick);

      setIsLoading(false);
      // } catch (error) {
      //   console.error("Error initializing chart:", error);
      //   setIsLoading(false);
      // }
    };

    initChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [params.type, eventCountData, hierarchyLevels]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Templates
        </Button>

        <div className="grid lg:grid-cols-[350px,1fr] gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {/* <ChartFilters
              type={params.type as string}
              onFiltersChange={handleFiltersChange}
            /> */}
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