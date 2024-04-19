import React from 'react'
import Image from 'next/image'
import Calendar from '@/public/vector.svg'
import rightArrowIcon from "@/public/rightArrow.svg"
import styles from './upcomingEvents.style.module.css'
const UpcomingEvents = () => {
    return (
        <div className={styles.container}>
            Upcoming Meetings
            <div className={styles.cards}>
                <div className={styles.card}>
                    <div className={styles.card1}>
                        <div className={styles.circles}>
                            <div className={styles.circle1}>A</div>
                            <div className={styles.circle1} style={{marginLeft: "-15px"}}>B</div>
                        </div>
                        <div className={styles.eventDetails}>
                            <div className={styles.detailContainer}>
                                <div>Meet</div>
                                <Image src={rightArrowIcon} alt="rightArrowIcon" width={30} height={20} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.card2}>Event Connect - Discussion with Alexia</div>
                    <div className={styles.card3}>
                        <Image src={Calendar} alt="Calendar"/>
                         <div> 1st  Apr 2024 2:30 PM</div>
                    </div>
                    <div className={styles.card4}>
                        <div className={styles.hostBtn}>HOST</div>
                        <div style={{color:"#8C8EA4", fontSize:"14px"}}>@Robslatexv,@alexia_cohade_1</div>
                    </div>
                    <div className={styles.card5}>
                    <div style={{fontSize:"10px",color:"#999999"}}>https:/eventgeni.com/event-dicussion14367a2e/joinmeet</div>
                    </div>
                </div>
                <div className={styles.card}>
                    <div className={styles.card1}>
                        <div className={styles.circles}>
                            <div className={styles.circle1}>A</div>
                            <div className={styles.circle1} style={{marginLeft: "-15px"}}>B</div>
                        </div>
                        <div className={styles.eventDetails}>
                            <div className={styles.detailContainer}>
                                <div>Meet</div>
                                <Image src={rightArrowIcon} alt="rightArrowIcon" width={30} height={20} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.card2}>Event Connect - Discussion with Alexia</div>
                    <div className={styles.card3}>
                        <Image src={Calendar} alt="Calendar"/>
                         <div> 1st  Apr 2024 2:30 PM</div>
                    </div>
                    <div className={styles.card4}>
                        <div className={styles.hostBtn}>HOST</div>
                        <div style={{color:"#8C8EA4", fontSize:"14px"}}>@Robslatexv,@alexia_cohade_1</div>
                    </div>
                    <div className={styles.card5}>
                    <div style={{fontSize:"10px",color:"#999999"}}>https:/eventgeni.com/event-dicussion14367a2e/joinmeet</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpcomingEvents
