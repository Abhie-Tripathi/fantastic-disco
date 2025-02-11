"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./trends.module.css";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import ZeroStateIcon from "/public/zero_state.svg";
import ZeroStateDataIcon from "/public/zero_state_data.svg";
import { Button } from "@/components/ui/button";
import Text from "@/components/new-ui/Text";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  aggregateAttendanceData,
  generateDatesArray,
  generateTrendsTableColumnHeaders,
  morphToGraphData,
  morphToSmartInsightsData,
  morphToTrendsTableData,
} from "@/utils/lineChart";
import {
  GetSaveTrendData,
  TableData,
  TableGroupedHoliday,
  TEventColumnType,
} from "@/types/trends/trends";
// import { useTrendsService } from "@/services/trendsService";
import { EventTrendsResponse } from "@/types/trends/trends";
import LocationSelector from "@/components/search/location";
import DateRangeSelector from "@/components/search/dateRange";
// import TrendsSelector from "@/components/search/trendsSelector";
import CategorySelector from "@/components/search/eventType";
import { columnsDropdown } from "@/data/trends";
import { NewColumn } from "@/data/trendsTableColHead";
import LineChartComponent from "@/components/trends/lineChart";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useDefaultFilters } from "@/hooks/useDefaultFilters";
// import { useFilterContext } from "@/contexts/filterContext";
import TrendsEventTypeSelector from "@/components/search/trendsEventType";
import { table } from "console";
import { useEventsService } from "@/services/eventsService";
// import { EventsResponse } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import TestPeriodicAnalytics from "@/components/newTrends/table-view/TestPeriodicAnalytics";
import D3AreaChart from "@/components/newTrends/D3newTrends";
import TrendsNotification from "@/components/newTrends/notification";
import { Switch } from "@/components/ui/switch";
import CILSearch from "/public/cil_search.svg";
import GoToIcon from "/public/go_to.svg";
import { ToastAction } from "@/components/ui/toast";
import SavedTrendsList from "@/components/newTrends/savedTrendsList";
import SaveTrend from "@/components/newTrends/saveTrend";
// import ColumnsSelector from "@/components/search/columnSelector";
// import EventTypeSelector from "@/components/eventType";
import EventTypeSelector from "@/components/search/eventType";
import ColumnsSelector from "@/components/search/columnSelector";
import { useFilterContext } from "@/context/filterContext";
import { useTrendsService } from "@/services/trendsService";

const EventTrends = () => {
  const { searchParams } = useDefaultFilters();
  const { getEventTrends, getSavedTrends } = useTrendsService();
  const {
    applyFilters,
    setLocalFilter,
    getLocalFilterValue,
    localFilters,
    deleteMultipleLocalFilters,
  } = useFilterContext();
  const columns = searchParams.get("columns");
  const editTrend = searchParams.get("editTrend");
  const enableEditTrend = editTrend ? Boolean(editTrend) : false;
  const columnsData = (columns && columns.split(",")) || [];
  const [isSmartInsightsEnabled, setIsSmartInsightsEnabled] =
    useState<boolean>(false);
  const [isNotificationEnabled, setIsNotificationEnabled] =
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
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
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

  const params = `groupBy=date&dateView=day&${searchParams.toString()}`;

  const stringParams = `groupBy=date&dateView=day&${searchParams.toString()}`;

  const apiParams = useMemo(() => {
    const params = new URLSearchParams(stringParams);
    const eventTypes = params.get("eventTypes") || "";
    const capitalizedEventTypes = eventTypes
      .split(",")
      .map((eventType) => {
        const trimmedEventType = eventType.endsWith("s")
          ? eventType.slice(0, -1)
          : eventType;
        return (
          trimmedEventType.charAt(0).toUpperCase() + trimmedEventType.slice(1)
        );
      })
      .join(",");
    params.set("eventTypes", capitalizedEventTypes);
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
    refetch,
  } = useQuery<EventTrendsResponse | undefined>({
    queryKey: ["trends", apiParams.toString()],
    queryFn: () => getEventTrends(apiParams.toString()),
    enabled: !!apiParams.toString(),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });

  // const { data: holdiayData } = useQuery({
  //   queryKey: ["holiday", updatedParams],
  //   queryFn: async () => await getEventsWithSearchParams(updatedParams),
  //   enabled: !!updatedParams,
  //   refetchOnWindowFocus: false,
  //   gcTime: 0,
  //   staleTime: 0,
  // });

  // const { data: savedTrendsList } = useQuery<GetSaveTrendData>({
  //   queryKey: ["getSavedTrends"],
  //   queryFn: async () => {
  //     const result = await getSavedTrends();
  //     if (!result) throw new Error("Failed to fetch saved trends");
  //     return result;
  //   },
  // });

  // const groupedData = (holdiayData as EventsResponse)?.events.reduce<
  //   Record<string, TableGroupedHoliday>
  // >((acc, { startDateTime, name }) => {
  //   if (!acc[startDateTime]) {
  //     acc[startDateTime] = { date: startDateTime, count: 0, holidays: [] };
  //   }
  //   acc[startDateTime].count++;
  //   acc[startDateTime].holidays.push(name);
  //   return acc;
  // }, {});

  // const holidaysByDate = groupedData && Object.values(groupedData);

  useEffect(() => {
    if (trendsData !== undefined) {
      setEventTrendsData(trendsData);
      // setIsSmartInsightsEnabled(false);
      setSelectedEventType(() => {
        return columnsData[0] as TEventColumnType;
      });
      // setSmartInsightState((prev) => {
      //   const updatedState = columnsData.reduce((acc, key) => {
      //     acc[key] = false;
      //     return acc;
      //   }, {} as { [key: string]: boolean });

      //   return updatedState;
      // });
    }
  }, [trendsData]);

  // useEffect(() => {
  //   const isEditTrue = Boolean(getLocalFilterValue("editTrend"));
  //   isEditTrue && setIsDisabled(isEditTrue);
  // }, [getLocalFilterValue]);

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
    const params = new URLSearchParams(searchParams);
    const eventTypes = params.get("eventTypes")?.split(",") || [];
    const columns = params.get("columns")?.split(",") || [];
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
    // deleteMultipleLocalFilters(["activeCard"]);
    if (getLocalFilterValue("eventTypes").length > 0) {
      setLocalFilter("columns", columnsValue);
      setLocalFilter("show", "alerts,scores,economicImpact");
    }
    applyFilters({ resetPage: true });
  };

  const handleSelectChange = (value: TEventColumnType) => {
    setSelectedEventType(value);
  };

  return (
    <div className="flex flex-col p-4">
      {/* {savedTrendsList && savedTrendsList?.trackerData.length > 0 && (
        <SavedTrendsList savedTrendsList={savedTrendsList?.trackerData || []} />
      )} */}
      <div>
        <div className="grid grid-cols-5 max-lg:grid-cols-2 gap-4 pt-4 pb-6 border-b items-end">
          {/* <EventTypeSelector source={""} /> */}
          {/* <TrendsEventTypeSelector /> */}
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
          <div className="grid grid-cols-1 max-lg:col-end-3  w-full gap-4">
            <Button
              className="flex-1 py-5"
              onClick={applyHandler}
              disabled={isLoading || isDisabled || enableEditTrend}
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
            {/* <Button className="flex-1 py-5">Save</Button> */}
            {/* <SaveTrend
              searchParams={searchParams}
              isLoading={isLoading}
              setShowNotificationForm={setShowNotificationForm}
            /> */}
          </div>
        </div>
        {graphData && graphData.length > 0 && !isLoading ? (
          <div className="pt-8">
            {/* <div className="flex justify-between ">
              <TrendsNotification
                thresholds={
                  (eventTrendsData && eventTrendsData.thresholds) || {}
                }
                threshold={
                  (eventTrendsData &&
                    eventTrendsData.thresholds[selectedEventType]) ??
                  0
                }
                activeColumn={selectedEventType}
                showNotificationForm={showNotificationForm}
                setShowNotificationForm={setShowNotificationForm}
              />
            </div> */}

            <div className={styles.predictedAttendence_container}>
              <LineChartComponent
                predictedData={graphData}
                selectedEventType={selectedEventType}
                threshold={
                  (eventTrendsData &&
                    eventTrendsData.thresholds[selectedEventType]) ??
                  0
                }
                showLegend
              />
              {/* <D3Chart predictedData={filteredData} /> */}
              {/* <D3AreaChart
                predictedData={graphData}
                selectedEventType={selectedEventType}
              /> */}
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
                />
                {/* <PeriodicAnalytics
                isSmartInsightsEnabled={isSmartInsightsEnabled}
                smartInsightState={smartInsightState}
                setIsSmartInsightsEnabled={setIsSmartInsightsEnabled}
                setSmartInsightState={setSmartInsightState}
                data={tableData && tableData.length > 0 ? tableData : []}
                holidayByDates={holidaysByDate}
                tableColumns={tableColumns || []}
              /> */}
              </div>
            </div>
          </div>
        ) : graphData && graphData.length <= 0 ? (
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
        ) : (
          error && (
            <div className={styles.zeroState_container}>
              <Image
                src={ZeroStateIcon}
                alt="zerostate"
                width={150}
                height={150}
              />
              <div>Set filters to view data</div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default EventTrends;
