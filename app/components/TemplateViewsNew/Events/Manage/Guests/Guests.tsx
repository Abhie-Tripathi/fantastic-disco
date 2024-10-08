import React from 'react'
import styles from './guests.style.module.css'
import GuestList from './GuestList'

const Guests = () => {
  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button>
          <span className={styles.icon1}>I</span>
          Invite Guests
        </button>
        <button>
          <span className={styles.icon2}>R</span>
          <div className={styles.sub_headingContainer}>
            Registration
            <span>Open</span>
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
      <GuestList />
    </div>
  )
}

export default Guests