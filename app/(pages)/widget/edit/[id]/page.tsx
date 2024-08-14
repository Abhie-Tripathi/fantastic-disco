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
import { ButtonSettingsState} from '@/types/buttoncustomizetypes'
import { AllEventsType } from '@/types/alleventtype'
import { AddedEventsType } from '@/types/addedeventtype'

const Page = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [cardBgColor, setCardBgColor] = useState<string>("#d4d4d4");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(20);
  const [fontSettings, setFontSettings] = useState({
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "normal" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "normal" }
  });
  const [buttonSettings, setButtonSettings] = useState<ButtonSettingsState>({
    primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
    secondary: { fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
  })

  const [cardStyle, setCardStyle] = useState<string>("style1")
  const [selectedBtn, setSelectedBtn] = useState<"primary" | "secondary">("primary");
  const [selectedTemplate, setSelectedTemplate] = useState<string>()
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false)
  const [fetchedAllEvents, setFetchedAllEvents] = useState<AllEventsType[]>([])
  const [fetchedAddedEvents, setfetchedAddedEvents] = useState<AddedEventsType[]>([])
  const [addedEventIds, setAddedEventIds] = useState<string[]>([]);
  const [widgetType, setWidgetType] = useState<string>("");
  const [prefilledAddedEvent, setPrefilledAddedEvent] = useState<PrefilledAddedEventsType>()
  const [prefilledNormalEvent, setPrefilledNormalEvent] = useState<AllEventsType>()

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
  const fetchEvents = async () => {
    const { data, error } = await myFetch(`${baseUrl}/event?widgetId=${widgetId}`)
    if (data) {
      const events : AllEventsType[] = data.data.map((event: any) => ({
        eventId: event.id,
        name: event.name,
        cityName: event.data.location_city,
        countryName : event.data.location_country,
        description : event.data.description,
        startDate: event.data.start_date,
        endDate: event.data.end_date,
        format : event.data.format,
        isLinkedToWidget: event.isWidgetLinked,
        startTime : event.data.startTime,
        endTime : event.data.endTime,
        gmtZone : event.data.gmt_time,
        participationType : event.data.participationType,
      }))
      setFetchedAllEvents(events)
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
      if (data) {
        setCardBgColor(data.customizationData.cardBgColor);
        setCardBorderRadius(data.customizationData.cardBorderRadius);
        setFontSettings(data.customizationData.fontSettings);
        setButtonSettings(data.customizationData.buttonSettings);
        setCardStyle(data.customizationData.selectedCard);
        setSelectedBtn(data.customizationData.selectedBtn);
        setSelectedTemplate(asciiToString(data.templatePublicId));
        setAddedEventIds(data.eventId.map((obj: { id: string }) => obj.id));
        setWidgetType(data.type)
      }
      if (error) {
        console.error("Error fetching widget data:", error);
      }
    }

    fetchWidgetData();
    fetchEvents();
    fetchAddedEvents();
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
    setIsAddEventModalOpen(true)
  }

  const handlePrefilledAddedEvent = (event: PrefilledAddedEventsType) => {
    setPrefilledAddedEvent(event)
    setIsAddEventModalOpen(true)
  }

  const handlePrefillNormalEvent = (event : AllEventsType) =>{
    setPrefilledNormalEvent(event)
    setIsAddEventModalOpen(true)
  }
  
  return (

    <div className={`${styles.body} ${isAddEventModalOpen ? styles.modalOpen : ""}`}>
      <ToastContainer />
      {!isFullScreen && <div className={styles.editContainer}>
        <EditScreen
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
          handlePrefillNormalEvent = {handlePrefillNormalEvent}
          handleAddEventModal={handleAddEventModal}
          addedEventIds = {addedEventIds}
        />
      </div>}
      <div className={`${styles.previewContainer} ${isFullScreen ? styles.fullPreview : ""}`}>
        <PreviewWindow
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
      {isAddEventModalOpen && <div className={styles.blackScreen}></div>}
      {isAddEventModalOpen && <div className={styles.addEventModal}>
        <AddEvent prefilledNormalEvent={prefilledNormalEvent} prefilledAddedEvent={prefilledAddedEvent} fetchedAddedEvents={fetchedAddedEvents} addedEventIds={addedEventIds} fetchAddedEvents={fetchAddedEvents} fetchEvents={fetchEvents} widgetId={widgetId} setIsAddEventModalOpen={setIsAddEventModalOpen} />
      </div>}
    </div>
  )
}

export default Page