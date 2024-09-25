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

const Page = () => {
    const [fetchedEvents, setFetchedEvents] = useState<AllEventsType[]>([]);
    const [isEventFormModal, setIsEventFormModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [selectedEventName, setSelectedEventName] = useState<string>("")
    const [page, setPage] = useState<number>(0);

    let prevDate: any = null;
    useEffect(() => {
        fetchEvents(page * 8);
    }, [page])

    const fetchAddedEvents = async () => {
        const { data, error } = await myFetch(`${baseUrl}/widget/${"1"}`)
        if (data) {
            const events = data.otherdata?.event;
        }
        if (error) {
            console.log(error);
        }
    }

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

    const handleDeleteModal = (eventId: string, eventName: string) => {
        setSelectedEventName(eventName)
        setSelectedEventId(eventId)
        setDeleteModal(true)
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
                widgetTags : event.widgetData.map((item: { type: any })=> item.type).join(', ')
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
        setIsEventFormModal(true)
    }
    const handlePrefillEvent = (event: AllEventsType) => {
        setIsEventFormModal(true)
    }
    return (
        <div className={`${styles.body} ${isEventFormModal || deleteModal ? styles.modalOpen : ""}`}>
            <nav className={styles.nav}>
                <div>
                    <Image src={CalendarIcon} alt='cal' width={14} height={14} className='icons' />
                    <span>Upcoming Events</span>
                </div>
                <button onClick={handleFormModal}>+ Add Event</button>
            </nav>
            <div className={styles.globalSearch}>
                <GlobalSearch widgetId='123' />
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
            {(isEventFormModal || deleteModal) && <div className={styles.blackScreen}></div>}
            {isEventFormModal && <div className={styles.addEventModal}>
                {/* <AddEvent widgetId='22323' prefilledNormalEvent={prefilledNormalEvent} fetchEvents={fetchEvents} setIsAddEventModalOpen={setIsEventFormModal} addedEventIds={[""]} fetchAddedEvents={fetchAddedEvents} fetchedAddedEvents={fetchedAddedEvents} /> */}
            </div>}
            {deleteModal && <div className={styles.deleteModal}>
                <div className={styles.deleteHeading}>Are you sure you want to delete this event?</div>
                <span>{selectedEventName}</span>
                <div className={styles.btns}>
                    <button className={styles.cancelBtn} onClick={() => setDeleteModal(false)}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
                </div>
            </div>}
        </div>
    )
}

export default Page