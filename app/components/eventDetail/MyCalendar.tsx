import React, { useEffect, useState } from 'react'
import styles from './myCalendar.style.module.css'
import LeftArrow from '@/public/leftarrow.svg'
import RightArrow from '@/public/rightarrow.svg'
import Video from '@/public/video.svg'
import Image from 'next/image'
import { useTheme } from '@/context'
const MyCalendar = () => {
    const [weeks, setWeeks] = useState<string[][]>([]);
    const [start, setStart] = useState<number>();
    const [end, setEnd] = useState<number>();
    const [selectedDate, setSelectedDay] = useState<string>(new Date().getDate().toString());
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear())
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const monthAbb = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const {theme} = useTheme();

    useEffect(() => {
        const getStartingDayOfMonth = (year: number, month: number) => {
            const firstDayOfMonth: Date = new Date(year, month, 1);
            return firstDayOfMonth.getDay();
        };

        const getEndDayOfMonth = (year: number, month: number) => {
            const lastDayOfMonth = new Date(year, month + 1, 0);
            return lastDayOfMonth.getDate();
        };

        const startingDay = getStartingDayOfMonth(year, month);
        setStart(startingDay);
        const endDay = getEndDayOfMonth(year, month);
        setEnd(endDay);

        let daysArray = [];
        let dayCounter = 1;

        for (let i = 0; i < 6; i++) {
            let week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j >= startingDay) {
                    week.push(dayCounter.toString());
                    dayCounter++;
                } else if (i !== 0 && dayCounter <= endDay) {
                    week.push(dayCounter.toString());
                    dayCounter++;
                } else {
                    week.push(" ");
                }
            }
            daysArray.push(week);
        }

        setWeeks(daysArray);
    }, [year, month]);
    const nextMonth = () => {
        if (month < 11)
            setMonth(month + 1);
        else {
            setYear(year + 1);
            setMonth(0);
        }
    }
    const prevMonth = () => {
        if (month > 0) setMonth(month - 1);
        else {
            setYear(year - 1);
            setMonth(11);
        }
    }
    //   const getSlotData = (date: string) => {
    //     setSelectedDay(date)
    //     if (times.hasOwnProperty(date)) {
    //       setTimeSlots(times[parseInt(date)]);
    //     }
    //   }
    return (
        <div className={`${styles.container} ${theme === 'light' && styles.container_light}`}>
            <div className={styles.leftContainer}>
                <div style={{fontWeight:"600"}}>My Calendar</div>
                <div className={styles.card}>
                    <div className={styles.todayCard}>
                        <div className={styles.conatinerHead}><span style={{fontWeight:"700"}}>TODAY</span> <span style={{ color: "#6750A4", paddingLeft:"4px" }}>27/04/2024</span></div>
                        <div className={styles.meetDetail}>
                            <div className={`${styles.upcomming} ${theme === 'light' && styles.upcomming_light}`}>2 Upcoming Meetings today</div>
                            <div className={styles.timings}>
                                <div>
                                    <div className={styles.circle}></div>
                                </div>
                                <div className={styles.eventNameTime}>
                                    <div className={styles.timeSlot}>2:30 - 3:30 PM <Image src={Video} alt="Video" /></div>
                                    <div style={{ fontSize: "12px" }}>Event Connect - Discussion with Alexia</div>
                                </div>
                            </div>
                            <div className={styles.timings}>
                                <div>
                                    <div className={styles.circle}></div>
                                </div>
                                <div className={styles.eventNameTime}>
                                    <div className={styles.timeSlot}>2:30 - 3:30 PM <Image src={Video} alt="Video" /></div>
                                    <div style={{ fontSize: "12px" }}>Event Discussion with Max glam</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.todayCard}>
                    <div className={styles.conatinerHead}><span style={{fontWeight:"700"}}>TODAY</span>  <span style={{ color: "#6750A4", paddingLeft:"4px" }}>27/04/2024</span></div>
                        <div className={styles.meetDetail}>
                            <div className={`${styles.upcomming} ${theme === 'light' && styles.upcomming_light}`}>2 Upcoming Meetings today</div>
                            <div className={styles.timings}>
                                <div>
                                    <div className={styles.circle} style={{backgroundColor:"#2DD4BF"}}></div>
                                </div>
                                <div className={styles.eventNameTime}>
                                    <div className={styles.timeSlot}>2:30 - 3:30 PM <Image src={Video} alt="Video" /></div>
                                    <div style={{ fontSize: "12px" }}>Event Connect - Discussion with Alexia</div>
                                </div>
                            </div>
                            <div className={styles.timings}>
                                <div>
                                    <div className={styles.circle} style={{backgroundColor:"#2DD4BF"}}></div>
                                </div>
                                <div className={styles.eventNameTime}>
                                    <div className={styles.timeSlot}>2:30 - 3:30 PM <Image src={Video} alt="Video" /></div>
                                    <div style={{ fontSize: "12px" }}>Event Discussion with Max glam</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.rightContainer}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: "22px" }}>{monthAbb[month].toUpperCase()}, <span style={{ color: "#6750A4" }}>{year}</span></div>
                    <div>
                        <Image src={LeftArrow} style={{ cursor: "pointer" }} alt="leftArrow" onClick={prevMonth} />
                        <Image src={RightArrow} style={{ cursor: "pointer" }} alt="rightArrow" onClick={nextMonth} />
                    </div>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableRow}>
                            {days.map((day, ind) => (
                                <td key={ind} style={{ color: "#666666" }}>{day}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {weeks.map((week, index) => (
                            <tr key={index} className={styles.tableRow}>
                                {week.map((date, index) => (

                                    date !== ' ' ? (
                                        <td key={index} style={{ cursor: "default" }}><span style={{}} >{date}</span></td>
                                    ) : (
                                        <td key={index}>&nbsp;</td>
                                    )
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyCalendar
