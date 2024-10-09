import React, { useState } from 'react'
import styles from './inviteguest.style.module.css'
import InviteGuestsFirstScreen from './InviteGuestsFirstScreen';
import InviteGuestsSecScreen from './InviteGuestsSecScreen';


const InviteGuest = () => {

  const maxCount = 15;
  const [count, setCount] = useState(4); // Default starting count
  const [screen, setScreen] = useState<string>("first");

  const percentageFilled = (count / maxCount) * 100;
  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.heading}>Invite Guests</div>
        <div className={styles.counterContainer}>
          <div
            className={styles.counter}
            style={{
              background: `conic-gradient(#4caf50 ${percentageFilled}%, #e0e0e0 0)`,
            }}
          ></div>
          <div>{15 - count} left</div>
        </div>
      </div>
      <div className={styles.line}></div>
      {screen === "first" ? <InviteGuestsFirstScreen /> :
      <InviteGuestsSecScreen/>}
      <div className={styles.line}></div>
      <div className={styles.selectedBtnContainer}>
        <div>0 Selected</div>
        {screen === "first" ? <button onClick={()=>setScreen("second")} className={styles.nextBtn}>Next</button> : 
        <button onClick={()=>setScreen("first")} className={styles.nextBtn}>Back</button>}
      </div>

    </div>
  )
}

export default InviteGuest