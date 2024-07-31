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

interface AllEventsType {
  eventId : string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}

const Page = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [cardBgColor, setCardBgColor] = useState<string>("#d4d4d4");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(20);
  const [fontSettings, setFontSettings] = useState({
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "normal" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "normal" }
  });
  const [buttonSettings, setButtonSettings] = useState({
    primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
    secondary: { buttonColor: "#6750a4", fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
  })

  const [cardStyle, setCardStyle] = useState<string>("style1")
  const [selectedBtn, setSelectedBtn] = useState<"primary" | "secondary">("primary");
  const [selectedTemplate, setSelectedTemplate] = useState<string>()

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false)

  const [fetchedAllEvents, setFetchedAllEvents] = useState<AllEventsType[]>([])

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

  const fetchEvents = async()=>{
    const {data, error} = await myFetch(`${baseUrl}/event`)
    if(data){
        const events = data.data.map((event : any)=>({
            eventId : event.id,
            name: event.name,
            location: event.data.location_city,
            startDate: event.data.startDate,
            endDate: event.data.endDate,
        }))
        setFetchedAllEvents(events)
    }if(error){
        console.log(error)
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
      }
      if (error) {
        console.error("Error fetching widget data:", error);
      }
    }

    fetchWidgetData();
    fetchEvents();
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
  return (

    <div className={`${styles.body} ${isAddEventModalOpen ? styles.modalOpen : ""}`}>
      <ToastContainer />
      <div className={styles.editContainer}>
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
          setIsAddEventModalOpen={setIsAddEventModalOpen}
          fetchedAllEvents = {fetchedAllEvents}
          fetchEvents = {fetchEvents}
        />
      </div>
      <div className={styles.previewContainer}>
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
        />
      </div>
      {isAddEventModalOpen && <div className={styles.blackScreen}></div>}
      {isAddEventModalOpen && <div className={styles.addEventModal}>
        <AddEvent fetchEvents = {fetchEvents} widgetId={widgetId} setIsAddEventModalOpen={setIsAddEventModalOpen} />
      </div>}
    </div>
  )
}

export default Page