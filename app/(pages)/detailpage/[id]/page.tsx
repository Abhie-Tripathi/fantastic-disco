'use client'
import React, { FormEvent, useState } from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import EventDescription from '@/app/components/internal/eventdetail/EventDescription'
import Organiser from '@/app/components/internal/eventdetail/Organiser'
import FestIcon from '/public/festival.svg'
import facebookIcon from '/public/facebook_icon.svg';
import instagramIcon from '/public/instagram_icon.svg';
import linkedinIcon from '/public/linkedin_icon.svg';
import xIcon from '/public/x_icon.svg';
import Link from 'next/link'
import CopyIcon from '/public/page.svg'
import TickIcon from '/public/tick.svg'
import Script from 'next/script'

const Page = () => {
    const tags = ["#paint", "#art", "#fest", "#fest", "#fest", "#fest", "#fest"]
    const description = "Unleash your creativity and immerse yourself in the world of art at the Painting Fest in New York. This vibrant celebration brings together artists, painters, and art enthusiasts from all walks of life to celebrate the joy of creation. Whether you're a seasoned artist or a novice, the festival offers a welcoming space to express yourself and explore new artistic horizons. From live painting demonstrations to interactive workshops, there's something for everyone to enjoy. Join us for a weekend filled with color, inspiration, and community as we come together to paint the town red, blue, and every color of the rainbow."

    const urlString = "https://console.eventgeni.com";
    const [copyClick, setCopyClick] = useState(false)

    const getShareLink = (type: string) => {
        let shareLink: string = '';

        switch (type) {
            case 'facebook':
                shareLink = 'https://www.facebook.com/sharer/sharer.php?u=';
                break;
            case 'twitter':
                shareLink = 'https://twitter.com/intent/tweet?&url=';
                break;
            case 'linkedin':
                shareLink = 'https://www.linkedin.com/shareArticle?mini=true&url=';
                break;
            case 'instagram':
                shareLink = "";
                break;
        }
        const finalLink = shareLink + urlString;
        return finalLink;
    }
    const handleCopy = () => {
        setCopyClick(true)
        const textToCopy = "https://console.eventgeni.com"
        navigator.clipboard.writeText(textToCopy);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className={styles.body}>
            <Script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js' />
            <popup-widget/>
            <div className={styles.leftContainer}>
                <div className={styles.headerContainer}>
                    <Image src={"https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg"} alt='poster' width={450} height={250} className={styles.poster} />

                </div>

                <div className={styles.tags}>{tags.map((tag, key) => (
                    <div key={key} className={styles.tag}>{tag}</div>
                ))}
                </div>
                <EventDescription open={false} description={description} speakers={false} shortlist={false} />
                <Organiser open={false} />
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.name_categoryContainer}>
                    <div className={styles.eventName}>Painting Fest</div>
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
                <form className={styles.registerContainer} onSubmit={handleSubmit}>
                    <div className={styles.registerHeading}>One Click Register</div>
                    <input type='text' placeholder='Enter your Name' className={styles.registerInput} />
                    <input type='text' placeholder='Enter your Email' className={styles.registerInput} />
                    <button type='button' className={styles.registerBtn}>Register</button>
                </form>
                <div className={styles.shareContainer}>
                    <div className={styles.shareHeading}>Share</div>
                    <div className={styles.shareIconContainer}>
                        <Link href={getShareLink('facebook')} target="_blank" >
                            <Image src={facebookIcon} alt="clock" width={30} height={30} />
                        </Link>
                        <Link href={getShareLink('twitter')} target="_blank" >
                            <Image src={xIcon} alt="clock" width={30} height={30} />
                        </Link>
                        <Link href={getShareLink('linkedin')} target="_blank" >
                            <Image src={linkedinIcon} alt="clock" width={30} height={30} />
                        </Link>
                        <Link href={getShareLink('instagram')} target="_blank" >
                            <Image src={instagramIcon} alt="clock" width={30} height={30} />
                        </Link>
                        {!copyClick && <div className={styles.copyContainer} data-name="Copy" onClick={handleCopy}>
                            <Image src={CopyIcon} alt='copy' className={styles.copyIcon} />
                        </div>}
                        {copyClick && <div className={styles.copyContainer} data-name="Copied">
                            <Image src={TickIcon} alt='copied' className={styles.copyIcon} width={30} height={30} />
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page