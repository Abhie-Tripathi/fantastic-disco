import React, { useState } from 'react'
import styles from './calendarContainer.module.css'
import MonthCalendar from '../calendarview/MonthCalendar'
import YearCalendar from '../calendarview/YearCalendar'
import WeekCalendar from  '../calendarview/WeekCalendar'
import { useTheme } from '@/context'

const CalendarContainer = () => {
    const {theme} = useTheme()
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
            {selectedCalendar === "month" && <MonthCalendar />}
            {selectedCalendar === "year" && <YearCalendar />}
            {selectedCalendar === "week" && <WeekCalendar />}
        </div>
    )
}

export default CalendarContainer;