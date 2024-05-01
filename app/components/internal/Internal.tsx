import React from 'react'
import YourEventCard from './YourEventCard'
import styles from './internal.style.module.css'
import TimelineItem from '@/app/components/employee/listView/TimelineItem'
import eventData from '@/public/data/demoEvent.json'

interface Props{
    handleModal : () => void
}

const Internal = ({handleModal} : Props) => {
    let prevDate: any = null;
  return (
    <div>
    <div className={styles.container}>
    <div className={styles.timelineContainer}>
    {eventData.map((item, index) => {
        // Check if current event's date is different from previous event's date
        const showDate = item.startDate !== prevDate;
        // Update previous date
        prevDate = item.startDate;
        return (
            <div key={index} className={styles.timeline}>
                <TimelineItem eventDate={showDate ? item.startDate : null} />
                <YourEventCard
                    eventId={item.id}
                    eventName={item.name}
                    eventCtas={item.ctas}
                    eventLocation={item.location}
                    eventImage={item.imageUrl}
                    eventDate={item.startDate}
                    eventCompany={item.company}
                    handleModal={handleModal}
                />
            </div>
        );
    })}
</div>
</div>
</div>
  )
}

export default Internal
