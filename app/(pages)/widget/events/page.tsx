'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import YourEventCard from '@/app/components/internal/YourEventCard'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import { myFetch } from '@/utils/myFetch'
import { AllEventsType } from '@/types/alleventtype'
import { baseUrl } from '@/constants'
import AddNormalEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddNormalEvent'

const Page = () => {
    const [fetchedEvents, setFetchedEvents] = useState<AllEventsType[]>([]);
    const [isEventFormModal, setIsEventFormModal] = useState<boolean>(false)
    const [prefilledNormalEvent, setPrefilledNormalEvent] = useState<AllEventsType>()

    let prevDate: any = null;
    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        const { data, error } = await myFetch(`${baseUrl}/event`)
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

            setFetchedEvents(transformedEvents);
        } else {
            console.error('Error fetching events:', error);
        }
    }
    const handlePrefillEvent = (event: AllEventsType) => {
        setPrefilledNormalEvent(event)
        setIsEventFormModal(true)
    }
    return (
        <div className={`${styles.body} ${isEventFormModal ? styles.modalOpen : ""}`}>
            {fetchedEvents.map((event, index) => {
                const showDate = event.startDate !== prevDate;
                prevDate = event.startDate;
                return (
                    <div key={index} className={styles.container}>
                        <TimelineItem eventDate={showDate ? event.startDate : null} />
                        <YourEventCard
                            handlePrefillEvent={handlePrefillEvent}
                            geniEvent={event}
                        />
                    </div>
                );
            })}
            {isEventFormModal && <div className={styles.blackScreen}></div>}
            {isEventFormModal && <div className={styles.addNormalEventModal}>
                <AddNormalEvent setIsNormalEventModalOpen={setIsEventFormModal} fetchEvents={fetchEvents} prefilledNormalEvent={prefilledNormalEvent} />
            </div>}
        </div>
    )
}

export default Page