import React, { useEffect, useState } from 'react'
import styles from './dashboardevents.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image';
import Link from 'next/link';
import { myFetch } from '@/utils/myFetch';
import { AllEventsType } from '@/types/alleventtype';
import { baseUrl } from '@/constants';
import YourEventCard from '@/app/components/internal/YourEventCard'
import DashboardEventCard from './DashboardEventCard';

const DashboardEvents = () => {
    const [selectedBtn, setSelectedBtn] = useState<string>("Added")
    const [fetchedAddedEvents, setFetchedAddedEvents] = useState<AllEventsType[]>([])
    const [siteFetchedEvents, setSiteFetchedEvents] = useState([])

    const fetchEvents = async () => {
        const { data, error } = await myFetch(`${baseUrl}/event`)
        if (data) {
            const events: AllEventsType[] = data.data.map((event: any) => ({
                eventId: event.id,
                name: event.name,
                cityName: event.data.location_city,
                countryName: event.data.location_country,
                description: event.data.description,
                startDate: event.data.start_date,
                endDate: event.data.end_date,
                format: event.data.format,
                isLinkedToWidget: event.isWidgetLinked,
                startTime: event.data.start_time,
                endTime: event.data.end_time,
                gmtZone: event.data.gmt_time,
            }))
            setFetchedAddedEvents(events)
        } if (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchEvents()
    }, [])
    return (
        <div className={styles.body}>
            <div className={styles.btnContainer}>
                <button className={`${styles.btn} ${selectedBtn === "Fetched" ? styles.selectedBtn : ""}`} onClick={() => setSelectedBtn("Fetched")}>
                    <span>Fetched</span>
                    <span className={`${styles.count} ${selectedBtn === "Fetched" ? styles.selectedCount : ""}`}>0</span>
                </button>
                <button className={`${styles.btn} ${selectedBtn === "Added" ? styles.selectedBtn : ""}`} onClick={() => setSelectedBtn("Added")}>
                    <span>Added</span>
                    <span className={`${styles.count} ${selectedBtn === "Added" ? styles.selectedCount : ""}`}>{fetchedAddedEvents.length}</span>
                </button>
            </div>
            <div className={styles.addEvent}><span>Last Fetched on : 27 Jul 2024</span><Link href={"/widge"}>Fetch Now</Link></div>
            {selectedBtn === "Fetched" ? <div className={styles.fetchedEventsContainer}>
                {siteFetchedEvents.length > 0 ?
                    <div className={styles.eventsList}>
                        
                    </div> :
                    <div className={styles.emptyScreen}>
                        <Image src={EmptyImage} alt='empty' />
                        <div>Search or Add your Events</div>
                        <span>Start by searching for existing events to add to your widgets</span>
                        <span>or feel free to create your own event from scratch</span>
                    </div>}
            </div> :
                <div className={styles.addedEventsContainer}>
                    {fetchedAddedEvents.length > 0 ?
                        <div className={styles.eventsList}>
                            {fetchedAddedEvents.slice(0, 2).map((event,key)=>(
                                <div className={styles.eventCard} key={key}><DashboardEventCard event={event}/></div>
                            ))}
                        </div>

                        : <div className={styles.emptyScreen}>
                            <Image src={EmptyImage} alt='empty' />
                            <div>Search or Add your Events</div>
                            <span>Start by searching for existing events to add to your widgets</span>
                            <span>or feel free to create your own event from scratch</span>
                        </div>}
                </div>}
            <Link href={"/widget/events"} className={styles.allEventBtn}>Show all events</Link>

        </div >
    )
}

export default DashboardEvents