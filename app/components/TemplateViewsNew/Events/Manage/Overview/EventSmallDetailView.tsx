import React from 'react'
import styles from './eventsmall.style.module.css'
// import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
import ParticipationContainer from './ParticipationContainer'
import DateTimeContainer from './DateTimeContainer'

interface Props {
    eventId: string
    imageUrl?: string;
    eventName?: string;
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    hashtags?: string;
    timeZone?: string;
    pageBgColor?: string;
    eventFont?: string;
    locationCity?: string;
    locationCountry?: string;
    participationType?: string;
}

const EventSmallDetailView = ({ eventId, imageUrl, eventName, startDate, endDate, startTime, endTime, hashtags, timeZone, pageBgColor, eventFont, locationCountry, locationCity, participationType }: Props) => {
    return (
        <div className={styles.outerbody}>
            <div className={styles.body} style={{ backgroundColor: pageBgColor }}>
                <div className={styles.leftSection}>
                    <div className={styles.posterContainer}>
                        <Image className={styles.poster} src={imageUrl || Placeholder} alt='Poster'
                            width={146} height={160}
                            style={{ borderRadius: 20, objectFit: "cover" }} />
                    </div>
                    <ParticipationContainer participationType={participationType}/>
                </div>
                <div className={styles.rightSection}>
                    <textarea className={styles.eventName} disabled placeholder='Event Name' value={eventName} style={{ fontFamily: eventFont }} />
                    <div className={styles.dateTimeContainer}>
                    <DateTimeContainer endDate={endDate || ""} startDate={startDate || ""} endTime={endTime || ""} startTime={startTime || ""} timeZone={timeZone || ""}/>
                    </div>

                    <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName={locationCity || ""} countryName={locationCountry || ""} /></div>
                </div>
            </div>
        </div>
    )
}

export default EventSmallDetailView