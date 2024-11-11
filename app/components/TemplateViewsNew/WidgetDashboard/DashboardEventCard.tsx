import React from 'react'
import styles from './dashboardeventcard.style.module.css'
import { AllEventsType, EventsType } from '@/types/alleventtype';
import calendarIcon from "/public/calendar.svg";
import PlaceIcon from "/public/location.svg";
import Image from 'next/image';
import ClockIcon from "/public/clock.svg";
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import SubEventCard from './SubEventCard';
import { useRouter } from 'next/navigation';

interface Props {
    event: AllEventsType;
    fetchEvents?: (value: void) => void
    handleDeleteModal: (id: string, name: string, isPresentinWidget: boolean) => void
    handlePrefillEvent?: (value: EventsType) => void
    handlePrefillSubEvent?: (value: EventsType) => void
    width: string;
    setSelectedEventType?: (value: string) => void
}

const DashboardEventCard = ({ event, fetchEvents, handleDeleteModal, handlePrefillEvent, handlePrefillSubEvent, width, setSelectedEventType }: Props) => {
    function formatEventDates(startDate: string, endDate: string) {

        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start.getFullYear() === end.getFullYear()) {
            if (start.getMonth() === end.getMonth()) {
                if (start.getDate() === end.getDate()) {
                    return new Date(startDate).toLocaleDateString("en-GB", {
                        weekday: 'long',
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    });
                } else {
                    return (
                        new Date(startDate).toLocaleDateString("en-GB", {
                            weekday: 'long',
                        }) + ', ' +
                        new Date(startDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                        }) + ' - ' +
                        new Date(endDate).toLocaleDateString("en-GB", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        })
                    );
                }
            } else {
                return (
                    new Date(startDate).toLocaleDateString("en-GB", {
                        weekday: 'long',
                        month: "short",
                        day: "2-digit",
                    }) + ' - ' +
                    new Date(endDate).toLocaleDateString("en-GB", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })
                );
            }
        } else {
            return (
                new Date(startDate).toLocaleDateString("en-GB", {
                    weekday: 'long',
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }) + ' - ' +
                new Date(endDate).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                })
            );
        }
    }
    const router = useRouter()
    const handleCardClick = () => {
        if (width === "small" && handlePrefillEvent) {
            // handlePrefillEvent(event)
            router.push(`/widget/events/manage/${event.mainEvent.eventId}/overview`)
        }
    }
    
    let prevDate: any = null;
    return (
        <div className={width === "small" ? styles.smallouterDiv : styles.bigouterDiv}>
            <div className={width === "small" ? styles.cardSubeventContainer : ""}>
                <div className={width === "small" ? styles.smallCard : styles.bigCard} onClick={handleCardClick}>
                    {width === "small" && <div className={styles.imageContainer}>
                        <Image src={event.mainEvent.logoUrl} alt='Banner' height={130} width={130} className='h-[130px] w-[130px]'/>
                    </div>}
                    <div className={styles.details}>
                        <div className={width === "small" ? styles.bigName : styles.smallName}>{event.mainEvent.name}</div>
                        <div className={styles.eventDataField} style={{ marginTop: 10 }}>
                            <Image src={PlaceIcon} alt="locationIcon" width={14} height={14} className="icons" />
                            {
                                event?.mainEvent.format === "Virtual"?<>Virtual</>: <div>{event.mainEvent.cityName}, {event.mainEvent.countryName}</div>
                            }
                            {/* <div>{event.mainEvent.cityName}, {event.mainEvent.countryName}</div> */}
                        </div>
                        <div className={styles.eventDateTimeContainer}>
                            <div className={styles.eventDataField}>
                                <Image src={calendarIcon} alt="calendarIcon" width={14} height={14} className='icons' />
                                <div>
                                    {formatEventDates(event.mainEvent.startDate, event.mainEvent.endDate)}
                                </div>
                            </div>
                            <div className={styles.eventDataField}>
                                <Image src={ClockIcon} alt="clockIcon" width={14} height={14} className='icons' />
                                <div>{event.mainEvent.startTime}{" - "}{event.mainEvent.endTime}{", "}{event.mainEvent.gmtZone}</div>
                            </div>
                        </div>
                        {/* <div className={styles.description} dangerouslySetInnerHTML={{ __html: event.mainEvent.description.substring(0, 100) + (event.mainEvent.description.length > 100 ? "..." : "") }}>
                        </div> */}
                        <div className={styles.tags_deleteContainer}>
                            <div className={styles.tags}>
                                <div className={styles.tag1}>{event.mainEvent.participationType}</div>
                                <div className={styles.tag2}>{event.mainEvent?.format}</div>
                            </div>
                            {/* <button className={styles.deleteBtn} onClick={(e) => handleDelete(e)}>Delete</button> */}
                        </div>
                    </div>
                </div>
                {(event.subEvents.length > 0 && width==="small") && (
                    <div className={styles.subEventsContainer}>
                        {event.subEvents.map((subEvent, index) => {
                            const showDate = subEvent.startDate !== prevDate;
                            prevDate = subEvent.startDate; // Ensure prevDate is defined before mapping
                            return (
                                <div key={index} className={styles.container}>
                                    <TimelineItem eventDate={showDate ? subEvent.startDate : null} />
                                    <SubEventCard
                                        setSelectedEventType={setSelectedEventType}
                                        handlePrefillSubEvent={handlePrefillSubEvent}
                                        width="small"
                                        subEvent={subEvent}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    )
}

export default DashboardEventCard