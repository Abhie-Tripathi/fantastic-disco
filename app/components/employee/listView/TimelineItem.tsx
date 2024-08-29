import React from 'react'
import styles from './timlineItem.module.css'
import { useTheme } from '@/context';

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
};
interface Props {
    eventDate: string | null;
}
const TimelineItem: React.FC<Props> = ({ eventDate }) => {
    const { theme } = useTheme();

    let formattedDate = "";
    if (eventDate !== null) {
        formattedDate = formatDate(eventDate);
    }

    const showCircle = formattedDate !== "";

    return (
        <div className={`${styles.timelineItem} ${showCircle ? styles.showCircle : ""} ${theme === 'light' ? styles.timelineItem_light : ""}`}>
            {formattedDate}
        </div>
    );
};


export default TimelineItem