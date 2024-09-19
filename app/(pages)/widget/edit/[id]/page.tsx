'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import PreviewWindow from '@/app/components/TemplateViewsNew/TemplatesPreview/PreviewWindow'
import EditScreen from '@/app/components/TemplateViewsNew/EditScreen/EditScreen'
import AddEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddEvent'
import { usePathname } from 'next/navigation'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes'
import { AllEventsType } from '@/types/alleventtype'
import { AddedEventsType } from '@/types/addedeventtype'
import AddNormalEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddNormalEvent'
import { GolbalEventType } from '@/types/globaleventtype'
import Errorpage from '@/app/components/TemplateViewsNew/Errorpage'
import { useTheme } from '@/context'

const Page = () => {
  const { theme } = useTheme()
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [cardBgColor, setCardBgColor] = useState<string>("#d4d4d4");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(20);
  const [fontSettings, setFontSettings] = useState({
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bold" },
    subheading: { fontFamily: "arial", fontSize: 14, fontColor: "#000000", fontWeight: "normal" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "normal" }
  });
  const [buttonSettings, setButtonSettings] = useState<ButtonSettingsState>({
    primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
    secondary: { fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
  })

  const [cardStyle, setCardStyle] = useState<string>("style1")
  const [selectedBtn, setSelectedBtn] = useState<"primary" | "secondary">("primary");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false)
  const [isNormalEventModalOpen, setIsNormalEventModalOpen] = useState<boolean>(false)
  const [fetchedAllEvents, setFetchedAllEvents] = useState<AllEventsType[]>([])
  const [fetchedAddedEvents, setfetchedAddedEvents] = useState<AddedEventsType[]>([])
  const [addedEventIds, setAddedEventIds] = useState<string[]>([]);
  const [widgetType, setWidgetType] = useState<string>("");
  const [prefilledAddedEvent, setPrefilledAddedEvent] = useState<PrefilledAddedEventsType>()
  const [prefilledNormalEvent, setPrefilledNormalEvent] = useState<AllEventsType>()
  const [prefilledGlobalEvent, setPrefilledGlobalEvent] = useState<GolbalEventType>()
  const [isValid, setIsValid] = useState(true); // Track if the data is valid
  const [loading, setLoading] = useState(true); // Track loading state
  const [allEventsCount, setAllEventsCount] = useState<number>(0)

  const pathName = usePathname();
  const trackerParams = pathName.split("/");
  const widgetId = trackerParams[3]

  const asciiToString = (ascii: number): string => {
    let convertedValue = ascii.toString();
    let str = '';
    for (let i = 0; i < convertedValue.length; i += 2) {
      const code = convertedValue.substring(i, i + 2);
      str += String.fromCharCode(parseInt(code, 10));
    }
    return str;
  };


  // This function is fetching all the events regardless added in the widget or not
  const fetchEvents = async (page: number, type? : string) => {
    const { data, error } = await myFetch(`${baseUrl}/event?widgetId=${widgetId}&offset=${page}&limit=8`)
    if (data) {
      const events: AllEventsType[] = data.data.map((event: any) => ({
        eventId: event.id,
        name: event.name,
        cityName: event.data.location_city,
        countryName: event.data.location_country,
        description: event.data.description,
        startDate: event.data.start_date,
        endDate: event.data.end_date,
        format: event.data.format,
        isLinkedToWidget: event.isWidgetLinked,
        startTime: event.data.start_time,
        endTime: event.data.end_time,
        gmtZone: event.data.gmt_time,
        latitude: event.data.latitude,
        longitude: event.data.longitude,
        participationType: event.data.participationType
      }))
      if(type === "update"){ // So basically this fetchEvents() function is called in many pages, we want to make sure if we are calling this function when some task if performed like, deleting an event or updating an event or adding an event, we only need to add the updated events and not the prev events + new events
        setFetchedAllEvents(events)
      }else{
        setFetchedAllEvents(prevEvents => [...prevEvents, ...events]);
      }

      setAllEventsCount(data.totalCount)
    } if (error) {
      console.log(error)
    }
  }

  // Function for fetching the added events in widget
  const fetchAddedEvents = async () => {
    const { data, error } = await myFetch(`${baseUrl}/widget/${widgetId}`)
    if (data) {
      const events = data.otherdata?.event;
      setfetchedAddedEvents(events);
    }
    if (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    const fetchWidgetData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/widget/${widgetId}`);
      if (!data) {
        console.log("data not found")
        setIsValid(false);
      }
      else {
        setCardBgColor(data.customizationData.cardBgColor);
        setCardBorderRadius(data.customizationData.cardBorderRadius);
        setFontSettings(data.customizationData.fontSettings);
        setButtonSettings(data.customizationData.buttonSettings);
        setCardStyle(data.customizationData.selectedCard);
        setSelectedBtn(data.customizationData.selectedBtn);
        setSelectedTemplate(asciiToString(data.templatePublicId));
        setAddedEventIds(data.eventId.map((obj: { id: string }) => obj.id));
        setWidgetType(data.type)
        setfetchedAddedEvents( data.otherdata?.event);
      }
      setLoading(false);
    }
    fetchWidgetData();
    fetchEvents(0);
    // fetchAddedEvents();
  }, [])

  const handleUpdateCustomization = async () => {
    const customizeData = new FormData();
    const customizationData = {
      fontSettings,
      buttonSettings,
      cardBgColor,
      cardBorderRadius,
      selectedBtn,
      selectedCard: cardStyle,
    };
    customizeData.append("widgetId", widgetId)
    customizeData.append('customizationData', JSON.stringify(customizationData));
    const { data, error } = await myFetch(
      `${baseUrl}/widget`,
      {
        method: 'POST',
        body: customizeData,
      }
    );
    if (data) {
      console.log(data);
      toast.success("Widget updated successfully!");
    } else {
      toast.error("Failed to update widget.");
      console.log(error);
    }
  }

  const handleAddEventModal = () => {
    setPrefilledAddedEvent(undefined)
    setPrefilledNormalEvent(undefined)
    setPrefilledGlobalEvent(undefined)
    setIsAddEventModalOpen(true)
  }
  const handleNormalEventModal = () => {
    setPrefilledNormalEvent(undefined)
    setIsNormalEventModalOpen(true)
  }

  const handlePrefilledAddedEvent = (event: PrefilledAddedEventsType) => {
    setPrefilledAddedEvent(event)
    setIsAddEventModalOpen(true)
  }

  const handlePrefillNormalEvent = (event: AllEventsType, type: string) => {
    setPrefilledNormalEvent(event)
    if (type === "add") {
      setIsAddEventModalOpen(true)
    } else setIsNormalEventModalOpen(true)

  }
  const handlePrefillGlobalEvent = (event: GolbalEventType, type: string) => {
    setPrefilledGlobalEvent(event)
    if (type === "widget") {
      setIsAddEventModalOpen(true)
    } else setIsNormalEventModalOpen(true)

  }
  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  if (!isValid) {
    return <div className={styles.errorPage}><Errorpage type='id' /></div>; // Render the 404 component if the data is invalid
  }
  return (

    <div className={`${styles.body} ${isAddEventModalOpen || isNormalEventModalOpen ? styles.modalOpen : ""}`}>
      <ToastContainer />
      {!isFullScreen && <div className={styles.editContainer}>
        <EditScreen
          selectedTemplate={selectedTemplate}
          handleUpdateCustomization={handleUpdateCustomization}
          selectedBtn={selectedBtn}
          setSelectedBtn={setSelectedBtn}
          cardStyle={cardStyle}
          setCardStyle={setCardStyle}
          setCardBgColor={setCardBgColor}
          setCardBorderRadius={setCardBorderRadius}
          setFontSettings={setFontSettings}
          fontSettings={fontSettings}
          setButtonSettings={setButtonSettings}
          buttonSettings={buttonSettings}
          cardBgColor={cardBgColor}
          cardBorderRadius={cardBorderRadius}
          fetchedAllEvents={fetchedAllEvents}
          fetchEvents={fetchEvents}
          fetchedAddedEvents={fetchedAddedEvents}
          fetchAddedEvents={fetchAddedEvents}
          widgetId={widgetId}
          widgetType={widgetType}
          handlePrefilledAddedEvent={handlePrefilledAddedEvent}
          handlePrefillNormalEvent={handlePrefillNormalEvent}
          handlePrefillGlobalEvent={handlePrefillGlobalEvent}
          handleAddEventModal={handleAddEventModal}
          addedEventIds={addedEventIds}
          handleNormalEventModal={handleNormalEventModal}
          allEventsCount = {allEventsCount}
        />
      </div>}
      <div className={`${styles.previewContainer} ${isFullScreen ? styles.fullPreview : ""}`}>
        <PreviewWindow
          widgetId={widgetId}
          smallCard={false}
          selectedBtn={selectedBtn}
          selectedTemplate={selectedTemplate}
          selectedCard={cardStyle}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          cardBgColor={cardBgColor}
          cardBorderRadius={cardBorderRadius}
          fontSettings={fontSettings}
          buttonSettings={buttonSettings}
          fetchedAddedEvents={fetchedAddedEvents}
        />
      </div>
      {(isAddEventModalOpen || isNormalEventModalOpen) && <div className={styles.blackScreen}></div>}
      {isAddEventModalOpen && <div className={styles.addEventModal}>
        <AddEvent prefilledGlobalEvent={prefilledGlobalEvent} prefilledNormalEvent={prefilledNormalEvent} prefilledAddedEvent={prefilledAddedEvent} fetchedAddedEvents={fetchedAddedEvents} addedEventIds={addedEventIds} fetchAddedEvents={fetchAddedEvents} fetchEvents={fetchEvents} widgetId={widgetId} setIsAddEventModalOpen={setIsAddEventModalOpen} />
      </div>}
      {isNormalEventModalOpen && <div className={styles.addNormalEventModal}>
        <AddNormalEvent theme={theme === "dark" ? "dark" : "light"} prefilledGlobalEvent={prefilledGlobalEvent} prefilledNormalEvent={prefilledNormalEvent} fetchEvents={fetchEvents} setIsNormalEventModalOpen={setIsNormalEventModalOpen} fetchAddedEvents={fetchAddedEvents}/>
      </div>}
    </div>
  )
}

export default Page