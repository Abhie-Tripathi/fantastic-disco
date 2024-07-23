import React from 'react'
import styles from './registration.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'


const RegistrationForm = () => {
    return (
        <div className={styles.registerContainer} >
            <div className={styles.header}>
                <div>Join us at the event</div>
                <Image src={EditIcon} alt='edit' />
            </div>
            <div className={styles.formSubHeading}>Welcome! To join the event, please register below.
            </div>
            <input className={styles.inputField} type="text" placeholder='Name' />
            <input className={styles.inputField} type="text" placeholder='Email' />
            <button className={styles.submitBtn}>Register</button>
        </div>
    )
}

export default RegistrationForm