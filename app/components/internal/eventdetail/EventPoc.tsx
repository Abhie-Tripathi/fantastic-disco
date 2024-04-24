'use client'
import React, { useState } from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import PeopleIcon from '/public/people.svg'
import Placehodler from '/public/placeholder.png'

interface Props{
    open : boolean
}

const EventPoc = ({open} : Props) => {
    const [accordianToggle, setAccordianToggle] = useState(open)
    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={() => setAccordianToggle(!accordianToggle)}>
                <Image src={PeopleIcon} alt='page' />
                <div>Event POC</div>
            </div>
            {accordianToggle && <div className={styles.accordian}>
                <div className={styles.organiserContainer}>
                    <Image src={Placehodler} alt='placeholder' className={styles.orgLogo} />
                    <div className={styles.organiserNameContainer}>
                        <div style={{ fontSize: 14 }}>Rob Slate</div>
                        <div style={{ fontSize: 12}}>Marketing Head</div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default EventPoc