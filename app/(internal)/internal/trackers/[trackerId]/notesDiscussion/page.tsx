"use client"
import React from 'react'
import styles from './notesDiscussion.style.module.css'
import { Notes } from '@/app/components/eventDetail/Notes'
const Trackers = React.lazy(() => import('@/app/components/internal/trackers/CommonTrackerCard'));
const Page = () => {
  return (
    <div className="flex gap-5 mt-[55px] w-[calc(100vw-134px)]" >
      <div className="flex w-[30%]">
      <Trackers />
      </div>

      <div className="w-[70%] h-[calc(100vh-164px)]">
        <Notes />
      </div>
    </div>
  )
}

export default Page
