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

export function formatDateRange(startISOString: any, endISOString: any) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const parseISOString = (isoString: any) => {
    const date = new Date(isoString);
    return {
      day: days[date.getUTCDay()],
      month: months[date.getUTCMonth()],
      monthNo: date.getUTCMonth(),
      dayOfMonth: date.getUTCDate(),
      year: date.getUTCFullYear(),
    };
  };

  const formatSingleDate = (date: any) => {
    return `${date.day}, ${date.dayOfMonth} ${date.month} ${date.year}`;
  };

  const dateDiffInDays = (a: any, b: any) => {
    const utc1 = Date.UTC(a.year, a.monthNo, a.dayOfMonth);
    const utc2 = Date.UTC(b.year, b.monthNo, b.dayOfMonth);

    console.log(utc1, utc2);
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  };

  const startDate = parseISOString(startISOString);
  const endDate = parseISOString(endISOString);

  const formattedStartDate = formatSingleDate(startDate);
  const formattedEndDate = formatSingleDate(endDate);
  const daysDiff = dateDiffInDays(startDate, endDate);

  return `${formattedStartDate}`;
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
              return new Date(startDate).toLocaleDateString("en-GB", {
                weekday: 'long',
              }) + ', ' +
              new Date(endDate).toLocaleDateString("en-GB", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              });
          } else {
              return (
                new Date(startDate).toLocaleDateString("en-GB", {
                  weekday: 'long',
                }) + ', ' +
                new Date(startDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                }) + ' - ' +
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
              weekday: 'long',
              month: "short",
              day: "2-digit",
            }) + ' - ' +
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
          weekday: 'long',
          month: "short",
          day: "2-digit",
          year: "numeric",
        }) + ' - ' +
        new Date(endDate).toLocaleDateString("en-GB", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      );
  }
}