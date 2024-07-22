import React from 'react'
import styles from './details.style.module.css'
import Image from 'next/image'
import Placeholder from '/public/placeholder3.png'
import AiIcon from '/public/AiIcon.svg'
import UploadIcon from '/public/UploadImageIcon.svg'
import ShareButtons from '@/app/components/DetailPage/ShareButtons'
import DateTimeContainer from './DateTimeContainer'
import LocationContainer from './LocationContainer'
import ParticipationContainer from './ParticipationContainer'
import RegistrationForm from './RegistrationForm'
import DescriptionContainer from './DescriptionContainer'

interface Props {
  setIsAddEventModalOpen: (value: boolean) => void
}
const Details = ({ setIsAddEventModalOpen }: Props) => {
  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button className={styles.closeBtn} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
        <button className={styles.addBtn}>Save and Add event</button>
      </div>
      <div className={styles.line}></div>
      <div className={styles.detailsContainer}>
        <div className={styles.leftSection}>
          <div className={styles.posterContainer}>
            <Image src={Placeholder} alt='Poster' width={296} height={290} />
            <div className={styles.posterIcons}>
              <div>
                <Image src={AiIcon} alt='aigenerate' className={styles.aiIcon}></Image>
              </div>
              <div>
                <Image src={UploadIcon} alt='upload'></Image>
              </div>
            </div>
          </div>
          <div className={styles.shareContainer}>
            <div className={styles.heading}>Share</div>
            <ShareButtons shareUrl='www.10times.com'/>
          </div>
        </div>
        <div className={styles.rightSection}>
          <textarea className={styles.eventName} placeholder='Event Name'></textarea>
          <div className={styles.dateTimeContainer}><DateTimeContainer/></div>
          <div className={styles.locationContainer}><LocationContainer/></div>
          <div className={styles.participationContainer}><ParticipationContainer/></div>
          <div className={styles.resgitrationContainer}><RegistrationForm/></div>
          <div className={styles.descriptionContainer}><DescriptionContainer/></div>
        </div>
      </div>
    </div>
  )
}

export default Details