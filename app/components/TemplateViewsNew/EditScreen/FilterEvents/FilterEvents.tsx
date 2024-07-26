import React, { useState } from 'react'
import styles from './filter.style.module.css'
import AllEvents from './AllEvents'
import EventsAdded from './EventsAdded';

interface AllEventsType {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
}

interface Props{
    setIsAddEventModalOpen : (value : boolean)=>void
}

const FilterEvents = ({setIsAddEventModalOpen} : Props) => {

    // We will be having the events data here and will be sending them as props to all events

    const allEvents: AllEventsType[] = [{ name: "East Midlands Young Planners Summer Social 2024", location: "Nottingham, UK", startDate: "1st  Apr 2024", endDate: "30th  Apr 2024" },
    { name: "East Midlands Young Planners Summer Social 2024", location: "Nottingham, UK", startDate: "1st  Apr 2024", endDate: "30th  Apr 2024" },
    { name: "East Midlands Young Planners Summer Social 2024", location: "Nottingham, UK", startDate: "1st  Apr 2024", endDate: "30th  Apr 2024" },
    { name: "East Midlands Young Planners Summer Social 2024", location: "Nottingham, UK", startDate: "1st  Apr 2024", endDate: "30th  Apr 2024" }
    ]

    const [selectedBtn, setSelectedBtn] = useState<string>("allevents")
    return (
        <div className={styles.body}>
            <div className={styles.navbar}>
                <li onClick={() => setSelectedBtn("allevents")} className={selectedBtn === "allevents" ? styles.activeItem : ""}>All Events</li>
                <li onClick={() => setSelectedBtn("addedevents")} className={selectedBtn === "addedevents" ? styles.activeItem : ""}>Events Added</li>
            </div>
            <div className={styles.line}></div>
            <div className={styles.container}>
                {selectedBtn === "allevents" ? <AllEvents setIsAddEventModalOpen={setIsAddEventModalOpen} allEvents={allEvents} /> : <EventsAdded setIsAddEventModalOpen={setIsAddEventModalOpen} allEvents={allEvents}/>}
            </div>
        </div>
    )
}

export default FilterEvents