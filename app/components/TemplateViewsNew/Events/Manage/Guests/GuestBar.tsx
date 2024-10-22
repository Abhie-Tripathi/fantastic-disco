import React from 'react'
import styles from './guestbar.style.module.css'

interface Props {
  goingGuests: number
  notgoingGuests: number
  pendingGuests: number
  followingGuests: number
  waitlistGuest: number
  capacity?: number;
}

const GuestBar = ({ goingGuests, notgoingGuests, pendingGuests, followingGuests, waitlistGuest, capacity }: Props) => {
  const totalGuests = goingGuests + notgoingGuests + pendingGuests + followingGuests + waitlistGuest;
  const effectiveCapacity = capacity || 0; // Fallback to 0 if capacity is undefined

  // Calculate the filled percentages
  const goingGuestsPercentage = effectiveCapacity > 0 ? (goingGuests / effectiveCapacity) * 100 : 0;
  const pendingGuestsPercentage = effectiveCapacity > 0 ? (pendingGuests / effectiveCapacity) * 100 : 0;
  const notgoingGuestsPercentage = effectiveCapacity > 0 ? (notgoingGuests / effectiveCapacity) * 100 : 0;
  const waitlistGuestsPercentage = effectiveCapacity > 0 ? (waitlistGuest / effectiveCapacity) * 100 : 0;
  const followingGuestsPercentage = effectiveCapacity > 0 ? (followingGuests / effectiveCapacity) * 100 : 0;
  // const otherGuestsPercentage = effectiveCapacity > 0 ? ((totalGuests > effectiveCapacity ? effectiveCapacity : totalGuests) - goingGuests) : 0; 
  // const otherGuestsFillPercentage = effectiveCapacity > 0 ? (otherGuestsPercentage / effectiveCapacity) * 100 : 0;

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.going}><span>{goingGuests}</span> Guests</div>
        <div className={styles.capacity}> Cap <span>{capacity}</span> </div>
      </div>
      <div className={styles.bar}>
        <div
          className={styles.goingBar}
          style={{ width: `${goingGuestsPercentage}%` }}
        ></div>
        <div
          className={styles.otherBar}
          style={{ width: `${pendingGuestsPercentage}%`, left: `${goingGuestsPercentage}%` }}
        ></div>
        <div
          className={styles.otherBar}
          style={{ width: `${notgoingGuestsPercentage}%`, left: `${pendingGuestsPercentage + goingGuestsPercentage}%` }}
        ></div>
        <div
          className={styles.otherBar}
          style={{ width: `${waitlistGuestsPercentage}%`, left: `${pendingGuestsPercentage + goingGuestsPercentage + notgoingGuestsPercentage}%` }}
        ></div>
        <div
          className={styles.otherBar}
          style={{ width: `${followingGuestsPercentage}%`, left: `${pendingGuestsPercentage + goingGuestsPercentage + notgoingGuestsPercentage + waitlistGuestsPercentage}%` }}
        ></div>
      </div>
      <div className={styles.guestContainer}>
          {goingGuests > 0 && <div><span></span>{goingGuests} Going</div>}
          {pendingGuests > 0 && <div><span></span>{pendingGuests} Pending</div>}
          {notgoingGuests > 0 && <div><span></span>{notgoingGuests} Not Going</div>}
          {waitlistGuest > 0 && <div><span></span>{waitlistGuest} Waitlist</div>}
          {followingGuests > 0 && <div><span></span>{followingGuests} Following</div>}
      </div>
    </div>
  )
}

export default GuestBar