import React from 'react'
import styles from './timlineItem.module.css'

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
};
interface Props {
    eventDate: string | null; 
}
const TimelineItem: React.FC<Props> = ({ eventDate })=> {

    let formattedDate = "";
    
    // If eventdate is null we dont want to format it
    if (eventDate !== null) {
        formattedDate = formatDate(eventDate);
    }

    // We will not show the circle if date is empty
    const showCircle = formattedDate !== "";

    return (
        <div className={`${styles.timelineItem} ${showCircle ? styles.showCircle : ""}`}>
            {formattedDate}
        </div>
    );
};


export default TimelineItem