import React, { useState } from 'react'
import styles from './filter.style.module.css'
import AllEvents from './AllEvents'
import EventsAdded from './EventsAdded';
import { AddedEventsType } from '@/types/addedwidgetevents';

interface AllEventsType {
    eventId : string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    isLinkedToWidget : boolean;
  }

interface Props{
    fetchedAllEvents : AllEventsType[]
    fetchEvents : () => Promise<void>;
    fetchedAddedEvents : AddedEventsType[]
    fetchAddedEvents : ()=>Promise<void>;
    handlePrefilledAddedEvent : (event : AddedEventsType)=>void
    handleAddEventModal : (value : void)=>void
}

const FilterEvents = ({fetchedAllEvents,fetchEvents,fetchedAddedEvents,fetchAddedEvents,handlePrefilledAddedEvent,handleAddEventModal} : Props) => {

    const [selectedBtn, setSelectedBtn] = useState<string>("allevents")
    return (
        <div className={styles.body}>
            <div className={styles.navbar}>
                <li onClick={() => setSelectedBtn("allevents")} className={selectedBtn === "allevents" ? styles.activeItem : ""}>All Events</li>
                <li onClick={() => setSelectedBtn("addedevents")} className={selectedBtn === "addedevents" ? styles.activeItem : ""}>Events Added</li>
            </div>
            <div className={styles.line}></div>
            <div className={styles.container}>
                {selectedBtn === "allevents" ? <AllEvents fetchAddedEvents={fetchAddedEvents} fetchEvents={fetchEvents} fetchedAllEvents={fetchedAllEvents} handleAddEventModal={handleAddEventModal} /> : <EventsAdded handlePrefilledAddedEvent={handlePrefilledAddedEvent} handleAddEventModal={handleAddEventModal} fetchedAddedEvents={fetchedAddedEvents}/>}
            </div>
        </div>
    )
}

export default FilterEvents