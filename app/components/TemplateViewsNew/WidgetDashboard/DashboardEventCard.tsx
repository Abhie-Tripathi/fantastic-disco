import React from 'react'
import styles from './dashboardeventcard.style.module.css'
import { AllEventsType } from '@/types/alleventtype';
import calendarIcon from "/public/calendar.svg";
import PlaceIcon from "/public/location.svg";
import Image from 'next/image';
import ClockIcon from "/public/clock.svg";
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';

interface Props {
    event: AllEventsType;
    fetchEvents?: (value: void) => void
    handleDeleteModal?: (id: string, name: string) => void
    handlePrefillEvent?: (value: AllEventsType) => void
    width: string;
}

const DashboardEventCard = ({ event, fetchEvents, handleDeleteModal, handlePrefillEvent, width }: Props) => {
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

    const handleDelete = async () => {
        if (handleDeleteModal) {
            handleDeleteModal(event.eventId, event.name)
        }
        else {
            const customizeData = new FormData();
            customizeData.append("id", event.eventId)
            customizeData.append('published', "false");
            const { data, error } = await myFetch(
                `${baseUrl}/event`,
                {
                    method: 'PATCH',
                    body: customizeData,
                }
            );
            if (data && fetchEvents) {
                fetchEvents()
            }
            if (error) {
                console.log(error);
            }
        }
    }
    return (
        <div className={width === "small" ? styles.smallouterDiv : styles.bigouterDiv}>
            <div className={width === "small" ? styles.smallCard : styles.bigCard}>
                <div className={width === "small" ? styles.bigName : styles.smallName}>{event.name}</div>
                <div className={styles.eventDataField} style={{ marginTop: 10 }}>
                    <Image src={PlaceIcon} alt="locationIcon" width={14} height={14} className="icons" />
                    <div>{event.cityName}, {event.countryName}</div>
                </div>
                <div className={styles.eventDateTimeContainer}>
                    <div className={styles.eventDataField}>
                        <Image src={calendarIcon} alt="calendarIcon" width={14} height={14} className='icons' />
                        <div>
                            {formatEventDates(event.startDate, event.endDate)}
                        </div>
                    </div>
                    <div className={styles.eventDataField}>
                        <Image src={ClockIcon} alt="clockIcon" width={14} height={14} className='icons' />
                        <div>{event.startTime}{" - "}{event.endTime}{", "}{event.gmtZone}</div>
                    </div>
                </div>
                <div className={styles.description} dangerouslySetInnerHTML={{ __html: event.description.substring(0,100) + (event.description.length > 100 ? "...":"") }}>
                </div>
                <div className={styles.tags_deleteContainer}>
                    <div className={styles.tags}>
                        <div className={styles.tag1}>Tradeshow</div>
                        <div className={styles.tag2}>In-Person</div>
                    </div>
                    <button className={styles.deleteBtn} onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default DashboardEventCard