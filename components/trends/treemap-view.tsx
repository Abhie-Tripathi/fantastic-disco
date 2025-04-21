import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getChartOptions, HierarchyLevel } from "@/utils/chart-options";
import { useEventsService } from "@/services/eventsService";
import { useFilterContext } from "@/context/filterContext";
import { useQuery } from "@tanstack/react-query";
import { useLocationService } from "@/services/locationService";
import { useFilterState } from "@/hooks/useFilterState";
import Loading from "../ui/Loading";
import { Breadcrumb } from "./breadcrumb";

interface TreemapViewProps {
  hierarchyLevels: HierarchyLevel[];
}

interface DataHistory {
  level: number;
  data: any;
  selectedCategory: string | null;
  path: Array<{ name: string; value: string }>;
}

const TreemapView = ({ hierarchyLevels }: TreemapViewProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { getEventCountByCity, getEventsCount } = useEventsService();
  const { getLocationDetails } = useLocationService();
  const { getFilterValue } = useFilterState();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dataHistory, setDataHistory] = useState<DataHistory[]>([]);
  const [currentPath, setCurrentPath] = useState<
    Array<{ name: string; value: string }>
  >([]);

  // Reset state when hierarchy levels change

  const locationId = getFilterValue("locationIds");
  const activeGte = getFilterValue("active_gte");
  const activeLte = getFilterValue("active_lte");
  const categories = getFilterValue("categories").split(",");
  const eventTypes = getFilterValue("eventTypes");

  useEffect(() => {
    setCurrentLevel(0);
    setSelectedCategory(null);
    setDataHistory([]);
    setCurrentPath([]);
  }, [hierarchyLevels, locationId]);

  const { data: locationDetails } = useQuery({
    queryKey: ["locationDetails", locationId],
    queryFn: async () => {
      if (!locationId) return null;
      return await getLocationDetails(locationId);
    },
    enabled: !!locationId,
  });

  const getGroupBy = () => {
    if (locationDetails?.formattedLocations) {
      const locationTypes = locationDetails.formattedLocations.map(
        (loc) => loc.locationType
      );
      const hasCountry = locationTypes.includes("COUNTRY");
      const hasState = locationTypes.includes("STATE");
      const hasCity = locationTypes.includes("CITY");

      if (hasCountry && !hasState && !hasCity) {
        return "state";
      } else if (hasState && !hasCity) {
        return "city";
      } else if (hasCity) {
        return "city";
      }
    }

    return "country";
  };

  const buildQueryParams = (category?: string, groupBy?: boolean) => {
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
    if (!category && categories.length > 0) {
      params.append("categories", categories.join(","));
    }

    if (category) {
      params.append("categories", category);
    }

    if (eventTypes) {
      params.append("eventTypes", eventTypes);
    }

    if (groupBy) {
      params.append("groupBy", getGroupBy());
    }

    const isLocationFirst = hierarchyLevels[0]?.value === "location";

    if (
      !locationId &&
      !activeGte &&
      !activeLte &&
      !category &&
      !isLocationFirst
    ) {
      return null;
    }

    return params.toString();
  };

  const {
    data: eventCountData,
    refetch: refetchEventCount,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "eventCount",
      locationId,
      activeGte,
      activeLte,
      hierarchyLevels,
      selectedCategory,
      locationDetails,
      categories,
      currentLevel,
      eventTypes,
    ],
    queryFn: async () => {
      const isCategoryFirst = hierarchyLevels[0]?.value === "category";
      const isLocationFirst = hierarchyLevels[0]?.value === "location";

      if (isCategoryFirst) {
        if (selectedCategory) {
          const queryParams = buildQueryParams(selectedCategory, true);
          if (!queryParams) return null;
          return await getEventCountByCity(queryParams);
        } else {
          const results = await Promise.all(
            categories.map(async (category) => {
              const queryParams = buildQueryParams(category);
              if (!queryParams) return null;
              const response = await getEventsCount({
                eventTypes: eventTypes,
                locationIds: locationId,
                active_gte: activeGte,
                active_lte: activeLte,
                categories: category,
              });
              if (!response) return null;

              return {
                category: category
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                count: (response as any).count,
              };
            })
          );

          return results.filter(Boolean);
        }
      } else if (isLocationFirst) {
        if (selectedCategory) {
          const results = await Promise.all(
            categories.map(async (category) => {
              const queryParams = buildQueryParams(category);
              if (!queryParams) return null;
              const response = await getEventsCount({
                locationIds: selectedCategory,
                active_gte: activeGte,
                active_lte: activeLte,
                categories: category,
                eventTypes: eventTypes,
              });
              if (!response) return null;

              return {
                category: category
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
                count: (response as any).count,
              };
            })
          );

          return results.filter(Boolean);
        } else {
          const queryParams = buildQueryParams(undefined, true);
          if (!queryParams) return null;
          return await getEventCountByCity(queryParams);
        }
      } else {
        const queryParams = buildQueryParams(undefined, true);
        if (!queryParams) return null;
        return await getEventCountByCity(queryParams);
      }
    },
  });

  const handleChartClick = (params: any) => {
    if (params.treePathInfo) {
      const isCategoryFirst = hierarchyLevels[0]?.value === "category";
      const isLocationFirst = hierarchyLevels[0]?.value === "location";

      if ((isCategoryFirst || isLocationFirst) && currentLevel === 0) {
        const selectedValue = isCategoryFirst
          ? params.data.rawData?.category?.toLowerCase().replace(/\s+/g, "-")
          : params.data.rawData?.id;
        setSelectedCategory(selectedValue);
        setCurrentLevel(1);

        // Update path and save to history
        const newPath = [
          {
            name: params.name,
            value: selectedValue || "",
          },
        ];
        setCurrentPath(newPath);
        setDataHistory((prev) => [
          ...prev,
          {
            level: currentLevel,
            data: eventCountData,
            selectedCategory: null,
            path: newPath,
          },
        ]);
      } else if (currentLevel < hierarchyLevels.length - 1) {
        setCurrentLevel(currentLevel + 1);

        // Update path and save to history
        const newPath = [
          ...currentPath,
          {
            name: params.name,
            value: params.data.rawData?.id || "",
          },
        ];
        setCurrentPath(newPath);
        setDataHistory((prev) => [
          ...prev,
          {
            level: currentLevel,
            data: eventCountData,
            selectedCategory: selectedCategory,
            path: newPath,
          },
        ]);
      }
    }
  };

  const handleBreadcrumbClick = (level: number) => {
    // If clicking on the current level, go back to initial state
    if (level === currentLevel) {
      // Reset to initial state
      setCurrentLevel(0);
      setSelectedCategory(null);
      setCurrentPath([]);
      setDataHistory([]);

      // Update the chart with initial data
      if (chartInstance.current && eventCountData) {
        const options = getChartOptions(
          "visitor-flow",
          hierarchyLevels.slice(0, 1),
          eventCountData as any
        );
        chartInstance.current.setOption(options);
      }
    } else {
      // If clicking on a previous level, go back to that level
      const targetData = dataHistory.find((h) => h.level === level);

      if (targetData) {
        // Update the chart with historical data
        if (chartInstance.current) {
          const options = getChartOptions(
            "visitor-flow",
            hierarchyLevels.slice(0, level + 1),
            targetData.data
          );
          chartInstance.current.setOption(options);
        }

        // Update state to match historical data
        setCurrentLevel(level);
        setSelectedCategory(targetData.selectedCategory);
        setCurrentPath(targetData.path);

        // Remove future history entries
        setDataHistory((prev) => prev.slice(0, level));
      }
    }
  };

  useEffect(() => {
    const initChart = async () => {
      if (!chartRef.current) return;

      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      chartRef.current.style.height = "600px";
      chartInstance.current = echarts.init(chartRef.current);

      if (eventCountData) {
        // Initialize with the first level of hierarchy
        const options = getChartOptions(
          "visitor-flow",
          hierarchyLevels.slice(0, 1),
          eventCountData as any
        );
        chartInstance.current.setOption(options);
      }

      chartInstance.current.on("click", handleChartClick);
    };

    if (eventCountData) {
      initChart();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [eventCountData, hierarchyLevels]);

  useEffect(() => {
    if (chartInstance.current && eventCountData) {
      // Update chart with current level of hierarchy
      const options = getChartOptions(
        "visitor-flow",
        hierarchyLevels.slice(0, currentLevel + 1),
        eventCountData as any
      );
      chartInstance.current.setOption(options);
    }
  }, [hierarchyLevels, eventCountData, currentLevel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{error.message}</p>
      </div>
    );
  }

  if (eventCountData && (eventCountData as any).count === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>
          No events found. Try expanding your preferences by selecting more
          categories, products, or topics.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-4">
      {currentPath.length > 0 && currentLevel > 0 && (
        <Breadcrumb
          levels={hierarchyLevels}
          currentLevel={currentLevel}
          onLevelClick={handleBreadcrumbClick}
          path={currentPath}
        />
      )}
      <div ref={chartRef} className="w-full" />
    </div>
  );
};

export default TreemapView;
