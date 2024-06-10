import React, { useEffect, useState } from 'react'
import styles from './normalevents.style.module.css'
import SearchIcon from "/public/search.svg";
import DatePickerComp from '@/app/components/calendar/DatePickerComp';
import DeleteIcon from '/public/delete.svg'
import Image from 'next/image'

const NormalEvents = () => {
    const events = ["Event One", "Event Two", "Event Three", "Event Four"]
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [currDate, setCurrDate] = useState<string>("");

    useEffect(() => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(currentDate.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        setCurrDate(formattedDate);
    }, []);

    const handleStartDate = (startDate: any) => {
        setStartDate(startDate);
    };
    const handleEndDate = (endDate: any) => {
        setEndDate(endDate);
    };

    return (
        <div className={styles.body}>
            <div className={styles.heading}>Select Normal Events</div>
            <div
                className={`${styles.promotedInput} ${styles.inputInnerContainer}`}
            >
                <Image src={SearchIcon} alt="search" />
                <input
                    type="text"
                    placeholder="Search Events"
                />
            </div>
            <div className={styles.dateContainer}>
                <div className={styles.startDate}>
                    <div className={styles.subHeading}>Start Date</div>
                    <div className={styles.datePickerContainer}>
                        <DatePickerComp handleDate={handleStartDate} date={currDate} />
                    </div>
                </div>
                <div className={styles.endDate}>
                    <div className={styles.subHeading}>End Date</div>
                    <div className={styles.datePickerContainer}>
                        <DatePickerComp handleDate={handleEndDate} date="" />
                    </div>
                </div>
            </div>
            <div className={styles.selectedEventsContainer}>
                <div className={styles.subHeading}>Selected Events</div>
                <div className={styles.selectedEventBackground}>
                {events.map((event, key) => (
                    <div className={styles.selectedEvents} key={key}>
                        <div className={styles.eventName}>{event}</div>
                        <div className={styles.btnsContainer}>
                            <Image src={DeleteIcon} alt='delete' className={styles.deleteBtn} />
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
    )
}

export default NormalEvents