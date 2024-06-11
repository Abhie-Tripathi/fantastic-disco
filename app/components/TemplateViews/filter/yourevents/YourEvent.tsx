import React from 'react'
import styles from './yourevents.style.module.css'
import DeleteIcon from '/public/delete.svg'
import Image from 'next/image'
import PenIcon from '/public/pen.svg'

const YourEvent = () => {

    const events = ["Event One", "Event Two", "Event Three", "Event Four"]

    return (
        <div className={styles.body}>
            {events.map((event, key) => (
                <div className={styles.eventContainer} key={key}>
                    <div className={styles.eventName}>{event}</div>
                    <div className={styles.btnsContainer}>
                        <Image src={DeleteIcon} alt='delete' className={styles.deleteBtn} />
                        <Image src={PenIcon} alt='delete' className={styles.editBtn} />
                        <input type="checkbox" className={styles.checkbox} />
                    </div>
                </div>
            ))}

        </div>
    )
}

export default YourEvent