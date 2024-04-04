import React from 'react'
import styles from './page.style.module.css'
import AddEventModal from '../components/AddEventModal'

const Page = () => {
  console.log()
  return (
    <div className={styles.bodyContainer}>
      <AddEventModal />
    </div>
  )
}

export default Page