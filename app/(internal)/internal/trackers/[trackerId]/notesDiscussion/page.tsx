"use client"
import React from 'react'
import styles from './notesDiscussion.style.module.css'
import {Notes} from '@/app/components/eventDetail/Notes'
const Page = () => {
  return (
    <div className={styles.container}>
      <Notes/>
    </div>
  )
}

export default Page
