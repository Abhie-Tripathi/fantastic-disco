import React from 'react'
import styles from './listview.style.module.css'
import YourEventCard from '../YourEventCard.js'
import TimelineItem from '../TimelineItem.js'
import Filter from '../Filter.js'
import eventData from '../../../eventdata/demoEvent.json'

const ListView = () => {
    
    let prevDate = null;
    const convertToDateObject = (dateString) => {
        const [month, day, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    };

    // Sort eventData based on startDate
    const sortedEventData = eventData.slice().sort((a, b) => {
        const dateA = convertToDateObject(a.startDate);
        const dateB = convertToDateObject(b.startDate);
        return dateA - dateB; // Sort in ascending order (earliest date first)
    });

    return (
        <div className={styles.container}>
            <div className={styles.timelineContainer}>
                {sortedEventData.map((item, index) => {
                    // Check if current event's date is different from previous event's date
                    const showDate = item.startDate !== prevDate;
                    // Update previous date
                    prevDate = item.startDate;
                    return (
                        <div key={index} className={styles.timeline}>
                            <TimelineItem eventDate={showDate ? item.startDate : null} />
                            <YourEventCard
                                eventName={item.name}
                                eventLocation={item.location}
                                eventImage={item.imageUrl}
                                eventDate={item.startDate}
                            />
                        </div>
                    );
                })}
            </div>
            {/* <div className={styles.filterContainer}>
                <Filter />
            </div> */}
        </div>
    )
}

export default ListView