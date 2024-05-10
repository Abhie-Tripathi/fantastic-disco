'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import Internal from '@/app/components/internal/Internal'
import EventDetail from '@/app/components/internal/eventdetail/EventDetail'
import ShortlistModal from '@/app/components/internal/eventdetail/shortlistModal'
import TypeOfEventsCount from '@/public/data/TypeOfEventsCount.json'
import { useTheme } from '@/context'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false)
  const {theme} = useTheme()

  const handleModal = () => {
    setModalOpen(!modalOpen)
  }
  const handleShortlistModal = () => {
    setShortlistModalOpen(!shortlistModalOpen)
  }
  const handleRejectClick = () => {
    toast.error(
      <div>Rejected! <button onClick={() => console.log("undo action")}>UNDO</button></div>, {
      position: 'top-center',
      autoClose: 2000,
    });
  }
  const totalCount = TypeOfEventsCount.reduce((total, item) => total + item.count, 0);

  return (
    <div className={`${styles.container} ${modalOpen ? styles.modalOpen : ""} ${theme === 'light' ? styles.container_light : ""}`} >
      {totalCount >= 9 && (
        <div className={styles.innerContainer}>
          {TypeOfEventsCount.map((item, key) => (
            <div className={styles.container1} key={key}>
              <div className={styles.number}>{item.count}</div>
              <div className={styles.heading}>{item.name}</div>
            </div>
          ))}
        </div>)}
      {!modalOpen && <Internal handleModal={handleModal} handleShortlistModal={handleShortlistModal} handleRejectClick={handleRejectClick} />}
      {modalOpen && <div className={`${styles.modal} ${theme === 'light' ? styles.modal_light : ""}`}>
        <EventDetail openEventDetails={true} openEventRequest={false} openOrganiserDetails={false} openPocDetails={false} closeBtn={true} handleModal={handleModal} />
      </div>}

      {shortlistModalOpen && 
        <div className={`${theme === 'light' ? styles.modal_light : ""}`}>
          <ShortlistModal handleShortlistModal={handleShortlistModal} />
        </div>
      }
      <ToastContainer />
    </div>
  )
}

export default Page
