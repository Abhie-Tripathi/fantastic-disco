import React from 'react'
import Filter from '@/app/components/internal/trackers/Filters'
import styles from './editTracker.style.module.css'
import SideNav from '@/app/components/trackers/sideNav'
const page = () => {
  return (
    <div className="flex flex-col items-center w-[100%] g-5 pb-6 ">
      <SideNav/>
      <Filter/>
    </div>
  )
}

export default page
