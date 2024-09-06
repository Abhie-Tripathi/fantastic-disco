'use client'
import React, { useState } from 'react'
import styles from './participation.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'
import ParticipationDropdown from './ParticipationDropdown'
import useOutsideClick from '@/hooks/useOutsideClick'

interface Props {
  setParticipationType: (value: string) => void
  participationType: string;
  setParticipationMessage: (value: string) => void
  participationMessage: string
  size : string;
  theme? : string;
}

const ParticipationContainer = ({ setParticipationType, participationType, setParticipationMessage, participationMessage,size, theme }: Props) => {
  const [dropdown, setDropdown] = useState<boolean>(false)
  const dropdownRef = useOutsideClick(() => setDropdown(false))
  return (
    <div className={`${styles.body} ${theme && theme === "dark"?styles.darkBody : ""}`} ref={dropdownRef}>
      <div className={styles.participationContainer}>
        <div className={styles.header}>
          <Image src={ParticipationIcon} alt='svg' />
          <span>Mode of Participation</span>
        </div>
        <div className={styles.inputMessage} dangerouslySetInnerHTML={{ __html: participationMessage }}></div>
      </div>

      <Image src={EditIcon} alt='edit' onClick={() => setDropdown(!dropdown)} className={styles.editBtn} />
      {dropdown && <div className={styles.dropdown} style={{width : size === "large" ? "150%" : "100%"}}>
        <ParticipationDropdown size={size} participationType={participationType} setParticipationType={setParticipationType} setInputMessage={setParticipationMessage} inputMessage={participationMessage} />
      </div>}
    </div>
  )
}

export default ParticipationContainer