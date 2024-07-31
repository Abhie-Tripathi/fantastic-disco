import React, { useState } from 'react'
import styles from './filter.style.module.css'
import AllEvents from './AllEvents'
import EventsAdded from './EventsAdded';

interface AllEventsType {
    eventId : string;
    name: string;
    location: string;
    startDate: string;
    endDate: string;
  }

interface Props{
    setIsAddEventModalOpen : (value : boolean)=>void
    fetchedAllEvents : AllEventsType[]
    fetchEvents : () => Promise<void>; 
}

const FilterEvents = ({setIsAddEventModalOpen,fetchedAllEvents,fetchEvents} : Props) => {

    const [selectedBtn, setSelectedBtn] = useState<string>("allevents")
    return (
        <div className={styles.body}>
            <div className={styles.navbar}>
                <li onClick={() => setSelectedBtn("allevents")} className={selectedBtn === "allevents" ? styles.activeItem : ""}>All Events</li>
                <li onClick={() => setSelectedBtn("addedevents")} className={selectedBtn === "addedevents" ? styles.activeItem : ""}>Events Added</li>
            </div>
            <div className={styles.line}></div>
            <div className={styles.container}>
                {selectedBtn === "allevents" ? <AllEvents fetchEvents={fetchEvents} fetchedAllEvents={fetchedAllEvents} setIsAddEventModalOpen={setIsAddEventModalOpen} /> : <EventsAdded setIsAddEventModalOpen={setIsAddEventModalOpen}/>}
            </div>
        </div>
    )
}

export default FilterEvents