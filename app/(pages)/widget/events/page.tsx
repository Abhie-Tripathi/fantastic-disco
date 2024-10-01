'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import YourEventCard from '@/app/components/internal/YourEventCard'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import { myFetch } from '@/utils/myFetch'
import { AllEventsType, EventsType } from '@/types/alleventtype'
import { baseUrl } from '@/constants'
import AddEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddEvent'
import CalendarIcon from '/public/calendar.svg'
import Image from 'next/image'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import DashboardEventCard from '@/app/components/TemplateViewsNew/WidgetDashboard/DashboardEventCard'
import GlobalSearch from '@/app/components/TemplateViewsNew/EditScreen/FilterEvents/GlobalSearch'
import { GolbalEventType } from '@/types/globaleventtype'
import ChoiceModal from '@/app/components/TemplateViewsNew/Events/ChoiceModal'
import SubEventCard from '@/app/components/TemplateViewsNew/WidgetDashboard/SubEventCard'

const Page = () => {
    const [fetchedEvents, setFetchedEvents] = useState<AllEventsType[]>([]);
    const [isEventFormModal, setIsEventFormModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [selectedEventName, setSelectedEventName] = useState<string>("")
    const [page, setPage] = useState<number>(0);
    const [prefilledEvent, setPrefilledEvent] = useState<AllEventsType | null>(null);
    const [prefilledSubEvent, setPrefilledSubEvent] = useState<EventsType | null>(null)
    const [prefilledGlobalEvent, setPrefilledGlobalEvent] = useState<GolbalEventType | null>(null);
    const [deleteModalTwo, setDeleteModalTwo] = useState<boolean>(false) // This one is for if the event is present in some widget
    const [choiceFormModal, setChoiceFormModal] = useState<boolean>(false)
    // const [mainEventFlow, setMainEventFlow] = useState<boolean>(false)
    // const [sideEventFlow, setSideEventFlow] = useState<boolean>(false)
    const [eventFlow, setEventFlow] = useState<string>("")
    const [selectedEventType, setSelectedEventType] = useState<string>("") // This will be used to Delete an event

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
        if (selectedEventType === "side") {
            customizeData.append("type", "SUB")
        }
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
                mainEvent: {
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
                    eventType: event.type,
                    longitude: event.data.longitude,
                    participationType: event.data.participationType,
                    parentData: event.data.parentData,
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
                },
                subEvents: event.children.map((subEvent: any) => ({
                    eventId: subEvent.id,
                    name: subEvent.name,
                    cityName: subEvent.data.location_city,
                    countryName: subEvent.data.location_country,
                    startDate: subEvent.data.start_date,
                    logoUrl: subEvent.data.logoUrl,
                    endDate: subEvent.data.end_date,
                    startTime: subEvent.data.start_time,
                    endTime: subEvent.data.end_time,
                    description: subEvent.data.description,
                    format: subEvent.data.format,
                    isLinkedToWidget: false,
                    gmtZone: subEvent.data.gmt_time,
                    latitude: subEvent.data.latitude,
                    eventType: subEvent.type,
                    longitude: subEvent.data.longitude,
                    participationType: subEvent.data.participationType,
                    // widgetTags: subEvent.widgetData.map((item: { type: any }) => item.type).join(', '),
                    customizationData: {
                        pageBgColor: subEvent.data.customizationData.pageBgColor,
                        eventFont: subEvent.data.customizationData.eventFont,
                        registerBtnColor: subEvent.data.customizationData.registerBtnColor,
                        registerBtnText: subEvent.data.customizationData.registerBtnText,
                        registerMessage: subEvent.data.customizationData.registerMessage,
                        speakerProfilesData: subEvent.data.customizationData.speakerProfilesData,
                        participationMessage: subEvent.data.customizationData.participationMessage,
                        venue: subEvent.data.customizationData.venue,
                        hashtags: subEvent.data.customizationData.hashtags,
                        boothNumber: subEvent.data.customizationData.boothNumber
                    }
                }))
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
    useEffect(() => {
        if (eventFlow) {
            setIsEventFormModal(true)
        }
    }, [eventFlow])

    // const handleFormModal = () => {
    //     setPrefilledEvent(undefined)
    //     setPrefilledGlobalEvent(undefined)
    //     if (eventFlow) {
    //         setIsEventFormModal(true)
    //     }
    // }
    const handlePrefillEvent = (event: AllEventsType) => {
        // setPrefilledGlobalEvent(undefined)
        setPrefilledEvent(event)
        setIsEventFormModal(true)
        if (event.mainEvent.eventType === "MAIN") {
            setEventFlow("main")
        } else setEventFlow("side")

    }
    const handlePrefillSubEvent = (event: EventsType) => {
        setPrefilledSubEvent(event)
        setIsEventFormModal(true)
        setEventFlow("side")
    }
    const handlePrefillGlobalEvent = (event: GolbalEventType) => {
        // setPrefilledEvent(undefined)
        // setPrefilledGlobalEvent(undefined)
        setPrefilledGlobalEvent(event)
        setIsEventFormModal(true)
        setEventFlow("main")
    }
    return (
        <div className={`${styles.body} ${isEventFormModal || deleteModal || deleteModalTwo || choiceFormModal ? styles.modalOpen : ""}`}>
            <nav className={styles.nav}>
                <div>
                    <Image src={CalendarIcon} alt='cal' width={14} height={14} className='icons' />
                    <span>Upcoming Events</span>
                </div>
                <button onClick={() => setChoiceFormModal(true)}>+ Add Event</button>
            </nav>
            <div className={styles.globalSearch}>
                <GlobalSearch widgetId='123' handlePrefillGlobalEvent={handlePrefillGlobalEvent} />
            </div>
            {fetchedEvents.length > 0 ? fetchedEvents.map((event, index) => {
                const showDate = event.mainEvent.startDate !== prevDate;
                prevDate = event.mainEvent.startDate;
                return (
                    <div key={index} className={styles.container}>
                        <TimelineItem eventDate={showDate ? event.mainEvent.startDate : null} />

                        {event.mainEvent.eventType === "MAIN" ? <DashboardEventCard setSelectedEventType={setSelectedEventType} handlePrefillSubEvent={handlePrefillSubEvent} width='small' handlePrefillEvent={handlePrefillEvent} handleDeleteModal={handleDeleteModal} event={event} /> : <SubEventCard setSelectedEventType={setSelectedEventType} width='small' handlePrefillEvent={handlePrefillEvent} handleDeleteModal={handleDeleteModal} normalEvent={event} />}
                    </div>
                );
            }) :
                <div className={styles.emptyScreen}>
                    <Image src={EmptyImage} alt='empty' />
                    <div>Search or Add your Events</div>
                    <span>Start by searching for existing events to add to your widgets</span>
                    <span>or feel free to create your own event from scratch</span>
                </div>}
            {(isEventFormModal || deleteModal || deleteModalTwo || choiceFormModal) && <div className={styles.blackScreen}></div>}
            {isEventFormModal && <div className={styles.addEventModal}>
                <AddEvent prefilledSubEvent={prefilledSubEvent} setPrefilledSubEvent={setPrefilledSubEvent} setPrefilledEvent={setPrefilledEvent} setPrefilledGlobalEvent={setPrefilledGlobalEvent} setEventFlow={setEventFlow} eventFlow={eventFlow} widgetId='22323' prefilledEvent={prefilledEvent} fetchEvents={fetchEvents} setIsAddEventModalOpen={setIsEventFormModal} prefilledGlobalEvent={prefilledGlobalEvent} addedEventIds={[""]} />
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
                </div>
            </div>}
            {choiceFormModal &&
                <div className={styles.choiceModal}>
                    <ChoiceModal setChoiceFormModal={setChoiceFormModal} setEventFlow={setEventFlow} />
                </div>
            }
        </div>
    )
}

export default Page