'use client'
import React from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import EventDescription from '@/app/components/internal/eventdetail/EventDescription'
import Organiser from '@/app/components/internal/eventdetail/Organiser'
import Scores from '@/app/components/staticDetailPage/Scores'
import Map from '@/app/components/staticDetailPage/Map'
import DateCard from '@/app/components/staticDetailPage/DateCard'
import RightArrowIcon from "/public/rightbigarrow.svg"

const Page = () => {

    const tags = ["#paint", "#art", "#fest", "#fest", "#fest", "#fest", "#fest"]
    const description = "Unleash your creativity and immerse yourself in the world of art at the Painting Fest in New York. This vibrant celebration brings together artists, painters, and art enthusiasts from all walks of life to celebrate the joy of creation. Whether you're a seasoned artist or a novice, the festival offers a welcoming space to express yourself and explore new artistic horizons. From live painting demonstrations to interactive workshops, there's something for everyone to enjoy. Join us for a weekend filled with color, inspiration, and community as we come together to paint the town red, blue, and every color of the rainbow."

    return (
        <div className={styles.body}>
            <div className={styles.leftContainer}>
                <div className={styles.headerContainer}>
                    <Image src={"https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg"} alt='poster' width={250} height={250} className={styles.poster} />
                    <div className={styles.eventNameTagsContainer}>
                        <div className={styles.eventName}>Painting Fest</div>
                        <div className={styles.tags}>{tags.map((tag, key) => (
                            <div key={key} className={styles.tag}>{tag}</div>
                        ))}
                        </div>
                    </div>

                </div>

                <EventDescription open={true} description={description} speakers={false} shortlist={false} />
                <Organiser open={true} />
            </div>
            <div className={styles.rightContainer}>
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
                    <div className={styles.eventDetails_dates_container}>
                        <DateCard />
                        <DateCard />
                        <DateCard />
                        <DateCard />
                        <DateCard />
                        <DateCard />
                    </div>
                </div>
                <div className={styles.venueContainer}>
                    <div>
                        <div className={styles.venueHeading}>VENUE</div>
                        <div className={styles.venueName}>The Konzerthaus Berlin</div>
                        <div className={styles.venueLocation}>Gendarmenmarkt square</div>
                    </div>
                    <div className={styles.venueButton}>
                        <Image src={RightArrowIcon} alt='arrow' />
                        <div>Search this venue</div>
                    </div>
                </div>
                <div className={styles.score_locationContainer}>
                    <div className={styles.scoreContainer}>
                        <Scores />
                    </div>
                    <div className={styles.locationContainer}>
                        <div className={styles.locationHeading}>LOCATION</div>
                        <div className={styles.locationName}>Berlin, Germany</div>
                        <div className={styles.locationCoordinate}>Center : 40.7128, -74.0060</div>
                        <div className={styles.mapContainer}>
                            <Map lat={40.7128} long={-74.0060} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page