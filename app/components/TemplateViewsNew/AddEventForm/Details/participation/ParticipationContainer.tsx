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
  size: string;
  theme?: string;
}

const ParticipationContainer = ({ setParticipationType, participationType, setParticipationMessage, participationMessage, size, theme }: Props) => {
  // const [dropdown, setDropdown] = useState<boolean>(false)
  // const dropdownRef = useOutsideClick(() => setDropdown(false))
  return (
    <div className={`${styles.body} ${theme && theme === "dark" ? styles.darkBody : ""}`} >
      <div className={styles.header}>
        <Image src={ParticipationIcon} alt='svg' />
        <span>Mode of Participation</span>
      </div>
      <div className={styles.participationTypes}>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={participationType === "Attendee"}
            onChange={() => setParticipationType("Attendee")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Attendee</span>
        </label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={participationType === "Speaker"}
            onChange={() => setParticipationType("Speaker")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Speaker</span>
        </label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={participationType === "Exhibitor"}
            onChange={() => setParticipationType("Exhibitor")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Exhibitor</span>
        </label>
        <label className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={participationType === "Organiser"}
            onChange={() => setParticipationType("Organiser")}
          />
          <span className={styles.customCheckbox}></span>
          <span className={styles.checkboxLabel}>Organiser</span>
        </label>
      </div>
      {/* <div className={styles.participationContainer}>

        <div className={styles.inputMessage} dangerouslySetInnerHTML={{ __html: participationMessage }}></div>
      </div>

      <Image src={EditIcon} alt='edit' onClick={() => setDropdown(!dropdown)} className={styles.editBtn} />
      {dropdown && <div className={styles.dropdown} style={{width : size === "large" ? "150%" : "100%"}}>
        <ParticipationDropdown size={size} participationType={participationType} setParticipationType={setParticipationType} setInputMessage={setParticipationMessage} inputMessage={participationMessage} />
      </div>} */}
    </div>
  )
}

export default ParticipationContainer