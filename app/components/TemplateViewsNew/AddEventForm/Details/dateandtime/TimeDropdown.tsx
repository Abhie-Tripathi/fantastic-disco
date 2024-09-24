import React, { useEffect } from 'react'
import styles from './timedropdown.style.module.css'

interface Props {
    setTime: (value: string) => void;
    time: string;
    minTime?: string;
}

const TimeDropdown = ({ setTime, time, minTime }: Props) => {
    const times = [
        "12:00 A.M", "12:30 A.M", "1:00 A.M", "1:30 A.M", "2:00 A.M", "2:30 A.M", "3:00 A.M", "3:30 A.M",
        "4:00 A.M", "4:30 A.M", "5:00 A.M", "5:30 A.M", "6:00 A.M", "6:30 A.M", "7:00 A.M", "7:30 A.M",
        "8:00 A.M", "8:30 A.M", "9:00 A.M", "9:30 A.M", "10:00 A.M", "10:30 A.M", "11:00 A.M", "11:30 A.M",
        "12:00 P.M", "12:30 P.M", "1:00 P.M", "1:30 P.M", "2:00 P.M", "2:30 P.M", "3:00 P.M", "3:30 P.M",
        "4:00 P.M", "4:30 P.M", "5:00 P.M", "5:30 P.M", "6:00 P.M", "6:30 P.M", "7:00 P.M", "7:30 P.M",
        "8:00 P.M", "8:30 P.M", "9:00 P.M", "9:30 P.M", "10:00 P.M", "10:30 P.M", "11:00 P.M", "11:30 P.M"
    ];
    const timeToMinutes = (t: string) => {
        const [hour, minute] = t.split(/:|\s/);
        const isPM = t.includes("P.M");
        return (parseInt(hour) % 12 + (isPM ? 12 : 0)) * 60 + parseInt(minute);
    };

    const isDisabled = (value: string) => {
        if (!minTime) return false;
        return timeToMinutes(value) < timeToMinutes(minTime);
    };


    return (
        <div className={styles.body}>
            {times.map((value, key) => (
                <div
                    key={key}
                    className={`${styles.time} ${value === time ? styles.activeTime : ""} ${isDisabled(value) ? styles.disabledTime : ""}`}
                    onClick={() => !isDisabled(value) && setTime(value)}
                >
                    {value}
                </div>
            ))}
        </div>
    )
}

export default TimeDropdown