import React, { useState } from 'react'
import styles from './participation.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'
import ParticipationDropdown from './ParticipationDropdown'

interface Props{
  setParticipationType : (value : string)=>void
  participationType : string;
  setParticipationMessage : (value : string)=>void
  participationMessage : string
}

const ParticipationContainer = ({setParticipationType, participationType, setParticipationMessage,participationMessage} : Props) => {
  const [dropdown, setDropdown] = useState<boolean>(false)
  // const [inuputMessage, setInputMessage] = useState<string>("")
  return (
    <div className={styles.body}>
      {!participationMessage ? <div className={styles.participationContainer}>
        <Image src={ParticipationIcon} alt='svg' />
        <span>Mode of Participation</span>
      </div> :  
      <span className={styles.inputMessage}>{participationMessage}</span>}
      <Image src={EditIcon} alt='edit' onClick={() => setDropdown(!dropdown)} className={styles.editBtn}/>
      {dropdown && <div className={styles.dropdown}>
        <ParticipationDropdown participationType={participationType} setParticipationType={setParticipationType} setInputMessage={setParticipationMessage} inuputMessage={participationMessage  }/>
      </div>}
    </div>
  )
}

export default ParticipationContainer