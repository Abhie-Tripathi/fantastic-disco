'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import GuestList from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestList'
import RegisterModal from '@/app/components/TemplateViewsNew/Events/Manage/Guests/RegisterModal'
import useOutsideClick from '@/hooks/useOutsideClick'
import InviteGuest from '@/app/components/TemplateViewsNew/Events/Manage/Guests/InviteGuest'
import { useEventContext } from '@/context/eventcontext'

const Page = () => {
  const { eventId, fetchedEvent } = useEventContext();

  const [registerModal, setRegisterModal] = useState<boolean>(false);
  const [inviteGuestModal, setInviteGuestModal] = useState<boolean>(false);
  const [registerValue, setRegisterValue] = useState<boolean>(fetchedEvent?.registration && fetchedEvent?.registration === true ? true : false)

  const [statusModal, setStatusModal] = useState<boolean>(false)
  const registerModalRef = useOutsideClick(() => setRegisterModal(false))
  const inviteModalRef = useOutsideClick(() => setInviteGuestModal(false))

  useEffect(()=>{
    setRegisterValue(fetchedEvent?.registration && fetchedEvent?.registration === true ? true : false)
  },[fetchedEvent])

  useEffect(()=>{
    if(registerModal || statusModal || inviteGuestModal){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },[registerModal,statusModal, inviteGuestModal])

  return (
    <div className={`${styles.body} ${registerModal || inviteGuestModal || statusModal ? styles.modalOpen : ""}`}>
      <div className={styles.btnContainer}>
        <button onClick={() => setInviteGuestModal(true)}>
          <span className={styles.icon1}>I</span>
          Invite Guests
        </button>
        <button onClick={() => setRegisterModal(true)}>
          <span className={styles.icon2}>R</span>
          <div className={styles.sub_headingContainer}>
            Registration
            <span>{registerValue ? "Open" : "Closed"}</span>
          </div>
        </button>
        <button>
          <span className={styles.icon3}>GR</span>
          <div className={styles.sub_headingContainer}>
            Group Registration
            <span>On</span>
          </div>
        </button>
      </div>
      <GuestList eventId={eventId} statusModal={statusModal} setStatusModal={setStatusModal}/>
      {/* {(registerModal || inviteGuestModal) &&<div className={styles.blackScreen}></div>} */}
      {registerModal && <div className={styles.modal} ref={registerModalRef}>
        <RegisterModal setRegisterValue={setRegisterValue} registerValue={registerValue} setRegisterModal={setRegisterModal} eventId={eventId} />
      </div>}
      {inviteGuestModal && <div className={styles.modal} ref={inviteModalRef}>
        <InviteGuest />
      </div>}
    </div>
  )
}

export default Page