import React from 'react'
import styles from './eventsmall.style.module.css'
import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'

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
}

const EventSmallDetailView = ({ eventId, imageUrl, eventName, startDate, endDate, startTime, endTime, hashtags, timeZone, pageBgColor, eventFont, locationCountry, locationCity }: Props) => {

    const console_url = process.env.NEXT_PUBLIC_CONSOLE_PAGE_DOMAIN

    return (
        <div className={styles.outerbody}>
            <div className={styles.body} style={{ backgroundColor: pageBgColor }}>
                <div className={styles.leftSection}>
                    <div className={styles.posterContainer}>
                        <Image className={styles.poster} src={imageUrl || Placeholder} alt='Poster'
                            width={196} height={180}
                            style={{ borderRadius: 20, objectFit: "cover" }} />
                    </div>
                    <div className={styles.shareContainer}>
                        <div className={styles.heading}>Share</div>
                        <ShareButtons disabled={false} shareUrl={`${console_url}/detailpage/${eventId}`} />
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <textarea className={styles.eventName} disabled placeholder='Event Name' value={eventName} style={{ fontFamily: eventFont }} />
                    <div className={styles.dateTimeContainer}><DateTimeContainer mobile endDate={endDate || ""} startDate={startDate || ""} endTime={endTime || ""} startTime={startTime || ""} timeZone={timeZone || ""} /></div>

                    <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName={locationCity || ""} countryName={locationCountry || ""} /></div>
                </div>
            </div>
        </div>
    )
}

export default EventSmallDetailView