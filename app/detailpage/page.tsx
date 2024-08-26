import React, { Suspense } from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import { generateHashtags } from '@/hooks/usHashtagsGenerator'
import { generateEmailContent } from '@/hooks/useEmailBody'
import Placeholder from '/public/placeholder.png'
import ParticipationContainer from '@/app/components/DetailPage/ParticipationContainer'
import DateTimeContainer from '@/app/components/DetailPage/DateTimeContainer'
import RegisterForm from '@/app/components/DetailPage/RegisterForm'
import LocationContainer from '@/app/components/DetailPage/LocationContainer'
import DescriptionContainer from '@/app/components/DetailPage/DescriptionContainer'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'
import { notFound } from 'next/navigation';

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
}

const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));

const Page = ({ venue, latitude, bannerUrl, eventFont, longitude, pageBgColor, registerBtnText, registerMessage, registerBtnColor, speakerProfilesData, participationMessage, name, format, logoUrl, end_date, end_time, gmt_time,
    start_date, start_time, description, location_city, location_country, widgetId, eventId }: EventProps) => {
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
                    <div className={styles.shareContainer}>
                        <div className={styles.heading}>Share</div>
                        <ShareButtons shareUrl={`https://console.eventgeni.com/detailpage?widgetId=${widgetId}&eventId=${eventId}`} />
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <textarea className={styles.eventName} disabled maxLength={80} placeholder='Event Name' value={name} style={{ fontFamily: eventFont }} />
                    <div className={styles.dateTimeContainer}><DateTimeContainer endDate={end_date} startDate={start_date} endTime={end_time} startTime={start_time} timeZone={gmt_time} /></div>

                    <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName={location_city} countryName={location_country} /></div>

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
const fetchData = async (widgetId: string, eventId: string) => {
    const { data, error } = await myFetch(`${baseUrl}/public/widget/${widgetId}`);
    if (error || !data || !data.widgetData || !data.widgetData.id) {
        console.log("Invalid widgetId or error encountered");
        notFound();
    }
    const eventFromOtherData = data.widgetData.otherdata?.event.find((event: any) => event.id === eventId);
    const eventFromEventData = data.eventData?.find((event: any) => event.id === eventId);
    if (!eventFromOtherData && !eventFromEventData) {
        console.log("Invalid eventId");
        notFound();
    }
    const mergedEventData = {
        ...eventFromOtherData,
        ...eventFromEventData,
    };
    return mergedEventData;
};
const DetailPage = async ({ searchParams }: { searchParams: { widgetId: string; eventId: string } }) => {
    const { widgetId, eventId } = searchParams;
    const data = await fetchData(widgetId, eventId);
    console.log("data is ,", data)
    return <Page {...data} widgetId={widgetId} eventId={eventId} />;
};
export default DetailPage;


export async function generateMetadata({ searchParams }: { searchParams: { widgetId: string; eventId: string } }) {
    const { widgetId, eventId } = searchParams
    const data = await fetchData(widgetId, eventId);

    // Check if data is valid, if not return 404 metadata
    if (!data || !data.name || !data.description || !data.bannerUrl) {
        return {
            title: "404 - Not Found",
            description: "The page you are looking for does not exist.",
            openGraph: {
                title: "404 - Not Found",
                description: "The page you are looking for does not exist.",
                images: [], // You can include a default 404 image if desired
                url: `https://console.eventgeni.com/detailpage?widgetId=${widgetId}&eventId=${eventId}`,
                type: "website"
            },
        };
    }
    const { name, description, bannerUrl } = data;
    return {
        title: name,
        description: description,
        openGraph: {
            title: name,
            description: description,
            images: [bannerUrl],
            url: `https://console.eventgeni.com/detailpage?widgetId=${widgetId}&eventId=${eventId}`,
            type: "website"
        },
    };
}

//     const hashtags = await generateHashtags(eventName, description);
//     const { emailSubject, emailBody } = await generateEmailContent(eventName, description)