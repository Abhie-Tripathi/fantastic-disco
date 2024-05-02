import React from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import PageIcon from '/public/page.svg'
import PeopleIcon from '/public/people.svg'
import Placeholder from '/public/placeholder.png'
import RightArrowIcon from '/public/rightbigarrow.svg'
import CalendarIcon from '/public/calendar.svg'
import LocationIcon from '/public/location.svg'

const Page = () => {
    return (
        <div className={styles.body}>
            <div className={styles.leftContainer}>
                <Image src={"https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg"} alt='poster' width={400} height={300} className={styles.poster} />
                <div className={styles.eventName}>Painting Fest</div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.companyContainer}>
                    <div className={styles.headerContainer}>
                        <Image src={PeopleIcon} alt='bag' />
                        <div>Organiser</div>
                    </div>
                    <div className={styles.companyNameContainer}>
                        <Image src={Placeholder} alt='logo' width={50} height={50} className={styles.companyLogo} />
                        <div className={styles.companyNameDescContainer}>
                            <div className={styles.companyName}>Groot Campus</div>
                            <div className={styles.companyDesc}>Campus for everyone</div>
                        </div>
                        <Image src={RightArrowIcon} alt='icon' className={styles.rightArrow} />
                    </div>

                </div>
                <div className={styles.descContainer}>
                    <div className={styles.headerContainer}>
                        <Image src={PageIcon} alt='page' />
                        <div>Decription</div>
                    </div>
                    <div className={styles.eventDesc}>Unleash your creativity and immerse yourself in the world of art at the Painting Fest in New York. This vibrant celebration brings together artists, painters, and art enthusiasts from all walks of life to celebrate the joy of creation. Whether you're a seasoned artist or a novice, the festival offers a welcoming space to express yourself and explore new artistic horizons. From live painting demonstrations to interactive workshops, there's something for everyone to enjoy. Join us for a weekend filled with color, inspiration, and community as we come together to paint the town red, blue, and every color of the rainbow.
                    </div>
                </div>
                <div className={styles.dateContainer}>
                    <div className={styles.headerContainer}>
                        <Image src={CalendarIcon} alt='cal' />
                        <div>Dates</div>
                    </div>
                    <div className={styles.startDateEndDateContainer}>
                        <div className={styles.dateHeader}>
                            <div>Start Date : </div>
                            <div className={styles.date}>1st April, 2024</div>
                        </div>
                        <div className={styles.dateHeader}>
                            <div>End Date : </div>
                            <div className={styles.date}>2nd April, 2024</div>
                        </div>
                    </div>
                </div>
                <div className={styles.locationContainer}>
                    <div className={styles.headerContainer}>
                        <Image src={LocationIcon} alt='location' />
                        <div>Locaiton</div>
                    </div>
                    <div className={styles.location}>India</div>
                </div>
            </div>
        </div>
    )
}

export default Page