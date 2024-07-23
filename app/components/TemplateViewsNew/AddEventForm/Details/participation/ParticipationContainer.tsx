import React, { useState } from 'react'
import styles from './participation.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'
import ParticipationDropdown from './ParticipationDropdown'


const ParticipationContainer = () => {
  const [dropdown, setDropdown] = useState<boolean>(false)
  return (
    <div className={styles.body}>
      <div className={styles.participationContainer}>
        <Image src={ParticipationIcon} alt='svg' />
        <span>Mode of Participation</span>
      </div>
      <Image src={EditIcon} alt='edit' onClick={() => setDropdown(!dropdown)} className={styles.editBtn}/>
      {dropdown && <div className={styles.dropdown}>
        <ParticipationDropdown />
      </div>}
    </div>
  )
}

export default ParticipationContainer