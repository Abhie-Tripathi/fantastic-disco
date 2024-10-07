import React, { useEffect, useState } from 'react'
import styles from './eventsadded.style.module.css'
import Image from 'next/image';
import StarIcon from '/public/staricon.svg'
import StarIconFilled from '/public/stariconfilled.svg'
import { AddedEventsType } from '@/types/addedeventtype';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import { useRouter } from 'next/navigation';

interface Props {
    fetchedAddedEvents: AddedEventsType[]
    widgetId: string;
    fetchAddedEvents: () => Promise<void>;
    fetchEvents: (page: number, type?: string) => Promise<void>;
    selectedTemplate: string;

    isCustomisationWindowDisable:boolean
    setIsCustomisationWindowDisable:(value: boolean) => void;
    isCodeWindowDisable:boolean
    setIsCodeWindowDisable:(value: boolean) => void;

    promotedEvents: string[];
    setPromotedEvents: React.Dispatch<React.SetStateAction<string[]>>;
    normalEvents: string[];
    setNormalEvents: React.Dispatch<React.SetStateAction<string[]>>;
}

const EventsAdded = ({fetchedAddedEvents, fetchAddedEvents, widgetId, fetchEvents, selectedTemplate,isCustomisationWindowDisable,setIsCustomisationWindowDisable,isCodeWindowDisable,setIsCodeWindowDisable,promotedEvents,setPromotedEvents,normalEvents,setNormalEvents }: Props) => {

    const [check, setCheck] = useState<boolean>(true)
    const [fetchedAddedOtherData, setFetchedAddedOtherData] = useState<PrefilledAddedEventsType[]>([])
    const [showMSG, setShowMsg] = useState(false)
    const [minNumberOfEvents,setMinNumberOfEvents] = useState("")
    const showPromote = (selectedTemplate === "HBL" || selectedTemplate === "HBG" || selectedTemplate === "CVL" || selectedTemplate === "CVG")
    const router = useRouter()
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
   
    useEffect(() => {
        const handleOtherDataFetch = async () => {
            try {
                const newPromotedEvents: string[] = [];
                const newNormalEvents: string[] = [];
                const newFetchedAddedOtherData = await Promise.all(
                    fetchedAddedEvents.map(async (event) => {
                        const { data, error } = await myFetch(`${baseUrl}/event/${event.id}?source=eventgtm`);
                        if (error) {
                            console.error(`Error fetching event data for event ID ${event.id}:`, error);
                            return null;
                        }
                        const eventData = data?.data;
                        // if (!eventData) return null;

                        const eventObject = {
                            id: event.id,
                            name: data?.name,
                            pageBgColor: eventData.customizationData.pageBgColor,
                            description: eventData.description,
                            eventFont: eventData.customizationData.eventFont,
                            startDate: eventData.start_date,
                            endDate: eventData.end_date,
                            startTime: eventData.start_time,
                            endTime: eventData.end_time,
                            timeZone: eventData.gmt_time,
                            cityName: eventData.location_city,
                            countryName: eventData.location_country,
                            participationType: data?.participationType,
                            eventFormat: eventData.format,
                            registerBtnColor: eventData.customizationData.registerBtnColor,
                            registerBtnText: eventData.customizationData.registerBtnText,
                            registerMessage: eventData.customizationData.registerMessage,
                            boothNumber: eventData.customizationData.boothNumber,
                            speakerProfilesData: eventData.customizationData.speakerProfilesData,
                            participationMessage: eventData.customizationData.participationMessage,
                            bannerUrl: eventData.logoUrl,
                            latitude: eventData.latitude,
                            longitude: eventData.longitude,
                            venue: eventData.customizationData.venue,
                            hashtags: eventData.customizationData.hashtags,
                            promoted : event.promoted,
                            eventType : data.type
                        } as PrefilledAddedEventsType;
                        if (event.promoted === "true") {
                            newPromotedEvents.push(event.promoted);
                        } else if (event.promoted === "false") {
                            newNormalEvents.push(event.promoted);
                        }
                        return eventObject;
                    })
                );
                setPromotedEvents(newPromotedEvents); 
                setNormalEvents(newNormalEvents);  
                setFetchedAddedOtherData(newFetchedAddedOtherData.filter((event): event is PrefilledAddedEventsType => event !== null));
            } catch (err) {
                console.error("Error in handleOtherDataFetch:", err);
            }
        };
        handleOtherDataFetch();
    }, [fetchedAddedEvents]);

    
    useEffect(() => {
        let promotedCount = promotedEvents.length;
        let normalEventCount = normalEvents.length; 
        console.log(fetchedAddedOtherData,promotedCount,normalEventCount)
        // Check which template is selected
        if (selectedTemplate === "CVG") {
            if ( promotedCount >= 3 && normalEventCount >= 2 ) {
                setIsCodeWindowDisable(false);
                setIsCustomisationWindowDisable(false);
            } else {
                setIsCodeWindowDisable(true);
                setIsCustomisationWindowDisable(true);
            }
            setShowMsg(true);
            setMinNumberOfEvents("Minimum 3 events to be selected for Carousel and 2 for Grid");
        } 
    
        if (selectedTemplate === "CVL") {
            if ( promotedCount >= 3 && normalEventCount >= 1) {
                setIsCodeWindowDisable(false);
                setIsCustomisationWindowDisable(false);
            } else {
                setIsCodeWindowDisable(true);
                setIsCustomisationWindowDisable(true);
            }
            setShowMsg(true);
            setMinNumberOfEvents("Minimum 3 events to be selected for Carousel and 1 for List");
        } 
    
        if (selectedTemplate === "CV") {
            // Check if there are 3 normal events
            if (normalEventCount >= 3) {
                setIsCodeWindowDisable(false);
                setIsCustomisationWindowDisable(false);
            } else {
                setIsCodeWindowDisable(true);
                setIsCustomisationWindowDisable(true);
            }
            setShowMsg(true);
            setMinNumberOfEvents("Minimum 3 events to be selected for this widget style");
        }
        if (selectedTemplate === "HS") {
            if (normalEventCount >= 3) {
                setIsCodeWindowDisable(false);
                setIsCustomisationWindowDisable(false);
            } else {
                setIsCodeWindowDisable(true);
                setIsCustomisationWindowDisable(true);
            }
            setShowMsg(true);
            setMinNumberOfEvents("Minimum 3 events to be selected for this widget style");
        }
    }, [selectedTemplate, fetchedAddedOtherData]); 
    


    const handlePromoteEvent = async (newEvent: AddedEventsType) => {
        const customizedFormData = new FormData();
        const existingEvents = fetchedAddedEvents || [];
        const updatedEvent = {
            id: newEvent.id,
            pageBgColor: newEvent.pageBgColor,
            registerBtnColor: newEvent.registerBtnColor,
            registerBtnText: newEvent.registerBtnColor,
            registerMessage: newEvent.registerMessage,
            boothNumber: newEvent.boothNumber,
            speakerProfilesData: newEvent.speakerProfilesData,
            participationMessage: newEvent.participationMessage,
            bannerUrl: newEvent.bannerUrl,
            eventFont : newEvent.eventFont,
            latitude: newEvent.latitude,
            longitude: newEvent.longitude,
            venue: newEvent.venue,
            hashtags: newEvent.hashtags,
            promoted: newEvent.promoted === "true" ? "false" : "true"
        };
        // Find and update the existing event
        const updatedEvents = existingEvents.map(event =>
            event.id === newEvent.id ? updatedEvent : event
        );

        const otherData = {
            event: updatedEvents,
        };
        const eventIds = updatedEvents.map(event => event.id).join(',');

        customizedFormData.append('widgetId', widgetId);
        customizedFormData.append('otherdata', JSON.stringify(otherData));
        customizedFormData.append('eventId', eventIds);
        const { data, error } = await myFetch(`${baseUrl}/widget`, {
            method: 'POST',
            body: customizedFormData,
        });
        if (data) {
            console.log("widget event promote data", data);
            fetchAddedEvents();
        }
        if (error) {
            console.log("error in updating event in widget ", error);
        }
    }

    // This function is to trigger the delete event function from added events
    const handleCheckboxChange = async (eventId: string) => {
        const updatedEvents = fetchedAddedEvents?.filter(event => event.id !== eventId);
        if (!updatedEvents) {
            return;
        }
        if (updatedEvents.length === 0) {
            handleDraftWidget() // Will call this function to move the widget to draft if no event is left in widget
        }
        try {
            await updateWidget(widgetId, updatedEvents, eventId);
        } catch (error) {
            console.error('Failed to update events:', error);
        }

    };

    // To move the widget to draft if all events are deleted
    const handleDraftWidget = async () => {
        const formData = new FormData();
        formData.append("widgetId", widgetId)
        formData.append("status", "draft")
        const { data, error } = await myFetch(`${baseUrl}/widget`, {
            method: "POST",
            body: formData
        })
        if (data) {
            console.log("widget moved to draft widgets")
        }
    }
    const updateWidget = async (widgetId: string, updatedEvents: AddedEventsType[], eventId: string) => {
        const customizedFormData = new FormData();

        const otherData = {
            event: updatedEvents,
        };

        // const updatedIds = eventIds.join(',')
        customizedFormData.append("widgetId", widgetId);
        customizedFormData.append("otherdata", JSON.stringify(otherData));

        const { data, error } = await myFetch(`${baseUrl}/widget`, {
            method: 'POST',
            body: customizedFormData
        })
        if (data) {
            handleEventIdDelete(eventId)
            fetchEvents(0, "update")
        }
        if (error) {
            console.log(error)
        }
    };

    const handleEventIdDelete = async (eventId: string) => {
        const customizedFormData = new FormData();
        customizedFormData.append("widgetId", widgetId);
        customizedFormData.append("eventId", eventId)
        customizedFormData.append("published", "false")
        const { data, error } = await myFetch(`${baseUrl}/widget`, {
            method: 'POST',
            body: customizedFormData
        })
        if (data) {
            fetchAddedEvents()  
            console.log(data)
        } if (error) {
            console.log(error)
        }
    }
    return (
        <div className={styles.body}>
            <div className={styles.headerContainer}>
                <div>Events Added</div>
                {/* <button onClick={() => handleAddEventModal()}>Add Event to widget</button> */}
            </div>
            <div className={styles.line}></div>

             
            {
                showMSG && (
                <>
                    <div className={styles.info_container}>
                        <div><InfoSvg/></div>
                        <div className={styles.info_heading}>{minNumberOfEvents} </div>
                    </div>
                    <div className={styles.line}></div>
                </>
                )
            }
          
            {fetchedAddedOtherData.length > 0 ? <div className={styles.allEventsContainer}>
                {fetchedAddedOtherData?.map((event, key) => (
                    <div className={styles.event} key={key}>
                        <div className={styles.eventDetailsContainer}>
                            <div className={styles.eventName}>{`${event.name.substring(0,30)} ${event.name.length>30 ? "...": ""}`}</div>
                            <div className={styles.eventLocationContainer}>
                                <LocationIcon />
                                <div>{event.cityName}</div>
                            </div>
                            <div className={styles.eventDateContainer}>
                                <DateIcon />
                                <div>{formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
                            </div>
                        </div>
                        <div className={styles.btnContainer}>
                            <div className={styles.addButtonContainer}>
                                <div className={styles.heading}>
                                    Added to Widget
                                </div>
                                <input
                                    type="checkbox"
                                    id={key.toString()}
                                    className={styles.checkboxInput}
                                    checked={check}
                                    onChange={() => handleCheckboxChange(event.id)}
                                />
                                <label htmlFor={key.toString()} className={styles.checkBox}></label>
                            </div>
                            <div className={styles.editBtnContainer}>
                                {showPromote && <div onClick={() => handlePromoteEvent(event)}><Image src={event.promoted === "true" ? StarIconFilled: StarIcon} alt='promote' /><span>{event.promoted === "true" ? "Promoted":"Promote"}</span></div>}
                                {/* <div onClick={() => handlePrefilledAddedEvent(event)}><EditIcon /><span>Edit</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div> : <div className={styles.emptyScreen}>
                <Image src={EmptyImage} alt='empty' />
                <div>Search or Add your Events</div>
                <span>Start by searching for existing events to add to your widgets</span>
                <span>or feel free to create your own event from scratch</span>
                <div className={styles.add_event_button} onClick={() =>{router.push('/widget/events')}}><span style={{color:"white"}}>Add Event</span></div>
            </div>}
        </div>
    )
}

export default EventsAdded

function DateIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z" fill="#696B83" /></svg>
    )
}
function LocationIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="10" viewBox="0 -960 960 960" width="10"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill="#696B83" /></svg>
    )
}
function EditIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.4997 3.00007L12.9997 5.50007M8.83301 14.6667H15.4997M2.16634 11.3334L1.33301 14.6667L4.66634 13.8334L14.3213 4.17841C14.6338 3.86586 14.8093 3.44201 14.8093 3.00007C14.8093 2.55813 14.6338 2.13429 14.3213 1.82174L14.178 1.67841C13.8655 1.36596 13.4416 1.19043 12.9997 1.19043C12.5577 1.19043 12.1339 1.36596 11.8213 1.67841L2.16634 11.3334Z" stroke="#6750A4" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}


function InfoSvg() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25 8.75H6.41667V5.25H5.25V8.75ZM5.83333 4.08333C5.99861 4.08333 6.13725 4.02733 6.24925 3.91533C6.36125 3.80333 6.41706 3.66489 6.41667 3.5C6.41628 3.33511 6.36028 3.19667 6.24867 3.08467C6.13706 2.97267 5.99861 2.91667 5.83333 2.91667C5.66806 2.91667 5.52961 2.97267 5.418 3.08467C5.30639 3.19667 5.25039 3.33511 5.25 3.5C5.24961 3.66489 5.30561 3.80353 5.418 3.91592C5.53039 4.02831 5.66883 4.08411 5.83333 4.08333ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5134 3.55833 11.207C2.84861 10.9006 2.23125 10.485 1.70625 9.96042C1.18125 9.43581 0.765723 8.81844 0.459667 8.10833C0.153612 7.39822 0.000389627 6.63989 7.38396e-07 5.83333C-0.00038815 5.02678 0.152834 4.26844 0.459667 3.55833C0.766501 2.84822 1.18203 2.23086 1.70625 1.70625C2.23047 1.18164 2.84783 0.766111 3.55833 0.459667C4.26883 0.153222 5.02717 0 5.83333 0C6.6395 0 7.39783 0.153222 8.10833 0.459667C8.81883 0.766111 9.4362 1.18164 9.96042 1.70625C10.4846 2.23086 10.9004 2.84822 11.2076 3.55833C11.5148 4.26844 11.6678 5.02678 11.6667 5.83333C11.6655 6.63989 11.5123 7.39822 11.207 8.10833C10.9017 8.81844 10.4862 9.43581 9.96042 9.96042C9.43464 10.485 8.81728 10.9007 8.10833 11.2076C7.39939 11.5144 6.64106 11.6674 5.83333 11.6667Z" fill="#52A8FF"/>
        </svg>
    )
}