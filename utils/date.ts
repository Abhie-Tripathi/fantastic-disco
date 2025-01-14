import { differenceInDays, format } from "date-fns";

export function convertISOToOriginalFormat(isoString: string) {
  const dateObject = new Date(isoString);
  const day = dateObject.getDate();
  const month = dateObject.toLocaleString("default", { month: "short" });
  const year = dateObject.getFullYear();
  return `${day} ${month}`;
}

export const formattedDateRange = (
  startDate: string,
  endDate: string,
  duration: boolean = true
) => {
  if (!startDate || !endDate) {
    return "Date to be announced";
  }

  const startMonth = format(startDate, "MMM");
  const endMonth = format(endDate, "MMM");
  const startYear = format(startDate, "yyyy");
  const endYear = format(endDate, "yyyy");
  const days = differenceInDays(endDate, startDate) + 1;

  if (format(startDate, "dd MMM yyyy") === format(endDate, "dd MMM yyyy")) {
    return format(startDate, "dd MMM yyyy");
  }

  if (startMonth === endMonth && startYear === endYear) {
    return `${format(startDate, "dd")} - ${format(
      endDate,
      "dd"
    )} ${startMonth} ${startYear}${
      duration ? ` (${days} ${days === 1 ? "day" : "days"})` : ""
    }`;
  }

  if (startYear === endYear) {
    return `${format(startDate, "dd MMM")} - ${format(
      endDate,
      "dd MMM"
    )} ${startYear}${
      duration ? ` (${days} ${days === 1 ? "day" : "days"})` : ""
    }`;
  }

  return `${format(startDate, "dd MMM yyyy")} - ${format(
    endDate,
    "dd MMM yyyy"
  )}${duration ? ` (${days} ${days === 1 ? "day" : "days"})` : ""}`;
};
