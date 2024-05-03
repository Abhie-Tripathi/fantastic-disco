'use client'
import React, { useState } from 'react'
import styles from './eventdesc.style.module.css'
import Image from 'next/image'
import PeopleIcon from '/public/people.svg'
import PlaceHolder from '/public/speaker1.jpeg'
import { useTheme } from '@/context'

const Follower = () => {

    const usernames = [{ name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" }
    ]

    const [accordianToggle, setAccordianToggle] = useState(false)
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? 'icons_light' : 'icon'
    return (
        <div>
            <div className={`${styles.container} ${theme === 'light' ? styles.container_light : ""}`}>
                <div className={styles.header} onClick={() => setAccordianToggle(!accordianToggle)}>
                    <Image src={PeopleIcon} alt='page' className={iconClass} />
                    <div>Followers</div>
                </div>
                {accordianToggle && <div className={styles.followerAccordian}>
                    {usernames.map((item, key) => (
                        <div className={styles.followerContainer} key={key}>
                            <Image src={PlaceHolder} alt='banner' width={80} height={80} className={styles.followerProfilePhoto} />
                            <div className={styles.followerDetails}>
                                <div className={styles.followerName}>{item.name} <span className={styles.username}>{item.username}</span></div>
                                <div className={styles.followerPosition}>{item.position}</div>
                            </div>
                        </div>
                    ))}
                </div>}
            </div>
        </div>
    )
}

export default Follower