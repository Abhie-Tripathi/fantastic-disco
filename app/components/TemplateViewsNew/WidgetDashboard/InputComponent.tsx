'use client'
import React from 'react'
import styles from './inputcomp.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image'

const InputComponent = () => {

    return (
        <div className={styles.body}>
            <Image src={EmptyImage} alt='empty' />
            <div className={styles.emptyHeading}>Build Personalized Widgets</div>
            <div className={styles.emptySubHeading}>Paste your Website URL below and let our inbuilt brand kit fetcher, fetch them for you</div>
            <div className={styles.input_btnContainer}>
                <div className={styles.inputContainer}>
                    <span>https://</span>
                    <input placeholder='Enter your company domain'/>
                </div>
                <button>Fetch</button>
            </div>

        </div>
    )
}

export default InputComponent