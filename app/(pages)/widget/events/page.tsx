// 'use client'
// import React, { useEffect, useState } from 'react'
// import styles from './page.style.module.css'
// import YourEventCard from '@/app/components/internal/YourEventCard'
// import TimelineItem from '@/app/components/employee/listView/TimelineItem'
// import { myFetch } from '@/utils/myFetch'
// import { AllEventsType, EventsType } from '@/types/alleventtype'
// import { baseUrl } from '@/constants'
// import AddEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddEvent'
// import CalendarIcon from '/public/calendar.svg'
// import Image from 'next/image'
// import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
// import DashboardEventCard from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEventCard'
// import GlobalSearch from '@/app/components/TemplateViewsNew/EditScreen/FilterEvents/GlobalSearch'
// import { GolbalEventType } from '@/types/globaleventtype'
// import ChoiceModal from '@/app/components/TemplateViewsNew/Events/ChoiceModal'
// import SubEventCard from '@/app/components/TemplateViewsNew/WidgetDashboard/SubEventCard'
// import { useEventServices } from '@/services/geniservices/eventService'
// const Page = () => {
//     const [fetchedEvents, setFetchedEvents] = useState<AllEventsType[]>([]);
//     const [isEventFormModal, setIsEventFormModal] = useState<boolean>(false)
//     const [deleteModal, setDeleteModal] = useState<boolean>(false)
//     const [selectedEventId, setSelectedEventId] = useState<string>("")
//     const [selectedEventName, setSelectedEventName] = useState<string>("")
//     const [page, setPage] = useState<number>(0);
//     const [isFetching, setIsFetching] = useState(false);
//     const [prefilledEvent, setPrefilledEvent] = useState<EventsType | null>(null);
//     const [prefilledSubEvent, setPrefilledSubEvent] = useState<EventsType | null>(null)
//     const [prefilledGlobalEvent, setPrefilledGlobalEvent] = useState<GolbalEventType | null>(null);
//     const [deleteModalTwo, setDeleteModalTwo] = useState<boolean>(false) // This one is for if the event is present in some widget
//     const [choiceFormModal, setChoiceFormModal] = useState<boolean>(false)
//     const [isApproved, setIsApproved] = useState<boolean>(false)
//     // const [mainEventFlow, setMainEventFlow] = useState<boolean>(false)
//     // const [sideEventFlow, setSideEventFlow] = useState<boolean>(false)
//     const [eventFlow, setEventFlow] = useState<string>("")
//     const [selectedEventType, setSelectedEventType] = useState<string>("") // This will be used to Delete an event
//     const [todaysDate, setTodaysDate] = useState("");
//     const {getSortedEvents,error} = useEventServices()
//     let prevDate: any = null;

//     useEffect(() => {
//         const getCurrentDate = (): string => {
//             const today = new Date();
//             const year = today.getFullYear();
//             const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//             const day = String(today.getDate()).padStart(2, '0');
//             return `${year}-${month}-${day}`;
//         };

//         setTodaysDate(getCurrentDate());
//     }, []);
//     useEffect(() => {
//         fetchEvents(page * 8);
//     }, [page])

//     useEffect(() => {
//         console.log("this scroll function called")
//         console.log("fetched events :", fetchedEvents)
//         const handleScroll = () => {
//             const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // Adjusted offset
//             if (isAtBottom && fetchedEvents.length > 0) {
//                 setPage((prevPage) => prevPage + 1); // Increment page to load more events
//             }
//         };

//         const debounceScroll = () => {
//             clearTimeout(window.scrollTimeout); // Clear any existing timeout
//             window.scrollTimeout = setTimeout(handleScroll, 100); // Set a debounce of 100ms
//         };

//         window.addEventListener("scroll", debounceScroll);
//         return () => window.removeEventListener("scroll", debounceScroll);
//     }, [fetchedEvents]);

//     const handleDeleteModal = (eventId: string, eventName: string, isPresentinWidget: boolean) => {
//         if (isPresentinWidget) {
//             setDeleteModalTwo(true)
//         } else {
//             setSelectedEventName(eventName)
//             setSelectedEventId(eventId)
//             setDeleteModal(true)
//         }
//     }

//     const fetchEvents = async (page: number, type?: string) => {
//         // const { data, error } = await myFetch(`${baseUrl}/event?sortBy=start_date&sortType=asc&offset=${page}&limit=8`)
//        try {
//         const data:any = await getSortedEvents(page);
//         if (data) {
//             const transformedEvents = data.data.map((event: any) => ({
//                 mainEvent: {
//                     eventId: event.id,
//                     name: event.name,
//                     cityName: event.data.location_city,
//                     countryName: event.data.location_country,
//                     startDate: event.data.start_date,
//                     logoUrl: event.data.logoUrl,
//                     endDate: event.data.end_date,
//                     startTime: event.data.start_time,
//                     endTime: event.data.end_time,
//                     description: event.data.description,
//                     format: event.data.format,
//                     isLinkedToWidget: false,
//                     gmtZone: event.data.gmt_time,
//                     latitude: event.data.latitude,
//                     eventType: event.type,
//                     longitude: event.data.longitude,
//                     participationType: event.data.participationType,
//                     parentData: event.data.parentData,
//                     widgetTags: event.widgetData.map((item: { type: any }) => item.type).join(', '),
//                     customizationData: {
//                         pageBgColor: event.data.customizationData.pageBgColor,
//                         eventFont: event.data.customizationData.eventFont,
//                         registerBtnColor: event.data.customizationData.registerBtnColor,
//                         registerBtnText: event.data.customizationData.registerBtnText,
//                         registerMessage: event.data.customizationData.registerMessage,
//                         speakerProfilesData: event.data.customizationData.speakerProfilesData,
//                         participationMessage: event.data.customizationData.participationMessage,
//                         venue: event.data.customizationData.venue,
//                         hashtags: event.data.customizationData.hashtags,
//                         boothNumber: event.data.customizationData.boothNumber
//                     }
//                 },
//                 subEvents: event.children.map((subEvent: any) => ({
//                     eventId: subEvent.id,
//                     name: subEvent.name,
//                     cityName: subEvent.data.location_city,
//                     countryName: subEvent.data.location_country,
//                     startDate: subEvent.data.start_date,
//                     logoUrl: subEvent.data.logoUrl,
//                     endDate: subEvent.data.end_date,
//                     startTime: subEvent.data.start_time,
//                     endTime: subEvent.data.end_time,
//                     description: subEvent.data.description,
//                     format: subEvent.data.format,
//                     isLinkedToWidget: false,
//                     gmtZone: subEvent.data.gmt_time,
//                     latitude: subEvent.data.latitude,
//                     eventType: subEvent.type,
//                     longitude: subEvent.data.longitude,
//                     participationType: subEvent.data.participationType,
//                     // widgetTags: subEvent.widgetData.map((item: { type: any }) => item.type).join(', '),
//                     customizationData: {
//                         pageBgColor: subEvent.data.customizationData.pageBgColor,
//                         eventFont: subEvent.data.customizationData.eventFont,
//                         registerBtnColor: subEvent.data.customizationData.registerBtnColor,
//                         registerBtnText: subEvent.data.customizationData.registerBtnText,
//                         registerMessage: subEvent.data.customizationData.registerMessage,
//                         speakerProfilesData: subEvent.data.customizationData.speakerProfilesData,
//                         participationMessage: subEvent.data.customizationData.participationMessage,
//                         venue: subEvent.data.customizationData.venue,
//                         hashtags: subEvent.data.customizationData.hashtags,
//                         boothNumber: subEvent.data.customizationData.boothNumber
//                     }
//                 }))
//             }));

//             if (type === "update") { // So basically this fetchEvents() function is called in many pages, we want to make sure if we are calling this function when some task if performed like, deleting an event or updating an event or adding an event, we only need to add the updated events and not the prev events + new events
//                 setFetchedEvents(transformedEvents)
//             } else {
//                 setFetchedEvents(prevEvents => [...prevEvents, ...transformedEvents]);
//             }
//         } else {
//             console.error('Error fetching events:', error);
//         }

//        } catch (error) {
//         console.error(error);
//        }

//     }
//     useEffect(() => {
//         if (eventFlow) {
//             setIsEventFormModal(true)
//         }
//     }, [eventFlow])

//     const handlePrefillEvent = (event: EventsType) => {
//         // setPrefilledGlobalEvent(undefined)
//         setPrefilledEvent(event)
//         setIsEventFormModal(true)
//         if (event.eventType === "MAIN") {
//             setEventFlow("main")
//         } else setEventFlow("side")

//     }
//     const handlePrefillSubEvent = (event: EventsType) => {
//         setPrefilledSubEvent(event)
//         setIsEventFormModal(true)
//         setEventFlow("side")
//     }
//     const handlePrefillGlobalEvent = (event: GolbalEventType) => {
//         // setPrefilledEvent(undefined)
//         // setPrefilledGlobalEvent(undefined)
//         setPrefilledGlobalEvent(event)
//         setIsEventFormModal(true)
//         setEventFlow("main")
//     }
//     return (
//         <div className={`${styles.body} ${isEventFormModal || deleteModal || deleteModalTwo || choiceFormModal ? styles.modalOpen : ""}`}>
//             <nav className={styles.nav}>
//                 <div>
//                     <Image src={CalendarIcon} alt='cal' width={14} height={14} className='icons' />
//                     <span>Upcoming Events</span>
//                 </div>
//                 <button onClick={() => setChoiceFormModal(true)}>+ Add Event</button>
//             </nav>
//             <div className={styles.globalSearch}>
//                 <GlobalSearch widgetId='123' handlePrefillGlobalEvent={handlePrefillGlobalEvent} />
//             </div>
//             {fetchedEvents.length > 0 ? fetchedEvents.map((event, index) => {
//                 const showDate = event.mainEvent.startDate !== prevDate;
//                 prevDate = event.mainEvent.startDate;
//                 return (
//                     <div key={index} className={styles.container}>
//                         <TimelineItem eventDate={showDate ? event.mainEvent.startDate : null} />
//                         {event.mainEvent.eventType === "MAIN" ? <DashboardEventCard setSelectedEventType={setSelectedEventType} handlePrefillSubEvent={handlePrefillSubEvent} width='small' handlePrefillEvent={handlePrefillEvent} handleDeleteModal={handleDeleteModal} event={event} /> : <SubEventCard setSelectedEventType={setSelectedEventType} width='small' handlePrefillEvent={handlePrefillEvent} normalEvent={event} />}
//                     </div>
//                 );
//             }) :
//                 <div className={styles.emptyScreen}>
//                     <Image src={EmptyImage} alt='empty' />
//                     <div>Search or Add your Events</div>
//                     <span>Start by searching for existing events to add to your widgets</span>
//                     <span>or feel free to create your own event from scratch</span>
//                 </div>}
//             {(isEventFormModal || deleteModal || deleteModalTwo || choiceFormModal) && <div className={styles.blackScreen}></div>}
//             {isEventFormModal && <div className={styles.addEventModal}>
//                 <AddEvent isApproved={isApproved} setIsApproved={setIsApproved} prefilledSubEvent={prefilledSubEvent} setPrefilledSubEvent={setPrefilledSubEvent} setPrefilledEvent={setPrefilledEvent} setPrefilledGlobalEvent={setPrefilledGlobalEvent} setEventFlow={setEventFlow} eventFlow={eventFlow} widgetId='22323' prefilledEvent={prefilledEvent} fetchEvents={fetchEvents} setIsAddEventModalOpen={setIsEventFormModal} prefilledGlobalEvent={prefilledGlobalEvent} addedEventIds={[""]} setChoiceFormModal={setChoiceFormModal} />
//             </div>}
//             {/* {deleteModal && <div className={styles.deleteModal}>
//                 <div className={styles.deleteHeading}>Are you sure you want to delete this event?</div>
//                 <span>{selectedEventName}</span>
//                 <div className={styles.btns}>
//                     <button className={styles.cancelBtn} onClick={() => setDeleteModal(false)}>Cancel</button>
//                     <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
//                 </div>
//             </div>}
//             {deleteModalTwo && <div className={styles.deleteModal}>
//                 <div className={styles.deleteHeading}>This event is Present in one of your widgets.</div>
//                 <span>Remove the event from widget to delete this event</span>
//                 <div className={styles.btns}>
//                     <button className={styles.cancelBtn} onClick={() => setDeleteModalTwo(false)}>Cancel</button>
//                 </div>
//             </div>} */}
//             {choiceFormModal &&
//                 <div className={styles.choiceModal}>
//                     <ChoiceModal setChoiceFormModal={setChoiceFormModal} setEventFlow={setEventFlow} />
//                 </div>
//             }
//         </div>
//     )
// }

// export default Page

"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import TimelineItem from "@/app/components/employee/listView/TimelineItem";
import { AllEventsType, EventsType } from "@/types/alleventtype";
import AddEvent from "@/app/components/TemplateViewsNew/AddEventForm/AddEvent";
import Image from "next/image";
import EmptyImage from "/public/widgetimages/emptyimages/addedeventempty.svg";
import DashboardEventCard from "@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEventCard";
import GlobalSearch from "@/app/components/TemplateViewsNew/EditScreen/FilterEvents/GlobalSearch";
import { GolbalEventType } from "@/types/globaleventtype";
import ChoiceModal from "@/app/components/TemplateViewsNew/Events/ChoiceModal";
import SubEventCard from "@/app/components/TemplateViewsNew/WidgetDashboard/SubEventCard";
import { useEventServices } from "@/services/geniservices/eventService";
import MonthsCalendar from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/MonthsCalendar";
import { useTheme } from "@/context";
import { useSearchParams } from 'next/navigation';
const Page = () => {
  const searchParams = useSearchParams();
  const [upcominFetchedEvents, setUpcominFetchedEvents] = useState<
    AllEventsType[]
  >([]);
  const [pastFetchedEvents, setPastFetchedEvents] = useState<AllEventsType[]>(
    []
  );
  const [isEventFormModal, setIsEventFormModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEventName, setSelectedEventName] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [isFetching, setIsFetching] = useState(false);
  const [prefilledEvent, setPrefilledEvent] = useState<EventsType | null>(null);
  const [prefilledSubEvent, setPrefilledSubEvent] = useState<EventsType | null>(
    null
  );
  const [prefilledGlobalEvent, setPrefilledGlobalEvent] =
    useState<GolbalEventType | null>(null);
  const [deleteModalTwo, setDeleteModalTwo] = useState<boolean>(false); // This one is for if the event is present in some widget
  const [choiceFormModal, setChoiceFormModal] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  // const [mainEventFlow, setMainEventFlow] = useState<boolean>(false)
  // const [sideEventFlow, setSideEventFlow] = useState<boolean>(false)
  const [eventFlow, setEventFlow] = useState<string>("");
  const [selectedEventType, setSelectedEventType] = useState<string>(""); // This will be used to Delete an event
  const [todaysDate, setTodaysDate] = useState("");
  const { getUpcomingEvents, getPastEvents, error } = useEventServices();
  let prevDate: any = null;
  const [activeTab, setActiveTab] = useState("upcoming");
  const { theme } = useTheme();
  const [filteredUpcomingEvents, setFilteredUpcomingEvents] = React.useState<
    AllEventsType[]
  >([]);
  const [filteredPastEvents, setFilteredPastEvents] = React.useState<
    AllEventsType[]
  >([]);
  const handleFilteredEvents = (selectedDate: string) => {
    if (activeTab === "past") {
      const filtered = pastFetchedEvents.filter(
        (event: any) => event.mainEvent.startDate === selectedDate
      );
      setFilteredPastEvents(filtered);
    }
    if (activeTab === "upcoming") {
      const filtered = upcominFetchedEvents!.filter(
        (event: any) => event.mainEvent.startDate === selectedDate
      );
      setFilteredUpcomingEvents(filtered);
    }
  };
  const handleFilteredEventsByMonth = (selectedMonth: string) => {
    if (activeTab === "past") {
      const filtered = pastFetchedEvents.filter((event: any) => {
        const eventMonth = new Date(event.mainEvent.startDate).toLocaleString(
          "default",
          {
            month: "long",
          }
        );
        return eventMonth === selectedMonth;
      });
      setFilteredPastEvents(filtered);
    }
    if (activeTab === "upcoming") {
      const filtered = upcominFetchedEvents.filter((event: any) => {
        const eventMonth = new Date(event.mainEvent.startDate).toLocaleString(
          "default",
          {
            month: "long",
          }
        );
        return eventMonth === selectedMonth;
      });
      setFilteredUpcomingEvents(filtered);
    }
  };

  useEffect(() => {
    const getCurrentDate = (): string => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setTodaysDate(getCurrentDate());
  }, []);

  useEffect(() => {
    if (searchParams.get('fromDashboard') === 'true') {
      setChoiceFormModal(true);
    }
  }, [searchParams])

  // useEffect(() => {
  //   setPage(0);
  //   if (activeTab === "upcoming") {
  //     fetchUpcomingEvents(0);
  //   } else {
  //     fetchPastEvents(0);
  //   }
  // }, [activeTab]);

  useEffect(() => {
    setPage(0);
    if (activeTab === "upcoming") {
      setUpcominFetchedEvents([]);
      fetchUpcomingEvents(0);
    } else {
      setPastFetchedEvents([]);
      fetchPastEvents(0);
    }
  }, [activeTab]);

  useEffect(() => {
    if (page > 0) {
      if (activeTab === "upcoming") {
        fetchUpcomingEvents(page * 8);
      } else {
        fetchPastEvents(page * 8);
      }
    }
  }, [page]);

  React.useEffect(() => {
    if (upcominFetchedEvents && upcominFetchedEvents.length > 0) {
      setFilteredUpcomingEvents(upcominFetchedEvents);
    }
    if (pastFetchedEvents && pastFetchedEvents.length > 0) {
      setFilteredPastEvents(pastFetchedEvents);
    }
  }, [upcominFetchedEvents, pastFetchedEvents]);

  useEffect(() => {
    if (activeTab === "upcoming") {
      console.log("this scroll function called");
      console.log("fetched_events_____________", upcominFetchedEvents);
      const handleScroll = () => {
        const isAtBottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 50; // Adjusted offset
        if (isAtBottom && upcominFetchedEvents.length > 0) {
          setPage((prevPage) => prevPage + 1); // Increment page to load more events
        }
      };

      const debounceScroll = () => {
        clearTimeout(window.scrollTimeout); // Clear any existing timeout
        window.scrollTimeout = setTimeout(handleScroll, 100); // Set a debounce of 100ms
      };

      window.addEventListener("scroll", debounceScroll);
      return () => window.removeEventListener("scroll", debounceScroll);
    }

    if (activeTab === "past") {
      console.log("this scroll function called");
      console.log("fetched_events_____________", upcominFetchedEvents);
      const handleScroll = () => {
        const isAtBottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 50; // Adjusted offset
        if (isAtBottom && upcominFetchedEvents.length > 0) {
          setPage((prevPage) => prevPage + 1); // Increment page to load more events
        }
      };

      const debounceScroll = () => {
        clearTimeout(window.scrollTimeout); // Clear any existing timeout
        window.scrollTimeout = setTimeout(handleScroll, 100); // Set a debounce of 100ms
      };

      window.addEventListener("scroll", debounceScroll);
      return () => window.removeEventListener("scroll", debounceScroll);
    }
  }, [upcominFetchedEvents, pastFetchedEvents]);

  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const calendarElement = document.getElementById("calendar");
      const scrollOffset = 150;
      if (window.scrollY >= scrollOffset) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDeleteModal = (
    eventId: string,
    eventName: string,
    isPresentinWidget: boolean
  ) => {
    if (isPresentinWidget) {
      setDeleteModalTwo(true);
    } else {
      setSelectedEventName(eventName);
      setSelectedEventId(eventId);
      setDeleteModal(true);
    }
  };

  const fetchUpcomingEvents = async (page: number, type?: string) => {
    try {
      const data: any = await getUpcomingEvents(page);
      if (data) {
        const transformedEvents = data.data.map((event: any) => ({
          mainEvent: {
            eventId: event.id,
            name: event.name,
            cityName: event.data.location_city,
            countryName: event.data.location_country,
            startDate: event.data.start_date,
            logoUrl: event.data.logoUrl,
            endDate: event.data.end_date,
            startTime: event.data.start_time,
            endTime: event.data.end_time,
            description: event.data.description,
            format: event.data.format,
            isLinkedToWidget: false,
            gmtZone: event.data.gmt_time,
            latitude: event.data.latitude,
            eventType: event.type,
            longitude: event.data.longitude,
            participationType: event.data.participationType,
            parentData: event.data.parentData,
            widgetTags: event.widgetData
              .map((item: { type: any }) => item.type)
              .join(", "),
            customizationData: {
              pageBgColor: event.data.customizationData.pageBgColor,
              eventFont: event.data.customizationData.eventFont,
              registerBtnColor: event.data.customizationData.registerBtnColor,
              registerBtnText: event.data.customizationData.registerBtnText,
              registerMessage: event.data.customizationData.registerMessage,
              speakerProfilesData:
                event.data.customizationData.speakerProfilesData,
              participationMessage:
                event.data.customizationData.participationMessage,
              venue: event.data.customizationData.venue,
              hashtags: event.data.customizationData.hashtags,
              boothNumber: event.data.customizationData.boothNumber,
            },
          },
          subEvents: event.children.map((subEvent: any) => ({
            eventId: subEvent.id,
            name: subEvent.name,
            cityName: subEvent.data.location_city,
            countryName: subEvent.data.location_country,
            startDate: subEvent.data.start_date,
            logoUrl: subEvent.data.logoUrl,
            endDate: subEvent.data.end_date,
            startTime: subEvent.data.start_time,
            endTime: subEvent.data.end_time,
            description: subEvent.data.description,
            format: subEvent.data.format,
            isLinkedToWidget: false,
            gmtZone: subEvent.data.gmt_time,
            latitude: subEvent.data.latitude,
            eventType: subEvent.type,
            longitude: subEvent.data.longitude,
            participationType: subEvent.data.participationType,
            // widgetTags: subEvent.widgetData.map((item: { type: any }) => item.type).join(', '),
            customizationData: {
              pageBgColor: subEvent.data.customizationData.pageBgColor,
              eventFont: subEvent.data.customizationData.eventFont,
              registerBtnColor:
                subEvent.data.customizationData.registerBtnColor,
              registerBtnText: subEvent.data.customizationData.registerBtnText,
              registerMessage: subEvent.data.customizationData.registerMessage,
              speakerProfilesData:
                subEvent.data.customizationData.speakerProfilesData,
              participationMessage:
                subEvent.data.customizationData.participationMessage,
              venue: subEvent.data.customizationData.venue,
              hashtags: subEvent.data.customizationData.hashtags,
              boothNumber: subEvent.data.customizationData.boothNumber,
            },
          })),
        }));

        if (type === "update") {
          // So basically this fetchEvents() function is called in many pages, we want to make sure if we are calling this function when some task if performed like, deleting an event or updating an event or adding an event, we only need to add the updated events and not the prev events + new events
          setUpcominFetchedEvents(transformedEvents);
        } else {
          setUpcominFetchedEvents((prevEvents) => [
            ...prevEvents,
            ...transformedEvents,
          ]);
          // setUpcominFetchedEvents(transformedEvents);
        }
      } else {
        console.error("Error fetching events:", error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPastEvents = async (page: number, type?: string) => {
    try {
      const data: any = await getPastEvents(page);
      if (data) {
        const transformedEvents = data.data.map((event: any) => ({
          mainEvent: {
            eventId: event.id,
            name: event.name,
            cityName: event.data.location_city,
            countryName: event.data.location_country,
            startDate: event.data.start_date,
            logoUrl: event.data.logoUrl,
            endDate: event.data.end_date,
            startTime: event.data.start_time,
            endTime: event.data.end_time,
            description: event.data.description,
            format: event.data.format,
            isLinkedToWidget: false,
            gmtZone: event.data.gmt_time,
            latitude: event.data.latitude,
            eventType: event.type,
            longitude: event.data.longitude,
            participationType: event.data.participationType,
            parentData: event.data.parentData,
            widgetTags: event.widgetData
              .map((item: { type: any }) => item.type)
              .join(", "),
            customizationData: {
              pageBgColor: event.data.customizationData.pageBgColor,
              eventFont: event.data.customizationData.eventFont,
              registerBtnColor: event.data.customizationData.registerBtnColor,
              registerBtnText: event.data.customizationData.registerBtnText,
              registerMessage: event.data.customizationData.registerMessage,
              speakerProfilesData:
                event.data.customizationData.speakerProfilesData,
              participationMessage:
                event.data.customizationData.participationMessage,
              venue: event.data.customizationData.venue,
              hashtags: event.data.customizationData.hashtags,
              boothNumber: event.data.customizationData.boothNumber,
            },
          },
          subEvents: event.children.map((subEvent: any) => ({
            eventId: subEvent.id,
            name: subEvent.name,
            cityName: subEvent.data.location_city,
            countryName: subEvent.data.location_country,
            startDate: subEvent.data.start_date,
            logoUrl: subEvent.data.logoUrl,
            endDate: subEvent.data.end_date,
            startTime: subEvent.data.start_time,
            endTime: subEvent.data.end_time,
            description: subEvent.data.description,
            format: subEvent.data.format,
            isLinkedToWidget: false,
            gmtZone: subEvent.data.gmt_time,
            latitude: subEvent.data.latitude,
            eventType: subEvent.type,
            longitude: subEvent.data.longitude,
            participationType: subEvent.data.participationType,
            // widgetTags: subEvent.widgetData.map((item: { type: any }) => item.type).join(', '),
            customizationData: {
              pageBgColor: subEvent.data.customizationData.pageBgColor,
              eventFont: subEvent.data.customizationData.eventFont,
              registerBtnColor:
                subEvent.data.customizationData.registerBtnColor,
              registerBtnText: subEvent.data.customizationData.registerBtnText,
              registerMessage: subEvent.data.customizationData.registerMessage,
              speakerProfilesData:
                subEvent.data.customizationData.speakerProfilesData,
              participationMessage:
                subEvent.data.customizationData.participationMessage,
              venue: subEvent.data.customizationData.venue,
              hashtags: subEvent.data.customizationData.hashtags,
              boothNumber: subEvent.data.customizationData.boothNumber,
            },
          })),
        }));

        if (type === "update") {
          // So basically this fetchEvents() function is called in many pages, we want to make sure if we are calling this function when some task if performed like, deleting an event or updating an event or adding an event, we only need to add the updated events and not the prev events + new events
          setPastFetchedEvents(transformedEvents);
        } else {
          setPastFetchedEvents((prevEvents) => [
            ...prevEvents,
            ...transformedEvents,
          ]);
          // setUpcominFetchedEvents(transformedEvents);
        }
      } else {
        console.error("Error fetching events:", error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (eventFlow) {
      setIsEventFormModal(true);
    }
  }, [eventFlow]);

  const handlePrefillEvent = (event: EventsType) => {
    // setPrefilledGlobalEvent(undefined)
    setPrefilledEvent(event);
    setIsEventFormModal(true);
    if (event.eventType === "MAIN") {
      setEventFlow("main");
    } else setEventFlow("side");
  };
  const handlePrefillSubEvent = (event: EventsType) => {
    setPrefilledSubEvent(event);
    setIsEventFormModal(true);
    setEventFlow("side");
  };
  const handlePrefillGlobalEvent = (event: GolbalEventType) => {
    // setPrefilledEvent(undefined)
    // setPrefilledGlobalEvent(undefined)
    setPrefilledGlobalEvent(event);
    setIsEventFormModal(true);
    setEventFlow("main");
  };

  const handleResetEvents = () => {
    if (activeTab === "upcoming") {
      setFilteredUpcomingEvents(upcominFetchedEvents || []);
    }
    if (activeTab === "past") {
      setFilteredPastEvents(pastFetchedEvents || []);
    }
  };

  return (
    <div
      className={`${styles.body} ${isEventFormModal || deleteModal || deleteModalTwo || choiceFormModal
        ? styles.modalOpen
        : ""
        }`}
    >
      <nav className={styles.nav}>
        <div className={styles.tabs}>
          <button
            className={activeTab === "upcoming" ? styles.activeTab : ""}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming Events
          </button>
          <button
            className={activeTab === "past" ? styles.activeTab : ""}
            onClick={() => setActiveTab("past")}
          >
            Past Events
          </button>
        </div>
        <button className={styles.addBtn} onClick={() => setChoiceFormModal(true)}>+ Add Event</button>
      </nav>
      <div className={styles.globalSearch}>
        <GlobalSearch
          widgetId="123"
          handlePrefillGlobalEvent={handlePrefillGlobalEvent}
        />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.eventsContainer}>
          {activeTab === "upcoming" && filteredUpcomingEvents.length > 0 ? (
            filteredUpcomingEvents.map((event, index) => {
              const showDate = event.mainEvent.startDate !== prevDate;
              prevDate = event.mainEvent.startDate;

              return (
                <>
                  {showDate && (
                    <TimelineItem
                      eventDate={showDate ? event.mainEvent.startDate : null}
                    />
                  )}
                  {event.mainEvent.eventType === "MAIN" ? (
                    <DashboardEventCard
                      setSelectedEventType={setSelectedEventType}
                      handlePrefillSubEvent={handlePrefillSubEvent}
                      width="small"
                      handlePrefillEvent={handlePrefillEvent}
                      handleDeleteModal={handleDeleteModal}
                      event={event}
                    />
                  ) : (
                    <SubEventCard
                      setSelectedEventType={setSelectedEventType}
                      width="small"
                      handlePrefillEvent={handlePrefillEvent}
                      normalEvent={event}
                    />
                  )}
                </>
              );
            })
          ) : activeTab === "past" && filteredPastEvents.length > 0 ? (
            filteredPastEvents.map((event, index) => {
              const showDate = event.mainEvent.startDate !== prevDate;
              prevDate = event.mainEvent.startDate;

              return (
                <>
                  {showDate && (
                    <TimelineItem
                      eventDate={showDate ? event.mainEvent.startDate : null}
                    />
                  )}
                  {event.mainEvent.eventType === "MAIN" ? (
                    <DashboardEventCard
                      setSelectedEventType={setSelectedEventType}
                      handlePrefillSubEvent={handlePrefillSubEvent}
                      width="small"
                      handlePrefillEvent={handlePrefillEvent}
                      handleDeleteModal={handleDeleteModal}
                      event={event}
                    />
                  ) : (
                    <SubEventCard
                      setSelectedEventType={setSelectedEventType}
                      width="small"
                      handlePrefillEvent={handlePrefillEvent}
                      normalEvent={event}
                    />
                  )}
                </>
              );
            })
          ) : (
            <div className={styles.emptyScreen}>
              <Image src={EmptyImage} alt="empty" />
              <div>Search or Add your Events</div>
              <span>
                Start by searching for existing events to add to your widgets
              </span>
              <span>or feel free to create your own event from scratch</span>
            </div>
          )}

        </div>
        <div id="calendar" className={`${styles.calendarContainer} ${isFixed ? styles.fixed : ""}`}>
          <div className={styles.calendar_div}>
            <MonthsCalendar
              theme={theme}
              widgetId={null}
              onMonthSelect={handleFilteredEventsByMonth}
              onDaySelect={handleFilteredEvents}
              tab={activeTab}
              handleResetEvents={handleResetEvents}
            />
          </div>
        </div>
      </div>

      {(isEventFormModal ||
        deleteModal ||
        deleteModalTwo ||
        choiceFormModal) && <div className={styles.blackScreen}></div>}
      {isEventFormModal && (
        <div className={styles.addEventModal}>
          <AddEvent
            isApproved={isApproved}
            setIsApproved={setIsApproved}
            prefilledSubEvent={prefilledSubEvent}
            setPrefilledSubEvent={setPrefilledSubEvent}
            setPrefilledEvent={setPrefilledEvent}
            setPrefilledGlobalEvent={setPrefilledGlobalEvent}
            setEventFlow={setEventFlow}
            eventFlow={eventFlow}
            widgetId="22323"
            prefilledEvent={prefilledEvent}
            fetchEvents={fetchUpcomingEvents}
            setIsAddEventModalOpen={setIsEventFormModal}
            prefilledGlobalEvent={prefilledGlobalEvent}
            addedEventIds={[""]}
            setChoiceFormModal={setChoiceFormModal}
          />
        </div>
      )}
      {choiceFormModal && (
        <div className={styles.choiceModal}>
          <ChoiceModal
            setChoiceFormModal={setChoiceFormModal}
            setEventFlow={setEventFlow}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
