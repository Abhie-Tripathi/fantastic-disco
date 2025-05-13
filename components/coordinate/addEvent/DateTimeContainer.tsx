"use client";
import React, { useEffect, useState } from "react";
import styles from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/datetime.style.module.css";
// import TimezoneDropdown from "./TimezoneDropdown";
// import CalendarDropdown from "./CalendarDropdown";
// import TimeDropdown from "./TimeDropdown";
import useOutsideClick from "@/hooks/useOutsideClick";
import { AddEventFormState } from "@/types/Formstate";
import CalendarDropdown from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/CalendarDropdown";
import TimeDropdown from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/TimeDropdown";

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};
interface TimeSettingsProps {
  formTheme: string;
  formState: AddEventFormState;
  handleChange: (field: keyof AddEventFormState, value: any) => void;
  theme?: string;
}

const DateTimeContainer = ({
  formTheme,
  formState,
  handleChange,
  theme,
}: TimeSettingsProps) => {
//   const [timezoneDropdown, setTimezoneDropdown] = useState<boolean>(false);
  const [startCalendarDropdown, setStartCalendarDropdown] =
    useState<boolean>(false);
  const [endCalendarDropdown, setEndCalendarDropdown] =
    useState<boolean>(false);
  const [startTimeDropdown, setStartTimeDropdown] = useState<boolean>(false);
  const [endTimeDropdown, setEndTimeDropdown] = useState<boolean>(false);
  const [todaysDate, setTodaysDate] = useState<any>();
  const [maxEndDate, setMaxEndDate] = useState<string>(""); // To find a max end date according to startDate. i:e 28 days later of startDate

  const startCalDropdownRef = useOutsideClick(() =>
    setStartCalendarDropdown(false)
  );
  const endCalDropdownRef = useOutsideClick(() =>
    setEndCalendarDropdown(false)
  );
  const startTimeDropdownRef = useOutsideClick(() =>
    setStartTimeDropdown(false)
  );
  const endTimeDropdownRef = useOutsideClick(() => setEndTimeDropdown(false));
//   const timezoneDropdownRef = useOutsideClick(() => setTimezoneDropdown(false));

  const times = [
    "12:00 A.M",
    "12:30 A.M",
    "1:00 A.M",
    "1:30 A.M",
    "2:00 A.M",
    "2:30 A.M",
    "3:00 A.M",
    "3:30 A.M",
    "4:00 A.M",
    "4:30 A.M",
    "5:00 A.M",
    "5:30 A.M",
    "6:00 A.M",
    "6:30 A.M",
    "7:00 A.M",
    "7:30 A.M",
    "8:00 A.M",
    "8:30 A.M",
    "9:00 A.M",
    "9:30 A.M",
    "10:00 A.M",
    "10:30 A.M",
    "11:00 A.M",
    "11:30 A.M",
    "12:00 P.M",
    "12:30 P.M",
    "1:00 P.M",
    "1:30 P.M",
    "2:00 P.M",
    "2:30 P.M",
    "3:00 P.M",
    "3:30 P.M",
    "4:00 P.M",
    "4:30 P.M",
    "5:00 P.M",
    "5:30 P.M",
    "6:00 P.M",
    "6:30 P.M",
    "7:00 P.M",
    "7:30 P.M",
    "8:00 P.M",
    "8:30 P.M",
    "9:00 P.M",
    "9:30 P.M",
    "10:00 P.M",
    "10:30 P.M",
    "11:00 P.M",
    "11:30 P.M",
  ];

  useEffect(() => {
    if (!formState.startDate) {
      const currentDate = new Date();
      const formattedStartDate = currentDate.toISOString().split("T")[0]; // Format the start date as "yyyy-mm-dd"
      handleChange("startDate", formattedStartDate);
      handleChange("endDate", formattedStartDate);
      setTodaysDate(formattedStartDate);
    }
    // if (!formState.startTime) {
    const closestTime = findClosestTime();
    const halfHourAddedTime = addMinutesToTime(closestTime, 60);
    handleChange("startTime", closestTime);
    console.log("half hour added time : ", halfHourAddedTime);
    handleChange("endTime", halfHourAddedTime);
    // }
  }, []);

  const addMinutesToTime = (time: string, minutesToAdd: number): string => {
    // Extract the time and period (AM/PM) parts
    const [timePart, period] = time.split(" "); // e.g., "2:00 P.M" -> ["2:00", "P.M"]
    let [hours, minutes] = timePart.split(":").map(Number); // e.g., "2:00" -> [2, 0]

    // Convert 12-hour time to 24-hour time
    if (period === "P.M" && hours !== 12) {
      hours += 12; // Convert P.M hours to 24-hour format (except for 12 P.M)
    }
    if (period === "A.M" && hours === 12) {
      hours = 0; // Midnight case (12 A.M should be 00:00 in 24-hour format)
    }

    // Create a new Date object
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    // Add the minutes
    date.setMinutes(date.getMinutes() + minutesToAdd);

    // Get the updated hours and minutes
    let updatedHours = date.getHours();
    const updatedMinutes = date.getMinutes().toString().padStart(2, "0");

    // Convert back to 12-hour format
    const updatedPeriod = updatedHours >= 12 ? "P.M" : "A.M";
    if (updatedHours > 12) updatedHours -= 12; // Convert from 24-hour to 12-hour format
    if (updatedHours === 0) updatedHours = 12; // Midnight case
    const updatedTime = `${updatedHours}:${updatedMinutes} ${updatedPeriod}`;

    return updatedTime;
  };

  const addDays = (date: string, days: number) => {
    const initialDate = new Date(date);
    initialDate.setDate(initialDate.getDate() + days);
    const resultDate = initialDate.toISOString().split("T")[0];
    return resultDate;
  };

  useEffect(() => {
    if (new Date(formState.endDate) < new Date(formState.startDate)) {
      handleChange("endDate", formState.startDate);
      // setEndDate(startDate);
    }
    if (formState.startDate) {
      const maxDate = addDays(formState.startDate, 28);
      setMaxEndDate(maxDate);
    }
  }, [formState.startDate, formState.endDate]);

  const timeToMinutes = (t: string) => {
    const [hour, minute] = t.split(/:|\s/);
    const isPM = t.includes("P.M");
    return ((parseInt(hour) % 12) + (isPM ? 12 : 0)) * 60 + parseInt(minute);
  };

  const findClosestTime = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let closestTime = times[0];
    let smallestDiff = Infinity;

    for (const t of times) {
      const tMinutes = timeToMinutes(t);
      const diff = tMinutes - currentMinutes;
      if (diff >= 0 && diff < smallestDiff) {
        smallestDiff = diff;
        closestTime = t;
      }
    }
    return closestTime;
  };

  const handleTimeSelect = (label: string, value: string, key: number) => {
    console.log("labeel ", label);
    console.log("value ", value);
    handleChange("timeZoneKey", key);
    // setTimeZoneKey(key)
    const timeZoneString = `${value} ${label}`;
    handleChange("timeZone", truncateString(timeZoneString, 20));
    // setTimeZone(truncateString(timeZoneString, 20));
  };
  const truncateString = (str: string, num: number) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  const handleCalendardropdown = (value: string) => {
    if (value === "start") {
      setStartCalendarDropdown(!startCalendarDropdown);
      setEndCalendarDropdown(false);
    } else {
      setEndCalendarDropdown(!endCalendarDropdown);
      setStartCalendarDropdown(false);
    }
  };
  const handleTimedropdown = (value: string) => {
    if (value === "start") {
      setStartTimeDropdown(!startTimeDropdown);
      setEndTimeDropdown(false);
    } else {
      setEndTimeDropdown(!endTimeDropdown);
      setStartTimeDropdown(false);
    }
  };

  return (
    <div className={`${styles.body}`}>
      <div
        className={`bg-accent flex items-center justify-between rounded-md py-3 pl-9 px-4 w-full`}
      >
        <div
          className={`${styles.startEndStyle} ${
            formTheme === "dark"
              ? styles.darkStartEndStyle
              : styles.lightStartEndStyle
          }`}
        >
          <div className={styles.start}>Start</div>
          <div className={styles.end}>End</div>
        </div>
        <div className={styles.dateTimeBoxes}>
          <div className={styles.dateBoxes}>
            <div
              className={styles.dateBox}
              onClick={() => handleCalendardropdown("start")}
            >
              {formatDate(formState.startDate)}
              {startCalendarDropdown && (
                <div
                  ref={startCalDropdownRef}
                  className={styles.calendarDropdown}
                >
                  <CalendarDropdown
                    minDate={todaysDate}
                    // setDate={setEndDate}
                    type="start"
                    handleChange={handleChange}
                    dateValue={formState.startDate}
                  />
                </div>
              )}
            </div>
            <div
              className={styles.dateBox}
              onClick={() => handleCalendardropdown("end")}
            >
              {formatDate(formState.endDate)}
              {endCalendarDropdown && (
                <div
                  ref={endCalDropdownRef}
                  className={styles.calendarDropdown}
                >
                  <CalendarDropdown
                    maxDate={maxEndDate}
                    minDate={formState.startDate}
                    // setDate={setEndDate}
                    type="end"
                    handleChange={handleChange}
                    dateValue={formState.endDate}
                  />
                </div>
              )}
            </div>
          </div>
          <div className={styles.timeBoxes}>
            <div
              className={styles.timeBox}
              onClick={() => handleTimedropdown("start")}
            >
              {formState.startTime}
              {startTimeDropdown && (
                <div ref={startTimeDropdownRef} className={styles.timeDropdown}>
                  <TimeDropdown
                    handleChange={handleChange}
                    time={formState.startTime}
                  />
                </div>
              )}
            </div>
            <div
              className={styles.timeBox}
              onClick={() => handleTimedropdown("end")}
            >
              {formState.endTime}
              {endTimeDropdown && (
                <div ref={endTimeDropdownRef} className={styles.timeDropdown}>
                  <TimeDropdown
                    handleChange={handleChange}
                    time={formState.endTime}
                    minTime={addMinutesToTime(formState.startTime, 30)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div
        ref={timezoneDropdownRef}
        className={`${styles.timeZonesContainer} ${
          theme && theme === "dark" ? styles.darktimeZonesContainer : ""
        }`}
        onClick={() => setTimezoneDropdown(!timezoneDropdown)}
      >
        <div className={styles.header}>
          <TimeZoneIcon color={formTheme === "light" ? "#A8A8A8" : "white"} />
          <div className={styles.dropdownIcon}>
            <DownIcon color={formTheme === "light" ? "black" : "white"} />
          </div>
        </div>
        <div
          className={`${styles.timeZone} ${theme && styles.themeTimeZone} ${
            formTheme === "dark" ? styles.darkTimeZone : styles.lightTimeZone
          }`}
        >
          {formState.timeZone}
        </div>
        {timezoneDropdown && (
          <div className={styles.timezoneDropdown}>
            <TimezoneDropdown
              timeZoneKey={formState.timeZoneKey}
              handleTimeSelect={handleTimeSelect}
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default DateTimeContainer;

interface IconProps {
  color: string;
}

function TimeZoneIcon({ color }: IconProps) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6623 6.91534C14.4627 5.68935 13.9287 4.54221 13.119 3.60021C12.3094 2.65821 11.2555 1.95789 10.0734 1.57634C8.89134 1.19479 7.62691 1.14681 6.41931 1.43769C5.21172 1.72857 4.10781 2.34702 3.22911 3.22495C2.35041 4.10289 1.731 5.20626 1.43907 6.4136C1.14714 7.62094 1.19402 8.88542 1.57454 10.0678C1.95505 11.2502 2.65446 12.3047 3.59575 13.1152C4.53705 13.9256 5.68372 14.4607 6.90953 14.6613M1.69928 5.74984H14.2993M1.69928 10.2498H6.87428"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.62423 1.25C6.58939 2.90805 5.94959 4.78181 5.75426 6.7265C5.55894 8.6712 5.81331 10.6348 6.49773 12.4655M8.37423 1.25C9.44941 2.97309 10.0974 4.9281 10.2642 6.95225M9.49923 12.5C9.49923 13.2956 9.8153 14.0587 10.3779 14.6213C10.9405 15.1839 11.7036 15.5 12.4992 15.5C13.2949 15.5 14.0579 15.1839 14.6205 14.6213C15.1832 14.0587 15.4992 13.2956 15.4992 12.5C15.4992 11.7044 15.1832 10.9413 14.6205 10.3787C14.0579 9.81607 13.2949 9.5 12.4992 9.5C11.7036 9.5 10.9405 9.81607 10.3779 10.3787C9.8153 10.9413 9.49923 11.7044 9.49923 12.5Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.499 11.375V12.5L12.874 12.875"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
function DownIcon({ color }: IconProps) {
  return (
    <svg
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.35341 3.85361C4.25965 3.94734 4.13249 4 3.99991 4C3.86733 4 3.74017 3.94734 3.64641 3.85361L0.817909 1.02511C0.72683 0.930806 0.676433 0.804505 0.677572 0.673406C0.678711 0.542308 0.731296 0.416902 0.824 0.324198C0.916704 0.231493 1.04211 0.178909 1.17321 0.17777C1.30431 0.176631 1.43061 0.227028 1.52491 0.318107L3.99991 2.79311L6.47491 0.318107C6.56921 0.227028 6.69551 0.176631 6.82661 0.17777C6.95771 0.178909 7.08312 0.231493 7.17582 0.324198C7.26852 0.416902 7.32111 0.542308 7.32225 0.673406C7.32339 0.804505 7.27299 0.930806 7.18191 1.02511L4.35341 3.85361Z"
        fill={color}
      />
    </svg>
  );
}
