import React, { useEffect } from 'react'
import styles from './details.style.module.css'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
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
  pageBgColor : string;
  eventFont : string;
}
const Details = ({ setIsAddEventModalOpen ,pageBgColor,eventFont}: Props) => {

  const isColorLight = (color:any) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };


  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button className={styles.closeBtn} onClick={() => setIsAddEventModalOpen(false)}>Close</button>
        <button className={styles.addBtn}>Save and Add event</button>
      </div>
      <div className={styles.line}></div>
      <div className={styles.detailsContainer} style={{backgroundColor : pageBgColor}}>
        <div className={styles.leftSection}>
          <div className={styles.posterContainer}>
            <Image src={Placeholder} alt='Poster' width={296} height={290} style={{borderRadius :20}}/>
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
          <textarea className={styles.eventName} placeholder='Event Name' style={{fontFamily : eventFont}}></textarea>
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