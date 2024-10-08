import React, { useEffect, useState, useRef } from "react";
import styles from "./allevents.style.module.css";
import GlobalSearch from "./GlobalSearch";
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import { AllEventsType } from "@/types/alleventtype";
import EmptyImage from "/public/widgetimages/emptyimages/addedeventempty.svg";
import Image from "next/image";
import useOutsideClick from "@/hooks/useOutsideClick";
import { showToast } from "@/utils/showToast";
import { AddedEventsType } from "@/types/addedeventtype";
import { PrefilledAddedEventsType } from "@/types/prefilledaddedeventtype";
import { useRouter } from "next/navigation";

interface Props {
  fetchedAllEvents: AllEventsType[];
  fetchedAddedEvents: AddedEventsType[];
  fetchEvents: (page: number, type?: string) => Promise<void>;
  fetchAddedEvents: () => Promise<void>;
  // handlePrefillEvent: (event: AllEventsType, type: string) => void
  widgetId: string;
  allEventsCount: number;
  addedEventIds: string[];
  selectedTemplate: string;
  isCustomisationWindowDisable: boolean;
  setIsCustomisationWindowDisable: (value: boolean) => void;
  isCodeWindowDisable: boolean;
  setIsCodeWindowDisable: (value: boolean) => void;

  promotedEvents: string[];
  setPromotedEvents: React.Dispatch<React.SetStateAction<string[]>>;
  normalEvents: string[];
  setNormalEvents: React.Dispatch<React.SetStateAction<string[]>>;
}

const AllEvents = ({
  fetchedAllEvents,
  fetchEvents,
  fetchAddedEvents,
  fetchedAddedEvents,
  //  handlePrefillEvent,
  widgetId,
  allEventsCount,
  addedEventIds,
  selectedTemplate,
  isCustomisationWindowDisable,
  setIsCustomisationWindowDisable,
  isCodeWindowDisable,
  setIsCodeWindowDisable,
  promotedEvents,
  setPromotedEvents,
  normalEvents,
  setNormalEvents,
}: Props) => {
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To heck if there are more events
  const scrollableDivRef = useRef(null);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const buttonDropdownRef = useOutsideClick(() => setDropdown(false));
  const [minNumberOfEvents, setMinNumberOfEvents] = useState("");
  const [showMSG, setShowMsg] = useState(false);
  const [fetchedAddedOtherData, setFetchedAddedOtherData] = useState<
    PrefilledAddedEventsType[]
  >([]);
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<any>({});
  useEffect(() => {
    const handleOtherDataFetch = async () => {
      try {
        const newPromotedEvents: string[] = [];
        const newNormalEvents: string[] = [];
        const newFetchedAddedOtherData = await Promise.all(
          fetchedAddedEvents.map(async (event) => {
            const { data, error } = await myFetch(
              `${baseUrl}/event/${event.id}?source=eventgtm`
            );
            if (error) {
              console.error(
                `Error fetching event data for event ID ${event.id}:`,
                error
              );
              return null;
            }
            const eventData = data?.data;
            // if (!eventData) return null;

            const eventObject = {
              id: event.id,
              name: data?.name,
              pageBgColor: eventData.customizationData.pageBgColor,
              description: eventData.description,
              eventFont: eventData.customizationData.eventFont,
              startDate: eventData.start_date,
              endDate: eventData.end_date,
              startTime: eventData.start_time,
              endTime: eventData.end_time,
              timeZone: eventData.gmt_time,
              cityName: eventData.location_city,
              countryName: eventData.location_country,
              participationType: data?.participationType,
              eventFormat: eventData.format,
              registerBtnColor: eventData.customizationData.registerBtnColor,
              registerBtnText: eventData.customizationData.registerBtnText,
              registerMessage: eventData.customizationData.registerMessage,
              boothNumber: eventData.customizationData.boothNumber,
              speakerProfilesData:
                eventData.customizationData.speakerProfilesData,
              participationMessage:
                eventData.customizationData.participationMessage,
              bannerUrl: eventData.logoUrl,
              latitude: eventData.latitude,
              longitude: eventData.longitude,
              venue: eventData.customizationData.venue,
              hashtags: eventData.customizationData.hashtags,
              promoted: event.promoted,
            } as PrefilledAddedEventsType;
            if (event.promoted === "true") {
              newPromotedEvents.push(event.promoted);
            } else if (event.promoted === "false") {
              newNormalEvents.push(event.promoted);
            }
            return eventObject;
          })
        );
        console.log("Promoted events:allevents", promotedEvents, normalEvents);
        setPromotedEvents(newPromotedEvents);
        setNormalEvents(newNormalEvents);
        setFetchedAddedOtherData(
          newFetchedAddedOtherData.filter(
            (event): event is PrefilledAddedEventsType => event !== null
          )
        );
      } catch (err) {
        console.error("Error in handleOtherDataFetch:", err);
      }
    };
    handleOtherDataFetch();
  }, [fetchedAddedEvents]);

  useEffect(() => {
    let promotedCount = promotedEvents.length;
    let normalEventCount = normalEvents.length;
    console.log(fetchedAddedOtherData, promotedCount, normalEventCount);
    // Check which template is selected
    if (selectedTemplate === "CVG") {
      if (promotedCount >= 3 && normalEventCount >= 2) {
        setIsCodeWindowDisable(false);
        setIsCustomisationWindowDisable(false);
      } else {
        setIsCodeWindowDisable(true);
        setIsCustomisationWindowDisable(true);
      }
      setShowMsg(true);
      setMinNumberOfEvents(
        "Select at least 2 events for the grid and promote 3 for the carousel view!"
      );
    }

    if (selectedTemplate === "CVL") {
      if (promotedCount >= 3 && normalEventCount >= 1) {
        setIsCodeWindowDisable(false);
        setIsCustomisationWindowDisable(false);
      } else {
        setIsCodeWindowDisable(true);
        setIsCustomisationWindowDisable(true);
      }
      setShowMsg(true);
      setMinNumberOfEvents(
        "Select at least 1 event for the list and promote 3 for the carousel view!"
      );
    }

    if (selectedTemplate === "CV") {
      if (normalEventCount >= 3) {
        setIsCodeWindowDisable(false);
        setIsCustomisationWindowDisable(false);
      } else {
        setIsCodeWindowDisable(true);
        setIsCustomisationWindowDisable(true);
      }
      setShowMsg(true);
      setMinNumberOfEvents("Select atleast 3 events for this widget style");
    }

    if (selectedTemplate === "HS") {
      if (normalEventCount >= 3) {
        setIsCodeWindowDisable(false);
        setIsCustomisationWindowDisable(false);
      } else {
        setIsCodeWindowDisable(true);
        setIsCustomisationWindowDisable(true);
      }
      setShowMsg(true);
      setMinNumberOfEvents("Select atleast 3 events for this widget style");
    }
  }, [selectedTemplate, fetchedAddedOtherData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableDiv = scrollableDivRef.current;
      if (scrollableDiv) {
        const { scrollTop, clientHeight, scrollHeight } = scrollableDiv;
        // Check if the user has scrolled near the bottom of the div
        if (
          scrollTop + clientHeight >= scrollHeight - 50 &&
          !isLoading &&
          hasMore
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };
    const scrollableDiv: any = scrollableDivRef.current;

    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (allEventsCount !== fetchedAllEvents.length) {
      if (page > 0) {
        const fetchMoreEvents = async () => {
          setIsLoading(true);
          const prevLength = fetchedAllEvents.length;
          await fetchEvents(page * 8);
          const newLength = fetchedAllEvents.length;
          setIsLoading(false);

          // If no more events are fetched, stop further fetching
          if (newLength === prevLength) {
            setHasMore(false);
          }
        };
        fetchMoreEvents();
      }
    }
  }, [page]);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const handleDelete = async (eventId: string) => {
    const customizeData = new FormData();
    customizeData.append("id", eventId);
    customizeData.append("published", "false");
    const { data, error } = await myFetch(`${baseUrl}/event`, {
      method: "PATCH",
      body: customizeData,
    });
    if (data) {
      if (fetchedAddedEvents.length === 1) {
        handleDraftWidget(); // Will call this function to move the widget to draft if no event is left in widget
      }
      fetchEvents(0, "update");
      fetchAddedEvents();
    }
    if (error) {
      console.log(error);
    }
  };

  // To move the widget to draft if all events are deleted
  const handleDraftWidget = async () => {
    const formData = new FormData();
    formData.append("widgetId", widgetId);
    formData.append("status", "draft");
    const { data, error } = await myFetch(`${baseUrl}/widget`, {
      method: "POST",
      body: formData,
    });
    if (data) {
      console.log("widget moved to draft widgets");
    }
  };

  const handleAddToWidget = async (event: AllEventsType, isLinked: any) => {
    const existingEvents = fetchedAddedEvents || [];
    event.mainEvent.isLinkedToWidget = !isLinked;
    if (!isLinked) {
      setSelectedOptions((prev: any) => ({
        ...prev,
        [event.mainEvent.eventId]: "carousel", // Set "carousel" as default when turning on
      }));
    }
    // Check if the event is already in the widget
    const eventIndex = existingEvents.findIndex(
      (existingEvent) => existingEvent.id === event.mainEvent.eventId
    );

    if (eventIndex !== -1) {
      // Event already exists in the widget (e.g., list), so we need to remove it from there
      const updatedEvents = existingEvents.filter(
        (existingEvent) => existingEvent.id !== event.mainEvent.eventId
      );

      // Now add the event to the carousel
      const newEvents = {
        id: event.mainEvent.eventId,
        promoted: event.promoted === "true" ? "false" : "true", // Update promotion status as needed
      };

      const mergedEvents = [...updatedEvents, newEvents]; // Remove from list and add to carousel
      const otherData = {
        event: mergedEvents,
      };

      const eventIds = mergedEvents.map((event) => event.id).join(",");
      const customizedFormData = new FormData();
      customizedFormData.append("widgetId", widgetId);
      customizedFormData.append("eventId", eventIds);
      customizedFormData.append("otherdata", JSON.stringify(otherData));
      customizedFormData.append("status", "active");

      const { data, error } = await myFetch(`${baseUrl}/widget`, {
        method: "POST",
        body: customizedFormData,
      });

      if (data) {
        showToast("success", "Event Successfully moved to the carousel");
        fetchEvents(0, "update");
        fetchAddedEvents();
      }
    } else {
      // If the event is not in any widget, just add it to the carousel
      const newEvents = {
        id: event.mainEvent.eventId,
        promoted: event.promoted === "true" ? "false" : "true",
      };

      const mergedEvents = [...existingEvents, newEvents];
      const otherData = {
        event: mergedEvents,
      };

      const eventIds = mergedEvents.map((event) => event.id).join(",");
      const customizedFormData = new FormData();
      customizedFormData.append("widgetId", widgetId);
      customizedFormData.append("eventId", eventIds);
      customizedFormData.append("otherdata", JSON.stringify(otherData));
      customizedFormData.append("status", "active");

      const { data, error } = await myFetch(`${baseUrl}/widget`, {
        method: "POST",
        body: customizedFormData,
      });

      if (data) {
        showToast("success", "Event Successfully added to the carousel");
        fetchEvents(0, "update");
        fetchAddedEvents();
      }
    }
  };

  const handleAddToWidgetList = async (
    event: AllEventsType,
    check: boolean,
    option: string
  ) => {
    if (check) {
      // Set the selected option (either 'list' or 'carousel')
      // setSelectedOption(option);
      setSelectedOptions((prev: any) => ({
        ...prev,
        [event.mainEvent.eventId]: option, // Ensure each event has its own option
      }));

      const existingEvents = fetchedAddedEvents || [];

      // Check if the event is already in the widget
      const eventIndex = existingEvents.findIndex(
        (existingEvent) => existingEvent.id === event.mainEvent.eventId
      );

      if (eventIndex !== -1) {
        // If event exists, remove it from the current widget
        const updatedEvents = existingEvents.filter(
          (existingEvent) => existingEvent.id !== event.mainEvent.eventId
        );

        // Add the event to the new widget
        const newEvents = {
          id: event.mainEvent.eventId,
          promoted: "false",
        };

        const mergedEvents = [...updatedEvents, newEvents];
        const otherData = {
          event: mergedEvents,
        };

        const eventIds = mergedEvents.map((event) => event.id).join(",");
        const customizedFormData = new FormData();
        customizedFormData.append("widgetId", widgetId);
        customizedFormData.append("eventId", eventIds);
        customizedFormData.append("otherdata", JSON.stringify(otherData));
        customizedFormData.append("status", "active");

        const { data, error } = await myFetch(`${baseUrl}/widget`, {
          method: "POST",
          body: customizedFormData,
        });

        if (data) {
          showToast("success", "Event successfully switched to the new widget");
          fetchEvents(0, "update");
          fetchAddedEvents();
        }
      } else {
        // Add the event if not already present in any widget
        const newEvents = {
          id: event.mainEvent.eventId,
          promoted: "false",
        };

        const mergedEvents = [...existingEvents, newEvents];
        const otherData = {
          event: mergedEvents,
        };

        const eventIds = mergedEvents.map((event) => event.id).join(",");
        const customizedFormData = new FormData();
        customizedFormData.append("widgetId", widgetId);
        customizedFormData.append("eventId", eventIds);
        customizedFormData.append("otherdata", JSON.stringify(otherData));
        customizedFormData.append("status", "active");

        const { data, error } = await myFetch(`${baseUrl}/widget`, {
          method: "POST",
          body: customizedFormData,
        });

        if (data) {
          showToast("success", "Event successfully added to the widget");
          fetchEvents(0, "update");
          fetchAddedEvents();
        }
      }
    }
  };

  const updateWidget = async (
    widgetId: string,
    updatedEvents: AddedEventsType[],
    eventId: string
  ) => {
    const customizedFormData = new FormData();

    const otherData = {
      event: updatedEvents,
    };
    // const updatedIds = eventIds.join(',')
    customizedFormData.append("widgetId", widgetId);
    customizedFormData.append("otherdata", JSON.stringify(otherData));

    const { data, error } = await myFetch(`${baseUrl}/widget`, {
      method: "POST",
      body: customizedFormData,
    });
    if (data) {
      handleEventIdDelete(eventId);
    }
    if (error) {
      console.log(error);
    }
  };
  const handleEventIdDelete = async (eventId: string) => {
    const customizedFormData = new FormData();
    customizedFormData.append("widgetId", widgetId);
    customizedFormData.append("eventId", eventId);
    customizedFormData.append("published", "false");
    const { data, error } = await myFetch(`${baseUrl}/widget`, {
      method: "POST",
      body: customizedFormData,
    });
    if (data) {
      console.log(data);
      fetchAddedEvents();
      fetchEvents(0, "update");
    }
    if (error) {
      console.log(error);
    }
  };

  const [selectedOption, setSelectedOption] = useState("carousel");

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.body} ref={scrollableDivRef}>
      <div className={styles.headerContainer}>
        <div className={styles.heading}>All Events</div>
        {/* <div className={styles.btnsDropdown}>
                    <div className={styles.dropdownBtn} onClick={() => setDropdown(!dropdown)}><span>Add Event</span><DownArrow /></div>
                    {dropdown && <div className={styles.dropdownContainer} ref={buttonDropdownRef}>
                        <li onClick={() => handleNormalEventModal()}><AddeventIcon/><span>Add event to list</span></li>
                        <li onClick={() => handleAddEventModal()}><AddeventToWidgetIcon/><span>Add event to widget</span></li>
                        <li><SideventIcon/><span>Add side event</span></li>
                    </div>}
                </div> */}
      </div>
      {/* <GlobalSearch widgetId={widgetId} handlePrefillGlobalEvent={handlePrefillGlobalEvent} /> */}
      <div className={styles.line}></div>

      {showMSG && (
        <>
          <div className={styles.info_container}>
            <div>
              <InfoSvg />
            </div>
            <div className={styles.info_heading}>{minNumberOfEvents} </div>
          </div>
          <div className={styles.line}></div>
        </>
      )}

      {fetchedAllEvents.length > 0 ? (
        <div className={styles.allEventsContainer}>
          {fetchedAllEvents.map((event, key) => (
            <div className={styles.event} key={key}>
              <div className={styles.eventDetailsContainer}>
                <div
                  className={styles.eventName}
                >{`${event.mainEvent.name.substring(0, 30)} ${
                  event.mainEvent.name.length > 30 ? "..." : ""
                }`}</div>
                <div className={styles.eventLocationContainer}>
                  <LocationIcon />
                  <div>{event.mainEvent.cityName}</div>
                </div>
                <div className={styles.eventDateContainer}>
                  <DateIcon />
                  <div>
                    {formatDate(event.mainEvent.startDate)} -{" "}
                    {formatDate(event.mainEvent.endDate)}
                  </div>
                </div>
                <div className={styles.tags}>
                  {event.mainEvent.eventType === "MAIN" ? (
                    <span className={styles.mainEventTag}>Main Event</span>
                  ) : (
                    <span className={styles.subEventTag}>Side Event</span>
                  )}
                  {event.subEvents.length > 0 && (
                    <span className={styles.subEventTag}>
                      {event.subEvents.length} Side Events
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.btnContainer}>
                {/* <div className={styles.addButtonContainer}>
                                <div className={styles.heading}>
                                    {event.mainEvent.isLinkedToWidget ? "Added to Widget" : "Add to widget"}
                                </div>
                                <input
                                    type="checkbox"
                                    id={key.toString()}
                                    className={styles.checkboxInput}
                                    checked={event.mainEvent.isLinkedToWidget}
                                    onChange={() => handleAddToWidget(event, event.mainEvent.isLinkedToWidget)}
                                />
                                <label htmlFor={key.toString()} className={styles.checkBox}></label>
                            </div> */}

                {/* <div
                  className={`${
                    event.mainEvent.isLinkedToWidget &&
                    (selectedTemplate === "CVG" || selectedTemplate === "CVL")
                      ? styles.rectangularBorder
                      : ""
                  }`}
                >
                  <div className={styles.addButtonContainer}>
                    <div className={styles.heading}>
                      {event.mainEvent.isLinkedToWidget
                        ? "Added to Widget"
                        : "Add to widget"}
                    </div>

                    <input
                      type="checkbox"
                      id={key.toString()}
                      className={styles.checkboxInput}
                      checked={event.mainEvent.isLinkedToWidget}
                      onChange={() =>
                        handleAddToWidget(
                          event,
                          event.mainEvent.isLinkedToWidget
                        )
                      }
                    />
                    <label
                      htmlFor={key.toString()}
                      className={styles.checkBox}
                    ></label>
                  </div>

                  {(selectedTemplate === "CVG" || selectedTemplate === "CVL") &&
                    event.mainEvent.isLinkedToWidget && (
                      <div className={styles.addEventOptionsContainer}>
                        <span
                          className={`${styles.addOption} ${
                            selectedOption === "list"
                              ? styles.selectedOption
                              : ""
                          }`}
                          onClick={() =>
                            handleAddToWidgetList(
                              event,
                              event.mainEvent.isLinkedToWidget,
                              "list"
                            )
                          }
                        >
                          {selectedOption === "list" && <TickIcon />}
                          <AddeventIcon />
                          {selectedTemplate === "CVL"
                            ? "Add Event to List"
                            : "Add Event to Grid"}
                        </span>
                        <span
                          className={`${styles.addOption} ${
                            selectedOption === "carousel"
                              ? styles.selectedOption
                              : ""
                          }`}
                          onClick={() =>
                            handleAddToWidgetList(
                              event,
                              event.mainEvent.isLinkedToWidget,
                              "carousel"
                            )
                          }
                        >
                          {selectedOption === "carousel" && <TickIcon />}
                          <AddeventToWidgetIcon />
                          <span>Add Event to Carousel</span>
                        </span>
                      </div>
                    )}
                </div> */}

                <div
                  className={`${
                    event.mainEvent.isLinkedToWidget &&
                    (selectedTemplate === "CVG" || selectedTemplate === "CVL")
                      ? styles.rectangularBorder
                      : ""
                  }`}
                >
                  <div className={styles.addButtonContainer}>
                    <div className={styles.heading}>
                      {event.mainEvent.isLinkedToWidget
                        ? "Added to Widget"
                        : "Add to widget"}
                    </div>

                    <input
                      type="checkbox"
                      id={event.mainEvent.eventId.toString()} // Use event.id for uniqueness
                      className={styles.checkboxInput}
                      checked={event.mainEvent.isLinkedToWidget}
                      onChange={() =>
                        handleAddToWidget(
                          event,
                          event.mainEvent.isLinkedToWidget
                        )
                      }
                    />
                    <label
                      htmlFor={event.mainEvent.eventId.toString()}
                      className={styles.checkBox}
                    ></label>
                  </div>

                  {(selectedTemplate === "CVG" || selectedTemplate === "CVL") &&
                    event.mainEvent.isLinkedToWidget && (
                      <div className={styles.addEventOptionsContainer}>
                        {/* Option for List */}
                        <span
                          className={`${styles.addOption} ${
                            selectedOptions[event.mainEvent.eventId] === "list"
                              ? styles.selectedOption
                              : ""
                          }`}
                          onClick={() =>
                            handleAddToWidgetList(
                              event,
                              event.mainEvent.isLinkedToWidget,
                              "list"
                            )
                          }
                        >
                          {selectedOptions[event.mainEvent.eventId] ===
                            "list" && <TickIcon />}
                          <AddeventIcon />
                          {selectedTemplate === "CVL"
                            ? "Add Event to List"
                            : "Add Event to Grid"}
                        </span>

                        {/* Option for Carousel (default when toggled on) */}
                        <span
                          className={`${styles.addOption} ${
                            selectedOptions[event.mainEvent.eventId] ===
                              "carousel" ||
                            (!selectedOptions[event.mainEvent.eventId] &&
                              event.mainEvent.isLinkedToWidget)
                              ? styles.selectedOption
                              : ""
                          }`}
                          onClick={() =>
                            handleAddToWidgetList(
                              event,
                              event.mainEvent.isLinkedToWidget,
                              "carousel"
                            )
                          }
                        >
                          {(selectedOptions[event.mainEvent.eventId] ===
                            "carousel" ||
                            (!selectedOptions[event.mainEvent.eventId] &&
                              event.mainEvent.isLinkedToWidget)) && (
                            <TickIcon />
                          )}
                          <AddeventToWidgetIcon />
                          <span>Add Event to Carousel</span>
                        </span>
                      </div>
                    )}
                </div>

                <div className={styles.delete_spanBtn}>
                  {/* <button onClick={() => handlePrefillNormalEvent(event ,"edit")}><Image src={EditIcon} alt='edit' /></button> */}
                  {/* <div onClick={() => handlePrefillNormalEvent(event, "edit")}><EditIcon /><span>Edit</span></div> */}
                  {/* <button onClick={() => handleDelete(event.mainEvent.eventId)}><DeleteIcon /></button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyScreen}>
          <Image src={EmptyImage} alt="empty" />
          <div>Search or Add your Events</div>
          <span>
            Start by searching for existing events to add to your widgets
          </span>
          <span>or feel free to create your own event from scratch</span>
          {/* <span>Add your events from scratch to add your widget</span> */}
          <div
            className={styles.add_event_button}
            onClick={() => {
              router.push("/widget/events");
            }}
          >
            <span style={{ color: "white" }}>Add Event</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;

function DateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="10"
      viewBox="0 -960 960 960"
      width="10"
    >
      <path
        d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"
        fill="#696B83"
      />
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="10"
      viewBox="0 -960 960 960"
      width="10"
    >
      <path
        d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"
        fill="#696B83"
      />
    </svg>
  );
}
function DeleteIcon() {
  return (
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 3H9.5C9.5 2.60218 9.34196 2.22064 9.06066 1.93934C8.77936 1.65804 8.39782 1.5 8 1.5C7.60218 1.5 7.22064 1.65804 6.93934 1.93934C6.65804 2.22064 6.5 2.60218 6.5 3ZM5.5 3C5.5 2.33696 5.76339 1.70107 6.23223 1.23223C6.70107 0.763392 7.33696 0.5 8 0.5C8.66304 0.5 9.29893 0.763392 9.76777 1.23223C10.2366 1.70107 10.5 2.33696 10.5 3H15.5C15.6326 3 15.7598 3.05268 15.8536 3.14645C15.9473 3.24021 16 3.36739 16 3.5C16 3.63261 15.9473 3.75979 15.8536 3.85355C15.7598 3.94732 15.6326 4 15.5 4H14.446L13.252 14.344C13.1676 15.0752 12.8173 15.7498 12.2679 16.2396C11.7184 16.7293 11.008 16.9999 10.272 17H5.728C4.99195 16.9999 4.28161 16.7293 3.73214 16.2396C3.18266 15.7498 2.8324 15.0752 2.748 14.344L1.554 4H0.5C0.367392 4 0.240215 3.94732 0.146447 3.85355C0.0526785 3.75979 0 3.63261 0 3.5C0 3.36739 0.0526785 3.24021 0.146447 3.14645C0.240215 3.05268 0.367392 3 0.5 3H5.5ZM3.741 14.23C3.79743 14.7174 4.03105 15.167 4.39742 15.4934C4.76379 15.8198 5.23735 16.0001 5.728 16H10.272C10.7627 16.0001 11.2362 15.8198 11.6026 15.4934C11.969 15.167 12.2026 14.7174 12.259 14.23L13.439 4H2.561L3.741 14.23ZM6.5 6.5C6.63261 6.5 6.75979 6.55268 6.85355 6.64645C6.94732 6.74021 7 6.86739 7 7V13C7 13.1326 6.94732 13.2598 6.85355 13.3536C6.75979 13.4473 6.63261 13.5 6.5 13.5C6.36739 13.5 6.24021 13.4473 6.14645 13.3536C6.05268 13.2598 6 13.1326 6 13V7C6 6.86739 6.05268 6.74021 6.14645 6.64645C6.24021 6.55268 6.36739 6.5 6.5 6.5ZM10 7C10 6.86739 9.94732 6.74021 9.85355 6.64645C9.75979 6.55268 9.63261 6.5 9.5 6.5C9.36739 6.5 9.24021 6.55268 9.14645 6.64645C9.05268 6.74021 9 6.86739 9 7V13C9 13.1326 9.05268 13.2598 9.14645 13.3536C9.24021 13.4473 9.36739 13.5 9.5 13.5C9.63261 13.5 9.75979 13.4473 9.85355 13.3536C9.94732 13.2598 10 13.1326 10 13V7Z"
        fill="#DA2F35"
      />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.4997 3.00007L12.9997 5.50007M8.83301 14.6667H15.4997M2.16634 11.3334L1.33301 14.6667L4.66634 13.8334L14.3213 4.17841C14.6338 3.86586 14.8093 3.44201 14.8093 3.00007C14.8093 2.55813 14.6338 2.13429 14.3213 1.82174L14.178 1.67841C13.8655 1.36596 13.4416 1.19043 12.9997 1.19043C12.5577 1.19043 12.1339 1.36596 11.8213 1.67841L2.16634 11.3334Z"
        stroke="#6750A4"
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function AddeventToWidgetIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0H9V9H0V0ZM2 2V7H7V2H2ZM11 0H20V9H11V0ZM13 2V7H18V2H13ZM0 11H9V20H0V11ZM2 13V18H7V13H2ZM14.5 11.5H16.5V14.5H19.5V16.5H16.5V19.5H14.5V16.5H11.5V14.5H14.5V11.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function AddeventIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 21 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 0H0V2.25H18V0ZM18 4.5H0V6.75H18V4.5ZM0 9H9V11.25H0V9ZM9 13.5H0V15.75H9V13.5ZM16.875 12.375H20.25V14.625H16.875V18H14.625V14.625H11.25V12.375H14.625V9H16.875V12.375Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SideventIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.12435 9.04525H5.67578C4.40723 9.04525 3.77251 9.04525 3.37867 8.65096C2.98437 8.25711 2.98438 7.62239 2.98438 6.35384V5.45671M2.98438 5.45671V3.88672M2.98438 5.45671H5.00293"
        stroke="currentColor"
        stroke-width="0.672852"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.47135 4.33529V6.57812M8.59277 5.45671H6.34994M6.12565 9.04525C6.12565 8.51683 6.12565 8.25218 6.2831 8.088C6.44144 7.92383 6.69533 7.92383 7.20221 7.92383H7.7405C8.24783 7.92383 8.50171 7.92383 8.65916 8.088C8.81706 8.25218 8.81706 8.51683 8.81706 9.04525C8.81706 9.57366 8.81706 9.83832 8.65916 10.0025C8.50216 10.1667 8.24783 10.1667 7.7405 10.1667H7.20221C6.69488 10.1667 6.44099 10.1667 6.28355 10.0025C6.12565 9.83832 6.12565 9.57366 6.12565 9.04525ZM2.21683 1.19531H3.75452C4.68575 1.19531 4.77995 1.69322 4.77995 2.54102C4.77995 3.38881 4.6853 3.88672 3.75452 3.88672H2.21683C1.28561 3.88672 1.19141 3.38881 1.19141 2.54102C1.19141 1.69322 1.28605 1.19531 2.21683 1.19531Z"
        stroke="currentColor"
        stroke-width="0.672852"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
function DownArrow() {
  return (
    <svg
      width={8}
      height={8}
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.47124 5.47026C5.34622 5.59524 5.17668 5.66545 4.9999 5.66545C4.82313 5.66545 4.65359 5.59524 4.52857 5.47026L0.757237 1.69893C0.693563 1.63743 0.642775 1.56387 0.607836 1.48253C0.572896 1.40119 0.554505 1.31371 0.553736 1.22519C0.552967 1.13667 0.569835 1.04889 0.603355 0.966957C0.636876 0.885027 0.686378 0.810592 0.748973 0.747996C0.811568 0.685401 0.886003 0.635899 0.967934 0.602379C1.04986 0.568858 1.13765 0.55199 1.22617 0.55276C1.31469 0.553529 1.40217 0.57192 1.48351 0.606859C1.56484 0.641798 1.63841 0.692586 1.6999 0.75626L4.9999 4.05626L8.2999 0.75626C8.42564 0.634821 8.59404 0.567625 8.76884 0.569144C8.94363 0.570663 9.11084 0.640775 9.23445 0.76438C9.35805 0.887986 9.42817 1.05519 9.42969 1.22999C9.43121 1.40479 9.36401 1.57319 9.24257 1.69893L5.47124 5.47026Z"
        fill="white"
      />
    </svg>
  );
}

function InfoSvg() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 8.75H6.41667V5.25H5.25V8.75ZM5.83333 4.08333C5.99861 4.08333 6.13725 4.02733 6.24925 3.91533C6.36125 3.80333 6.41706 3.66489 6.41667 3.5C6.41628 3.33511 6.36028 3.19667 6.24867 3.08467C6.13706 2.97267 5.99861 2.91667 5.83333 2.91667C5.66806 2.91667 5.52961 2.97267 5.418 3.08467C5.30639 3.19667 5.25039 3.33511 5.25 3.5C5.24961 3.66489 5.30561 3.80353 5.418 3.91592C5.53039 4.02831 5.66883 4.08411 5.83333 4.08333ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5134 3.55833 11.207C2.84861 10.9006 2.23125 10.485 1.70625 9.96042C1.18125 9.43581 0.765723 8.81844 0.459667 8.10833C0.153612 7.39822 0.000389627 6.63989 7.38396e-07 5.83333C-0.00038815 5.02678 0.152834 4.26844 0.459667 3.55833C0.766501 2.84822 1.18203 2.23086 1.70625 1.70625C2.23047 1.18164 2.84783 0.766111 3.55833 0.459667C4.26883 0.153222 5.02717 0 5.83333 0C6.6395 0 7.39783 0.153222 8.10833 0.459667C8.81883 0.766111 9.4362 1.18164 9.96042 1.70625C10.4846 2.23086 10.9004 2.84822 11.2076 3.55833C11.5148 4.26844 11.6678 5.02678 11.6667 5.83333C11.6655 6.63989 11.5123 7.39822 11.207 8.10833C10.9017 8.81844 10.4862 9.43581 9.96042 9.96042C9.43464 10.485 8.81728 10.9007 8.10833 11.2076C7.39939 11.5144 6.64106 11.6674 5.83333 11.6667Z"
        fill="#52A8FF"
      />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="14"
      viewBox="0 -960 960 960"
      width="14"
    >
      <path
        d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"
        fill="#0072F5"
      />
    </svg>
  );
}
