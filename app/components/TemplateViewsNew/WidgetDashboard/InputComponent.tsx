'use client'
import React from 'react'
import styles from './inputcomp.style.module.css'
import EmptyImage from '/public/widgetimages/emptyimages/addedeventempty.svg'
import Image from 'next/image'

interface Props{
    fetched : boolean;
}

const InputComponent = ({fetched} : Props) => {

    return (
        <div className={`${styles.body} ${fetched ? styles.fetchedBody : ""}`}>
            {!fetched && <Image src={EmptyImage} alt='empty' />}
            <div className={fetched ? styles.fetchedHeading : styles.emptyHeading}>
                {fetched ? "Please provide your company URL to fetch the companys brand kit":"Build Personalized Widgets"}</div>
            {!fetched &&<div className={styles.emptySubHeading}>Paste your Website URL below and let our inbuilt brand kit fetcher, fetch them for you</div>}
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