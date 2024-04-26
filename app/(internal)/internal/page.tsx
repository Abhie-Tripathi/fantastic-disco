'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import Internal from '@/app/components/internal/Internal'
import EventDetail from '@/app/components/internal/eventdetail/EventDetail'
import TypeOfEventsCount from '@/public/data/TypeOfEventsCount.json'

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleModal = () => {
    setModalOpen(!modalOpen)
  }
  const totalCount = TypeOfEventsCount.reduce((total, item) => total + item.count, 0);

  return (
    <div className={`${styles.container} ${modalOpen ? styles.modalOpen : ""}`}>
      {totalCount >= 9 && (
        <div className={styles.innerContainer}>
          {TypeOfEventsCount.map((item, key) => (
            <div className={styles.container1} key={key}>
              <div className={styles.number}>{item.count}</div>
              <div className={styles.heading}>{item.name}</div>
            </div>
          ))}
        </div>)}
      {!modalOpen && <Internal handleModal={handleModal} />}
      {modalOpen && <div className={styles.modal}>
        <EventDetail openEventDetails={true} openOrganiserDetails={false} openPocDetails={false} closeBtn={true} handleModal={handleModal} />
      </div>}
    </div>

  )
}

export default Page
