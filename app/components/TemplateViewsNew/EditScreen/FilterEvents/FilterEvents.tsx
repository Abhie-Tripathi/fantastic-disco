import React, { useState } from 'react'
import styles from './filter.style.module.css'
import AllEvents from './AllEvents'
import EventsAdded from './EventsAdded';
import { AddedEventsType } from '@/types/addedeventtype';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype';
import { AllEventsType } from '@/types/alleventtype';

interface Props{
    fetchedAllEvents : AllEventsType[]
    fetchEvents : () => Promise<void>;
    fetchedAddedEvents : AddedEventsType[]
    fetchAddedEvents : ()=>Promise<void>;
    handlePrefilledAddedEvent : (event : PrefilledAddedEventsType)=>void
    handlePrefillNormalEvent : (event :  AllEventsType)=>void
    handleAddEventModal : (value : void)=>void
    widgetId : string;
    addedEventIds : string[]
}

const FilterEvents = ({fetchedAllEvents,fetchEvents,fetchedAddedEvents,fetchAddedEvents,handlePrefilledAddedEvent,handleAddEventModal,widgetId,addedEventIds,handlePrefillNormalEvent} : Props) => {

    const [selectedBtn, setSelectedBtn] = useState<string>("allevents")
    return (
        <div className={styles.body}>
            <div className={styles.navbar}>
                <li onClick={() => setSelectedBtn("allevents")} className={selectedBtn === "allevents" ? styles.activeItem : ""}>All Events</li>
                <li onClick={() => setSelectedBtn("addedevents")} className={selectedBtn === "addedevents" ? styles.activeItem : ""}>Events Added</li>
            </div>
            <div className={styles.line}></div>
            <div className={styles.container}>
                {selectedBtn === "allevents" ? <AllEvents widgetId={widgetId} handlePrefillNormalEvent={handlePrefillNormalEvent} fetchAddedEvents={fetchAddedEvents} fetchEvents={fetchEvents} fetchedAllEvents={fetchedAllEvents} handleAddEventModal={handleAddEventModal} /> : <EventsAdded fetchAddedEvents={fetchAddedEvents} widgetId={widgetId} fetchEvents={fetchEvents} handlePrefilledAddedEvent={handlePrefilledAddedEvent} handleAddEventModal={handleAddEventModal} fetchedAddedEvents={fetchedAddedEvents}/>}
            </div>
        </div>
    )
}

export default FilterEvents