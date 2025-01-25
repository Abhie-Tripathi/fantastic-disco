// @ts-nocheck
import {
  EventTrendsResponse,
  EventTypeData,
  GroupedDataByDate,
  TableData,
  TEventColumnType,
  Thresholds,
} from "@/types/trends/trends";
import { format, parseISO } from "date-fns";
import { columnsDropdown, subCategories } from "@/data/trends";
import { NewColumn, SubColumn } from "@/data/trendsTableColHead";

/**
 *
 * Generates an array of dates between the given starting and ending dates, inclusive.
 *
 * @param startingDate - The start date in a string format (e.g., "2024-08-01").
 * @param endingDate - The end date in a string format (e.g., "2024-08-10").
 * @returns  An array of Date objects representing each day between the start and end dates.
 */
export function generateDatesArray(startingDate: string, endingDate: string) {
  const startDate = new Date(startingDate);
  const endDate = new Date(endingDate);
  const datesArray = [];

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    datesArray.push(new Date(date)); // Add a copy of the date to the array
  }

  return datesArray;
}

/**
 *
 * Aggregates attendance data over a range of dates, summing values for each date.
 *
 * @param data - The attendance data, which should include a `groupingByDate` object that maps date strings to attendance counts.
 * @param startingDate - The start date for aggregation, in string format.
 * @param endingDate - The end date for aggregation, in string format.
 * @returns - An array of objects, each containing a formatted date string and the total attendance for that date.
 */
export function aggregateAttendanceData(
  data: any,
  startingDate: string,
  endingDate: string
) {
  const datesArray = generateDatesArray(startingDate, endingDate);
  return datesArray.map((date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Ensure date format matches the data keys
    const attendance = data && data.groupingByDate[formattedDate];
    return {
      date: format(parseISO(formattedDate), "d MMM"),
      value: attendance,
    };
  });
}

/**
 *
 * Aggregates attendance data over a range of dates, summing values for each date.
 *
 * @param data - The attendance data, which should include a `groupingByDate` object that maps date strings to attendance counts.
 * @param startingDate - The start date for aggregation, in string format.
 * @param endingDate - The end date for aggregation, in string format.
 * @returns - An array of objects, each containing a formatted date string and the total attendance for that date.
 */
export function morphToGraphData(
  groupedData: GroupedDataByDate,
  selectedEventType?: TEventColumnType
) {
  if (!selectedEventType) return [];
  return Object.entries(groupedData).map(([date, groupData]) => ({
    date,
    total: groupData[selectedEventType]?.total,
    social: groupData[selectedEventType]?.byEventTypeGroup?.Social ?? 0,
    business: groupData[selectedEventType]?.byEventTypeGroup?.Business ?? 0,
  }));
}

/**
 * Converts a given Date object to an ISO 8601 string with the time set to midnight UTC (00:00:00.000Z).
 *
 * @param date - The Date object to convert.
 * @returns {string} The ISO 8601 formatted string representation of the date, with the time set to midnight UTC.
 *
 * @example
 * const date = new Date('2024-08-12T14:30:00.000Z');
 * const midnightISOString = toMidnightISOString(date);
 * console.log(midnightISOString); // Outputs: "2024-08-12T00:00:00.000Z"
 */
export function toMidnightISOString(date: Date): string {
  const copy = new Date(date); // Create a copy to avoid mutating the original Date object
  copy.setUTCHours(0, 0, 0, 0); // Set the time to midnight UTC
  return copy.toISOString(); // Convert to ISO string
}

/**
 *
 * Morph the Trends Data into Table Data Visualization.
 *
 * @param thresholds - The threshold values of all columns selected.
 * @param groupedData - The date wise columns with their categories and subcategories count.
 * @param eventTypes - The array of selected eventTypes(subCategories) in dropdown.
 * @returns {TableData[]} Returns the table data following the TableData interface structure.
 */
export function morphToTrendsTableData(
  thresholds: Thresholds,
  groupedData: GroupedDataByDate,
  eventTypes: string[] | [] | undefined
): TableData[] {
  const tableData = Object.entries(groupedData).map(([date, groupData]) => {
    const filteredData = columnsDropdown.reduce((acc: any, option) => {
      const key = option.value as keyof Thresholds;
      const groupDataItem = groupData[key];
      if (groupDataItem !== undefined && groupDataItem !== null) {
        const eventTypeValues: Record<keyof EventTypeData, number> =
          {} as Record<keyof EventTypeData, number>;
        eventTypes &&
          eventTypes.length > 0 &&
          eventTypes.forEach((eventType) => {
            eventTypeValues[eventType as keyof EventTypeData] =
              groupDataItem.byEventType?.[eventType as keyof EventTypeData] ||
              0;
          });
        acc[key] = {
          avg: thresholds[key] as number,
          value: groupDataItem.total as number,
          ...eventTypeValues,
        };
      }

      return acc;
    }, {});

    return {
      date,
      ...filteredData,
    };
  });
  return tableData;
}

/**
 *
 * Generate Trends Table Column Headers.
 *
 * @param {string[]} eventTypes - Array of selected eventTypes(subCategories) in the dropdown.
 * @param {string[]} columns - Array of selected columns in the dropdown.
 * @returns {NewColumn[]} Returns the Trends Table Column header following the NewColumn interface structure.
 *
 */
export function generateTrendsTableColumnHeaders(
  eventTypes: string[],
  columns: string[]
): NewColumn[] {
  const subHeading = subCategories.filter(
    (subCategory: SubColumn) =>
      subCategory.slug && eventTypes.includes(subCategory.slug)
  );
  const dateColumn = {
    slug: "date",
    columnName: "Dates",
    color: "#6750a4",
  };
  const columnHeaders = columnsDropdown
    .filter((columnVal) => columns.includes(columnVal.value))
    .map((columnVal) => ({
      slug: columnVal.value,
      columnName: columnVal.label,
      tooltipDescription: columnVal.tooltipDescription,
      color: "#000",
      subHeading: [
        {
          slug: "avg",
          subColumnName: "Avg",
          color: "#000",
        },
        {
          slug: "value",
          subColumnName: "Value",
          color: "#000",
        },
        ...subHeading,
      ],
    }));
  return [dateColumn, ...columnHeaders];
}

/**
 *
 *
 */
export function morphToSmartInsightsData(tableData: TableData[]) {
  const maxColumnValues: { [key: string]: number } = {};
  tableData.forEach((row) => {
    const columnKeys = Object.keys(row).filter((key) => key !== "date");
    columnKeys.forEach((field) => {
      const fieldData = row[field as keyof TableData] as EventTypeData;
      const value = fieldData.value;
      // If we haven't stored the max value for this field yet, store it
      if (!maxColumnValues[field]) {
        maxColumnValues[field] = value;
      }
      // If the current value is greater than the stored max value, update it
      if (value > maxColumnValues[field]) {
        maxColumnValues[field] = value;
      }
    });
  });
  return tableData.map((row) => {
    const newRow = { ...row };
    const columnKeys = Object.keys(newRow).filter((key) => key !== "date");
    columnKeys.forEach((field) => {
      const fieldData = newRow[field as keyof TableData] as EventTypeData;
      const avg = newRow[field as keyof TableData].avg;
      const value = newRow[field as keyof TableData].value;
      const maxColumn = maxColumnValues[field];
      const thresholdHighlightCol =
        value >= avg && value <= avg * 1.5
          ? "bg-[#398E4A1A] bg-opacity-5 text-[#398E4A]"
          : value > avg * 1.5
          ? "bg-[#398E4A33] bg-opacity-5 text-[#398E4A]"
          : value < avg && value >= avg * 0.5
          ? "bg-[#FF990A1A] bg-opacity-5 text-[#FF990A]"
          : value < avg * 0.5
          ? "bg-[#FF990A33] bg-opacity-5 text-[#FF990A]"
          : "";

      const slugKeys = Object.keys(fieldData).filter(
        (key) => key !== "avg" && key !== "value"
      );
      const maxSlugValue = Math.max(...slugKeys.map((key) => fieldData[key]));
      const thresholdHighlightRow =
        maxSlugValue >= avg && maxSlugValue <= avg * 1.5
          ? "bg-[#398E4A1A] bg-opacity-5 text-[#398E4A] border-2 border-[var(--negative-color)]"
          : maxSlugValue > avg * 1.5
          ? "bg-[#398E4A33] bg-opacity-5 text-[#398E4A] border-2 border-[var(--negative-color)]"
          : maxSlugValue < avg && maxSlugValue >= avg * 0.5
          ? "bg-[#FF990A1A] bg-opacity-5 text-[#FF990A] border-2 border-[var(--negative-color)]"
          : maxSlugValue < avg * 0.5
          ? "bg-[#FF990A33] bg-opacity-5 text-[#FF990A] border-2 border-[var(--negative-color)]"
          : "";
      newRow[field as keyof TableData] = {
        ...fieldData,
        maxRow: maxSlugValue,
        maxCol: maxColumn,
        thresholdHighlightCol: thresholdHighlightCol,
        thresholdHighlightRow: thresholdHighlightRow,
      };
    });
    return newRow;
  });
}

/**
 *
 *
 */
export function sortingTableData(
  order: "asc" | "desc",
  columnSlug: keyof TableData,
  tableData: TableData[]
): TableData[] {
  const tableDataCopy = tableData.slice();
  if (order === "desc") {
    const sortedData = tableDataCopy.sort((a, b) => {
      return b[columnSlug].value - a[columnSlug].value;
    });
    return sortedData;
  } else if (order === "asc") {
    const sortedData = tableDataCopy.sort((a, b) => {
      return a[columnSlug].value - b[columnSlug].value;
    });
    return sortedData;
  } else {
    return tableData;
  }
}
