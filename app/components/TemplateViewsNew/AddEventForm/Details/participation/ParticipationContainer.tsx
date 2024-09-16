'use client'
import React, { useState } from 'react'
import styles from './participation.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'
import ParticipationDropdown from './ParticipationDropdown'
import useOutsideClick from '@/hooks/useOutsideClick'
import AttendeeIcon from '/public/widgetimages/attendeeIcon.svg'
import SpeakerIcon from '/public/widgetimages/speakerIcon.svg'
import ExhibitorIcon from '/public/widgetimages/exhibitorIcon.svg'
import OrganiserIcon from '/public/widgetimages/organiserIcon.svg'
import { showToast } from "@/utils/showToast";

interface Props {
  setParticipationType: (value: string) => void
  participationType: string;
  setParticipationMessage: (value: string) => void
  participationMessage: string
  size: string;
  theme?: string;
  type : string;
  isEventParticipationEmpty:boolean
}

const ParticipationContainer = ({ setParticipationType, participationType, setParticipationMessage, participationMessage, size, theme, type,isEventParticipationEmpty }: Props) => {

  const handleSelection = (type: string) => {
    setParticipationType(type);
    // setDropdown(true)
  }
  const handleCloseSelection = () => {
    // setDropdown(false)
    setParticipationType("")
  }
  const handleInputChange = (e: any) => {
    let value = e.target.value;
    
    const specialCharRegex = /[@#$%^&*"|<>]/g;

    if (specialCharRegex.test(value)) {
        showToast("error","Please check, input should not contain any special character");
    } else {
        setParticipationMessage(value);  
    }
  };
  return (
    <div className={`${styles.body} ${theme && theme === "dark" ? styles.darkBody : ""}`} >
      {(type === "normal" ? true : !participationType) ?
        <><div className={styles.header}>
          <Image src={ParticipationIcon} alt='svg' />
          <span>Choose Your Mode of Participation</span>
        </div>
          <div className={`${styles.options} ${isEventParticipationEmpty? styles.errorHighlight : ""}`} >
            <div className={`${styles.option} ${(type === "normal" && participationType === "Attendee") ? styles.activeOption : ""} `} onClick={() => handleSelection("Attendee")}>
              <Image src={AttendeeIcon} alt='icon' />
              <span>Attendee</span>
            </div>
            <div className={`${styles.option} ${(type === "normal" && participationType === "Speaker") ?styles.activeOption : ""}`} onClick={() => handleSelection("Speaker")}>
              <Image src={SpeakerIcon} alt='icon' />
              <span>Speaker</span>
            </div>
            <div className={`${styles.option} ${(type === "normal" && participationType === "Exhibitor") ?styles.activeOption : ""}`} onClick={() => handleSelection("Exhibitor")}>
              <Image src={ExhibitorIcon} alt='icon' />
              <span>Exhibitor</span>
            </div>
            <div className={`${styles.option} ${(type === "normal" && participationType === "Organiser") ?styles.activeOption : ""}`} onClick={() => handleSelection("Organiser")}>
              <Image src={OrganiserIcon} alt='icon' />
              <span>Organiser</span>
            </div>
          </div>
        </>
        :
        <>
          {(participationType === "Attendee" && type === "widget") ? (
            <div className={styles.selectedOption}>
              <div className={styles.option}>
                <Image src={AttendeeIcon} alt="icon" />
                <span>Attendee</span>
              </div>
              <div className={styles.inputContainer}>
                <input type="text" placeholder='Add your message here!' onChange={(e) => {handleInputChange(e)}} value={participationMessage}/>
                <span onClick={handleCloseSelection}>x</span>
              </div>
            </div>
          ) : (participationType === "Speaker" && type === "widget") ? (
            <div className={styles.selectedOption}>
              <div className={styles.option}>
                <Image src={SpeakerIcon} alt="icon" />
                <span>Speaker</span>
              </div>
              <div className={styles.inputContainer}>
                <input type="text" placeholder='Add your message here!' onChange={(e) => {handleInputChange(e)}} value={participationMessage}/>
                <span onClick={handleCloseSelection}>x</span>
              </div>
            </div>
          ) : (participationType === "Exhibitor" && type === "widget") ? (
            <div className={styles.selectedOption}>
              <div className={styles.option}>
                <Image src={ExhibitorIcon} alt="icon" />
                <span>Exhibitor</span>
              </div>
              <div className={styles.inputContainer}>
                <input type="text" placeholder='Add your message here!' onChange={(e) => {handleInputChange(e)}} value={participationMessage}/>
                <span onClick={handleCloseSelection}>x</span>
              </div>
            </div>
          ) : (participationType === "Organiser" && type === "widget") ? (
            <div className={styles.selectedOption}>
              <div className={styles.option}>
                <Image src={OrganiserIcon} alt="icon" />
                <span>Organiser</span>
              </div>
              <div className={styles.inputContainer}>
                <input type="text" placeholder='Add your message here!' onChange={(e) => {handleInputChange(e)}} value={participationMessage}/>
                <span onClick={handleCloseSelection}>x</span>
              </div>
            </div>
          ) : null}
        </>

      }
      {/* <div className={styles.participationContainer}>

        <div className={styles.inputMessage} dangerouslySetInnerHTML={{ __html: participationMessage }}></div>
      </div>

      <Image src={EditIcon} alt='edit' onClick={() => setDropdown(!dropdown)} className={styles.editBtn} />
      {dropdown && <div className={styles.dropdown} style={{width : size === "large" ? "150%" : "100%"}}>
        <ParticipationDropdown size={size} participationType={participationType} setParticipationType={setParticipationType} setInputMessage={setParticipationMessage} inputMessage={participationMessage} />
      </div>} */}
    </div >
  )
}

export default ParticipationContainer