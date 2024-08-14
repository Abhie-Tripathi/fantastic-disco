import React from 'react'
import styles from './participation.style.module.css'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'

interface Props{
  participationType : string;
  participationMessage : string
}

const ParticipationContainer = ({participationType,participationMessage} : Props) => {
  return (
    <div className={styles.body}>
      {!participationMessage ? <div className={styles.participationContainer}>
        <Image src={ParticipationIcon} alt='svg' />
        <span>Mode of Participation</span>
      </div> :  
      <span className={styles.inputMessage}>{participationMessage}</span>}
    </div>
  )
}

export default ParticipationContainer