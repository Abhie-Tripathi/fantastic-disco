import React, { FormEvent } from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import EventDescription from '@/app/components/internal/eventdetail/EventDescription'
import Organiser from '@/app/components/internal/eventdetail/Organiser'
import FestIcon from '/public/festival.svg'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import { generateHashtags } from '@/hooks/usHashtagsGenerator'

interface PageProps {
    hashtags: string[];
    description: string;
    eventName: string;
    shareUrl: string;
    title: string;
    media: string;
}

const Page = ({ hashtags, description, eventName, shareUrl, title, media }: PageProps) => {
    return (
        <div className={styles.body}>
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
                    <ShareButtons shareUrl={shareUrl} title={title} />
                </div>
            </div>
        </div>
    )
}
const DetailPage = async () => {
    const eventName = "Painting Fest";
    const description = "Unleash your creativity and immerse yourself in the world of art at the Painting Fest in New York. This vibrant celebration brings together artists, painters, and art enthusiasts from all walks of life to celebrate the joy of creation. Whether you're a seasoned artist or a novice, the festival offers a welcoming space to express yourself and explore new artistic horizons. From live painting demonstrations to interactive workshops, there's something for everyone to enjoy. Join us for a weekend filled with color, inspiration, and community as we come together to paint the town red, blue, and every color of the rainbow.";
    const hashtags = await generateHashtags(eventName, description);

    const shareUrl = "http://console.eventgeni.com/detailpage";
    const title = "Check out this amazing content!";
    const media = "https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg";

    return <Page hashtags={hashtags} description={description} eventName={eventName} shareUrl={shareUrl} title={title} media={media} />;
};
export default DetailPage;

export function generateMetadata() {
    const title = 'My Detail Page';
    const description = 'My Detail page description';

    return {
        title,
        description,
        openGraph: {
            images: ['https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg']
        }
    };
}
