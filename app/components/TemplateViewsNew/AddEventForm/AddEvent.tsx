import React, { useState } from 'react'
import styles from './addevent.style.module.css'
import Appearance from './Appearance/Appearance'
import { AllEventsType } from '@/types/alleventtype'
import { GolbalEventType } from '@/types/globaleventtype'
import AddEventFormTab from './AddEventFormTab'
import Placeholder from '/public/placeholder.png'
import { FormState } from '@/types/Formstate'

interface Props {
  setIsAddEventModalOpen: (value: boolean) => void
  widgetId: string;
  eventFlow: string;
  fetchEvents: (page: number) => Promise<void>;
  addedEventIds: string[]
  prefilledEvent?: AllEventsType
  prefilledGlobalEvent?: GolbalEventType;
  setEventFlow: (value: string) => void
}
const AddEvent = ({ setIsAddEventModalOpen, widgetId, fetchEvents, addedEventIds, prefilledEvent, prefilledGlobalEvent, eventFlow, setEventFlow }: Props) => {

  const [pageBgColor, setPageBgColor] = useState<string>(prefilledEvent?.mainEvent.customizationData.pageBgColor || "")
  const [eventFont, setEventFont] = useState<string>("Arial")
  const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
  const initialFormState: FormState = {
    descriptionModal : false,
    speakerModal : false,
    registerModal : false,
    eventName: prefilledEvent?.mainEvent.name || prefilledGlobalEvent?.name || "",
    participationType: prefilledEvent?.mainEvent.participationType || "",
    description: prefilledEvent?.mainEvent.description || prefilledGlobalEvent?.description || "",
    textValue :  prefilledEvent?.mainEvent.description || prefilledGlobalEvent?.description || "",
    cityName: prefilledEvent?.mainEvent.cityName || prefilledGlobalEvent?.cityName || "",
    speakerProfilesData: [],
    prefilledProfile: undefined,
    registerMessage: prefilledEvent?.mainEvent.customizationData.registerMessage || 'Welcome! To join the event, please register below.',
    registerBtnText: prefilledEvent?.mainEvent.customizationData.registerBtnText || 'Register',
    registerBtnColor: prefilledEvent?.mainEvent.customizationData.registerBtnColor || '#1a1a1a',
    countryName: prefilledEvent?.mainEvent.countryName || prefilledGlobalEvent?.countryName || '',
    timeZone: prefilledEvent?.mainEvent.gmtZone || 'GMT+05:30 Chennai',
    timeZoneKey: 1,
    startDate: prefilledEvent?.mainEvent.startDate || prefilledGlobalEvent?.startDate || '',
    endDate: prefilledEvent?.mainEvent.endDate || prefilledGlobalEvent?.endDate || '',
    startTime: prefilledEvent?.mainEvent.startTime || '12:00 A.M',
    endTime: prefilledEvent?.mainEvent.endTime || '12:00 A.M',
    eventFormat: prefilledEvent?.mainEvent.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person",
    boothNumber: prefilledEvent?.mainEvent.customizationData.boothNumber || "",
    participationMessage: prefilledEvent?.mainEvent.customizationData.participationMessage || "",
    banner: { placeHolder: prefilledEvent?.mainEvent.logoUrl || Placeholder, file: null }, // Customize placeholder as needed
    venue: prefilledEvent?.mainEvent.customizationData.venue || prefilledGlobalEvent?.venue || "",
    latitude: Number(prefilledEvent?.mainEvent.latitude || prefilledGlobalEvent?.latitude) || 37.7749,
    longitude: Number(prefilledEvent?.mainEvent.longitude || prefilledGlobalEvent?.longitude) || -122.4194,
    hashtags: prefilledEvent?.mainEvent.customizationData.hashtags.split(",") || [],
    query: '',
    isEventNameEmpty: false,
    isEventFormatEmpty: false,
    isEventDescriptionEmpty: false,
    isEventParticipationEmpty: false,
    isParticipationMessageEmpty: false,
    isTextValueMessageEmpty: false,
    errorMessage: 'Event name is required.',
  };
  const [mainEventState, setMainEventState] = useState<FormState>(initialFormState);
  const [subeventState, setSubeventState] = useState<FormState>(initialFormState);
  // const [eventName, setEventName] = useState<string>(prefilledEvent?.name || prefilledGlobalEvent?.name || "");
  // const [cityName, setCityName] = useState<string>(prefilledEvent?.cityName || prefilledGlobalEvent?.cityName || "")
  // const [participationType, setParticipationType] = useState<string>(prefilledEvent?.participationType || "")
  // const [description, setDescription] = useState<string>(prefilledEvent?.description ||  prefilledGlobalEvent?.description || "")
  const handleMaineventChanges = (field: keyof FormState, value: any) => {
    setMainEventState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubeventChange = (field: keyof FormState, value: any) => {
    setSubeventState((prev) => ({ ...prev, [field]: value }));
  };


  return (
    <div className={styles.body}>
      <div className={styles.appearance}><Appearance eventNameSub={subeventState.eventName} participationTypeSub={subeventState.participationType} descriptionSub={subeventState.description} cityNameSub={subeventState.cityName} prefilledEvent={prefilledEvent} cityNameMain={mainEventState.cityName} descriptionMain={mainEventState.description} eventNameMain={mainEventState.eventName} participationTypeMain={mainEventState.participationType} extractedColors={extractedColors} setExtractedColors={setExtractedColors} setEventFont={setEventFont} eventFont={eventFont} setPageBgColor={setPageBgColor} pageBgColor={pageBgColor} /></div>
      <div className={styles.details}>
        <AddEventFormTab setEventFlow={setEventFlow} eventFlow={eventFlow} 
        // setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName}
         prefilledGlobalEvent={prefilledGlobalEvent} prefilledEvent={prefilledEvent} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor={pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen} mainEventState={mainEventState} subEventState={subeventState} handleMaineventChanges={handleMaineventChanges} handleSubeventChange={handleSubeventChange}/>
        {/* <Details setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName} prefilledGlobalEvent={prefilledGlobalEvent} prefilledEvent={prefilledEvent} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor={pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen} /> */}
      </div>
    </div>
  )
}

export default AddEvent