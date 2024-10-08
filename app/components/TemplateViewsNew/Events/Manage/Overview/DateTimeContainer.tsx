import React from 'react'
import styles from './datetime.style.module.css'

interface TimeSettingsProps {
    timeZone: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

const DateTimeContainer = ({ timeZone, startDate, endDate, startTime, endTime }: TimeSettingsProps) => {
    const formatDate = (date: string) => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    return (
        <div className={styles.dateAndTimeContainer}>
            <div className={styles.mobile_dateIconContainer}>
                <TimeZoneIcon />
                <div className={styles.mobile_dateContainer}>{formatDate(startDate)} - {formatDate(endDate)}</div>
            </div>
            <div className={styles.mobile_timeGmtContainer}>
                <div>{startTime}-{endTime}</div>
                <div>{timeZone}</div>
            </div>
        </div>
    )
}

export default DateTimeContainer

function TimeZoneIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.6623 6.91534C14.4627 5.68935 13.9287 4.54221 13.119 3.60021C12.3094 2.65821 11.2555 1.95789 10.0734 1.57634C8.89134 1.19479 7.62691 1.14681 6.41931 1.43769C5.21172 1.72857 4.10781 2.34702 3.22911 3.22495C2.35041 4.10289 1.731 5.20626 1.43907 6.4136C1.14714 7.62094 1.19402 8.88542 1.57454 10.0678C1.95505 11.2502 2.65446 12.3047 3.59575 13.1152C4.53705 13.9256 5.68372 14.4607 6.90953 14.6613M1.69928 5.74984H14.2993M1.69928 10.2498H6.87428" stroke="#A8A8A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.62423 1.25C6.58939 2.90805 5.94959 4.78181 5.75426 6.7265C5.55894 8.6712 5.81331 10.6348 6.49773 12.4655M8.37423 1.25C9.44941 2.97309 10.0974 4.9281 10.2642 6.95225M9.49923 12.5C9.49923 13.2956 9.8153 14.0587 10.3779 14.6213C10.9405 15.1839 11.7036 15.5 12.4992 15.5C13.2949 15.5 14.0579 15.1839 14.6205 14.6213C15.1832 14.0587 15.4992 13.2956 15.4992 12.5C15.4992 11.7044 15.1832 10.9413 14.6205 10.3787C14.0579 9.81607 13.2949 9.5 12.4992 9.5C11.7036 9.5 10.9405 9.81607 10.3779 10.3787C9.8153 10.9413 9.49923 11.7044 9.49923 12.5Z" stroke="#A8A8A8" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round" />
            <path d="M12.499 11.375V12.5L12.874 12.875" stroke="#A8A8A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
