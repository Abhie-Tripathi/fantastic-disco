//@ts-nocheck
"use client";
import Image from "next/image";
import styles from "./TableAnalytics.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewColumn } from "@/data/trendsTableColHead";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EventTypeData, TableData, TableGroupedHoliday } from "@/types";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useFilterState } from "@/hooks/useFilterState";
import CollapseIcon from "/public/collapse.svg";
import ExpandIcon from "/public/expandColumn.svg";
import Text from "@/components/new-ui/Text";
import SmartInsights from "/public/smartInsights.svg";
import { Switch } from "@/components/ui/switch";
import { sortingTableData } from "@/utils/lineChart";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowDownWideNarrow,
  ArrowUp,
  ArrowUpNarrowWide,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
} from "@/components/ui/select";
import EnableSmartInsights from "/public/smartInsightsDisable.svg";
import DisableSmartInsights from "/public/smartInsightsColored.svg";
import { renderFormattedDates } from "@/utils/dateFormat";
import HolidayIcon from "/public/eventType/holiday.svg";
import { useSearchParams, useRouter } from "next/navigation";

interface TestPeriodicAnalyticsProps {
  data: TableData[] | [];
  tableColumns: NewColumn[] | [];
  isSmartInsightsEnabled: boolean;
  smartInsightState: { [key: string]: boolean };
  setIsSmartInsightsEnabled: Dispatch<SetStateAction<boolean>>;
  setSmartInsightState: Dispatch<
    SetStateAction<{
      [key: string]: boolean;
    }>
  >;
}

function convertToLongDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date
    .toLocaleDateString("en-US", options)
    .toLocaleUpperCase()
    .replace(",", "");
}

const TestPeriodicAnalytics = ({
  data,
  tableColumns,
  isSmartInsightsEnabled,
  smartInsightState,
  setIsSmartInsightsEnabled,
  setSmartInsightState,
}: TestPeriodicAnalyticsProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const [openState, setOpenState] = useState<{ [key: string]: boolean }>({});
  const [tableData, setTableData] = useState<TableData[] | []>();
  const [skip, setSkip] = useState();
  const columnKeys =
    data && data.length > 0
      ? Object.keys(data[0]).filter((key) => key !== "date")
      : [];
  const { setFilter, getFilterValue } = useFilterState();
  const [sortingColumnOrder, setSortingColumnOrder] = useState<{
    order: "asc" | "desc";
    eventType: keyof TableData | null;
  }>({ order: "asc", eventType: null });
  useEffect(() => {
    setTableData(data);
  }, [data]);
  useEffect(() => {
    if (tableData && tableData.length > 0 && sortingColumnOrder.eventType) {
      const sortedTableData = sortingTableData(
        sortingColumnOrder.order,
        sortingColumnOrder.eventType,
        data
      );
      setTableData(sortedTableData);
    }
  }, [sortingColumnOrder]);
  const sortingData = (eventType: keyof TableData, order: "asc" | "desc") => {
    setSortingColumnOrder({
      order: order,
      eventType: eventType,
    });
  };
  const toggleSmartInsightState = (slug: string | undefined) => {
    if (!slug) return;
    setSmartInsightState((prevState) => ({
      ...prevState,
      [slug]: !prevState[slug],
    }));
  };

  const startDate =
    (data && data[0] && convertToLongDate(data[0].date ?? "")) || "";
  // const startDate = data && data[0] && formatDate(new Date(data[0]), "dd MMM yyyy");
  const endDate =
    (data &&
      data[data.length - 1] &&
      convertToLongDate(data[data.length - 1].date ?? "")) ||
    "";
  const itemsPerPage = 10;
  const currentPage =
    Math.floor(Number(getFilterValue("skip") || "0") / itemsPerPage) + 1;
  const totalPages =
    tableData && tableData.length > 0
      ? Math.ceil(tableData.length / itemsPerPage)
      : 1;

  const startingLimit = (currentPage - 1) * itemsPerPage;
  const endingLimit = startingLimit + itemsPerPage - 1;
  const handlePageChange = (page: number) => {
    setFilter("skip", ((page - 1) * itemsPerPage).toString());
  };
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const ellipsis = <PaginationEllipsis />;

    if (totalPages && totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(1)}
            isActive={1 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">{ellipsis}</PaginationItem>
        );
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">{ellipsis}</PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };
  const toggleOpenState = (slug: string | undefined) => {
    if (!slug) return;
    setOpenState((prevState) => ({
      ...prevState,
      [slug]: !prevState[slug],
    }));
  };
  const redirectTo = (url: string, startDate: string, endDate: string) => {
    const updatedParams = new URLSearchParams(params);
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndStartDate = new Date(endDate).toISOString();

    updatedParams.delete("skip");
    updatedParams.set("active_gte", formattedStartDate);
    updatedParams.set("active_lte", formattedEndStartDate);

    const queryString = updatedParams.toString();

    router.push(`${url}?${queryString}`);
  };

  return (
    <>
      <div className={styles.analytics_header}>
        <div className={styles.analytics_header_title}>
          {`FOR THE SELECTED TIME PERIODS (${renderFormattedDates(
            startDate,
            endDate
          )})`}
        </div>
        <div className="flex gap-2 items-center px-3 py-3 border border-[var(--neutral-light-color)] rounded-sm">
          <Image src={SmartInsights} width={18} height={18} alt={""} />
          <Text color="primary" variant="noMargin" fontWeight="regular">
            Smart Insights
          </Text>
          <Switch
            checked={isSmartInsightsEnabled}
            onCheckedChange={() => setIsSmartInsightsEnabled((prev) => !prev)}
            disabled={Object.keys(smartInsightState).length === 0}
          ></Switch>
        </div>
      </div>
      <div className={styles.table_container}>
        <div className="w-full">
          <Table className="border border-[var(--neutral-light-color) w-[98%] mx-auto relative">
            <TableHeader>
              <TableRow>
                {tableColumns.map((trends) => {
                  const colSpan = openState[trends.slug ?? ""]
                    ? (trends.subHeading &&
                        trends.subHeading.filter(
                          (heading) => heading.slug !== "avg"
                        ).length) ||
                      1
                    : 1;
                  return (
                    <TableHead
                      key={trends.columnName}
                      colSpan={colSpan}
                      rowSpan={trends.slug === "date" ? 2 : 1}
                      style={{ width: 1000 }}
                      className={`text-center bg-[rgb(250,250,250)] text-[#171717] border border-[var(--neutral-light-color)] relative ${
                        trends.slug === "date" ? "sticky left-0 z-30" : ""
                      }`}
                    >
                      {trends.slug === "date" &&
                        trends.columnName.toUpperCase()}
                      {trends.slug !== "date" && (
                        <div className="flex items-center justify-center mx-auto gap-4 h-inherit w-60">
                          {trends.columnName.toUpperCase()}
                          <Select>
                            <SelectTrigger className="w-5 h-5 focus:outline-none z-20 top-3 right-10 bg-white p-0 border-2 rounded-sm border-[#EBEBEBBB]"></SelectTrigger>
                            <SelectContent>
                              <SelectGroup className="flex flex-col gap-4 p-4">
                                <div className="flex gap-4 items-center">
                                  <p className="text-sm">SORT BY</p>
                                  <button
                                    className={`${
                                      sortingColumnOrder.eventType ===
                                        trends.slug &&
                                      sortingColumnOrder.order === "asc"
                                        ? "border-[#6750A4]"
                                        : "border-[#EBEBEBBB]"
                                    }flex items-center w-6 h-6 border-2 rounded-sm`}
                                  >
                                    <ArrowUpNarrowWide
                                      color="#7D7D7D"
                                      className="cursor-pointer w-5"
                                      onClick={() =>
                                        sortingData(
                                          trends.slug as keyof TableData,
                                          "asc"
                                        )
                                      }
                                    />
                                  </button>
                                  <button
                                    className={`${
                                      sortingColumnOrder.eventType ===
                                        trends.slug &&
                                      sortingColumnOrder.order === "desc"
                                        ? "border-[#6750A4]"
                                        : "border-[#EBEBEBBB]"
                                    }flex items-center w-6 h-6 border-2 rounded-sm`}
                                  >
                                    <ArrowDownWideNarrow
                                      color="#7D7D7D"
                                      className="cursor-pointer w-5"
                                      onClick={() =>
                                        sortingData(
                                          trends.slug as keyof TableData,
                                          "desc"
                                        )
                                      }
                                    />
                                  </button>
                                </div>

                                <div className="flex gap-4 items-center">
                                  <p className="text-sm">
                                    {`Turn
                                    ${
                                      smartInsightState[trends.slug ?? ""]
                                        ? "off"
                                        : "on"
                                    }
                                    Insights`}
                                  </p>
                                  <Image
                                    src={
                                      smartInsightState[trends.slug ?? ""]
                                        ? DisableSmartInsights
                                        : EnableSmartInsights
                                    }
                                    className="cursor-pointer"
                                    width={30}
                                    height={30}
                                    alt={"Disable Smart Insights"}
                                    onClick={() =>
                                      toggleSmartInsightState(trends.slug)
                                    }
                                  />
                                </div>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {trends.slug !== "date" && (
                        <button
                          className="absolute z-20 top-2 -right-3 bg-white"
                          onClick={() => toggleOpenState(trends.slug)}
                        >
                          <Image
                            className="p-1 z-30 shadow-lg flex items-center justify-center rounded-md border border-[#EBEBEB] aspect-auto"
                            src={
                              openState[trends.slug ?? ""]
                                ? CollapseIcon
                                : ExpandIcon
                            }
                            alt="TableIcons"
                            width={25}
                            height={25}
                          />
                        </button>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
              {(Object.values(openState).some((state) => state) ||
                Object.values(smartInsightState).some((state) => state)) && (
                <TableRow>
                  {tableColumns.map((trends) => {
                    const subHeading = trends.subHeading ?? [];
                    const isSmartInsightEnabledForColumn =
                      smartInsightState[trends.slug ?? ""];
                    const isOpenState = openState[trends.slug ?? ""];

                    if (trends.subHeading && trends.subHeading.length > 0) {
                      return isOpenState && trends.slug !== "date" ? (
                        trends.subHeading
                          .filter((heading) => heading.slug !== "avg")
                          .map((cell) => (
                            <TableHead
                              key={cell.subColumnName}
                              className={`bg-[rgb(250,250,250)] text-[#171717] w-40 text-center border border-[var(--neutral-light-color)] ${
                                cell.slug === "value" ? "py-2" : ""
                              }`}
                            >
                              <div
                                className={`flex items-center w-20 mx-auto font-${
                                  cell.fontWeight ?? "normal"
                                } justify-center text-[var(${
                                  cell.color
                                })] gap-2`}
                              >
                                {cell.icon && (
                                  <Image
                                    src={cell.icon}
                                    alt={cell.subColumnName}
                                    width={18}
                                    height={18}
                                  />
                                )}
                                <p
                                  className="truncate max-w-[80px] relative group"
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  title={cell.subColumnName}
                                >
                                  {cell.subColumnName.toUpperCase()}
                                </p>
                                <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block p-2 bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap">
                                  {cell.subColumnName}
                                </div>
                              </div>
                              {cell.slug === "value" && (
                                <div className="flex justify-center gap-1 text-[var(--negative-color)] font-medium items-center border-t mt-1 pt-2">
                                  <p>AVG</p> {":"}
                                  <span>
                                    {tableData &&
                                      tableData.length > 0 &&
                                      tableData[0][trends.slug]["avg"]}
                                  </span>
                                </div>
                              )}
                            </TableHead>
                          ))
                      ) : !isOpenState && !isSmartInsightEnabledForColumn ? (
                        <TableHead
                          key={trends.slug}
                          className="bg-[rgb(250,250,250)] text-[#171717] w-40 text-center border border-[var(--neutral-light-color)]"
                        ></TableHead>
                      ) : !isOpenState && isSmartInsightEnabledForColumn ? (
                        <TableHead
                          key={trends.slug}
                          style={{ width: 1000 }}
                          className="bg-[rgb(250,250,250)] text-[#171717] text-center p-0"
                        >
                          <div className="grid grid-cols-1 w-full h-full">
                            {trends.subHeading
                              .filter((cell) => cell.slug === "avg")
                              .map((cell) => (
                                <div
                                  key={cell.subColumnName}
                                  className={`flex items-center justify-center text-center
                    border-x border-[var(--neutral-light-color)]
                    font-${cell.fontWeight ?? "normal"} text-[var(${
                                    cell.color
                                  })] gap-2`}
                                >
                                  <p
                                    className="text-center truncate max-w-[80px] relative group text-[var(--negative-color)] font-medium"
                                    style={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                    title={cell.subColumnName}
                                  >
                                    {cell.subColumnName.toUpperCase()} {":"}
                                  </p>

                                  <p className="text-[var(--negative-color)] font-medium">
                                    {tableData &&
                                      tableData.length > 0 &&
                                      tableData[0][trends.slug]["avg"]}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </TableHead>
                      ) : null;
                    } else {
                      return (
                        trends.slug !== "date" && (
                          <TableHead key={trends.slug} />
                        )
                      );
                    }
                  })}
                </TableRow>
              )}
            </TableHeader>
            <TableBody>
              {tableData &&
                tableData
                  .slice(startingLimit, endingLimit + 1)
                  .map((data, rowIndex) => {
                    return (
                      <TableRow
                        key={`row-${rowIndex}`}
                        className="cursor-pointer"
                        onClick={() =>
                          redirectTo(
                            "/internal/search/events",
                            data["date"],
                            data["date"]
                          )
                        }
                      >
                        {tableColumns.map((trends) => {
                          const key = (trends.slug as keyof TableData) || "";
                          if (key === "date") {
                            return (
                              <TableCell
                                key={key}
                                width={100}
                                className={`text-center font-semibold text-[#6750a4] flex items-center justify-center w-full sticky left-0 z-30 bg-white`}
                              >
                                <div className="w-40 flex justify-center">
                                  <p>
                                    {key !== undefined &&
                                      format(
                                        new Date(data[key]),
                                        "dd MMM yyyy"
                                      )}
                                  </p>
                                </div>
                              </TableCell>
                            );
                          }
                          const cellData = data[key];
                          const isSmartInsightEnabledForColumn =
                            smartInsightState[trends.slug ?? ""];
                          const isOpenState = openState[trends.slug ?? ""];
                          const subHeading = trends.subHeading;
                          if (cellData) {
                            return subHeading &&
                              isSmartInsightEnabledForColumn &&
                              isOpenState ? (
                              subHeading
                                .filter((heading) => heading.slug !== "avg")
                                .map((subCol) => (
                                  <TableCell
                                    key={subCol.slug}
                                    width={100}
                                    className={`p-0 h-[53px] w-32 border border-[var(--neutral-light-color)]`}
                                  >
                                    <div
                                      className={`text-center w-full h-full flex gap-2 items-center justify-center font-semibold text-[#000]
                                ${
                                  subCol.slug === "avg" &&
                                  isSmartInsightEnabledForColumn
                                    ? "bg-[#DA2F35] bg-opacity-5 text-[#DF2670]"
                                    : ""
                                }
                                  
                                ${
                                  isSmartInsightEnabledForColumn &&
                                  cellData["maxRow"] &&
                                  subCol.slug !== "avg" &&
                                  subCol.slug !== "value" &&
                                  cellData["maxRow"] ===
                                    cellData[subCol.slug as keyof EventTypeData]
                                    ? cellData["thresholdHighlightRow"]
                                    : ""
                                }
                                ${
                                  isSmartInsightEnabledForColumn &&
                                  subCol.slug === "value"
                                    ? cellData["thresholdHighlightCol"]
                                    : ""
                                }
                                  ${
                                    isSmartInsightEnabledForColumn &&
                                    subCol.slug === "value" &&
                                    cellData["maxCol"] === cellData["value"]
                                      ? "border-2 border-[var(--negative-color)]"
                                      : ""
                                  }`}
                                    >
                                      {
                                        cellData[
                                          subCol.slug as keyof EventTypeData
                                        ]
                                      }
                                      {cellData["thresholdHighlightCol"] ===
                                        "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]" &&
                                        subCol.slug === "value" && (
                                          <ArrowUp width={15} height={15} />
                                        )}
                                      {cellData["thresholdHighlightCol"] ===
                                        "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]" &&
                                        subCol.slug === "value" && (
                                          <ArrowDown
                                            width={15}
                                            height={15}
                                            color="#E1313A"
                                          />
                                        )}
                                    </div>
                                  </TableCell>
                                ))
                            ) : !isSmartInsightEnabledForColumn &&
                              !isOpenState ? (
                              <TableCell
                                key={key}
                                width={100}
                                className={`text-center font-semibold border border-[var(--neutral-light-color)] text-[#000] ${
                                  isSmartInsightEnabledForColumn
                                    ? `${cellData["thresholdHighlightCol"]} ${
                                        cellData["maxCol"] ===
                                          cellData["value"] &&
                                        "border-2 border-[var(--negative-color)]"
                                      }`
                                    : ""
                                }`}
                              >
                                {cellData["value"] ?? 0}
                              </TableCell>
                            ) : subHeading &&
                              isSmartInsightEnabledForColumn &&
                              !isOpenState ? (
                              <TableCell
                                key={key}
                                width={1000}
                                className={`w-[1000px] h-[52px] p-0 ${
                                  cellData["maxCol"] === cellData["value"]
                                    ? "border-2 border-[var(--negative-color)]"
                                    : "border-[#EBEBEB]"
                                }`}
                              >
                                <div className="grid grid-cols-1 w-full h-full">
                                  {subHeading
                                    .filter((subCol) => subCol.slug === "value")
                                    .map((subCol, index) => {
                                      return (
                                        <div
                                          key={subCol.slug}
                                          className={`h-full text-center gap-2 justify-center font-semibold text-[#000] flex items-center ${
                                            subCol.slug === "avg" &&
                                            isSmartInsightEnabledForColumn &&
                                            "bg-[#DA2F35] bg-opacity-5 text-[#DF2670]"
                                          }   ${
                                            isSmartInsightEnabledForColumn &&
                                            subCol.slug === "value" &&
                                            cellData["thresholdHighlightCol"]
                                          }`}
                                        >
                                          <p>
                                            {subCol.slug === "avg"
                                              ? cellData["avg"]
                                              : subCol.slug === "value"
                                              ? cellData["value"]
                                              : null}
                                          </p>

                                          {cellData["thresholdHighlightCol"] ===
                                            "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]" &&
                                            subCol.slug === "value" && (
                                              <ArrowUp width={15} height={15} />
                                            )}
                                          {cellData["thresholdHighlightCol"] ===
                                            "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]" &&
                                            subCol.slug === "value" && (
                                              <ArrowDown
                                                width={15}
                                                height={15}
                                                color="#E1313A"
                                              />
                                            )}
                                        </div>
                                      );
                                    })}
                                </div>
                              </TableCell>
                            ) : subHeading &&
                              !isSmartInsightEnabledForColumn &&
                              isOpenState ? (
                              subHeading
                                .filter((heading) => heading.slug !== "avg")
                                .map((subCol) => (
                                  <TableCell
                                    key={subCol.slug}
                                    width={100}
                                    className="p-0 h-[52px] w-32 border border-[var(--neutral-light-color)]"
                                  >
                                    <div
                                      className={`flex text-center items-center justify-center w-full h-full font-semibold text-[#000]`}
                                    >
                                      {
                                        cellData[
                                          subCol.slug as keyof EventTypeData
                                        ]
                                      }
                                    </div>
                                  </TableCell>
                                ))
                            ) : null;
                          } else {
                            return (
                              <TableCell
                                key={key}
                                width={100}
                                className="text-center font-semibold border border-[var(--neutral-light-color)] text-[#0000]"
                              >
                                0
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="mt-4 sticky bottom-0 bg-white py-4">
              <Pagination>
                <PaginationContent className="flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestPeriodicAnalytics;
