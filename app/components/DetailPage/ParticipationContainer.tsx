import React from 'react'
import styles from './participation.style.module.css'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'
import AttendeeIcon from '/public/widgetimages/attendeeIcon.svg'
import SpeakerIcon from '/public/widgetimages/speakerIcon.svg'
import ExhibitorIcon from '/public/widgetimages/exhibitorIcon.svg'
import OrganiserIcon from '/public/widgetimages/organiserIcon.svg'

interface Props {
  participationType: string;
  participationMessage: string
}

const ParticipationContainer = ({ participationType, participationMessage }: Props) => {
  return (
    <div className={styles.body}>
      {participationType === "Attendee" ? (
        <div className={styles.selectedOption}>
          <div className={styles.option}>
            <Image src={AttendeeIcon} alt="icon" />
            <span>Attendee</span>
          </div>
        </div>
      ) : participationType === "Speaker" ? (
        <div className={styles.selectedOption}>
          <div className={styles.option}>
            <Image src={SpeakerIcon} alt="icon" />
            <span>Speaker</span>
          </div>
        </div>
      ) : participationType === "Exhibitor" ? (
        <div className={styles.selectedOption}>
          <div className={styles.option}>
            <Image src={ExhibitorIcon} alt="icon" />
            <span>Exhibitor</span>
          </div>
        </div>
      ) : participationType === "Organiser" ? (
        <div className={styles.selectedOption}>
          <div className={styles.option}>
            <Image src={OrganiserIcon} alt="icon" />
            <span>Organiser</span>
          </div>
        </div>
      ) : null}
      <div className={`${styles.line} ${styles[`line${participationType.toLowerCase()}`]}`}></div>
      <div className={`${styles.message} ${styles[`message${participationType.toLowerCase()}`]}`}>
        {participationMessage}
      </div>

    </div>
  )
}

export default ParticipationContainer