import React, { useEffect, useState } from 'react'
import styles from './dashboardevents.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image';
import Link from 'next/link';
import { myFetch } from '@/utils/myFetch';
import { AllEventsType } from '@/types/alleventtype';
import { baseUrl } from '@/constants';
import DashboardEventCard from './DashboardEventCard';
import { useEventServices } from '@/services/geniservices/eventService'; 
import { useRouter } from 'next/navigation';
const DashboardEvents = () => {
    const [selectedBtn, setSelectedBtn] = useState<string>("Added")
    const [fetchedAddedEvents, setFetchedAddedEvents] = useState<AllEventsType[]>([])
    const [siteFetchedEvents, setSiteFetchedEvents] = useState([])
    const [addedEventsLength, setLength] = useState<number>(0)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [deleteModalTwo, setDeleteModalTwo] = useState<boolean>(false) // This one is for if the event is present in some widget
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [selectedEventName, setSelectedEventName] = useState<string>("")
    const {getEvents, deleteEvent, error} = useEventServices();
    const [createdDate,setCreatedDate]=useState("")
    const router = useRouter()
    const fetchEvents = async () => {
        // const { data, error } = await myFetch(`${baseUrl}/event?sortBy=start_date&sortType=asc&limit=2`)
            const data:any = await getEvents()
            if (data.data[0]?.createdAt) {
                const date = new Date(data.data[0]?.createdAt);
                const formattedDate = new Intl.DateTimeFormat("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }).format(date);
                setCreatedDate(formattedDate)
            }
        if (data) {
            const events = data.data.map((event: any) => ({
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
                subEvents : event.children.map((subEvent : any)=>({
                    eventId : subEvent.id,
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

            setLength(data.totalCount)
            setFetchedAddedEvents(events)
        } else {
            console.error('Error fetching events:', error);
        }
    }
    // const fetchEvents = async () => {
    //     const { data, error } = await myFetch(`${baseUrl}/event?sortBy=start_date&sortType=asc&limit=2`)
    //     if (data) {
    //         const events: AllEventsType[] = data.data.map((event: any) => ({
    //             eventId: event.id,
    //             name: event.name,
    //             cityName: event.data.location_city,
    //             countryName: event.data.location_country,
    //             description: event.data.description,
    //             startDate: event.data.start_date,
    //             endDate: event.data.end_date,
    //             format: event.data.format,
    //             isLinkedToWidget: event.isWidgetLinked,
    //             startTime: event.data.start_time,
    //             endTime: event.data.end_time,
    //             gmtZone: event.data.gmt_time,
    //             widgetTags: event.widgetData.map((item: { type: any }) => item.type).join(', '),
    //         }))
    //         setLength(data.totalCount)
    //         setFetchedAddedEvents(events)
    //     } if (error) {
    //         console.log(error)
    //     }
    // }
    useEffect(() => {
        fetchEvents()
    }, [])
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
        // const { data, error } = await myFetch(
        //     `${baseUrl}/event`,
        //     {
        //         method: 'PATCH',
        //         body: customizeData,
        //     }
        // );
        const data = await deleteEvent(customizeData)
        if (data) {
            setDeleteModal(false)
        }
        if (error) {
            console.log(error);
        }
    }
    const handleRoute = (e: any,eventId:string ) => {
        e.stopPropagation()
        router.push(`/widget/events/manage/${eventId}`);
    }
    
    return (
        <div className={styles.body}>
            <div className={styles.btnContainer}>
                <button className={`${styles.btn} ${selectedBtn === "Fetched" ? styles.selectedBtn : ""}`} onClick={() => setSelectedBtn("Fetched")}>
                    <span>Discovered Events</span>
                    <span className={`${styles.count} ${selectedBtn === "Fetched" ? styles.selectedCount : ""}`}>0</span>
                </button>
                <button className={`${styles.btn} ${selectedBtn === "Added" ? styles.selectedBtn : ""}`} onClick={() => setSelectedBtn("Added")}>
                    <span>Your Events</span>
                    <span className={`${styles.count} ${selectedBtn === "Added" ? styles.selectedCount : ""}`}>{addedEventsLength}</span>
                </button>
            </div>
            <div className={styles.addEvent}><span>Last added at: {createdDate}</span>
            {/* <Link href={"/widget/events"}>Fetch Now</Link> */}
            </div>
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
                            {fetchedAddedEvents.map((event, key) => (
                                <div style={{cursor:"pointer"}} className={styles.eventCard} key={key} onClick={(e) => handleRoute(e,event.mainEvent.eventId)}><DashboardEventCard handleDeleteModal={handleDeleteModal} width='large' fetchEvents={fetchEvents} event={event} /></div>
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
            {(deleteModal || deleteModalTwo) && <div className={styles.blackScreen}></div>}
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
                    <button className={styles.cancelBtn} onClick={() => setDeleteModalTwo(false)}>Close</button>
                    {/* <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button> */}
                </div>
            </div>}
        </div >
    )
}

export default DashboardEvents