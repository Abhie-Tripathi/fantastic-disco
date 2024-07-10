import React from 'react'
import styles from './attending.style.module.css'
import Image from 'next/image'
import person1 from "@/public/person1.svg";
import person2 from "@/public/person2.svg";

const AttendingPeople = () => {
    return (
        <div className={styles.body}>
            <div className={styles.circles}>
                <div className={styles.circle} data-name="John Doe">
                    <Image className={styles.image} src={person1} alt="person1" />
                </div>
                <div
                    className={styles.circle}
                    style={{ marginLeft: "-2px" }}
                    data-name="Alvin"
                >
                    AJ
                </div>
                <div
                    className={styles.circle}
                    style={{ marginLeft: "-2px" }}
                    data-name="Jane Smith"
                >
                    <Image className={styles.image} src={person2} alt="person2" />
                </div>
                <div
                    className={styles.circle}
                    style={{ marginLeft: "-2px" }}
                    data-name="Jane Smith"
                >
                    <Image className={styles.image} src={person2} alt="person2" />
                </div>
                <div
                    className={styles.circle}
                    style={{ marginLeft: "-2px" }}
                    data-name="Jane Smith"
                >
                    <Image className={styles.image} src={person2} alt="person2" />
                </div>
            </div>
            <div className={styles.names}>
                Nolan, Michael Caine and 6 others
            </div>
        </div>
    )
}

export default AttendingPeople