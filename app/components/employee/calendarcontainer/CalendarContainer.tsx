import React, { useEffect, useState } from 'react'
import styles from './calendarContainer.module.css'
import MonthCalendar from '../calendarview/MonthCalendar'
import YearCalendar from '../calendarview/YearCalendar'
import WeekCalendar from  '../calendarview/WeekCalendar'
import { useTheme } from '@/context'

interface CalendarContainerProps {
    queryString?: string;
}

const CalendarContainer = (props: CalendarContainerProps) => {
    const {theme} = useTheme()
    console.log(props.queryString)
    const [selectedCalendar, setSelectedCalendar] = useState("month")
    const handleCalendar = (value:string) => {
        setSelectedCalendar(value)
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.calendarBtns} ${theme === 'light' ? styles.calendarBtns_light : ""}`}>
                <button onClick={() => handleCalendar("week")} className={`${styles.weekBtn} ${selectedCalendar === 'week' ? styles.activeCalendarBtn : ''}`}>Week</button>
                <button onClick={() => handleCalendar("month")} className={`${styles.monthBtn} ${selectedCalendar === 'month' ? styles.activeCalendarBtn : ''}`}>Month</button>
                <button onClick={() => handleCalendar("year")} className={`${styles.yearBtn} ${selectedCalendar === 'year' ? styles.activeCalendarBtn : ''}`}>Year</button>
            </div>
            {selectedCalendar === "month" && <MonthCalendar queryString={props.queryString ? props.queryString : ''} />}
            {selectedCalendar === "year" && <YearCalendar queryString={props.queryString ? props.queryString : ''} />}
            {selectedCalendar === "week" && <WeekCalendar queryString={props.queryString ? props.queryString : ''} />}
        </div>
    )
}

export default CalendarContainer;