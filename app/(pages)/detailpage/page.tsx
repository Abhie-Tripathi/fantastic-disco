import React, { Suspense } from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import { generateHashtags } from '@/hooks/usHashtagsGenerator'
import { generateEmailContent } from '@/hooks/useEmailBody'
import Placeholder from '/public/placeholder.png'
import DateTimeContainer from '@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/DateTimeContainer'
import LocationContainer from '@/app/components/TemplateViewsNew/AddEventForm/Details/location/LocationContainer'
import ParticipationContainer from '@/app/components/TemplateViewsNew/AddEventForm/Details/participation/ParticipationContainer'
import RegistrationForm from '@/app/components/TemplateViewsNew/AddEventForm/Details/resgistration/RegistrationForm'
import DescriptionContainer from '@/app/components/TemplateViewsNew/AddEventForm/Details/description/DescriptionContainer'
import SpeakerProfile from '@/app/components/TemplateViewsNew/AddEventForm/Details/participation/speaker/SpeakerProfile'
import ExhibitorContainer from '@/app/components/TemplateViewsNew/AddEventForm/Details/participation/exhibitor/ExhibitorContainer'


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
        <div className={`${styles.detailsContainer}`} style={{ backgroundColor: "white" }}>
            <div className={styles.leftSection}>
                <div className={styles.posterContainer}>
                    <Image src={Placeholder} alt='Poster' width={296} height={290} style={{ borderRadius: 20 }} />
                </div>
                {/* <div className={styles.participationContainer}><ParticipationContainer participationMessage="We are attending" participationType="Attendee" /></div> */}
                <div className={styles.shareContainer}>
                    <div className={styles.heading}>Share</div>
                    <ShareButtons shareUrl='www.10times.com' />
                </div>
            </div>
            <div className={styles.rightSection}>
                <textarea className={styles.eventName} maxLength={80} placeholder='Event Name' value={eventName} />
                
                {/* <div className={styles.dateTimeContainer}><DateTimeContainer endDate="2024-08-07" startDate="2024-08-07" endTime="12:00 A.M" startTime="12:00 A.M" timeZone="GMT+05:30 Chennai" /></div> */}

                {/* <div className={styles.locationContainer}><LocationContainer eventFormat="In-Person" cityName="Delhi" countryName="India" /></div> */}

                {/* <div className={styles.resgitrationContainer}><RegistrationForm registerBtnColor="#6750a4" registerBtnText="Register" registerMessage="Come meet us" /></div> */}
                <div className={styles.map}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Mapview latitude={37.7749}
                            width={600}
                            longitude={-122.4194}
                            zoom={6} />
                    </Suspense>
                </div>
                {/* <div className={styles.descriptionContainer} ><DescriptionContainer description={description} /></div> */}
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

function LocationIcon() {
    return (
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.966 11.5463L8 15.59L4.03405 11.5463C1.82198 9.29089 1.82198 5.6208 4.03405 3.36537C6.2282 1.1282 9.77179 1.1282 11.966 3.36537C14.178 5.6208 14.178 9.29089 11.966 11.5463ZM13.1707 12.7279L9.18182 16.795L8 18L6.81817 16.795L2.82928 12.7279C-0.0264295 9.81623 -0.0264271 5.09545 2.82928 2.18377C5.685 -0.727923 10.315 -0.727923 13.1707 2.18377C16.0264 5.09545 16.0264 9.81623 13.1707 12.7279ZM9.125 7.3125C9.125 7.93381 8.62131 8.4375 8 8.4375C7.37868 8.4375 6.875 7.93381 6.875 7.3125C6.875 6.69118 7.37868 6.1875 8 6.1875C8.62131 6.1875 9.125 6.69118 9.125 7.3125ZM8 10.125C9.5533 10.125 10.8125 8.8658 10.8125 7.3125C10.8125 5.7592 9.5533 4.5 8 4.5C6.4467 4.5 5.1875 5.7592 5.1875 7.3125C5.1875 8.8658 6.4467 10.125 8 10.125Z" fill="#A1A1A1" />
        </svg>

    )
}