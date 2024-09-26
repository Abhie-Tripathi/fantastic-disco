import React, { useState } from 'react'
import styles from './addevent.style.module.css'
import Appearance from './Appearance/Appearance'
import Details from './Details/Details'
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { AddedEventsType } from '@/types/addedeventtype'
import { AllEventsType } from '@/types/alleventtype'
import { GolbalEventType } from '@/types/globaleventtype'
import AddEventFormTab from './AddEventFormTab'

interface Props {
  setIsAddEventModalOpen: (value: boolean) => void
  widgetId: string;
  fetchEvents: (page: number) => Promise<void>;
  addedEventIds: string[]
  prefilledEvent?: AllEventsType
  prefilledGlobalEvent?: GolbalEventType
}
const AddEvent = ({ setIsAddEventModalOpen, widgetId, fetchEvents, addedEventIds, prefilledEvent, prefilledGlobalEvent }: Props) => {

  const [pageBgColor, setPageBgColor] = useState<string>(prefilledEvent?.customizationData.pageBgColor || "")
  const [eventFont, setEventFont] = useState<string>("Arial")
  const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
  const [eventName, setEventName] = useState<string>(prefilledEvent?.name || prefilledGlobalEvent?.name || "");
  const [cityName, setCityName] = useState<string>(prefilledEvent?.cityName || prefilledGlobalEvent?.cityName || "")
  const [participationType, setParticipationType] = useState<string>(prefilledEvent?.participationType || "")
  const [description, setDescription] = useState<string>(prefilledEvent?.description ||  prefilledGlobalEvent?.description || "")


  return (
    <div className={styles.body}>
      <div className={styles.appearance}><Appearance prefilledEvent={prefilledEvent} cityName={cityName} description={description} eventName={eventName} participationType={participationType} extractedColors={extractedColors} setExtractedColors={setExtractedColors} setEventFont={setEventFont} eventFont={eventFont} setPageBgColor={setPageBgColor} pageBgColor={pageBgColor} /></div>
      <div className={styles.details}>
        <AddEventFormTab setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName} prefilledGlobalEvent={prefilledGlobalEvent} prefilledEvent={prefilledEvent} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor={pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen}/>
        {/* <Details setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName} prefilledGlobalEvent={prefilledGlobalEvent} prefilledEvent={prefilledEvent} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor={pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen} /> */}
      </div>
    </div>
  )
}

export default AddEvent