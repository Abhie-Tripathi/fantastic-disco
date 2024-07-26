import React, { useState } from 'react'
import styles from './codewindow.style.module.css'
import CopyIcon from '/public/page.svg'
import Image from 'next/image'
import TickIcon from '/public/tick.svg'

const CodeWindow = () => {

    const [copyClick, setCopyClick] = useState(false) //To change the icon if the copy button is clicked

    const handleCopy = () => {
        setCopyClick(true)
        const textToCopy = `
            <script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>
            <section-widget id="23"></section-widget>
        `;
        navigator.clipboard.writeText(textToCopy);
    };
    return (
        <div className={styles.body}>
            <div className={styles.domainHeader}>Whitelist your Domain</div>
            <div className={styles.line}></div>
            <div className={styles.domainContainer}>
                <div className={styles.domainHeadingContainer}>
                    <div className={styles.iBtn}>i</div>
                    <div className={styles.heading}>Please enter your website host domain to whitelist it on our platform</div>
                </div>
                <div className={styles.inputContainer}>
                    <span>https://</span>
                    <input placeholder='Your Company' />
                    {/* <span>.com</span> */}
                </div>
            </div>
            <div className={styles.line}></div>
            <div className={styles.codeHeader}>
                <div className={styles.heading}>Widget Code</div>
                <button className={styles.copyBtn} onClick={handleCopy}>
                    {copyClick ? <Image src={TickIcon} alt='tick' width={16} height={18}/> : <Image src={CopyIcon} alt='copy' width={16} height={18} />}
                    <div>Copy Code</div>
                </button>
            </div>
            <div className={styles.line}></div>
            <div className={styles.codeContainer}>
                <div className={styles.codewindow}>
                    {`<script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>`}
                    {`<section-widget id="23"></section-widget>`}
                </div>
            </div>

        </div>
    )
}

export default CodeWindow