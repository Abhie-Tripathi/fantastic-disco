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
  fetchAddedEvents: () => Promise<void>;
  addedEventIds: string[]
  fetchedAddedEvents: AddedEventsType[]
  prefilledAddedEvent?: PrefilledAddedEventsType
  prefilledNormalEvent?: AllEventsType
  prefilledGlobalEvent?: GolbalEventType
}
const AddEvent = ({ setIsAddEventModalOpen, widgetId, fetchEvents, addedEventIds, fetchAddedEvents, fetchedAddedEvents, prefilledAddedEvent, prefilledNormalEvent, prefilledGlobalEvent }: Props) => {

  const [pageBgColor, setPageBgColor] = useState<string>(prefilledAddedEvent?.pageBgColor || "rgba(70, 83, 216, 0.1)")
  const [eventFont, setEventFont] = useState<string>("Arial")
  const [extractedColors, setExtractedColors] = useState<string[]>(["#843DF8", "#424FDF", "#1A56F3", "#3097F5", "#0785A2"])
  const [eventName, setEventName] = useState<string>(prefilledAddedEvent?.name || prefilledNormalEvent?.name || prefilledGlobalEvent?.name || "");
  const [cityName, setCityName] = useState<string>(prefilledAddedEvent?.cityName || prefilledNormalEvent?.cityName || prefilledGlobalEvent?.cityName || "")
  const [participationType, setParticipationType] = useState<string>(prefilledAddedEvent?.participationType || prefilledNormalEvent?.participationType || "")
  const [description, setDescription] = useState<string>(prefilledAddedEvent?.description || prefilledNormalEvent?.description || prefilledGlobalEvent?.description || "")


  return (
    <div className={styles.body}>
      <div className={styles.appearance}><Appearance cityName={cityName} description={description} eventName={eventName} participationType={participationType} extractedColors={extractedColors} setExtractedColors={setExtractedColors} setEventFont={setEventFont} eventFont={eventFont} setPageBgColor={setPageBgColor} pageBgColor={pageBgColor} /></div>
      <div className={styles.details}>
        {/* <AddEventFormTab setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName} prefilledGlobalEvent={prefilledGlobalEvent} prefilledNormalEvent={prefilledNormalEvent} prefilledAddedEvent={prefilledAddedEvent} fetchedAddedEvents={fetchedAddedEvents} fetchAddedEvents={fetchAddedEvents} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor= {pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen}/> */}
        <Details setParticipationType={setParticipationType} participationType={participationType} eventName={eventName} setEventName={setEventName} description={description} setDescription={setDescription} cityName={cityName} setCityName={setCityName} prefilledGlobalEvent={prefilledGlobalEvent} prefilledNormalEvent={prefilledNormalEvent} prefilledAddedEvent={prefilledAddedEvent} fetchedAddedEvents={fetchedAddedEvents} fetchAddedEvents={fetchAddedEvents} addedEventIds={addedEventIds} fetchEvents={fetchEvents} widgetId={widgetId} eventFont={eventFont} pageBgColor={pageBgColor} setIsAddEventModalOpen={setIsAddEventModalOpen} />
      </div>
    </div>
  )
}

export default AddEvent