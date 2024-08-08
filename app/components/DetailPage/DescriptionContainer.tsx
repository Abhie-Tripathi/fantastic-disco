import React from 'react'
import styles from './description.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'

interface Props{
    description : string;
}

const DescriptionContainer = ({description} : Props) => {

    return (
        <div className={styles.body}>
            <div className={styles.descHeader}>
                <div className={styles.descContainer}>
                    <DescIcon />
                    <div className={styles.descriptionHeading}>Add Event Description</div>
                </div>
            </div>
            {description && <div className={styles.description} dangerouslySetInnerHTML={{ __html: description }}></div>}
        </div>
    )
}

export default DescriptionContainer

function DescIcon() {
    return (
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.1665 1.66699H12.8332M1.1665 5.00033H12.8332M1.1665 8.33366H6.1665" stroke="#A8A8A8" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}