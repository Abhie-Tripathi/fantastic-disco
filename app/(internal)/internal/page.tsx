'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import Internal from '@/app/components/internal/Internal'
import EventDetail from '@/app/components/internal/eventdetail/EventDetail'
const Page = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleModal = () => {
    setModalOpen(!modalOpen)
  }
  return (
    <div className={`${styles.container} ${modalOpen ? styles.modalOpen : ""}`}>
      <div className={styles.innerContainer}>
        <div className={styles.container1}>
          <div className={styles.number}>12</div>
          <div className={styles.heading}>Exhibitors</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.number}>6</div>
          <div className={styles.heading}>Sponsores</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.number}>12</div>
          <div className={styles.heading}>Speakers</div>
        </div>
        <div className={styles.container1}>
          <div className={styles.number}>12</div>
          <div className={styles.heading}>Attendee</div>
        </div>
      </div>
      {!modalOpen && <Internal handleModal = {handleModal} />}
      {modalOpen && <div className={styles.modal}>
        <EventDetail openEventDetails={true} openOrganiserDetails={false} openPocDetails={false} closeBtn={true} handleModal={handleModal} />
      </div>}
    </div>

  )
}

export default Page
