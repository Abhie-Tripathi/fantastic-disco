'use client'
import React, { useEffect, useState } from 'react'
import styles from './layout.style.module.css'
import { usePathname, useRouter } from 'next/navigation'
import { EventsType } from '@/types/alleventtype'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import AddEvent from '@/app/components/TemplateViewsNew/AddEventForm/AddEvent'
import Link from 'next/link'
import { EventContext } from '@/context/eventcontext'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();
    const trackerParams = pathName.split("/");
    const eventId = trackerParams[4]

    const [fetchedEvent, setFetchedEvent] = useState<EventsType>()
    const [addEventModal, setAddEventModal] = useState<boolean>(false)
    const [deleteModal, setDeleteModal] = useState<boolean>(false)
    const [deleteModalTwo, setDeleteModalTwo] = useState<boolean>(false)
    const [isPastEvent, setIsPastEvent] = useState<boolean>(false)

    useEffect(() => {
        const calculateIsPastEvent = () => {
            function convertTo24Hour(time : string) {
                // Use a regex to parse the hour, minute, and AM/PM part
                const [timeString, modifier] = time.split(' ');
                let [hours, minutes] = timeString.split(':');
            
                // Convert hours based on AM/PM
                if (modifier === 'P.M' && hours !== '12') {
                    hours = `${parseInt(hours, 10) + 12}`;
                } else if (modifier === 'A.M' && hours === '12') {
                    hours = '00';
                }
                return `${hours}:${minutes}`;
            }
            function getCurrentTime24Hour() {
                const now = new Date();
                return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
            }  
            function getCurrentDateFormatted() {
                const now = new Date();
                return now.toISOString().split('T')[0]; // returns "YYYY-MM-DD"
            }          
            const eventTime = convertTo24Hour(fetchedEvent?.endTime || "12:00 AM")
            const currentTime = getCurrentTime24Hour()
            const currentDate = getCurrentDateFormatted()
            if(currentDate > (fetchedEvent?.endDate || "1")){
                setIsPastEvent(true)
                console.log("this is being called")
            }else if(currentDate === fetchedEvent?.endDate){
                if(currentTime > eventTime){
                    setIsPastEvent(true)
                    console.log("this is being called")
                }else setIsPastEvent(false)
            }else setIsPastEvent(false)
        };

        // Call the function to set the state
        calculateIsPastEvent();
    }, [fetchedEvent])

    const fetchEventData = async () => {
        const { data, error } = await myFetch(`${baseUrl}/event/${eventId}?source=eventgtm`);
        if (error) {
            console.error(`Error fetching event data for event ID ${eventId}:`, error);
            return null;
        }
        const eventData = data?.data;
        // if (!eventData) return null;
        console.log("fetchedd", eventData)
        const eventObject: EventsType = {
            eventId: eventId, // Use eventId from the URL param
            name: data?.name || "",
            latitude: eventData.latitude || 0,
            longitude: eventData.longitude || 0,
            cityName: eventData.location_city || "",
            virtualLink : eventData.virtualLink || "",
            countryName: eventData.location_country || "",
            startDate: eventData.start_date || "",
            endDate: eventData.end_date || "",
            startTime: eventData.start_time || "",
            endTime: eventData.end_time || "",
            participationType: eventData.participationType || "",
            description: eventData.description || "",
            format: eventData.format || "",
            isLinkedToWidget: false, // Assuming this is not available in API, set a default value
            gmtZone: eventData.gmt_time || "", // Assuming this is `gmt_time` from the API
            interest: "", // Assuming this is missing from API, set default or handle later
            logoUrl: eventData.logoUrl || "",
            widgetTags: data?.widgetData,
            eventType: data?.type,
            event_type: eventData?.event_type,
            parentData: "",
            capacity: eventData.maxCapacity || 0,
            registration: data?.registration === true ? true : false,
            approval: data?.approval === true ? true : false,
            waitlisting: data?.waitlisting === true ? true : false,
            eventFormat:"",
            customizationData: {
                pageBgColor: eventData.customizationData?.pageBgColor || "",
                pageGradient: eventData.customizationData?.pageGradient || "",
                confettiType: eventData.customizationData?.confettiType || "",
                leavesTheme: eventData.customizationData?.leavesTheme || false,
                snowTheme: eventData.customizationData?.snowTheme || false,
                eventFont: eventData.customizationData?.eventFont || "",
                registerBtnColor: eventData.customizationData?.registerBtnColor || "",
                registerBtnText: eventData.customizationData?.registerBtnText || "",
                registerMessage: eventData.customizationData?.registerMessage || "",
                speaker: eventData.customizationData?.speaker || [],
                participationMessage: eventData.customizationData?.participationMessage || "",
                venue: eventData.customizationData?.venue || "",
                hashtags: eventData.customizationData?.hashtags || "",
                boothNumber: eventData.customizationData?.boothNumber || "",
                eventFormat: eventData.customizationData?.eventFormat || "",
                exhibitor: eventData.customizationData?.exhibitor || [],
            }
        };
        setFetchedEvent(eventObject)
    }
    const router = useRouter()
    const handleDelete = async () => {
        const customizeData = new FormData();
        customizeData.append("id", eventId)
        customizeData.append('published', "false");
        const { data, error } = await myFetch(
            `${baseUrl}/event`,
            {
                method: 'PATCH',

                body: customizeData,
            }
        );
        if (data) {
            router.push("/widget/events")
        }
        if (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchEventData()
    }, [])

    const handleDetailPage = () => {
        window.open(`/detailpage/${eventId}`)
    }

    return (
        <EventContext.Provider value={{ fetchEventData, eventId, fetchedEvent, setAddEventModal, setDeleteModal, setDeleteModalTwo,isPastEvent }}>
            <div className={styles.body}>
                <div className={styles.details}>
                    <div className={styles.header}>
                        <div className={styles.eventNameHeading}>{fetchedEvent?.name}</div>
                        <button onClick={handleDetailPage} className={styles.detailPageBtn}>Detail Page<Arrow /> </button>
                    </div>  
                    <div className={styles.navbar}>
                        <Link href={`/widget/events/manage/${eventId}/overview`}
                            className={`${styles.item} ${pathName == `/widget/events/manage/${eventId}/overview` ? styles.activeItem : ""
                                }`} >Overview</Link>

                        <Link href={`/widget/events/manage/${eventId}/guests`}
                            className={`${styles.item} ${pathName == `/widget/events/manage/${eventId}/guests` ? styles.activeItem : ""
                                }`}
                        >Guests </Link>

                        <Link href={`/widget/events/manage/${eventId}/settings`}
                            className={`${styles.item} ${pathName === `/widget/events/manage/${eventId}/settings` ? styles.activeItem : ""} ${fetchedEvent?.participationType && ["Attendee", "Exhibitor", "Speaker"].includes(fetchedEvent.participationType) ? styles.disabled : ""}`}
                        >Settings
                            {fetchedEvent?.participationType && ["Attendee", "Exhibitor", "Speaker"].includes(fetchedEvent.participationType) && <LockIcon />}</Link>

                        <Link href={`/widget/events/manage/${eventId}/blasts`}
                            className={`${styles.item} ${pathName === `/widget/events/manage/${eventId}/blasts` ? styles.activeItem : ""} ${styles.disabled}`}
                        >Blasts
                            <LockIcon />
                        </Link>
                    </div>
                    <div className={styles.selectedView}>
                        {children}
                    </div>
                </div>
                {addEventModal && <div className={styles.addEventModal}>
                    <AddEvent fetchEventData={fetchEventData} eventFlow={fetchedEvent?.eventType === "MAIN" ? "main" : "side"} widgetId='22323' prefilledEvent={fetchedEvent} setIsAddEventModalOpen={setAddEventModal} addedEventIds={[""]} />
                </div>}
                {deleteModal && <div className={styles.deleteModal}>
                    <div className={styles.deleteHeading}>Are you sure you want to delete this event?</div>
                    <span>{fetchedEvent?.name}</span>
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
            </div>
        </EventContext.Provider>
    )
}

export default Layout

function Arrow() {
    return (
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" fill="white" />
            <rect x="0.5" y="0.5" width="27" height="27" rx="13.5" stroke="#6750A4" />
            <path d="M18.6889 9.31004H10.8736L10.8736 10.412L16.8015 10.4159L8.91971 18.2977L9.70125 19.0793L17.5831 11.1975L17.587 17.1254L18.6889 17.1254V9.31004Z" fill="#6750A4" />
        </svg>
    )
}
function LockIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.2913 14.0166L16.9497 15.5749L16.2163 16.7666L12.9163 14.7499V10.1666H14.2913V14.0166ZM21.1663 13.8333C21.1663 17.8758 17.8755 21.1666 13.833 21.1666C11.9813 21.1666 10.2947 20.4699 9.00217 19.3333H4.66634C3.61217 19.3333 2.83301 18.5541 2.83301 17.4999V9.24992C2.83301 8.22325 3.64884 7.45325 4.66634 7.41659V6.95825C4.66634 4.67575 6.50884 2.83325 8.79134 2.83325C10.9363 2.83325 12.678 4.47409 12.8797 6.57325C13.1913 6.52742 13.5122 6.49992 13.833 6.49992C17.8755 6.49992 21.1663 9.79075 21.1663 13.8333ZM6.49967 7.41659H11.083V6.73825C10.973 5.57409 9.98301 4.66659 8.79134 4.66659C7.52634 4.66659 6.49967 5.69325 6.49967 6.95825V7.41659ZM19.333 13.8333C19.333 10.7991 16.8672 8.33325 13.833 8.33325C10.7988 8.33325 8.33301 10.7991 8.33301 13.8333C8.33301 16.8674 10.7988 19.3333 13.833 19.3333C16.8672 19.3333 19.333 16.8674 19.333 13.8333Z" fill="#7d7d7d" />
        </svg>

    )
}