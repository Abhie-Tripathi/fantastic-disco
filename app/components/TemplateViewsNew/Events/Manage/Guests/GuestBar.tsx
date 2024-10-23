import React from 'react'
import styles from './guestbar.style.module.css'

interface Props {
  goingGuests: number
  notgoingGuests: number
  pendingGuests: number
  followingGuests: number
  waitlistGuest: number
  capacity?: number;
  setFilterStatus:(value: string) => void
}

const GuestBar = ({ goingGuests, notgoingGuests, pendingGuests, followingGuests, waitlistGuest, capacity, setFilterStatus }: Props) => {

  const totalGuests = goingGuests + notgoingGuests + pendingGuests + followingGuests + waitlistGuest;
  const effectiveCapacity = Math.max(capacity || 0, totalGuests);
  // Calculate the filled percentages
  const goingGuestsPercentage = effectiveCapacity > 0 ? (goingGuests / effectiveCapacity) * 100 : 0;
  const pendingGuestsPercentage = effectiveCapacity > 0 ? (pendingGuests / effectiveCapacity) * 100 : 0;
  const notgoingGuestsPercentage = effectiveCapacity > 0 ? (notgoingGuests / effectiveCapacity) * 100 : 0;
  const waitlistGuestsPercentage = effectiveCapacity > 0 ? (waitlistGuest / effectiveCapacity) * 100 : 0;
  const followingGuestsPercentage = effectiveCapacity > 0 ? (followingGuests / effectiveCapacity) * 100 : 0;

  const guestTypes = [
    { className: styles.goingBar, percentage: goingGuestsPercentage },
    { className: styles.otherBar, percentage: pendingGuestsPercentage },
    { className: styles.otherBar, percentage: notgoingGuestsPercentage },
    { className: styles.otherBar, percentage: waitlistGuestsPercentage },
    { className: styles.otherBar, percentage: followingGuestsPercentage },
  ];
  let accumulatedPercentage = 0;
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.going}><span>{goingGuests}</span> Guests</div>
        {capacity !== -1 && <div className={`${styles.capacity} ${goingGuests > (capacity || 0) ? styles.redCap : ""}`}>
          Cap <span>{capacity}</span>
        </div>}
      </div>
      <div className={styles.bar}>
        {guestTypes.map((guest, index) => {
          const style = {
            width: `${guest.percentage}%`,
            left: `${accumulatedPercentage}%`,
          };
          accumulatedPercentage += guest.percentage;
          return <div key={index} className={guest.className} style={style}></div>;
        })}
      </div>
      <div className={styles.guestContainer}>
        {goingGuests > 0 && <div onClick={()=>setFilterStatus("CONFIRMED")}><span></span>{goingGuests} Going</div>}
        {pendingGuests > 0 && <div onClick={()=>setFilterStatus("PENDING")}><span></span>{pendingGuests} Pending</div>}
        {notgoingGuests > 0 && <div onClick={()=>setFilterStatus("REJECTED")}><span></span>{notgoingGuests} Not Going</div>}
        {waitlistGuest > 0 && <div onClick={()=>setFilterStatus("WAITLISTING")}><span></span>{waitlistGuest} Waitlist</div>}
        {followingGuests > 0 && <div onClick={()=>setFilterStatus("FOLLOWING")}><span></span>{followingGuests} Following</div>}
      </div>
    </div>
  )
}

export default GuestBar