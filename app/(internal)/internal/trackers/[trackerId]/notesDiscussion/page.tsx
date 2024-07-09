"use client"
import React, { Suspense } from 'react'
import styles from './notesDiscussion.style.module.css'
import { Notes } from '@/app/components/eventDetail/Notes'
import Trackers from '@/app/components/internal/trackers/CommonTrackerCard'
const Page = () => {
  return (
    <div className={styles.outerContainer} >
      <div className={styles.innerLeft}>

        <Trackers />

      </div>

      <div className={styles.container}>
        <Notes />
      </div>
    </div>
  )
}

export default Page
