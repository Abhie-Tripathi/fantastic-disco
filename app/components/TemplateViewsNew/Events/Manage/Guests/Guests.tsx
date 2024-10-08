import React from 'react'
import styles from './guests.style.module.css'
import GuestList from './GuestList'

const Guests = () => {
  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button>Invite Guests</button>
        <button>Registration</button>
      </div>
      <GuestList />
    </div>
  )
}

export default Guests