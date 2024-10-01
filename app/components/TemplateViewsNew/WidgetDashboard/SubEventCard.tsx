import React from 'react'
import styles from './subeventcard.style.module.css'
import { AllEventsType, EventsType } from '@/types/alleventtype';
import calendarIcon from "/public/calendar.svg";
import PlaceIcon from "/public/location.svg";
import Image from 'next/image';
import ClockIcon from "/public/clock.svg";
import PopperImage from "/public/widgetimages/Popper.png";

interface Props {
    normalEvent?: AllEventsType;
    subEvent?: EventsType;
    fetchEvents?: (value: void) => void
    handleDeleteModal: (id: string, name: string, isPresentinWidget: boolean) => void
    handlePrefillEvent?: (value: AllEventsType) => void
    width: string;
}

const SubEventCard = ({ normalEvent, subEvent, fetchEvents, handleDeleteModal, handlePrefillEvent, width }: Props) => {

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

    const handleCardClick = () => {
        if (width === "small" && handlePrefillEvent && normalEvent) {
            handlePrefillEvent(normalEvent)
        }
    }

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        if (normalEvent)
            handleDeleteModal(normalEvent.mainEvent.eventId, normalEvent.mainEvent.name, false)
    }
    return (
        <div className={(width === "small" && normalEvent) ? styles.smallMainOuterDiv : (width === "small" && subEvent) ? styles.smallSubOuterDiv : styles.bigouterDiv}>
            <div className={(width === "small" && normalEvent) ? styles.smallMainCard : (width === "small" && subEvent) ? styles.smallSubCard : styles.bigCard} onClick={handleCardClick}>
                <Image src={PopperImage} alt='Popper' className={styles.popperImg} />
                {width === "small" && <div className={styles.imageContainer}>
                    <Image src={normalEvent?.mainEvent.logoUrl || subEvent?.logoUrl || PlaceIcon} alt='Banner' height={130} width={130} />
                    <div className={styles.squareOne}></div>
                    <div className={styles.squareTwo}></div>
                </div>}
                <div className={styles.details}>
                    <div className={width === "small" ? styles.bigName : styles.smallName}>{normalEvent?.mainEvent.name || subEvent?.name}</div>
                    <div className={styles.eventDataField} style={{ marginTop: 10 }}>
                        <Image src={PlaceIcon} alt="locationIcon" width={14} height={14} className="icons" />
                        <div>{normalEvent ? `${normalEvent?.mainEvent.cityName, normalEvent?.mainEvent.countryName}` : `${subEvent?.cityName, subEvent?.countryName}`}</div>
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
                    <div className={styles.description} dangerouslySetInnerHTML={{
                            __html:
                                normalEvent
                                    ? (normalEvent?.mainEvent.description?.substring(0, 100) +
                                        (normalEvent?.mainEvent.description?.length > 100 ? "..." : "")):
                                subEvent ? (subEvent?.description?.substring(0, 100) +
                                        (subEvent?.description?.length > 100 ? "..." : "")) : ""
                        }}
                    >
                    </div>
                    <div className={styles.tags_deleteContainer}>
                        <div className={styles.tags}>
                            <div className={styles.tag1}>Tradeshow</div>
                            <div className={styles.tag2}>In-Person</div>
                        </div>
                        <button className={styles.deleteBtn} onClick={(e) => handleDelete(e)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubEventCard