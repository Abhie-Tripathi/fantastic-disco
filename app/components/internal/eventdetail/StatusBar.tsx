'use client'
import React from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import StatusIcon from './icons/status'
import StatusIcon2 from './icons/status2'
import tickIcon from "/public/internal/circle_tick.svg";

interface Props {
    status: number
}

const StatusBar = ({status}:Props) => {

    return (
        <div className={styles.statusContainer}>
            <div className={styles.statusCard}>
                {status < 1 ?
                    <StatusIcon fillColor={''} borderColor={"#6750A4"} /> :
                        status === 1 ?
                            <StatusIcon fillColor={'#2B233D'} borderColor={"#6750A4"} /> :
                                <StatusIcon fillColor={'#1C1728'} borderColor={""} />
                }
                <div className={styles.statusText} >
                    {status > 1 && <Image width={14} height={14} src={tickIcon} alt="check" />}
                    Shortlisted </div>
            </div>
            <div className={styles.statusCard}>
                {status < 2 ?
                    <StatusIcon2 fillColor={''} borderColor={"#6750A4"} /> :
                        status === 2 ?
                            <StatusIcon2 fillColor={'#2B233D'} borderColor={"#6750A4"} /> :
                                <StatusIcon2 fillColor={'#1C1728'} borderColor={""} />
                }
                <div className={styles.statusText} >
                    {status > 2 && <Image width={14} height={14} src={tickIcon} alt="check" />}
                    In Progress
                </div>
            </div>
            <div className={styles.statusCard}>
                {status < 10 ?
                    <StatusIcon2 fillColor={''} borderColor={"#6750A4"} /> :
                        status === 10 ?
                            <StatusIcon2 fillColor={'#2B233D'} borderColor={"#6750A4"} /> :
                                <StatusIcon2 fillColor={'#1C1728'} borderColor={""} />
                }
                <div className={styles.statusText} >
                    {status > 10 && <Image width={14} height={14} src={tickIcon} alt="check" />}
                    Finalised
                </div>
            </div>
            <div className={styles.statusCard}>
                {status < 12 ?
                    <StatusIcon2 fillColor={''} borderColor={"#6750A4"} /> :
                        status === 12 ?
                            <StatusIcon2 fillColor={'#2B233D'} borderColor={"#6750A4"} /> :
                                <StatusIcon2 fillColor={'#1C1728'} borderColor={""} />
                }
                <div className={styles.statusText} >
                    Cancelled
                </div>
            </div>
        </div>
    )
}

export default StatusBar