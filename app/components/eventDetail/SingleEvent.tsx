import React from 'react'
import styles from './singleEvent.module.css'
import Image from 'next/image';
import person1 from '@/public/person1.svg'
import person2 from '@/public/person2.svg'
import Calendar from '@/public/vector.svg'
import Location from '@/public/location.svg'
import Speaker1 from '@/public/speaker1.jpeg'
import rightArrowIcon from '/public/rightbigarrow.svg';
import { useTheme } from '@/context';

interface Data {
    imageUrl: string;
    name: string;
    description: string;
}

const SingleEvent = (params: { data: Data }) => {
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? styles.icons_light : styles.icon
    console.log(params.data);
    return (
        <div className={styles.card}>
            <div className={styles.topView}>
                <Image src={params.data.imageUrl} alt="eventImage" width={400} height={250} style={{ borderRadius: "12px", width: "90%" }} />
            </div>
            <div className={styles.downView}>
                <div className={styles.eventHeaderContainer}>
                    <div className={styles.eventHeading}>{params.data.name}</div>
                    <div onClick={params.handleShareModal} className={styles.shareBtnContainer} data-name="Share">
                        <Image src={shareIcon} alt="share"/>
                    </div>
                </div>
                <div className={styles.datecta}>
                    <div className={`${styles.calendar} ${theme === 'light' && styles.calendar_light}`}>
                        <Image src={Calendar} alt="Calendar" className={iconClass} />
                        <div className={styles.date}>1st Apr 2024</div>
                        <div>-</div>
                        <div className={styles.date}>30th Apr 2024</div>
                    </div>
                    <div className={styles.ctas}>
                        <div>Participation</div>
                        <div className={styles.pill}>Attending</div>
                    </div>
                </div>
                <div className={`${styles.locationInfo} ${theme === 'light' && styles.locationInfo_light}`}>
                    <div className={styles.locationDetail}>
                        <Image src={Location} alt="Location" className={iconClass} />
                        <div className={styles.des}>
                            <div>UrbanVault HSR Layout 1515</div>
                            <div>Bengaluru, Karnataka</div>
                        </div>
                    </div>
                    <div className={styles.eventDetails}>
                        <div className={styles.detailContainer}>
                            <div>View location</div>
                            <Image src={rightArrowIcon} alt="rightArrowIcon" width={50} height={24} className={iconClass} />
                        </div>
                    </div>
                </div>
                <div className={`${styles.description} ${theme === 'light' && styles.description_light}`}>
                    <div>Description</div>
                    <div>
                        {params.data.description}
                    </div>
                </div>
                <div className={styles.line}></div>
                <div className={styles.speakers}>
                    <div>Speakers</div>
                    <div className={styles.circles}>
                        <div className={styles.circle} data-name="John Doe">
                            <Image className={styles.image} src={person1} alt="person1" />
                        </div>
                        <div className={styles.circle} style={{ marginLeft: "-15px" }} data-name="Jane Smith">
                            <Image className={styles.image} src={person2} alt="person2" />
                        </div>
                        <div className={styles.circle} style={{ marginLeft: "-15px", width: "45px", height: "45px" }} data-name="Custom Name">
                            CN
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SingleEvent;
