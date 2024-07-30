import React, { useState } from 'react'
import TimeZoneData from '@/public/data/timezones.json'
import styles from './timezone.style.module.css'

interface Props{
    handleTimeSelect : (value1 : string, value2 : string , value3 : number)=>void
    timeZoneKey  : number;
}

const TimezoneDropdown = ({handleTimeSelect, timeZoneKey} : Props) => {
    return (
        <div className={styles.timezonecontainer}>
            {TimeZoneData.map((time, key) => (
                <div onClick={() => handleTimeSelect(time.label, time.value, key)} className={`${styles.timezone} ${key === timeZoneKey ? styles.activeTimeZone : ""}`} key={key}>
                    <span>{key === timeZoneKey && <TickIcon />}{time.label}</span><span>{time.value}</span>
                </div>
            ))}
        </div>
    )
}

export default TimezoneDropdown
function TickIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="#0072F5" /></svg>
    )
}