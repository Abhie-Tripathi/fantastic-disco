import React from 'react'
import Filter from '@/app/components/internal/trackers/Filters'
import styles from './editTracker.style.module.css'
import SideNav from '@/app/components/trackers/sideNav'
const page = () => {
  return (
    <div className={`${styles.container}`}>
      <SideNav/>
      <Filter/>
    </div>
  )
}

export default page
