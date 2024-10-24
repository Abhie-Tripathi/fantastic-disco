"use client";
import React, { useState, useEffect } from "react";
import styles from "./registerform.style.module.css";
import { baseUrl } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "@/utils/showToast";
interface Props {
  registerMessage: string;
  registerBtnText: string;
  registerBtnColor: string;
  widgetId?: string;
  eventId: string;
  setRegisterSuccess: (value: boolean) => void;
  capacity: number;
  registration: boolean;
  approval: boolean;
  waitlisting: boolean;
  start_date: string;
  end_date: string;
  end_time: string;
  start_time: string;
}

const RegisterForm = ({
  registerMessage,
  registerBtnText,
  widgetId,
  registerBtnColor,
  eventId,
  setRegisterSuccess,
  capacity,
  registration,
  approval,
  waitlisting,
  start_date,
  end_date,
  end_time,
  start_time,
}: Props) => {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
  });
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isCapacityFull, setIsCapacityFull] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [isEventEnded, setIsEventEnded] = useState(false);
  const [timeSinceEnd, setTimeSinceEnd] = useState("");
  console.log("value_s", start_time, end_time, start_date,end_date);
  // Function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  // Function to calculate brightness
  const calculateBrightness = ({
    r,
    g,
    b,
  }: {
    r: number;
    g: number;
    b: number;
  }) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Determine if the button color is dark or light
  const rgb = hexToRgb(registerBtnColor);
  const brightness = calculateBrightness(rgb);
  const fontColor = brightness > 155 ? "#000000" : "#FFFFFF";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameParts = formData.firstname.trim().split(" ");
    const firstName = nameParts[0]; // First word becomes the first name
    const lastName = nameParts.slice(1).join(" "); // Remaining words become the last name
    const payload = {
      email: formData.email,
      firstname: firstName,
      lastname: lastName,
      eventId: eventId,
      interest: "ATTENDEE",
      note: "intend",
      source: "eventgeni",
      redirectUrl: `${console_url}/detailpage/${eventId}`,
      // sourceId: widgetId,
    };
    try {
      const response = await fetch(`${baseUrl}/intend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        setRegisterSuccess(true);
        // toast.success("successfully registred for the event !");
      } else {
        console.error("Error:", response.statusText);
        // toast.error("Error in registration");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClick = () => {
    showToast("error", "You have already registered for this event");
  };

  // useEffect(() => {
  //   const calculateTimeDifference = () => {
  //     const currentDate = new Date();

  //     const eventEndDate = new Date(end_date);

  //     const hasEventEnded = currentDate > eventEndDate;
  //     if (hasEventEnded) {
  //       setIsEventEnded(true);
  //       const timeDiffInMs = currentDate.getTime() - eventEndDate.getTime();
  //       const daysSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));
  //       if (daysSinceEnd === 1) {
  //         setTimeSinceEnd("1 day ago"); // Ended yesterday
  //       } else if (daysSinceEnd > 1) {
  //         setTimeSinceEnd(`${daysSinceEnd} days ago`); // More than one day ago
  //       }
  //     }
  //   };

  //   calculateTimeDifference();
  // }, [end_date]);

  // useEffect(() => {
  //   const parseTimeString = (timeStr:any) => {
  //     const [time, modifier] = timeStr.split(" "); // Split into time and AM/PM
  //     let [hours, minutes] = time.split(":").map(Number);

  //     if (modifier === "P.M." && hours < 12) {
  //       hours += 12; // Convert to 24-hour format
  //     } else if (modifier === "A.M." && hours === 12) {
  //       hours = 0; // Handle 12:00 A.M. as midnight
  //     }

  //     return { hours, minutes };
  //   };

  //   const calculateTimeDifference = () => {
  //     const currentDate = new Date();

  //     // Parse the end time into hours and minutes
  //     const { hours: endHours, minutes: endMinutes } = parseTimeString(end_time);
  //     const eventEndDate = new Date(`${end_date}`); // Create a date with the end date
  //     eventEndDate.setHours(endHours, endMinutes, 0, 0); // Set the end time for the event

  //     const hasEventEnded = currentDate > eventEndDate;

  //     if (hasEventEnded) {
  //       setIsEventEnded(true);

  //       const timeDiffInMs = currentDate.getTime() - eventEndDate.getTime();
  //       const daysSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24)); // Days difference

  //       // If the event ended today
  //       if (daysSinceEnd === 0) {
  //         const hoursSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60)); // Hours since event ended
  //         const minutesSinceEnd = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60)); // Minutes since event ended

  //         if (hoursSinceEnd === 0 && minutesSinceEnd > 0) {
  //           setTimeSinceEnd(`This event ended ${minutesSinceEnd} minutes ago`);
  //         } else if (hoursSinceEnd === 1) {
  //           setTimeSinceEnd("This event ended 1 hour ago");
  //         } else if (hoursSinceEnd > 1) {
  //           setTimeSinceEnd(`This event ended ${hoursSinceEnd} hours ago`);
  //         }
  //       }
  //       // If the event ended yesterday
  //       else if (daysSinceEnd === 1) {
  //         setTimeSinceEnd("This event ended yesterday");
  //       }
  //       // If the event ended more than one day ago
  //       else if (daysSinceEnd > 1) {
  //         setTimeSinceEnd(`This event ended ${daysSinceEnd} days ago`);
  //       }
  //     } else {
  //       // Event is ongoing, calculate remaining time
  //       const timeDiffInMs = eventEndDate.getTime() - currentDate.getTime();
  //       const hoursRemaining = Math.floor(timeDiffInMs / (1000 * 60 * 60));
  //       const minutesRemaining = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60));

  //       if (hoursRemaining > 0) {
  //         setTimeSinceEnd(`Event will end in ${hoursRemaining} hours`);
  //       } else if (minutesRemaining > 0) {
  //         setTimeSinceEnd(`Event will end in ${minutesRemaining} minutes`);
  //       } else {
  //         setTimeSinceEnd("Event is ending soon");
  //       }
  //     }
  //   };

  //   // Call the function when component mounts or when end_date/end_time changes
  //   calculateTimeDifference();

  //   // Optionally, set up an interval to update the time every minute
  //   const interval = setInterval(calculateTimeDifference, 60000); // Update every minute

  //   return () => clearInterval(interval);
  // }, [end_date, end_time]);

  // useEffect(() => {
  //   const parseTimeString = (timeStr: any) => {
  //     const [time, modifier] = timeStr.split(" ");
  //     let [hours, minutes] = time.split(":").map(Number);

  //     if (modifier === "P.M." && hours < 12) {
  //       hours += 12;
  //     } else if (modifier === "A.M." && hours === 12) {
  //       hours = 0;
  //     }

  //     return { hours, minutes };
  //   };

  //   const calculateTimeDifference = () => {
  //     const currentDate = new Date();

  //     const { hours: endHours, minutes: endMinutes } =
  //       parseTimeString(end_time);
  //     const eventEndDate = new Date(`${end_date}`);
  //     eventEndDate.setHours(endHours, endMinutes, 0, 0);

  //     const hasEventEnded = currentDate > eventEndDate;

  //     let timeMessage = "";

  //     if (hasEventEnded) {
  //       setIsEventEnded(true);

  //       const timeDiffInMs = currentDate.getTime() - eventEndDate.getTime();
  //       const daysSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24)); // Days difference

  //       if (daysSinceEnd === 0) {
  //         const hoursSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60)); // Hours since event ended
  //         const minutesSinceEnd = Math.floor(
  //           (timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60)
  //         ); // Minutes since event ended

  //         if (hoursSinceEnd === 0 && minutesSinceEnd > 0) {
  //           timeMessage = `This event ended ${minutesSinceEnd} minutes ago`;
  //         } else if (hoursSinceEnd === 1) {
  //           timeMessage = "This event ended 1 hour ago";
  //         } else if (hoursSinceEnd > 1) {
  //           timeMessage = `This event ended ${hoursSinceEnd} hours ago`;
  //         }
  //       } else if (daysSinceEnd === 1) {
  //         timeMessage = "This event ended yesterday";
  //       } else if (daysSinceEnd > 1) {
  //         timeMessage = `This event ended ${daysSinceEnd} days ago`;
  //       }
  //     } else {
  //       const timeDiffInMs = eventEndDate.getTime() - currentDate.getTime();
  //       const hoursRemaining = Math.floor(timeDiffInMs / (1000 * 60 * 60));
  //       const minutesRemaining = Math.floor(
  //         (timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60)
  //       );

  //       if (hoursRemaining > 0) {
  //         timeMessage = `Event will end in ${hoursRemaining} hours`;
  //       } else if (minutesRemaining > 0) {
  //         timeMessage = `Event will end in ${minutesRemaining} minutes`;
  //       } else {
  //         timeMessage = "Event is ending soon";
  //       }
  //     }

  //     setTimeSinceEnd(timeMessage);
  //   };

  //   calculateTimeDifference();

  //   const interval = setInterval(calculateTimeDifference, 60000); // Update every minute

  //   return () => clearInterval(interval);
  // }, [end_date, end_time]);


  // useEffect(() => {
  //   const parseTimeString = (timeStr:any) => {
  //     const [time, modifier] = timeStr.split(" "); // Split into time and AM/PM
  //     let [hours, minutes] = time.split(":").map(Number);
  
  //     if (modifier === "P.M." && hours < 12) {
  //       hours += 12; // Convert to 24-hour format
  //     } else if (modifier === "A.M." && hours === 12) {
  //       hours = 0; // Handle 12:00 A.M. as midnight
  //     }
  
  //     return { hours, minutes };
  //   };
  
  //   const calculateTimeDifference = () => {
  //     const currentDate = new Date();
      
  //     // Parse the start and end time
  //     const { hours: startHours, minutes: startMinutes } = parseTimeString(start_time);
  //     const { hours: endHours, minutes: endMinutes } = parseTimeString(end_time);
      
  //     // Create dates for event start and end
  //     const eventStartDate = new Date(`${start_date}`);
  //     const eventEndDate = new Date(`${end_date}`);
      
  //     eventStartDate.setHours(startHours, startMinutes, 0, 0); // Set the start time
  //     eventEndDate.setHours(endHours, endMinutes, 0, 0); // Set the end time
  
  //     let timeMessage = '';
      
  //     if (currentDate < eventStartDate) {
  //       // Event has not started yet
  //       const timeDiffInMs = eventStartDate.getTime() - currentDate.getTime();
  //       const hoursRemaining = Math.floor(timeDiffInMs / (1000 * 60 * 60));
  //       const minutesRemaining = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  //       timeMessage = `Event will start in ${hoursRemaining > 0 ? hoursRemaining + ' hours' : minutesRemaining + ' minutes'}`;
  //       setIsEventEnded(false); // Event hasn't started, so it hasn't ended
  //     } else if (currentDate >= eventStartDate && currentDate < eventEndDate) {
  //       // Event is ongoing
  //       timeMessage = "Event is ongoing";
  //       setIsEventEnded(false); // Event is ongoing, so it hasn't ended
  //     } else {
  //       // Event has ended
  //       setIsEventEnded(true); // Set to true since the event has ended
  
  //       const timeDiffInMs = currentDate.getTime() - eventEndDate.getTime();
  //       const daysSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24)); // Days difference
        
  //       // If the event ended today
  //       if (daysSinceEnd === 0) {
  //         const hoursSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60)); // Hours since event ended
  //         const minutesSinceEnd = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60)); // Minutes since event ended
          
  //         if (hoursSinceEnd === 0 && minutesSinceEnd > 0) {
  //           timeMessage = `This event ended ${minutesSinceEnd} minutes ago`;
  //         } else if (hoursSinceEnd === 1) {
  //           timeMessage = "This event ended 1 hour ago";
  //         } else if (hoursSinceEnd > 1) {
  //           timeMessage = `This event ended ${hoursSinceEnd} hours ago`;
  //         }
  //       } 
  //       // If the event ended yesterday
  //       else if (daysSinceEnd === 1) {
  //         timeMessage = "This event ended yesterday";
  //       } 
  //       // If the event ended more than one day ago
  //       else if (daysSinceEnd > 1) {
  //         timeMessage = `This event ended ${daysSinceEnd} days ago`;
  //       }
  //     }
  
  //     // Update the state with the constructed message
  //     setTimeSinceEnd(timeMessage);
  //   };
  
  //   // Call the function when the component mounts or when start_date/start_time or end_date/end_time changes
  //   calculateTimeDifference();
  
  //   // Optionally, set up an interval to update the time every minute
  //   const interval = setInterval(calculateTimeDifference, 60000); // Update every minute
  
  //   return () => clearInterval(interval);
  // }, [start_date, start_time, end_date, end_time]);


  // useEffect(() => {
  //   const parseTimeString = (timeStr:any) => {
  //     const [time, modifier] = timeStr.split(" "); // Split into time and AM/PM
  //     let [hours, minutes] = time.split(":").map(Number);
  
  //     if (modifier === "P.M." && hours < 12) {
  //       hours += 12; // Convert to 24-hour format
  //     } else if (modifier === "A.M." && hours === 12) {
  //       hours = 0; // Handle 12:00 A.M. as midnight
  //     }
  
  //     return { hours, minutes };
  //   };
  
  //   const calculateTimeDifference = () => {
  //     const currentDate = new Date();
      
  //     // Parse the start and end time
  //     const { hours: startHours, minutes: startMinutes } = parseTimeString(start_time);
  //     const { hours: endHours, minutes: endMinutes } = parseTimeString(end_time);
      
  //     // Create dates for event start and end
  //     const eventStartDate = new Date(start_date);
  //     const eventEndDate = new Date(end_date);
      
  //     eventStartDate.setHours(startHours, startMinutes, 0, 0); // Set the start time
  //     eventEndDate.setHours(endHours, endMinutes, 0, 0); // Set the end time
  
  //     let timeMessage = '';
      
  //     if (currentDate < eventStartDate) {
  //       // Event has not started yet
  //       const timeDiffInMs = eventStartDate.getTime() - currentDate.getTime();
  //       const hoursRemaining = Math.floor(timeDiffInMs / (1000 * 60 * 60));
  //       const minutesRemaining = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  //       timeMessage = `Event will start in ${hoursRemaining > 0 ? hoursRemaining + ' hours' : minutesRemaining + ' minutes'}`;
  //       setIsEventEnded(false); // Event hasn't started, so it hasn't ended
  //     } else if (currentDate >= eventStartDate && currentDate < eventEndDate) {
  //       // Event is ongoing
  //       timeMessage = "Event is ongoing";
  //       setIsEventEnded(false); // Event is ongoing, so it hasn't ended
  //     } else {
  //       // Event has ended
  //       setIsEventEnded(true); // Set to true since the event has ended
  
  //       const timeDiffInMs = currentDate.getTime() - eventEndDate.getTime();
  //       const daysSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24)); // Days difference
        
  //       // If the event ended today
  //       if (daysSinceEnd === 0) {
  //         const hoursSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60)); // Hours since event ended
  //         const minutesSinceEnd = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60)); // Minutes since event ended
          
  //         if (hoursSinceEnd > 0) {
  //           timeMessage = `This event ended ${hoursSinceEnd} hour${hoursSinceEnd > 1 ? 's' : ''} ago`;
  //         } else {
  //           timeMessage = `This event ended ${minutesSinceEnd} minute${minutesSinceEnd > 1 ? 's' : ''} ago`;
  //         }
  //       } 
  //       // If the event ended yesterday
  //       else if (daysSinceEnd === 1) {
  //         timeMessage = "This event ended yesterday";
  //       } 
  //       // If the event ended more than one day ago
  //       else if (daysSinceEnd > 1) {
  //         timeMessage = `This event ended ${daysSinceEnd} day${daysSinceEnd > 1 ? 's' : ''} ago`;
  //       }
  //     }
  
  //     // Update the state with the constructed message
  //     setTimeSinceEnd(timeMessage);
  //   };
  
  //   // Call the function when the component mounts or when start_date/start_time or end_date/end_time changes
  //   calculateTimeDifference();
  
  //   // Optionally, set up an interval to update the time every minute
  //   const interval = setInterval(calculateTimeDifference, 60000); // Update every minute
  
  //   return () => clearInterval(interval);
  // }, [start_date, start_time, end_date, end_time]);




  // useEffect(() => {
  //   const calculateEventStatus = () => {
  //     const currentDate = new Date();
      
  //     // Construct the event start and end dates
  //     const eventStartDate = new Date(`${start_date} ${start_time}`);
  //     const eventEndDate = new Date(`${end_date} ${end_time}`);

  //     // Check if the event is ongoing or has ended
  //     if (currentDate < eventStartDate) {
  //       // Event hasn't started yet
  //       setEventMessage("Event hasn't started yet.");
  //     } else if (currentDate >= eventStartDate && currentDate < eventEndDate) {
  //       // Event is ongoing
  //       setIsEventEnded(false);
  //       setTimeSinceEnd("Event is ongoing.");
  //     } else if (currentDate >= eventEndDate) {
  //       // Event has ended
  //       setIsEventEnded(true);
  //       const timeDiffInMs = currentDate.getTime() - eventEndDate.getTime();
  //       const hoursSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60));

  //       if (hoursSinceEnd === 0) {
  //         setTimeSinceEnd("This event ended just now."); // Ended just now
  //       } else if (hoursSinceEnd === 1) {
  //         setTimeSinceEnd("This event ended 1 hour ago."); // Ended 1 hour ago
  //       } else {
  //         setTimeSinceEnd(`This event ended ${hoursSinceEnd} hours ago.`); // Ended more than 1 hour ago
  //       }
  //     }
  //   };

  //   calculateEventStatus();
  // }, [start_date, end_date, start_time, end_time]);
 


  // useEffect(() => {
  //   const calculateTimeDifference = () => {
  //     const currentDate = new Date();
  //     const currentDateString = currentDate.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  //     // Create event end date with time included
  //     const eventEndDateTime = new Date(`${end_date}T${end_time}`);

  //     const hasEventEnded = end_date < currentDateString || (end_date === currentDateString && currentDate >= eventEndDateTime);

  //     if (hasEventEnded) {
  //       setIsEventEnded(true);
  //       const timeDiffInMs = currentDate.getTime() - eventEndDateTime.getTime();
  //       const daysSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));
  //       const hoursSinceEnd = Math.floor((timeDiffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  //       if (daysSinceEnd > 0) {
  //         if (daysSinceEnd === 1) {
  //           setTimeSinceEnd("1 day ago"); // Ended yesterday
  //         } else {
  //           setTimeSinceEnd(`${daysSinceEnd} days ago`); // More than one day ago
  //         }
  //       } else {
  //         // If ended today, show hours
  //         if (hoursSinceEnd === 0) {
  //           setTimeSinceEnd("Ended just now."); // Ended just now
  //         } else if (hoursSinceEnd === 1) {
  //           setTimeSinceEnd("1 hour ago"); // Ended 1 hour ago
  //         } else {
  //           setTimeSinceEnd(`${hoursSinceEnd} hours ago`); // Ended more than 1 hour ago
  //         }
  //       }
  //     } else {
  //       // Event is ongoing or hasn't started yet
  //       setIsEventEnded(false);
  //       setTimeSinceEnd("Event is ongoing or has not started yet.");
  //     }
  //   };

  //   calculateTimeDifference();
  // }, [end_date, end_time]);




  useEffect(() => {
    const calculateTimeDifference = () => {
      const currentDate = new Date();
      const currentDateString = currentDate.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

      // Create event end date with time included
      const eventEndDateTime = new Date(`${end_date}T${end_time}`);

      const hasEventEnded = end_date < currentDateString || (end_date === currentDateString && currentDate >= eventEndDateTime);

      if (hasEventEnded) {
        setIsEventEnded(true);
        const timeDiffInMs = currentDate.getTime() - eventEndDateTime.getTime();
        const daysSinceEnd = Math.floor(timeDiffInMs / (1000 * 60 * 60 * 24));
        const hoursSinceEnd = Math.floor((timeDiffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (daysSinceEnd > 0) {
          if (daysSinceEnd === 1) {
            console.log("ssssssssssssssssssssssssssssssssss_1")
            setTimeSinceEnd("1 day ago"); // Ended yesterday
          } else {
            console.log("ssssssssssssssssssssssssssssssssss_2")
            setTimeSinceEnd(`${daysSinceEnd} days ago`); // More than one day ago
          }
        } else if (daysSinceEnd === 0) {
          // If ended today, show hours
          if (hoursSinceEnd === 0) {
            setTimeSinceEnd("Ended just now."); // Ended just now
            console.log("ssssssssssssssssssssssssssssssssss_3")
          } else if (hoursSinceEnd === 1) {
            setTimeSinceEnd("1 hour ago"); // Ended 1 hour ago
            console.log("ssssssssssssssssssssssssssssssssss_4")
          } else {
            setTimeSinceEnd(`${hoursSinceEnd} hours ago`); // Ended more than 1 hour ago
            console.log("ssssssssssssssssssssssssssssssssss_5")
          }
        }
      } else {
        // Event is ongoing or hasn't started yet
        console.log("ssssssssssssssssssssssssssssssssss_6")
        setIsEventEnded(false);
        
        setTimeSinceEnd("Event is ongoing or has not started yet.");
      }
    };

    calculateTimeDifference();
  }, [end_date, end_time]);


  return (
    <div className={styles.registerContainer}>
      {!isEventEnded &&
        capacity &&
        registration &&
        !approval &&
        waitlisting && (
          <div className={styles.customMsg_container}>
            <div className={styles.header}>
              <div>Join us at the event</div>
            </div>
            <div className={styles.customMessage}>{registerMessage}</div>
          </div>
        )}
      {!isEventEnded &&
        capacity &&
        registration &&
        !approval &&
        !waitlisting && (
          <div className={styles.customMsg_container}>
            <div className={styles.header}>
              <div>Join us at the event</div>
            </div>
            <div className={styles.customMessage}>{registerMessage}</div>
          </div>
        )}

      {/* <form onSubmit={handleSubmit}>
        {isEventEnded && registration && approval && waitlisting && capacity ? (
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Past Event</div>
                <div className={styles.waitlist_text}>
                  <span>This event ended {timeSinceEnd}.</span>
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Thank you for your interest! Follow to stay updated for future
              events.
            </div>
          </>
        ) :  registration && !approval && !waitlisting && !capacity ? (
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Follow Event</div>
                <div className={styles.waitlist_text}>
                  This event is full. Please follow for future updates.
                </div>
              </div>
            </div>
          </>
        ): registration && !approval && !capacity && !waitlisting ? (
          <div className={styles.formSubHeading}>{registerMessage}</div>
        ) : !registration ||
          (waitlisting && capacity && !registration && approval) ? (
          // When cap, waitlist, approve may be true or false but registration should be false
          <>
            <div className={styles.icon_text_container}>
              <div style={{ marginTop: "5px" }}>
                <RegistrationClosedSVG />
              </div>
              <div>Registration Closed</div>
            </div>
            <div className={styles.dec_text}>
              This event is not currently taking registrations. You may contact
              the host to receive updates.
            </div>
          </>
        ) : approval && registration && !capacity && !waitlisting ? (
          // When approval is true and cap is true (remaining)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <ApprovalSVG />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Approval Required</div>
                <div className={styles.waitlist_text}>
                  Your registration is subject to approval by the host.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Welcome! To join the event, please register below.
            </div>
          </>
        ) : registration && approval && waitlisting && !capacity ? (
          // When waitlisting is true and cap is false (full)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Event Full</div>
                <div className={styles.waitlist_text}>
                  If you&apos;d like, you can join the waitlist.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Please click on the button below to join the waitlist. You will be
              notified if additional spots become available.
            </div>
          </>
        ) : registration && approval && capacity && !waitlisting ? (
          // When approval is true and cap is true (remaining)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <ApprovalSVG />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Approval Required</div>
                <div className={styles.waitlist_text}>
                  Your registration is subject to approval by the host.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Welcome! To join the event, please register below.
            </div>
          </>
        ) : registration && approval && capacity && waitlisting ? (
          // When approval is true and cap is true (remaining)
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <ApprovalSVG />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Approval Required</div>
                <div className={styles.waitlist_text}>
                  Your registration is subject to approval by the host.
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Welcome! To join the event, please register below.
            </div>
          </>
        ) : (
          <></>
        )}

        <input
          className={styles.inputField}
          type="text"
          name="firstname"
          placeholder="Name"
          value={formData.firstname}
          onChange={handleChange}
          required
        />

        <input
          className={styles.inputField}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          style={{ backgroundColor: registerBtnColor, color: fontColor }}
          className={styles.submitBtn}
          // onClick={handleClick}
        >
          {isEventEnded &&
          registration &&
          approval &&
          waitlisting &&
          capacity ? (
            <span>Follow</span>
          ) :registration && !approval && !waitlisting && !capacity ? <span>Follow</span>: registration && !approval && !capacity && !waitlisting ||  (registration && !approval && capacity && waitlisting ) ? (
            <span>{registerBtnText}</span>
          ) : !registration ? (
            <span>Follow</span>
          ) : registration && approval && waitlisting && !capacity ? (
            <span>Join waitlist</span>
          ) : registration && approval && capacity && !waitlisting ? (
            <span>Request to join</span>
          ) : registration && !approval && !capacity && !waitlisting ? (
            <span>Request to join</span>
          ) : registration && approval && !capacity && !waitlisting ? (
            <span>Request to join</span>
          ) : registration && approval && capacity && waitlisting ? (
            <span>Request to join</span>
          ) : (
            <></>
          )}
        </button>
      </form> */}

      <form onSubmit={handleSubmit}>
        {/* Past event */}
        {isEventEnded && (
          <>
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Past Event</div>
                <div className={styles.waitlist_text}>
                  <span>{timeSinceEnd}</span>
                </div>
              </div>
            </div>
            <div className={styles.detail_text}>
              Welcome! To join the event, please register below.
            </div>
          </>
        )}
        {/* Follow event */}
        {(!isEventEnded &&
          registration &&
          !approval &&
          !waitlisting &&
          !capacity) ||
          (!isEventEnded &&
            registration &&
            approval &&
            !waitlisting &&
            !capacity && (
              <div className={styles.event_container}>
                <div className={styles.icon_container}>
                  <EventClosedIcon />
                </div>
                <div className={styles.text_container}>
                  <div className={styles.event_full_text}>Follow Event</div>
                  <div className={styles.waitlist_text}>
                    This event is full. Please follow for future updates.
                  </div>
                </div>
              </div>
            ))}
        {/* Registration closed */}
        {!isEventEnded && !registration && (
          <>
            <div className={styles.icon_text_container}>
              <div style={{ marginTop: "5px" }}>
                <RegistrationClosedSVG />
              </div>
              <div>Registration Closed</div>
            </div>
            <div className={styles.dec_text}>
              This event is not currently taking registrations. You may contact
              the host to receive updates.
            </div>
          </>
        )}
        {/* Approval required */}
        {!isEventEnded &&
          approval &&
          registration &&
          !waitlisting &&
          capacity && (
            <>
              <div className={styles.event_container}>
                <div className={styles.icon_container}>
                  <ApprovalSVG />
                </div>
                <div className={styles.text_container}>
                  <div className={styles.event_full_text}>
                    Approval Required
                  </div>
                  <div className={styles.waitlist_text}>
                    Your registration is subject to approval by the host.
                  </div>
                </div>
              </div>
              <div className={styles.detail_text}>
                Welcome! To join the event, please register below.
              </div>
            </>
          )}
        {/* join waitlist */}
        {!isEventEnded &&
          approval &&
          registration &&
          waitlisting &&
          !capacity && (
            <>
              <div className={styles.event_container}>
                <div className={styles.icon_container}>
                  <EventClosedIcon />
                </div>
                <div className={styles.text_container}>
                  <div className={styles.event_full_text}>Event Full</div>
                  <div className={styles.waitlist_text}>
                    If you&apos;d like, you can join the waitlist.
                  </div>
                </div>
              </div>
              <div className={styles.detail_text}>
                Please click on the button below to join the waitlist. You will
                be notified if additional spots become available.
              </div>
            </>
          )}
        {/* follow event */}
        {!isEventEnded &&
          !capacity &&
          registration &&
          !approval &&
          !waitlisting && (
            <div className={styles.event_container}>
              <div className={styles.icon_container}>
                <EventClosedIcon />
              </div>
              <div className={styles.text_container}>
                <div className={styles.event_full_text}>Follow Event</div>
                <div className={styles.waitlist_text}>
                  This event is full. Please follow for future updates.
                </div>
              </div>
            </div>
          )}
        {/* join waitlist */}
        {!isEventEnded &&
          !capacity &&
          registration &&
          !approval &&
          waitlisting && (
            <>
              <div className={styles.event_container}>
                <div className={styles.icon_container}>
                  <EventClosedIcon />
                </div>
                <div className={styles.text_container}>
                  <div className={styles.event_full_text}>Event Full</div>
                  <div className={styles.waitlist_text}>
                    If you&apos;d like, you can join the waitlist.
                  </div>
                </div>
              </div>
              <div className={styles.detail_text}>
                Please click on the button below to join the waitlist. You will
                be notified if additional spots become available.
              </div>
            </>
          )}

        {!isEventEnded &&
          capacity &&
          registration &&
          approval &&
          waitlisting && (
            <>
              <div className={styles.event_container}>
                <div className={styles.icon_container}>
                  <ApprovalSVG />
                </div>
                <div className={styles.text_container}>
                  <div className={styles.event_full_text}>
                    Approval Required
                  </div>
                  <div className={styles.waitlist_text}>
                    Your registration is subject to approval by the host.
                  </div>
                </div>
              </div>
              <div className={styles.detail_text}>
                Welcome! To join the event, please register below.
              </div>
            </>
          )}

        <input
          className={styles.inputField}
          type="text"
          name="firstname"
          placeholder="Name"
          value={formData.firstname}
          onChange={handleChange}
          required
        />

        <input
          className={styles.inputField}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          style={{ backgroundColor: registerBtnColor, color: fontColor }}
          className={styles.submitBtn}
          // onClick={handleClick}
        >
          {/* Past event */}
          {isEventEnded && <span>Follow</span>}

          {/* Follow event */}
          {(!isEventEnded &&
            registration &&
            !approval &&
            !waitlisting &&
            !capacity) ||
            (!isEventEnded &&
              registration &&
              approval &&
              !waitlisting &&
              !capacity && <span>Follow</span>)}
          {/* Registration closed */}
          {!isEventEnded && !registration && <span>Follow</span>}
          {/* Approval required */}
          {!isEventEnded &&
            approval &&
            registration &&
            !waitlisting &&
            capacity && <span>Request to join</span>}
          {/* join waitlist  */}
          {!isEventEnded &&
            approval &&
            registration &&
            waitlisting &&
            !capacity && <span>Join waitlist</span>}
          {!isEventEnded &&
            !capacity &&
            registration &&
            !approval &&
            !waitlisting && <span>Follow</span>}
          {!isEventEnded &&
            !capacity &&
            registration &&
            !approval &&
            waitlisting && <span>Join waitlist</span>}
          {!isEventEnded &&
            capacity &&
            registration &&
            !approval &&
            waitlisting && <span>{registerBtnText}</span>}
          {!isEventEnded &&
            capacity &&
            registration &&
            !approval &&
            !waitlisting && <span>{registerBtnText}</span>}
          {!isEventEnded &&
            capacity &&
            registration &&
            approval &&
            waitlisting && <span>Request to join</span>}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

function EventClosedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#a8a8a8"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function ApprovalSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="20px"
      viewBox="0 96 960 960"
      width="20px"
      fill="#7D7D7D"
    >
      <path d="M669 1026 504 861l43-43 122 122 243-243 43 43-286 286ZM479.825 696Q415 696 371.5 652.65 328 609.3 328 544.5q0-64.8 43.5-108.15 43.5-43.35 108.325-43.35Q544 393 587.175 436.35q43.175 43.35 43.175 108.15 0 64.8-43.175 108.15Q544 696 479.825 696ZM188 866v-60q0-30 15.5-54.5T258 711q51-22 103-33.5t118-11.5q30 0 59.5 3t57.5 10l-49 50q-19-3-40-5t-40-2q-59 0-112.5 9.5T257 777q-16 7-25.5 22t-9.5 32v29h259L610 866H188Zm291-366q-45 0-74-29.5T376 397q0-45 29-73.5T479 295q45 0 74.5 28.5T583 397q0 45-29.5 74.5T479 500ZM479 437Zm.5 283Z" />
    </svg>
  );
}

function RegistrationClosedSVG() {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 11H17V13H7V11Z" fill="#A8A8A8" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"
        fill="#A8A8A8"
      />
    </svg>
  );
}
