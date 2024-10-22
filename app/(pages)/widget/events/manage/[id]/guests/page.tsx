'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import GuestList from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestList'
import RegisterModal from '@/app/components/TemplateViewsNew/Events/Manage/Guests/RegisterModal'
import useOutsideClick from '@/hooks/useOutsideClick'
import InviteGuest from '@/app/components/TemplateViewsNew/Events/Manage/Guests/InviteGuest'
import { useEventContext } from '@/context/eventcontext'
import { baseUrl } from "@/constants";
import { myFetch } from "@/utils/myFetch";
import GuestBar from '@/app/components/TemplateViewsNew/Events/Manage/Guests/GuestBar'

const Page = () => {
  const {fetchEventData, eventId, fetchedEvent } = useEventContext();

  const [registerModal, setRegisterModal] = useState<boolean>(false);
  const [inviteGuestModal, setInviteGuestModal] = useState<boolean>(false);
  const [registerValue, setRegisterValue] = useState<boolean>(fetchedEvent?.registration && fetchedEvent?.registration === true ? true : false)

  const [statusModal, setStatusModal] = useState<boolean>(false)
  const registerModalRef = useOutsideClick(() => setRegisterModal(false))
  const inviteModalRef = useOutsideClick(() => setInviteGuestModal(false))
  
  const [goingGuests, setGoingGuests] = useState<number>(0)
  const [notgoingGuests, setNotgoingGuests] = useState<number>(0)
  const [pendingGuests, setPendingGuests] = useState<number>(0)
  const [followingGuests, setFollowingGuests] = useState<number>(0)
  const [waitlistGuests, setWaitlistGuests] = useState<number>(0)

  useEffect(()=>{
    setRegisterValue(fetchedEvent?.registration && fetchedEvent?.registration === true ? true : false)
    fetchCounts()
  },[fetchedEvent])

  useEffect(()=>{
    if(registerModal || statusModal || inviteGuestModal){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },[registerModal,statusModal, inviteGuestModal])

  const fetchCounts = async () => {
    let fetchUrl = `${baseUrl}/intend/users?eventId=${eventId}`;
    const { data, error } = await myFetch(`${fetchUrl}`)
    if (error) {
      console.log("error is : ", error);
    } else {
      data.stats.map((stat: any) => {
        switch (stat.status) {
          case "CONFIRMED":
            setGoingGuests(stat.count);
            break;
          case "REJECTED":
            setNotgoingGuests(stat.count);
            break;
          case "PENDING":
            setPendingGuests(stat.count);
            break;
          case "FOLLOWING":
            setFollowingGuests(stat.count);
            break;
          case "WAITLISTING":
            setWaitlistGuests(stat.count);
            break;
          default:
            break; // Handle any unexpected statuses
        }
      });
    }
  }

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
      <div className={styles.guestBar}>
        <div className={styles.heading}>At a Glance</div>
        <GuestBar goingGuests={goingGuests} notgoingGuests={notgoingGuests} waitlistGuest={waitlistGuests} pendingGuests={pendingGuests} followingGuests={followingGuests} capacity = {fetchedEvent?.capacity}/>
      </div>
      <GuestList eventId={eventId} statusModal={statusModal} setStatusModal={setStatusModal}/>
      {/* {(registerModal || inviteGuestModal) &&<div className={styles.blackScreen}></div>} */}
      {registerModal && <div className={styles.modal} ref={registerModalRef}>
        <RegisterModal fetchEventData={fetchEventData} setRegisterValue={setRegisterValue} registerValue={registerValue} setRegisterModal={setRegisterModal} eventId={eventId} />
      </div>}
      {inviteGuestModal && <div className={styles.modal} ref={inviteModalRef}>
        <InviteGuest />
      </div>}
    </div>
  )
}

export default Page