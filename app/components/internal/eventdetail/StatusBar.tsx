'use client'
import React from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import StatusIcon from './icons/status'
import StatusIcon2 from './icons/status2'
import tickIcon from "/public/internal/circle_tick.svg";

interface Props {
    status: number,
    handleStatusChange: any
}

const StatusBar = ({status, handleStatusChange}:Props) => {
    
    return (
        <div className={styles.outreachStatusContainer}>
            <div className={styles.statusCard} onClick={()=>handleStatusChange(1)}>
                {status < 1 ?
                    <StatusIcon fillColor={'var(--primary-color)'} borderColor={'var(--primary-color)'}/> :
                        status === 1 ?
                            <StatusIcon fillColor={'var(--primary-color)'} borderColor={'var(--primary-color)'} /> :
                                <StatusIcon fillColor={'var(--primary-color)'} borderColor={""} />
                }
                <div className={styles.statusText} >
                    {/* {status > 1 && <Image width={14} height={14} src={tickIcon} alt="check" />} */}
                    Shortlisted </div>
            </div>
            <div className={styles.statusCard} onClick={()=>handleStatusChange(2)}>
                {status < 2 ?
                    <StatusIcon2 fillColor={'var(--heading-background-color)'} borderColor={""} /> :
                        status === 2 ?
                            <StatusIcon2 fillColor={'var(--primary-color)'} borderColor={"var(--primary-color)"} /> :
                                <StatusIcon2 fillColor={'var(--primary-color)'} borderColor={""} />
                }
                <div className={styles.statusText}>
                    {/* {status > 2 && <Image width={14} height={14} src={tickIcon} alt="check" />} */}
                    <span style={{color:status>=2? "white" :"var(--secondary-text-color)"}}>In Discussion</span>
                </div>
            </div>
            <div className={styles.statusCard} onClick={()=>handleStatusChange(10)}>
                {status < 10 ?
                    <StatusIcon2 fillColor={'var(--heading-background-color)'} borderColor={""} /> :
                        status === 10 ?
                            <StatusIcon2 fillColor={'var(--primary-color)'} borderColor={"var(--primary-color)"} /> :
                                <StatusIcon2 fillColor={'var(--primary-color)'} borderColor={""} />
                }
                <div className={styles.statusText} >
                    {/* {status > 10 && <Image width={14} height={14} src={tickIcon} alt="check" />} */}
                    <span style={{color:status>=10? "white" :"var(--secondary-text-color)"}}>In Nego</span>
                </div>
            </div>
            <div className={styles.statusCard} style={{cursor: 'unset'}} >
                {status < 12 ?
                    <StatusIcon2 fillColor={'var(--heading-background-color)'} borderColor={""}  /> :
                        status === 12 ?
                            <StatusIcon2 fillColor={'var(--success-text-color)'} borderColor={"var(--success-text-color)"} /> :
                                status === 15 ?
                                <StatusIcon2 fillColor={'var(--danger-text-color)'} borderColor={"var(--danger-text-color)"} /> :
                                    <StatusIcon2 fillColor={'var(--primary-color)'} borderColor={""} />
                }
                <div className={styles.statusText} >
                    <span style={{color:status>=12? "white" :"var(--secondary-text-color)"}}>
                        {status < 12 ?
                        <>
                            <span className={styles.wonBtn} onClick={()=>handleStatusChange(12)}>Won </span> / 
                            <span className={styles.lostBtn} onClick={()=>handleStatusChange(15)}> Lost</span>
                        </> : status == 12 ?
                            <span>Won</span> : status == 15 ?
                            <span>Lost</span> : ''
                        }
                    </span>
                </div>
            </div>
        </div>
    )
}

export default StatusBar;
