"use client"
import React from 'react'
import styles from './notesDiscussion.style.module.css'
import { Notes } from '@/app/components/eventDetail/Notes'
import Loading from '@/app/components/UI/Loading'
const Trackers = React.lazy(() => import('@/app/components/internal/trackers/CommonTrackerCard'));
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
