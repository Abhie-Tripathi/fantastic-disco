import React from 'react'
import styles from './page.style.module.css'
import Image from 'next/image'
import EventDescription from '@/app/components/staticDetailPage/EventDescription'
import Organiser from '@/app/components/internal/eventdetail/Organiser'

const Page = () => {

    const tags = ["#paint", "#art", "#fest", "#fest", "#fest", "#fest", "#fest"]
    const description = "Unleash your creativity and immerse yourself in the world of art at the Painting Fest in New York. This vibrant celebration brings together artists, painters, and art enthusiasts from all walks of life to celebrate the joy of creation. Whether you're a seasoned artist or a novice, the festival offers a welcoming space to express yourself and explore new artistic horizons. From live painting demonstrations to interactive workshops, there's something for everyone to enjoy. Join us for a weekend filled with color, inspiration, and community as we come together to paint the town red, blue, and every color of the rainbow."

    return (
        <div className={styles.body}>
            <div className={styles.leftContainer}>
                <div className={styles.headerContainer}>
                    <Image src={"https://palmbeach.floridaweekly.com/wp-content/uploads/images/2023-02-23/27p1.jpg"} alt='poster' width={200} height={200} className={styles.poster} />
                    <div className={styles.eventNameTagsContainer}>
                        <div className={styles.eventName}>Painting Fest</div>
                        <div className={styles.tags}>{tags.map((tag, key) => (
                            <div key={key} className={styles.tag}>{tag}</div>
                        ))}
                        </div>
                    </div>

                </div>

                <EventDescription open={false} description={description} />
                <Organiser open={false} />
            </div>
            <div className={styles.rightContainer}>
            </div>
        </div>
    )
}

export default Page