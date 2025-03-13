"use client";
import Text from "@/components/new-ui/Text";
import SavedTrendsList from "@/components/newTrends/savedTrendsList";
import SaveTrend from "@/components/newTrends/saveTrend";
import TestPeriodicAnalytics from "@/components/newTrends/table-view/TestPeriodicAnalytics";
import ColumnsSelector from "@/components/search/columnSelector";
import DateRangeSelector from "@/components/search/dateRange";
import EventTypeSelector from "@/components/search/eventType";
import LocationSelector from "@/components/search/location";
import LineChartComponent from "@/components/trends/lineChart";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";
import { isEventeli } from "@/config";
import { useFilterContext } from "@/context/filterContext";
import { columnsDropdown } from "@/data/trends";
import { NewColumn } from "@/data/trendsTableColHead";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
import { useEventsService } from "@/services/eventsService";
import { useTrendsService } from "@/services/trendsService";
import { EventResponse } from "@/types/events";
import {
  EventTrendsResponse,
  GetSaveTrendData,
  TableData,
  TableGroupedHoliday,
  TEventColumnType,
} from "@/types/trends/trends";
import {
  generateTrendsTableColumnHeaders,
  morphToGraphData,
  morphToSmartInsightsData,
  morphToTrendsTableData,
} from "@/utils/lineChart";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import styles from "./trends.module.css";
import ZeroStateIcon from "/public/zero_state.svg";
import ZeroStateDataIcon from "/public/zero_state_data.svg";

const EventTrends = () => {
  const { searchParams } = useDefaultFilters();
  const { getEventTrends, getSavedTrends } = useTrendsService();
  const { applyFilters, setLocalFilter, getLocalFilterValue } =
    useFilterContext();
  const columns = searchParams.get("columns");
  const editTrend = searchParams.get("editTrend");
  const eventTypes = searchParams.get("eventTypes");
  const eventTypesArray = eventTypes ? eventTypes.split(",") : [];
  const hasHoliday =
    eventTypesArray.length > 0 ? eventTypesArray.includes("holiday") : false;
  const enableEditTrend = editTrend ? Boolean(editTrend) : false;
  const columnsData = (columns && columns.split(",")) || [];
  const [isSmartInsightsEnabled, setIsSmartInsightsEnabled] =
    useState<boolean>(false);
  const [smartInsightState, setSmartInsightState] = useState<{
    [key: string]: boolean;
  }>(
    columnsData.length > 0
      ? columnsData.reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as { [key: string]: boolean })
      : {}
  );
  const [eventTrendsData, setEventTrendsData] = useState<
    EventTrendsResponse | undefined
  >();
  const [graphData, setGraphData] = useState<any>();
  const [tableData, setTableData] = useState<TableData[] | []>();
  const [tableColumns, setTableColumns] = useState<NewColumn[]>();
  const { getEventsWithSearchParams } = useEventsService();
  const [selectedEventType, setSelectedEventType] = useState<TEventColumnType>(
    () => {
      return columnsData[0] as TEventColumnType;
    }
  );
  const [showNotificationForm, setShowNotificationForm] =
    useState<boolean>(false);

  const stringParams = `groupBy=date&dateView=day&${searchParams.toString()}`;

  const apiParams = useMemo(() => {
    const params = new URLSearchParams({
      groupBy: "date",
      dateView: "day",
    });
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    return params.toString();
  }, [stringParams]);

  const updatedParams = useMemo(() => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("eventTypes", "holiday");
    updatedSearchParams.delete("skip");
    return updatedSearchParams.toString();
  }, [searchParams]);

  const {
    data: trendsData,
    error,
    isLoading,
  } = useQuery<EventTrendsResponse | undefined>({
    queryKey: ["trends", apiParams.toString()],
    queryFn: () => getEventTrends(apiParams.toString()),
    enabled: !!apiParams.toString(),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const { data: holdiayData } = useQuery({
    queryKey: ["holiday", updatedParams],
    queryFn: async () => await getEventsWithSearchParams(updatedParams),
    enabled: isEventeli && hasHoliday,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  const { data: savedTrendsList } = useQuery<GetSaveTrendData>({
    queryKey: ["getSavedTrends"],
    queryFn: async () => {
      const result = await getSavedTrends();
      if (!result) throw new Error("Failed to fetch saved trends");
      return result;
    },
  });

  const groupedData = (holdiayData as EventResponse)?.events.reduce<
    Record<string, TableGroupedHoliday>
  >((acc, { basic }) => {
    const { startDateTime, name } = basic;
    if (!acc[startDateTime]) {
      acc[startDateTime] = { date: startDateTime, count: 0, holidays: [] };
    }
    acc[startDateTime].count++;
    acc[startDateTime].holidays.push(name);
    return acc;
  }, {});

  const holidaysByDate =
    (groupedData &&
      Object.values(groupedData).length > 0 &&
      Object.values(groupedData)) ||
    [];

  useEffect(() => {
    if (trendsData !== undefined) {
      setEventTrendsData(trendsData);
      setSelectedEventType(() => {
        return columnsData[0] as TEventColumnType;
      });
    }
  }, [trendsData]);

  useEffect(() => {
    const skip = searchParams.get("skip");

    if (!skip) {
      setIsSmartInsightsEnabled(false);

      setSelectedEventType(() => {
        return columnsData[0] as TEventColumnType;
      });

      setSmartInsightState((prev) => {
        const updatedState = columnsData.reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as { [key: string]: boolean });

        return updatedState;
      });
    }
  }, [trendsData, searchParams]);

  useEffect(() => {
    if (Object.keys(smartInsightState).length > 0) {
      const allFalse = Object.values(smartInsightState).every(
        (value) => value === false
      );
      const allTrue = Object.values(smartInsightState).every(
        (value) => value === true
      );
      if (allFalse) {
        setIsSmartInsightsEnabled(false);
      }
      if (allTrue) {
        setIsSmartInsightsEnabled(true);
      }
    }
  }, [smartInsightState]);

  useEffect(() => {
    setSmartInsightState((prevState) => {
      const newState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = isSmartInsightsEnabled;
        return acc;
      }, {} as { [key: string]: boolean });
      return newState;
    });
  }, [isSmartInsightsEnabled]);

  useEffect(() => {
    const eventTypes = searchParams.get("eventTypes")?.split(",") || [];
    const columns = searchParams.get("columns")?.split(",") || [];
    if (eventTrendsData && eventTrendsData.groupedData) {
      const tableColumns = generateTrendsTableColumnHeaders(
        eventTypes,
        columns
      );

      const graphData = morphToGraphData(
        eventTrendsData.groupedData,
        selectedEventType
      );

      const tableData = morphToTrendsTableData(
        eventTrendsData.thresholds,
        eventTrendsData.groupedData,
        eventTypes
      );

      const smartInsightsData = morphToSmartInsightsData(tableData);

      setGraphData(graphData);
      setTableData(smartInsightsData);
      setTableColumns(tableColumns);
    }
  }, [eventTrendsData, selectedEventType]);

  useEffect(() => {
    if (trendsData === undefined) {
      setGraphData(undefined);
    }
  }, [trendsData]);

  const applyHandler = () => {
    const columnsValue = columnsDropdown
      .filter(
        (dropdown) =>
          dropdown.value !== "impactScore" &&
          dropdown.value !== "economicImpact"
      )
      .map((filteredValue) => filteredValue.value)
      .join(",");
    if (getLocalFilterValue("eventTypes").length > 0) {
      setLocalFilter("columns", columnsValue);
      setLocalFilter("status", "active,cancelled,postponed");
      setLocalFilter("show", "alerts,scores,economicImpact");
    }
    applyFilters({ resetPage: true });
  };

  const handleSelectChange = (value: TEventColumnType) => {
    setSelectedEventType(value);
  };

  return (
    <div className="flex flex-col p-4">
      {savedTrendsList && savedTrendsList?.trackers.length > 0 && (
        <SavedTrendsList savedTrendsList={savedTrendsList?.trackers || []} />
      )}
      <div className="relative">
        <div className="grid grid-cols-5 max-lg:grid-cols-2 gap-4 pt-4 pb-6 border-b items-end">
          <EventTypeSelector />
          <div className="flex flex-col gap-2 items-start">
            <LocationSelector />
          </div>
          <div className="flex flex-col gap-2 items-start">
            <DateRangeSelector />
          </div>
          <div className="flex flex-col gap-2 items-start">
            <ColumnsSelector
              selectedEventType={selectedEventType}
              handleSelectChange={handleSelectChange}
            />
          </div>
          <div className="grid grid-cols-2 max-lg:col-end-3 w-full gap-4">
            <Button
              className="flex-1 py-5"
              onClick={applyHandler}
              disabled={isLoading || enableEditTrend}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </Button>
            <SaveTrend
              searchParams={searchParams}
              isLoading={isLoading}
              setShowNotificationForm={setShowNotificationForm}
            />
          </div>
        </div>
        {isLoading ? (
          <Loading className="absolute right-1/2 -bottom-3/4" />
        ) : error ? (
          <div className={styles.zeroState_container}>
            <Image
              src={ZeroStateIcon}
              alt="zerostate"
              width={150}
              height={150}
            />
            <div>Set filters to view data</div>
          </div>
        ) : graphData && graphData.length > 0 ? (
          <div className="pt-8">
            <div className={styles.predictedAttendence_container}>
              <LineChartComponent
                predictedData={graphData}
                selectedEventType={selectedEventType}
                holidayByDates={holidaysByDate}
                threshold={
                  (eventTrendsData &&
                    eventTrendsData.thresholds[selectedEventType]) ??
                  0
                }
                showLegend
              />
            </div>
            <div className={styles.inner_container}>
              <div className="py-8">
                <TestPeriodicAnalytics
                  isSmartInsightsEnabled={isSmartInsightsEnabled}
                  smartInsightState={smartInsightState}
                  setIsSmartInsightsEnabled={setIsSmartInsightsEnabled}
                  setSmartInsightState={setSmartInsightState}
                  data={tableData && tableData.length > 0 ? tableData : []}
                  tableColumns={tableColumns || []}
                  holidayByDates={holidaysByDate}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.zeroState_container}>
            <Image
              src={ZeroStateDataIcon}
              alt="zerostateData"
              width={150}
              height={150}
            />
            <p>No Events Found</p>
            <Text
              variant="noMargin"
              color="secondary"
              className="w-80 text-center"
            >
              Try selecting a different date range or broaden the location to
              view events.
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};
export default EventTrends;
