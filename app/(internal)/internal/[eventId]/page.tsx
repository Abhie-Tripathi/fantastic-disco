import React from 'react'
import styles from './page.style.module.css'
import EventDetail from '@/app/components/internal/eventdetail/EventDetail'

const Page = () => {
  return (
    <div className={styles.body}>
        <EventDetail/>
    </div>
  )
}

export default Page