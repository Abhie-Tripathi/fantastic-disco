import React, { FormEvent } from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import EventDescription from '@/app/components/internal/eventdetail/EventDescription'
import Organiser from '@/app/components/internal/eventdetail/Organiser'
import FestIcon from '/public/festival.svg'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import { generateHashtags } from '@/hooks/usHashtagsGenerator'
import MoreEvents from '@/app/components/DetailPage/MoreEvents'
import Script from 'next/script'
import { url } from 'inspector'

interface PageProps {
    hashtags: string[];
    description: string;
    eventName: string;
    shareUrl: string
    media: string;
}

const Page = ({ hashtags, description, eventName, shareUrl, media }: PageProps) => {
    return (
        <div className={styles.body}>
            <Script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'/>
            <popup-widget/>
            <div className={styles.eventDetailContainer}>
                <div className={styles.leftContainer}>
                    <div className={styles.headerContainer}>
                        <Image src={media} alt='poster' width={450} height={250} className={styles.poster} />

                    </div>
                    <div className={styles.tags}>{hashtags.map((tag, key) => (
                        <div key={key} className={styles.tag}>{tag}</div>
                    ))}
                    </div>
                    <EventDescription open={false} description={description} speakers={false} shortlist={false} />
                    <Organiser open={false} />
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.name_categoryContainer}>
                        <div className={styles.eventName}>{eventName}</div>
                        <div className={styles.categoryContainer}>
                            <Image src={FestIcon} alt='fest' />
                            <div className={styles.category}>Tradeshow</div>
                        </div>
                    </div>
                    <div className={styles.datesContainer}>
                        <div className={styles.eventDetails_dateTime_heading}>
                            Date & Time
                        </div>
                        <div className={styles.eventDetails_date_heading}>Dates</div>
                        <div className={styles.eventDetails_dateTime}>
                            <div className={styles.eventDetails_dateTime_container}>
                                <div>Sun, 17 Mar 2024</div>
                                <span>7:00 AM</span>
                                <div>Tue, 19 Mar 2024</div>
                                <span>6:45 PM</span>
                            </div>
                            <div className={styles.eventDetails_timeZone_container}>
                                TIME ZONE: -0500 (AMERICA/NEW_YORK)
                            </div>
                        </div>
                    </div>
                    <form className={styles.registerContainer} >
                        <div className={styles.registerHeading}>One Click Register</div>
                        <input type='text' placeholder='Enter your Name' className={styles.registerInput} />
                        <input type='text' placeholder='Enter your Email' className={styles.registerInput} />
                        <button type='button' className={styles.registerBtn}>Register</button>
                    </form>
                    <div className={styles.shareContainer}>
                        <div className={styles.shareHeading}>Share</div>
                        <ShareButtons shareUrl={shareUrl} title={eventName} hashtags = {hashtags}/>
                    </div>
                </div>
            </div>
            <div className={styles.moreEventsContainer}>
                <MoreEvents/>
            </div>
        </div>
    )
}
const fetchData = async () => {
    const eventName = "Tomartina Tomato Fest";
    const description = "Get ready for a tomato-filled adventure at the annual Tomartina Tomato Fest in Italy. This lively celebration brings together locals and visitors alike for a fun-filled day of festivities centered around everyone's favorite red fruit. From tomato-themed games and competitions to juicy tomato tastings and street parades, there's no shortage of excitement at this one-of-a-kind event. Whether you're dodging tomatoes in the streets or indulging in tomato-inspired delicacies, the Tomartina Tomato Fest is an experience not to be missed.";
    const hashtags = await generateHashtags(eventName, description);
    const shareUrl = "https://console.eventgeni.com/detailpage";
    const media = "https://images.ladepeche.fr/api/v1/images/view/63106cfdef5bdc39f1680c68/large/image.jpg?v=1";

    return { eventName, description, hashtags, shareUrl, media };
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
            url: shareUrl 
        },
        
    };
}
