'use client'
import React from 'react'
import styles from './inputcomp.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image'

interface Props {
    fetched: boolean;
}

const InputComponent = ({ fetched }: Props) => {

    return (
        <div className={`${styles.body} ${fetched ? styles.fetchedBody : ""}`}>
            {!fetched && <Image src={EmptyImage} alt='empty' />}
            {!fetched && <div className={styles.emptyHeading}>
                Build Personalized Widgets</div>}
            {!fetched && <div className={styles.emptySubHeading}>Paste your Website URL below and let our inbuilt model fetch your events and brand kit</div>}
            <div className={`${styles.input_btnContainer} ${fetched ? styles.fetchedInputBtnContainer : ""}`}>
                <div className={styles.inputContainer}>
                    <span>https://</span>
                    <input placeholder='Enter your company domain' />
                </div>
                <button>Fetch</button>
            </div>
            {fetched && <div className={styles.infoContainer}>
                <span className={styles.infoBtn}>i</span>
                <span className={styles.info}>Once you&apos;ve created a widget, the URL cannot be changed. Please ensure all details are accurate before finalizing. However, if you delete all existing widgets, you will have the option to change the URL.</span>
            </div>}

        </div>
    )
}

export default InputComponent