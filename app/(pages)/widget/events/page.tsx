'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import YourEventCard from '@/app/components/internal/YourEventCard'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import { myFetch } from '@/utils/myFetch'
import { AllEventsType } from '@/types/alleventtype'
import { baseUrl } from '@/constants'
import AddNormalEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddNormalEvent'
import CalendarIcon from '/public/calendar.svg'
import Image from 'next/image'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import { useTheme } from '@/context'

const Page = () => {
    const [fetchedEvents, setFetchedEvents] = useState<AllEventsType[]>([]);
    const [isEventFormModal, setIsEventFormModal] = useState<boolean>(false)
    const [prefilledNormalEvent, setPrefilledNormalEvent] = useState<AllEventsType>()
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [selectedEventName, setSelectedEventName] = useState<string>("")
    const [page, setPage] = useState<number>(0);
    const { theme } = useTheme()

    let prevDate: any = null;
    useEffect(() => {
        fetchEvents(page*8);
    }, [page])

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
                fetchedEvents.length > 0 // Prevent fetching on empty screen
            ) {
                setPage((prevPage) => prevPage + 1); // Increment page to load more events
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchedEvents]);

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
                interest: "", // Assuming this field is optional and not present in the response
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
        setPrefilledNormalEvent(undefined)
        setIsEventFormModal(true)
    }
    const handlePrefillEvent = (event: AllEventsType) => {
        setPrefilledNormalEvent(event)
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
            {fetchedEvents.length > 0 ? fetchedEvents.map((event, index) => {
                const showDate = event.startDate !== prevDate;
                prevDate = event.startDate;
                return (
                    <div key={index} className={styles.container}>
                        <TimelineItem eventDate={showDate ? event.startDate : null} />
                        <YourEventCard
                            handleDeleteModal={handleDeleteModal}
                            handlePrefillEvent={handlePrefillEvent}
                            geniEvent={event}
                        />
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
            {isEventFormModal && <div className={styles.addNormalEventModal}>
                <AddNormalEvent theme={theme === "dark" ? "dark" : "light"} setIsNormalEventModalOpen={setIsEventFormModal} fetchEvents={fetchEvents} prefilledNormalEvent={prefilledNormalEvent} />
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