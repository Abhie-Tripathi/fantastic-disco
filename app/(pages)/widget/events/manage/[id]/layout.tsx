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

    const fetchEventData = async () => {
        const { data, error } = await myFetch(`${baseUrl}/event/${eventId}?source=eventgtm`);
        if (error) {
            console.error(`Error fetching event data for event ID ${eventId}:`, error);
            return null;
        }
        const eventData = data?.data;
        // if (!eventData) return null;

        const eventObject: EventsType = {
            eventId: eventId, // Use eventId from the URL param
            name: data?.name || "",
            latitude: eventData.latitude || 0,
            longitude: eventData.longitude || 0,
            cityName: eventData.location_city || "",
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
            widgetTags: "",
            eventType: data?.type, // Assuming this is missing from API, set default or handle later
            parentData: "",
            customizationData: {
                pageBgColor: eventData.customizationData?.pageBgColor || "",
                eventFont: eventData.customizationData?.eventFont || "",
                registerBtnColor: eventData.customizationData?.registerBtnColor || "",
                registerBtnText: eventData.customizationData?.registerBtnText || "",
                registerMessage: eventData.customizationData?.registerMessage || "",
                speakerProfilesData: eventData.customizationData?.speakerProfilesData || [],
                participationMessage: eventData.customizationData?.participationMessage || "",
                venue: eventData.customizationData?.venue || "",
                hashtags: eventData.customizationData?.hashtags || "",
                boothNumber: eventData.customizationData?.boothNumber || "",
                eventFormat: eventData.customizationData?.eventFormat || "",
            }
        };
        setFetchedEvent(eventObject)
    }

    useEffect(() => {
        fetchEventData()
    }, [])
    const router = useRouter()
    const handleDetailPage = () => {
        router.push(`/detailpage/${eventId}`)
    }

    return (
        <EventContext.Provider value={{ eventId, fetchedEvent, setAddEventModal }}>
            <div className={styles.body}>
                <div className={styles.details}>
                    <div className={styles.header}>
                        <div className={styles.eventNameHeading}>{fetchedEvent?.name}</div>
                        <button onClick={handleDetailPage} className={styles.detailPageBtn}>Detail Page<Arrow /> </button>
                    </div>
                    <div className={styles.navbar}>
                        <Link href={`/widget/events/manage/${eventId}/overview`} className={`${styles.item} ${pathName == `/widget/events/manage/${eventId}/overview` ? styles.activeItem : ""
                            }`} >Overview</Link>

                        <Link href={`/widget/events/manage/${eventId}/guests`} className={`${styles.item} ${pathName == `/widget/events/manage/${eventId}/guests` ? styles.activeItem : ""
                            }`}>Guests</Link>

                        <Link href={`/widget/events/manage/${eventId}/registration`} className={`${styles.item} ${pathName == `/widget/events/manage/${eventId}/registration` ? styles.activeItem : ""
                            }`} >Registration</Link>

                        <Link href={`/widget/events/manage/${eventId}/blasts`} className={`${styles.item} ${pathName == `/widget/events/manage/${eventId}/blasts` ? styles.activeItem : ""
                            }`} >Blasts</Link>
                    </div>
                    <div className={styles.selectedView}>
                        {children}
                    </div>
                </div>
                {addEventModal && <div className={styles.addEventModal}>
                    <AddEvent fetchEventData={fetchEventData} eventFlow={fetchedEvent?.eventType === "MAIN" ? "main" : "side"} widgetId='22323' prefilledEvent={fetchedEvent} setIsAddEventModalOpen={setAddEventModal} addedEventIds={[""]} />
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