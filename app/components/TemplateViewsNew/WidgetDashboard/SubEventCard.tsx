import React from 'react'
import styles from './subeventcard.style.module.css'
import { AllEventsType, EventsType } from '@/types/alleventtype';
import calendarIcon from "/public/calendar.svg";
import PlaceIcon from "/public/location.svg";
import Image from 'next/image';
import ClockIcon from "/public/clock.svg";
import PopperImage from "/public/widgetimages/Popper.png";
import { useRouter } from 'next/navigation';

interface Props {
    normalEvent?: AllEventsType;
    subEvent?: EventsType;
    fetchEvents?: (value: void) => void
    handlePrefillEvent?: (value: EventsType) => void
    width: string;
    handlePrefillSubEvent? : (value : EventsType) => void
    setSelectedEventType?: (value : string)=>void
}

const SubEventCard = ({ normalEvent, subEvent, fetchEvents, handlePrefillEvent,handlePrefillSubEvent, width,setSelectedEventType }: Props) => {

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
    const handleDetailPage = () => {
        window.open(`/detailpage/${subEvent?.eventId}`)
    }
    const router = useRouter()
    const handleCardClick = () => {
        if(width === "small" && !handlePrefillEvent && !handlePrefillSubEvent){
            handleDetailPage()
        }
        else if (width === "small" && handlePrefillEvent && normalEvent) {
            // handlePrefillEvent(normalEvent)
            router.push(`/widget/events/manage/${normalEvent.mainEvent.eventId}/overview`)
        }else if(width === "small" && handlePrefillSubEvent && subEvent){
            // handlePrefillSubEvent(subEvent)
            router.push(`/widget/events/manage/${subEvent.eventId}/overview`)
        }
    }

    return (
        <div className={(width === "small" && normalEvent) ? styles.smallMainOuterDiv : (width === "small" && subEvent) ? styles.smallSubOuterDiv : styles.bigouterDiv}>
            <div className={width === "small"  ? styles.smallCard :  styles.bigCard} onClick={handleCardClick}>
                <Image src={PopperImage} alt='Popper' className={styles.popperImg} />
                {width === "small" && <div className={styles.imageContainer}>
                    <Image src={normalEvent?.mainEvent.logoUrl || subEvent?.logoUrl || PlaceIcon} alt='Banner' height={130} width={130} className='h-[130px] w-[130px]'/>
                    <div className={styles.squareOne}></div>
                    <div className={styles.squareTwo}></div>
                </div>}
                <div className={styles.details}>
                    <div className={width === "small" ? styles.bigName : styles.smallName}>{normalEvent?.mainEvent.name || subEvent?.name}</div>
                    <div className={styles.eventDataField} style={{ marginTop: 10 }}>
                        <Image src={PlaceIcon} alt="locationIcon" width={14} height={14} className="icons" />
                        {(normalEvent?.mainEvent.format === "Virtual" || subEvent?.format === "Virtual") ? <>Virtual</>:
                        <div>{normalEvent ? `${normalEvent?.mainEvent.cityName, normalEvent?.mainEvent.countryName}` : `${subEvent?.cityName, subEvent?.countryName}`}</div>}
                    </div>
                    <div className={styles.eventDateTimeContainer}>
                        <div className={styles.eventDataField}>
                            <Image src={calendarIcon} alt="calendarIcon" width={14} height={14} className='icons' />
                            <div>
                                {normalEvent && formatEventDates(normalEvent?.mainEvent.startDate, normalEvent?.mainEvent.endDate)}
                                {subEvent && formatEventDates(subEvent?.startDate, subEvent?.endDate)}
                            </div>
                        </div>
                        <div className={styles.eventDataField}>
                            <Image src={ClockIcon} alt="clockIcon" width={14} height={14} className='icons' />
                            <div>
                                {normalEvent ? `${normalEvent?.mainEvent.startTime}-${normalEvent?.mainEvent.endTime},${normalEvent?.mainEvent.gmtZone}` : `${subEvent?.startTime}-${subEvent?.endTime},${subEvent?.gmtZone}`}

                            </div>
                        </div>
                    </div>
                    <div className={styles.tags_deleteContainer}>
                        <div className={styles.tags}>
                            <div className={styles.tag1}>{normalEvent?.mainEvent.participationType || subEvent?.participationType}</div>
                            <div className={styles.tag2}>{normalEvent?.mainEvent.format || subEvent?.format}</div>
                        </div>
                        {/* <button className={styles.deleteBtn} onClick={(e) => handleDelete(e)}>Delete</button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubEventCard