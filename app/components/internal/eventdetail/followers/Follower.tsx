import React from 'react'
import styles from './follower.style.module.css'
import PlaceHolder from '/public/placeholder.png'
import Image from 'next/image'

const Follower = () => {

    const usernames = [{ name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" },
    { name: "Walter White", username: "@Walter_cartel", position: "Human Resources" }
    ]

    return (
        <div className={styles.body}>
            {usernames.map((item, key) => (
                <div className={styles.container} key={key}>
                    <Image src={PlaceHolder} alt='banner' width={80} height={80} className={styles.profilePhoto} />
                    <div className={styles.details}>
                        <div className={styles.name}>{item.name} <span className={styles.username}>{item.username}</span></div>
                        <div className={styles.position}>{item.position}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Follower