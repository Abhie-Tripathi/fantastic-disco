import React from 'react'
import styles from './participation.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'

const ParticipationContainer = () => {
  return (
    <div className={styles.body}>
        <div className={styles.participationContainer}>Mode of Participation</div>
        <Image src={EditIcon} alt='edit'/>
    </div>
  )
}

export default ParticipationContainer