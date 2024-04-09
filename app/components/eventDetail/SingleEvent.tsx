import React from 'react'
import styles from './singleEvent.module.css'
import Image from 'next/image';
import Calendar from '@/public/vector.svg'
import Location from '@/public/location.svg'
import Speaker1 from '@/public/speaker1.jpeg'
import rightArrowIcon from '/public/rightbigarrow.svg';
const SingleEvent = (params) => {
    console.log(params.data);
  return (
    <div className={styles.card}>
    <div className={styles.topView}>
      <Image src={params.data.imageUrl} alt="eventImage" width={400} height={250} style={{borderRadius:"12px", width:"90%"}}/>
    </div>
    <div className={styles.downView}>
        <div className={styles.eventHeading}>{params.data.name}</div>
        <div className={styles.datecta}>
            <div className={styles.calendar}>
                <Image src={Calendar} alt="Calendar"/>
                <div className={styles.date}>1st Apr 2024</div>
                <div>-</div>
                <div className={styles.date}>30th Apr 2024</div>
            </div>
            <div className={styles.ctas}>
                <div>Participation</div>
                <div className={styles.pill}>Attending</div>
            </div>
        </div>
        <div className={styles.locationInfo}>
            <div className={styles.locationDetail}>
                <Image src={Location} alt="Location"/>
                <div className={styles.des}>
                    <div>UrbanVault HSR Layout 1515</div>
                    <div>Bengaluru, Karnataka</div>
                </div>
            </div>
            <div className={styles.eventDetails}>
          <div className={styles.detailContainer}>
            <div>View location</div>
            <Image src={rightArrowIcon} alt="rightArrowIcon" width={50} height={24} />
          </div>
        </div>
        </div>
        <div className={styles.description}>
        <div>Description</div>
        <div style={{textAlign:"justify"}}>
        Lorem ipsum dolor sit amet consectetur. In sit eget non aliquet nisi. Eu dictum sit fermentum lectus. Nunc hac tortor elit vestibulum lorem auctor. Risus interdum sagittis pulvinar at.Lorem ipsum dolor sit amet consectetur. In sit eget non aliquet nisiLorem ipsum dolor sit amet consectetur. In sit eget non aliquet nisi. Eu dictum sit fermentum lectus. Nunc hac tortor elit vestibulum lorem auctor. Risus interdum sagittis .
        </div>
        </div>
        <div className={styles.line}></div>
        <div className={styles.speakers}>
            <div>Speakers</div>
            <div className={styles.circles}>
                <div className={styles.circle}>A</div>
                <div className={styles.circle}>B</div>
                <div className={styles.circle}>C</div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default SingleEvent
