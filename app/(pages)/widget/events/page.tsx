'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import YourEventCard from '@/app/components/internal/YourEventCard'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import { myFetch } from '@/utils/myFetch'
import { AllEventsType } from '@/types/alleventtype'
import { baseUrl } from '@/constants'
import AddEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddEvent'
import CalendarIcon from '/public/calendar.svg'
import Image from 'next/image'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import DashboardEventCard from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEventCard'
import GlobalSearch from '@/app/components/TemplateViewsNew/EditScreen/FilterEvents/GlobalSearch'
import { GolbalEventType } from '@/types/globaleventtype'

const Page = () => {
    const [fetchedEvents, setFetchedEvents] = useState<AllEventsType[]>([]);
    const [isEventFormModal, setIsEventFormModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [selectedEventName, setSelectedEventName] = useState<string>("")
    const [page, setPage] = useState<number>(0);
    const [prefilledEvent, setPrefilledEvent] = useState<AllEventsType>();
    const [prefilledGlobalEvent, setPrefilledGlobalEvent] = useState<GolbalEventType>();
    const [deleteModalTwo, setDeleteModalTwo] = useState<boolean>(false) // This one is for if the event is present in some widget

    let prevDate: any = null;
    useEffect(() => {
        fetchEvents(page * 8);
    }, [page])


    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (
    //             window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
    //             fetchedEvents.length > 0 // Prevent fetching on empty screen
    //         ) {
    //             setPage((prevPage) => prevPage + 1); // Increment page to load more events
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, [fetchedEvents]);

    const handleDeleteModal = (eventId: string, eventName: string, isPresentinWidget: boolean) => {
        if (isPresentinWidget) {
            setDeleteModalTwo(true)
        } else {
            setSelectedEventName(eventName)
            setSelectedEventId(eventId)
            setDeleteModal(true)
        }

    }
    const handleDelete = async () => {
        const customizeData = new FormData();
        customizeData.append("id", selectedEventId)
        customizeData.append('published', "false");
        const { data, error } = await myFetch(
            `${baseUrl}/event`,
            {
                method: 'PATCH',
                body: customizeData,
            }
        );
        if (data) {
            fetchEvents(0, "update")
            setDeleteModal(false)
        }
        if (error) {
            console.log(error);
        }
    }

    const fetchEvents = async (page: number, type?: string) => {
        const { data, error } = await myFetch(`${baseUrl}/event?sortBy=start_date&sortType=asc&offset=${page}&limit=8`)
        if (data) {
            const transformedEvents = data.data.map((event: any) => ({
                eventId: event.id,
                name: event.name,
                cityName: event.data.location_city,
                countryName: event.data.location_country,
                startDate: event.data.start_date,
                logoUrl: event.data.logoUrl,
                endDate: event.data.end_date,
                startTime: event.data.start_time,
                endTime: event.data.end_time,
                description: event.data.description,
                format: event.data.format,
                isLinkedToWidget: false,
                gmtZone: event.data.gmt_time,
                latitude: event.data.latitude,
                longitude: event.data.longitude,
                participationType: event.data.participationType,
                widgetTags: event.widgetData.map((item: { type: any }) => item.type).join(', '),
                customizationData: {
                    pageBgColor: event.data.customizationData.pageBgColor,
                    eventFont: event.data.customizationData.eventFont,
                    registerBtnColor: event.data.customizationData.registerBtnColor,
                    registerBtnText: event.data.customizationData.registerBtnText,
                    registerMessage: event.data.customizationData.registerMessage,
                    speakerProfilesData: event.data.customizationData.speakerProfilesData,
                    participationMessage: event.data.customizationData.participationMessage,
                    venue: event.data.customizationData.venue,
                    hashtags: event.data.customizationData.hashtags,
                    boothNumber: event.data.customizationData.boothNumber
                }
            }));

            if (type === "update") { // So basically this fetchEvents() function is called in many pages, we want to make sure if we are calling this function when some task if performed like, deleting an event or updating an event or adding an event, we only need to add the updated events and not the prev events + new events
                setFetchedEvents(transformedEvents)
            } else {
                setFetchedEvents(prevEvents => [...prevEvents, ...transformedEvents]);
            }
        } else {
            console.error('Error fetching events:', error);
        }
    }
    const handleFormModal = () => {
        setPrefilledEvent(undefined)
        setPrefilledGlobalEvent(undefined)
        setIsEventFormModal(true)
    }
    const handlePrefillEvent = (event: AllEventsType) => {
        setPrefilledEvent(undefined)
        setPrefilledGlobalEvent(undefined)
        setPrefilledEvent(event)
        setIsEventFormModal(true)
    }
    const handlePrefillGlobalEvent = (event: GolbalEventType) => {
        setPrefilledEvent(undefined)
        setPrefilledGlobalEvent(undefined)
        setPrefilledGlobalEvent(event)
        setIsEventFormModal(true)
    }
    return (
        <div className={`${styles.body} ${isEventFormModal || deleteModal || deleteModalTwo ? styles.modalOpen : ""}`}>
            <nav className={styles.nav}>
                <div>
                    <Image src={CalendarIcon} alt='cal' width={14} height={14} className='icons' />
                    <span>Upcoming Events</span>
                </div>
                <button onClick={handleFormModal}>+ Add Event</button>
            </nav>
            <div className={styles.globalSearch}>
                <GlobalSearch widgetId='123' handlePrefillGlobalEvent={handlePrefillGlobalEvent} />
            </div>
            {fetchedEvents.length > 0 ? fetchedEvents.map((event, index) => {
                const showDate = event.startDate !== prevDate;
                prevDate = event.startDate;
                return (
                    <div key={index} className={styles.container}>
                        <TimelineItem eventDate={showDate ? event.startDate : null} />
                        {/* <YourEventCard
                            handleDeleteModal={handleDeleteModal}
                            handlePrefillEvent={handlePrefillEvent}
                            geniEvent={event}
                        /> */}
                        <DashboardEventCard width='small' handlePrefillEvent={handlePrefillEvent} handleDeleteModal={handleDeleteModal} event={event} />
                    </div>
                );
            }) :
                <div className={styles.emptyScreen}>
                    <Image src={EmptyImage} alt='empty' />
                    <div>Search or Add your Events</div>
                    <span>Start by searching for existing events to add to your widgets</span>
                    <span>or feel free to create your own event from scratch</span>
                </div>}
            {(isEventFormModal || deleteModal ||deleteModalTwo) && <div className={styles.blackScreen}></div>}
            {isEventFormModal && <div className={styles.addEventModal}>
                <AddEvent widgetId='22323' prefilledEvent={prefilledEvent} fetchEvents={fetchEvents} setIsAddEventModalOpen={setIsEventFormModal} prefilledGlobalEvent={prefilledGlobalEvent} addedEventIds={[""]} />
            </div>}
            {deleteModal && <div className={styles.deleteModal}>
                <div className={styles.deleteHeading}>Are you sure you want to delete this event?</div>
                <span>{selectedEventName}</span>
                <div className={styles.btns}>
                    <button className={styles.cancelBtn} onClick={() => setDeleteModal(false)}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
                </div>
            </div>}
            {deleteModalTwo && <div className={styles.deleteModal}>
                <div className={styles.deleteHeading}>This event is Present in one of your widgets.</div>
                <span>Remove the event from widget to delete this event</span>
                <div className={styles.btns}>
                    <button className={styles.cancelBtn} onClick={() => setDeleteModalTwo(false)}>Cancel</button>
                    {/* <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button> */}
                </div>
            </div>}
        </div>
    )
}

export default Page