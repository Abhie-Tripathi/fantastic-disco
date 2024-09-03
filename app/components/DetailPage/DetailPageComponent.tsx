'use client'
import React, { Suspense, useEffect, useState } from 'react'
import styles from './detailpage.style.module.css'
import Image from 'next/image'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import { generateEmailContent } from '@/hooks/useEmailBody'
import ParticipationContainer from '@/app/components/DetailPage/ParticipationContainer'
import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import RegisterForm from '@/app/components/DetailPage/RegisterForm'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'
import DescriptionContainer from '@/app/components/DetailPage/DescriptionContainer'

interface EventProps {
    venue: string;
    latitude: number;
    bannerUrl: string;
    eventFont: string;
    longitude: number;
    pageBgColor: string;
    registerBtnText: string;
    registerMessage: string;
    registerBtnColor: string;
    speakerProfilesData: any[];
    participationMessage: string;
    name: string;
    format: string;
    logoUrl: string;
    end_date: string;
    end_time: string;
    gmt_time: string;
    start_date: string;
    start_time: string;
    description: string;
    location_city: string;
    location_country: string;
    widgetId: string;
    eventId: string;
    hashtags: string;
}

const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));
const DetailPageComponent = ({ venue, latitude, bannerUrl, eventFont, longitude, pageBgColor, registerBtnText, registerMessage, registerBtnColor, speakerProfilesData, participationMessage, name, format, logoUrl, end_date, end_time, gmt_time,
    start_date, start_time, description, location_city, location_country, widgetId, eventId, hashtags }: EventProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 821);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className={styles.body}
            style={{ backgroundColor: pageBgColor }}
        >
            <div className={styles.detailsContainer}>
                <div className={styles.leftSection}>
                    <div className={styles.posterContainer}>
                        <Image className={styles.poster} src={bannerUrl} alt='Poster'
                            width={296} height={290}
                            style={{ borderRadius: 20, objectFit: "cover" }} />
                    </div>
                    <div className={styles.participationContainer}><ParticipationContainer participationMessage={participationMessage} participationType='Atendee' /></div>

                    <div className={styles.hashtagsContainer}>
                        {hashtags.split(",").map((tag, key)=>(
                            <div className={styles.hashtag} key={key}>{tag}</div>
                        ))}
                    </div>
                    <div className={styles.shareContainer}>
                        <div className={styles.heading}>Share</div>
                        <ShareButtons shareUrl={`https://console.eventgeni.com/detailpage?widgetId=${widgetId}&eventId=${eventId}`} />
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <textarea className={styles.eventName} disabled placeholder='Event Name' value={name} style={{ fontFamily: eventFont }} />
                    <div className={styles.dateTimeContainer}><DateTimeContainer endDate={end_date} startDate={start_date} endTime={end_time} startTime={start_time} timeZone={gmt_time} /></div>

                    <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName={location_city} countryName={location_country} /></div>
                    {isMobile &&
                        <div className={styles.detailPageMobileView}>
                            <div className={styles.mobile_participationContainer}><ParticipationContainer participationMessage={participationMessage} participationType='Atendee' /></div>
                            <div className={styles.mobile_shareContainer}>
                                <div className={styles.heading}>Share</div>
                                <ShareButtons shareUrl={`https://console.eventgeni.com/detailpage?widgetId=${widgetId}&eventId=${eventId}`} />
                            </div>
                        </div>
                    }
                    <div className={styles.resgitrationContainer}><RegisterForm registerBtnColor={registerBtnColor} registerBtnText={registerBtnText} registerMessage={registerMessage} widgetId={widgetId} eventId={eventId} /></div>

                    <div className={styles.map}>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Mapview latitude={latitude}
                                venue={venue}
                                longitude={longitude}
                                zoom={6} />
                        </Suspense>
                    </div>
                    <div className={styles.descriptionContainer} ><DescriptionContainer description={description} /></div>
                </div>
            </div>
            <div className={styles.line}></div>
            <footer className={styles.footer}>Powered by Eventgeni &copy; 2024</footer>
        </div>
    )
}

export default DetailPageComponent