import React from 'react'
import styles from './registerques.style.module.css'
import AttendeeIcon from '/public/widgetimages/attendeeIcon.svg'
import Image from 'next/image'
import PeopleIcon from '/public/people.svg'
import MailIcon from '/public/page.svg'

const RegistrationQues = () => {
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <div className={styles.heading}>Registration Questions</div>
                <div className={styles.subheading}>We will ask guests the following questions when they register for the event.</div>
            </div>
            <div className={styles.personalInfoContainer}>
                <div className={styles.quesHeader}>
                    <Image src={AttendeeIcon} alt='attendee' />
                    <span className={styles.heading}>Personal Information</span>
                </div>
                <div className={styles.quesList}>
                    <div className={styles.ques}>
                        <div className={styles.nameLogoContainer}>
                            {/* <Image src={PeopleIcon} alt='people' /> */}
                            <span>Name</span>
                        </div>
                        <span className={styles.value}>Required</span>
                    </div>
                    <div className={styles.ques}>
                        <div className={styles.nameLogoContainer}>
                            {/* <Image src={MailIcon} alt='people' /> */}
                            <span>Email</span>
                        </div>
                        <span className={styles.value}>Required</span>
                    </div>
                    <div className={`${styles.ques} ${styles.phoneQues}`}>
                        <div className={styles.nameLogoContainer}>
                            <span></span>
                            <span>Phone</span>
                        </div>
                        <span className={styles.value}>Off</span>
                    </div>
                </div>
            </div>
            <div className={styles.customQuesContainer}>
                <div className={styles.quesHeader}>
                    <span className={styles.tag}>?</span>
                    <span className={styles.heading}>Custom Questions</span>
                </div>
                <div className={`${styles.ques} ${styles.addQues}`}>
                    <span>+</span>
                    <span className={styles.value}>Add Question</span>
                </div>
            </div>
        </div>
    )
}

export default RegistrationQues