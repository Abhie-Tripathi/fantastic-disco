import { format } from "date-fns";
export function convertToYYYYMMDD(dateStr: string) {
  // Split the date string into day and month parts
  var parts = dateStr.split(" ");
  var day = parseInt(parts[0], 10);
  var monthName = parts[1];

  // Define an array of month names
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month index from the month name
  var monthIndex = monthNames.indexOf(monthName);

  // Create a new Date object with year 2000 (arbitrary year) to avoid issues with leap years
  var dateObject = new Date(2024, monthIndex, day);

  // Format the date as "YYYY-MM-DD"
  var formattedDate = dateObject.toISOString().split("T")[0];

  return formattedDate;
}
export function convertToISO(dateStr: any) {
  try {
    // Split the input date string into year, month, and day
    const [year, month, day] = dateStr.split("-");

    // Create a new Date object using the extracted values
    const dateObj = new Date(year, month - 1, day);

    return dateObj.toISOString();
  } catch (error) {
    console.error('Invalid date format. Please use "yyyy-mm-dd".');
    return null;
  }
}

export function parseDateStringToDate(dateString: any) {
  const months: any = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const parts = dateString.split(" ");
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

export const convertToCustomFormat = (dateStr: string) => {
  const dateObject = new Date(dateStr);
  const day = dateObject.getDate();
  const monthIndex = dateObject.getMonth();
  const year = dateObject.getFullYear();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const formattedDate = day + " " + monthNames[monthIndex] + " " + year;
  return formattedDate;
};

export const formatEventDates = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      if (start.getDate() === end.getDate()) {
        return (
          new Date(startDate).toLocaleDateString("en-GB", {
            weekday: "long",
          }) +
          ", " +
          new Date(endDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        );
      } else {
        return (
          new Date(startDate).toLocaleDateString("en-GB", {
            weekday: "long",
          }) +
          ", " +
          new Date(startDate).toLocaleDateString("en-GB", {
            day: "2-digit",
          }) +
          " - " +
          new Date(endDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        );
      }
    } else {
      return (
        new Date(startDate).toLocaleDateString("en-GB", {
          weekday: "long",
        }) +
        ", " +
        new Date(startDate).toLocaleDateString("en-GB", {
          month: "short",
          day: "2-digit",
        }) +
        " - " +
        new Date(endDate).toLocaleDateString("en-GB", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );
    }
  } else {
    return (
      new Date(startDate).toLocaleDateString("en-GB", {
        weekday: "long",
      }) +
      ", " +
      new Date(startDate).toLocaleDateString("en-GB", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }) +
      " - " +
      new Date(endDate).toLocaleDateString("en-GB", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    );
  }
};

export const renderFormattedDates = (startDate: string, endDate: string) => {
  if (!startDate || !endDate) {
    return "";
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "";
    }

    if (start.getTime() === end.getTime()) {
      return format(start, "dd MMM yyyy");
    }

    const isSameMonth = start.getMonth() === end.getMonth();
    const isSameYear = start.getFullYear() === end.getFullYear();

    if (isSameMonth && isSameYear) {
      return `${format(start, "dd")} - ${format(end, "dd MMM yyyy")}`;
    } else if (!isSameMonth && isSameYear) {
      return `${format(start, "dd MMM")} - ${format(end, "dd MMM yyyy")}`;
    } else {
      return `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`;
    }
  } catch (error) {
    console.error("Error formatting dates:", error);
    return "";
  }
};

export const calculateDateDifference = (givenDateStr: string): number => {
  const givenDate: Date = new Date(givenDateStr);

  const today: Date = new Date();

  if (givenDate > today) {
    return -1;
  }

  const timeDifference: number = today.getTime() - givenDate.getTime();

  const daysDifference: number = Math.floor(
    timeDifference / (1000 * 3600 * 24)
  );

  return daysDifference;
}
