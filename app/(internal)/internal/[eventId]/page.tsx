import React from 'react'
import styles from './page.style.module.css'
import EventDetail from '@/app/components/internal/eventdetail/EventDetail'


const Page = () => {
  return (
    <div className={styles.body}>
      <EventDetail openEventDetails={true} openOrganiserDetails={false} openPocDetails={false} closeBtn={false} />
    </div>
  )
}

export default Page