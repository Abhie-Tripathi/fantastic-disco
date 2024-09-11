import React, { useEffect, useState } from 'react'
import styles from './eventsadded.style.module.css'
import Image from 'next/image';
import StarIcon from '/public/staricon.svg'
import { AddedEventsType } from '@/types/addedeventtype';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'

interface Props {
    handleAddEventModal: (value: void) => void
    fetchedAddedEvents: AddedEventsType[]
    handlePrefilledAddedEvent: (event: PrefilledAddedEventsType) => void
    widgetId: string;
    fetchAddedEvents: () => Promise<void>;
    fetchEvents: () => Promise<void>;
}

const EventsAdded = ({ handleAddEventModal, fetchedAddedEvents, handlePrefilledAddedEvent, fetchAddedEvents, widgetId, fetchEvents }: Props) => {

    const [check, setCheck] = useState<boolean>(true)
    const [fetchedAddedOtherData, setFetchedAddedOtherData] = useState<PrefilledAddedEventsType[]>([])

    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    useEffect(() => {
        const handleOtherDataFetch = async () => {
            const newFetchedAddedOtherData: (PrefilledAddedEventsType | null)[] = await Promise.all(
                fetchedAddedEvents.map(async (event) => {
                    const { data, error } = await myFetch(`${baseUrl}/event?id=${event.id}`);
                    if (error) {
                        console.error(`Error fetching event data for event ID ${event.id}:`, error);
                        return null;
                    }
                    if (data) {
                        console.log("data of fetched event : ",)
                    }
                    return {
                        id: event.id,
                        name: data.data[0].name,
                        pageBgColor: event.pageBgColor,
                        description: data.data[0].data.description,
                        eventFont: event.eventFont,
                        startDate: data.data[0].data.start_date,
                        endDate: data.data[0].data.end_date,
                        startTime: data.data[0].data.start_time,
                        endTime: data.data[0].data.end_time,
                        timeZone: data.data[0].data.gmt_time,
                        cityName: data.data[0].data.location_city,
                        countryName: data.data[0].data.location_country,
                        participationType: data.data[0].data.participationType,
                        eventFormat: data.data[0].data.format,
                        registerBtnColor: event.registerBtnColor,
                        registerBtnText: event.registerBtnText,
                        registerMessage: event.registerMessage,
                        boothNumber: event.boothNumber,
                        speakerProfilesData: event.speakerProfilesData,
                        participationMessage: event.participationMessage,
                        bannerUrl: event.bannerUrl,
                        latitude: event.latitude,
                        longitude: event.longitude,
                        venue: event.venue,
                        hashtags : event.hashtags
                    } as PrefilledAddedEventsType;
                })
            );
            setFetchedAddedOtherData(newFetchedAddedOtherData.filter((event): event is PrefilledAddedEventsType => event !== null));
        };

        handleOtherDataFetch();
    }, [fetchedAddedEvents]);


    // This function is to trigger the delete event function from added events
    const handleCheckboxChange = async (eventId: string) => {
        const updatedEvents = fetchedAddedEvents?.filter(event => event.id !== eventId);
        if (!updatedEvents) {
            return;
        }
        if(updatedEvents.length === 0){
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
            fetchAddedEvents()
            fetchEvents()
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
            console.log(data)
        } if (error) {
            console.log(error)
        }
    }
    return (
        <div className={styles.body}>
            <div className={styles.headerContainer}>
                <div>Events Added<span>{fetchedAddedEvents?.length || 0}</span></div>
                <button onClick={() => handleAddEventModal()}>Add Event to widget</button>
            </div>
            <div className={styles.line}></div>
            {fetchedAddedOtherData.length > 0 ? <div className={styles.allEventsContainer}>
                {fetchedAddedOtherData?.map((event, key) => (
                    <div className={styles.event} key={key}>
                        <div className={styles.eventDetailsContainer}>
                            <div className={styles.eventName}>{event.name}</div>
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
                            <div className={styles.promotEditBtnContainer}>
                                <div onClick={() => handlePrefilledAddedEvent(event)}><EditIcon /><span>Edit</span></div>
                                <div><Image src={StarIcon} alt='promote' /><span>Promote</span></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div> : <div className={styles.emptyScreen}>
                <Image src={EmptyImage} alt='empty' />
                <div>Search or Add your Events</div>
                <span>Start by searching for existing events to add to your widgets</span>
                <span>or feel free to create your own event from scratch</span>
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