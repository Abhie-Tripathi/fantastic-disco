import React, { useState } from 'react'
import styles from './filter.style.module.css'
import AllEvents from './AllEvents'
import EventsAdded from './EventsAdded';
import { AddedEventsType } from '@/types/addedeventtype';
import { AllEventsType } from '@/types/alleventtype';

interface Props{
    fetchedAllEvents : AllEventsType[]
    fetchEvents : (page : number) => Promise<void>;
    fetchedAddedEvents : AddedEventsType[]
    fetchAddedEvents : ()=>Promise<void>;
    // handlePrefillEvent : (event :  AllEventsType , type : string)=>void
    widgetId : string;
    addedEventIds : string[]
    allEventsCount : number;
    selectedTemplate : string;

    isCustomisationWindowDisable:boolean
    setIsCustomisationWindowDisable:(value: boolean) => void;
    isCodeWindowDisable:boolean
    setIsCodeWindowDisable:(value: boolean) => void;

}

const FilterEvents = ({fetchedAllEvents,fetchEvents,fetchedAddedEvents,fetchAddedEvents,
    // handlePrefillEvent,
    widgetId,addedEventIds, allEventsCount, selectedTemplate, isCustomisationWindowDisable,setIsCustomisationWindowDisable,isCodeWindowDisable,setIsCodeWindowDisable} : Props) => {

    const [selectedBtn, setSelectedBtn] = useState<string>("allevents")
    const [promotedEvents, setPromotedEvents] = useState<string[]>([]);
    const [normalEvents, setNormalEvents] = useState([])

    return (
        <div className={styles.body}>
            <div className={styles.navbar}>
                <li onClick={() => setSelectedBtn("allevents")} className={selectedBtn === "allevents" ? styles.activeItem : ""}>All Events <span className={styles.count}>{allEventsCount}</span></li>
                <li onClick={() => setSelectedBtn("addedevents")} className={selectedBtn === "addedevents" ? styles.activeItem : ""}>Events Added <span className={styles.count}>{fetchedAddedEvents?.length || 0}</span></li>
            </div>
            <div className={styles.line}></div>
            <div className={styles.container}>
                {selectedBtn === "allevents" ? <AllEvents
                promotedEvents={promotedEvents}
                setPromotedEvents={setPromotedEvents}
                normalEvents={normalEvents}
                setNormalEvents={setNormalEvents}
                isCustomisationWindowDisable={isCustomisationWindowDisable}
                setIsCustomisationWindowDisable={setIsCustomisationWindowDisable}
                isCodeWindowDisable={isCodeWindowDisable} 
                setIsCodeWindowDisable={setIsCodeWindowDisable}
                fetchedAddedEvents={fetchedAddedEvents}
                selectedTemplate={selectedTemplate}
                //  handlePrefillEvent={handlePrefillEvent}
                addedEventIds={addedEventIds}
                  allEventsCount={allEventsCount} widgetId={widgetId}  fetchAddedEvents={fetchAddedEvents} fetchEvents={fetchEvents} fetchedAllEvents={fetchedAllEvents} /> : <EventsAdded fetchAddedEvents={fetchAddedEvents} widgetId={widgetId} fetchEvents={fetchEvents} fetchedAddedEvents={fetchedAddedEvents} selectedTemplate={selectedTemplate} isCustomisationWindowDisable={isCustomisationWindowDisable}
                  setIsCustomisationWindowDisable={setIsCustomisationWindowDisable}
                  isCodeWindowDisable={isCodeWindowDisable} 
                  setIsCodeWindowDisable={setIsCodeWindowDisable}
                  promotedEvents={promotedEvents}
                  setPromotedEvents={setPromotedEvents}
                  normalEvents={normalEvents}
                  setNormalEvents={setNormalEvents}
                  />}
            </div>
        </div>
    )
}

export default FilterEvents