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

interface PageProps {
    hashtags: string[];
    description: string;
    eventName: string;
    shareUrl: string
    media: string;
    emailSubject: string;
    emailBody: string;
}

const Mapview = React.lazy(() => import('@/app/components/DetailPage/Mapview'));

const Page = ({ hashtags, description, eventName, shareUrl, media, emailSubject, emailBody }: PageProps) => {
    return (
        <div className={`${styles.detailsContainer}`}>
            <div className={styles.leftSection}>
                <div className={styles.posterContainer}>
                    <Image src={"https://api.eventgeni.com/public/f5dff6bc-c589-49dd-bdde-f7ef407381ba2024-08-09T07:35:17.283Z.jpg"} alt='Poster' width={296} height={290} style={{ borderRadius: 20,objectFit:"cover"}} />
                </div>
                <div className={styles.participationContainer}><ParticipationContainer participationMessage='We are attending' participationType='Atendee' /></div>
                <div className={styles.shareContainer}>
                    <div className={styles.heading}>Share</div>
                    <ShareButtons shareUrl='www.10times.com' />
                </div>
            </div>
            <div className={styles.rightSection}>
                <textarea className={styles.eventName} disabled maxLength={80} placeholder='Event Name' value="Dance Show" style={{fontFamily : "Arial"}}/>
                <div className={styles.dateTimeContainer}><DateTimeContainer endDate="2024-08-07" startDate="2024-08-07" endTime="12:00 A.M" startTime="12:00 A.M" timeZone="GMT+05:30 Chennai" /></div>

                <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName="Delhi" countryName="India" /></div>

                <div className={styles.resgitrationContainer}><RegisterForm registerBtnColor="#6750a4" registerBtnText="Register" registerMessage="Come meet us" /></div>

                <div className={styles.map}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Mapview latitude={37.7749}
                            width={600}
                            longitude={-122.4194}
                            zoom={6} />
                    </Suspense>
                </div>
                <div className={styles.descriptionContainer} ><DescriptionContainer description={"Dance Show"} /></div>
            </div>
        </div>
    )
}
const fetchData = async (widgetId: string, eventId: string) => {
    const { data, error } = await myFetch(`https://api.eventgeni.com/widget/${widgetId}?eventId=${eventId}`);
    if(data){
        console.log(data)
    }
    return data;
};
const DetailPage = async ({ searchParams }: { searchParams: { widgetId: string; eventId: string } }) => {
    const { widgetId, eventId } = searchParams;
    console.log("widgetId:", widgetId);
    console.log("eventId:", eventId);

    try {
        const data = await fetchData(widgetId, eventId);
        return <Page {...data} />;
    } catch (error) {
        console.error("Error in DetailPage:", error);
        return <div>Error loading page data. Please try again later.</div>;
    }
};
export default DetailPage;


// export async function generateMetadata({ searchParams }: { searchParams: { widgetId: string; eventId: string } }) {
//     const { widgetId, eventId } = searchParams
//     const { eventName, description, media, shareUrl } = await fetchData(widgetId, eventId);
//     return {
//         title: eventName,
//         description: description,
//         openGraph: {
//             title: eventName,
//             description: description,
//             images: [media],
//             url: shareUrl,
//             type: "website"
//         },
//     };
// }

//     const hashtags = await generateHashtags(eventName, description);
//     const { emailSubject, emailBody } = await generateEmailContent(eventName, description)