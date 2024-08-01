import React from 'react'
import Filter from '@/app/components/internal/trackers/Filters'
import styles from './editTracker.style.module.css'
const page = () => {
  return (
    <div className={`${styles.container}`}>
      <Filter/>
    </div>
  )
}

export default page
