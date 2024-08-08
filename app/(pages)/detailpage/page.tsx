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
import { useSearchParams } from 'next/navigation';
import DescriptionContainer from '@/app/components/DetailPage/DescriptionContainer'

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
                    <Image src={Placeholder} alt='Poster' width={296} height={290} style={{ borderRadius: 20 }} />
                </div>
                <div className={styles.participationContainer}><ParticipationContainer participationMessage='We are attending' participationType='Atendee' /></div>
                <div className={styles.shareContainer}>
                    <div className={styles.heading}>Share</div>
                    <ShareButtons shareUrl='www.10times.com' />
                </div>
            </div>
            <div className={styles.rightSection}>
                <textarea className={styles.eventName} disabled maxLength={80} placeholder='Event Name' value={eventName} />
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
                <div className={styles.descriptionContainer} ><DescriptionContainer description={description} /></div>
            </div>
        </div>
    )
}
const fetchData = async () => {
    const eventName = "Tomartina Tomato Fest";
    const description = "Get ready for a tomato-filled adventure at the annual Tomartina Tomato Fest in Italy. This lively celebration brings together locals and visitors alike for a fun-filled day of festivities centered around everyone's favorite red fruit. From tomato-themed games and competitions to juicy tomato tastings and street parades, there's no shortage of excitement at this one-of-a-kind event. Whether you're dodging tomatoes in the streets or indulging in tomato-inspired delicacies, the Tomartina Tomato Fest is an experience not to be missed.";
    const hashtags = await generateHashtags(eventName, description);
    const { emailSubject, emailBody } = await generateEmailContent(eventName, description)
    const shareUrl = "https://console.eventgeni.com/detailpage";
    const media = "https://images.ladepeche.fr/api/v1/images/view/63106cfdef5bdc39f1680c68/large/image.jpg?v=1";

    return { eventName, description, hashtags, shareUrl, media, emailSubject, emailBody };
};
const DetailPage = async () => {
    const data = await fetchData();
    return <Page {...data} />;
};
export default DetailPage;

export async function generateMetadata() {
    const { eventName, description, media, shareUrl } = await fetchData();
    return {
        title: eventName,
        description: description,
        openGraph: {
            title: eventName,
            description: description,
            images: [media],
            url: shareUrl,
            type: "website"
        },
    };
}
