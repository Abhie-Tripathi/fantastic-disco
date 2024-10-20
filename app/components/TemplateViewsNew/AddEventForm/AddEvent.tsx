import React, { useState } from 'react'
import styles from './addevent.style.module.css'
import Appearance from './Appearance/Appearance'
import { AllEventsType, EventsType } from '@/types/alleventtype'
import { GolbalEventType } from '@/types/globaleventtype'
import AddEventFormTab from './AddEventFormTab'
import Placeholder from '/public/placeholder.png'
import { FormState } from '@/types/Formstate'


interface Props {
  setIsAddEventModalOpen: (value: boolean) => void
  widgetId: string;
  eventFlow: string;
  fetchEvents?: (page: number) => Promise<void>;
  addedEventIds: string[]
  prefilledEvent?: EventsType | null
  prefilledGlobalEvent?: GolbalEventType | null;
  prefilledSubEvent?: EventsType | null;
  setPrefilledSubEvent?: (value: EventsType | null) => void
  setEventFlow?: (value: string) => void
  setPrefilledGlobalEvent?: (value: GolbalEventType | null) => void;
  setPrefilledEvent?: (value: EventsType | null) => void;
  fetchEventData?: () => Promise<undefined | null>;
  setChoiceFormModal?:(value:boolean) =>void
  isApproved?:boolean;
  setIsApproved?:(value:boolean) =>void
}
const AddEvent = ({ setIsAddEventModalOpen, widgetId, fetchEvents, addedEventIds, prefilledEvent, prefilledGlobalEvent, eventFlow, setEventFlow, setPrefilledGlobalEvent, setPrefilledEvent, prefilledSubEvent, setPrefilledSubEvent, fetchEventData, setChoiceFormModal,isApproved, setIsApproved  }: Props) => {

  const [pageBgColor, setPageBgColor] = useState<string>(prefilledEvent?.customizationData.pageBgColor || "")
  const [pageGradient, setPageGradient] = useState<string>(prefilledEvent?.customizationData.pageGradient || "")
  const [confettiType, setConfettiType] = useState<string>(prefilledEvent?.customizationData.confettiType || "")
  const [leavesTheme, setLeavesTheme] = useState<boolean>(prefilledEvent?.customizationData.leavesTheme || false)
  const [formTheme, setFormTheme] = useState<string>("light")
  const [eventFont, setEventFont] = useState<string>("Arial")
  const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
  const initialFormState: FormState = {
    parentData: prefilledEvent?.parentData || "",
    descriptionModal: false,
    speakerModal: false,
    registerModal: false,
    eventName: prefilledEvent?.name || prefilledSubEvent?.name || prefilledGlobalEvent?.name || "",
    participationType: prefilledEvent?.participationType || prefilledSubEvent?.participationType || "",
    description: prefilledEvent?.description || prefilledSubEvent?.description || prefilledGlobalEvent?.description || "",
    textValue: prefilledEvent?.description || prefilledSubEvent?.description || prefilledGlobalEvent?.description || "",
    cityName: prefilledEvent?.cityName || prefilledSubEvent?.cityName || prefilledGlobalEvent?.cityName || "",
    speaker: prefilledEvent?.customizationData.speaker || [],
    prefilledProfile: undefined,
    registerMessage: prefilledEvent?.customizationData.registerMessage || prefilledSubEvent?.customizationData.registerMessage || 'Welcome! To join the event, please register below.',
    registerBtnText: prefilledEvent?.customizationData.registerBtnText || prefilledSubEvent?.customizationData.registerBtnText || 'Register',
    registerBtnColor: prefilledEvent?.customizationData.registerBtnColor || prefilledSubEvent?.customizationData.registerBtnColor || '#1a1a1a',
    countryName: prefilledEvent?.countryName || prefilledSubEvent?.countryName || prefilledGlobalEvent?.countryName || '',
    timeZone: prefilledEvent?.gmtZone || prefilledSubEvent?.gmtZone || 'GMT+05:30 Chennai',
    timeZoneKey: 1,
    startDate: prefilledEvent?.startDate || prefilledSubEvent?.startDate || prefilledGlobalEvent?.startDate || '',
    endDate: prefilledEvent?.endDate || prefilledSubEvent?.endDate || prefilledGlobalEvent?.endDate || '',
    startTime: prefilledEvent?.startTime || prefilledSubEvent?.startTime || '12:00 A.M',
    endTime: prefilledEvent?.endTime || prefilledSubEvent?.endTime || '12:00 A.M',
    eventFormat: prefilledEvent?.customizationData.eventFormat || prefilledSubEvent?.customizationData.eventFormat || prefilledGlobalEvent?.format || "In-person",
    boothNumber: prefilledEvent?.customizationData.boothNumber || prefilledSubEvent?.customizationData.boothNumber || "",
    participationMessage: prefilledEvent?.customizationData.participationMessage || prefilledSubEvent?.customizationData.participationMessage || "",
    banner: { placeHolder: prefilledEvent?.logoUrl || prefilledSubEvent?.logoUrl || Placeholder, file: null }, // Customize placeholder as needed
    venue: prefilledEvent?.customizationData.venue || prefilledSubEvent?.customizationData.venue || prefilledGlobalEvent?.venue || "",
    latitude: Number(prefilledEvent?.latitude || prefilledSubEvent?.latitude || prefilledGlobalEvent?.latitude) || 37.7749,
    longitude: Number(prefilledEvent?.longitude || prefilledSubEvent?.longitude || prefilledGlobalEvent?.longitude) || -122.4194,
    hashtags: prefilledEvent?.customizationData.hashtags.split(",") || prefilledSubEvent?.customizationData.hashtags.split(",") || [],
    query: '',
    isEventNameEmpty: false,
    isEventFormatEmpty: false,
    isEventDescriptionEmpty: false,
    isEventParticipationEmpty: false,
    isParticipationMessageEmpty: false,
    isTextValueMessageEmpty: false,
    errorMessage: 'Event name is required.',
    capacity:0,
    registration:true,
    approval:false,
    waitlisting:false,
    // capacityModalClose:false,
    // capacityModalOpen:false
    capacityModal:false,
    virtualLink:""
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
      <div className={styles.appearance}><Appearance setLeavesTheme={setLeavesTheme} confettiType={confettiType} setFormTheme={setFormTheme} setConfettiType={setConfettiType} setPageGradient={setPageGradient} eventNameSub={subeventState.eventName} participationTypeSub={subeventState.participationType} descriptionSub={subeventState.description} cityNameSub={subeventState.cityName} prefilledEvent={prefilledEvent} cityNameMain={mainEventState.cityName} descriptionMain={mainEventState.description} eventNameMain={mainEventState.eventName} participationTypeMain={mainEventState.participationType} extractedColors={extractedColors} setExtractedColors={setExtractedColors} setEventFont={setEventFont} eventFont={eventFont} setPageBgColor={setPageBgColor} pageBgColor={pageBgColor} /></div>
      <div className={styles.details}>
        <AddEventFormTab leavesTheme={leavesTheme} formTheme={formTheme} confettiType={confettiType} pageGradient={pageGradient} setPrefilledSubEvent={setPrefilledSubEvent} prefilledSubEvent={prefilledSubEvent} setPrefilledEvent={setPrefilledEvent} setPrefilledGlobalEvent={setPrefilledGlobalEvent} setEventFlow={setEventFlow} eventFlow={eventFlow} fetchEventData={fetchEventData}
          // setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName}
          prefilledGlobalEvent={prefilledGlobalEvent} prefilledEvent={prefilledEvent} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor={pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen} mainEventState={mainEventState} subEventState={subeventState} handleMaineventChanges={handleMaineventChanges} handleSubeventChange={handleSubeventChange} setChoiceFormModal={setChoiceFormModal}/>
        {/* <Details setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName} prefilledGlobalEvent={prefilledGlobalEvent} prefilledEvent={prefilledEvent} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor={pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen} /> */}
      </div>
    </div>
  )
}

export default AddEvent