import React, { useState } from 'react'
import styles from './codewindow.style.module.css'
import CopyIcon from '/public/page.svg'
import Image from 'next/image'
import TickIcon from '/public/tick.svg'
import { useTheme } from '@/context'

interface Props{
    widgetType : string;
    widgetId : string;
}

const CodeWindow = ({widgetType, widgetId}: Props) => {

    const [copyClick, setCopyClick] = useState(false) //To change the icon if the copy button is clicked

    const getWidgetTag = (type : string) => {
        switch (type) {
            case 'Section':
                return 'section-widget';
            case 'Page':
                return 'page-widget';
            case 'Pop':
                return 'popup-widget';
            case 'StickyTop':
                return 'sticky-widget';
            default:
                return 'section-widget'; // Default case if widgetType is not one of the specified types
        }
    };
    const widgetTag = getWidgetTag(widgetType);

    const handleCopy = () => {
        setCopyClick(true);
        const widgetTag = getWidgetTag(widgetType);
        const textToCopy = `
            <script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>
            <${widgetTag} id="${widgetId}"></${widgetTag}>
        `;
        navigator.clipboard.writeText(textToCopy.trim());
    };
    const {theme} = useTheme();
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
                    <span style={{backgroundColor : theme === "light"?"#F2F2F2":"#292929"}}>https://</span>
                    <input placeholder='Your Company' style={{color : theme === "light" ? "black":"white"}} />
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
                <div className={styles.codewindow} style={{backgroundColor : theme == "light" ?"#FAFAFA":"#1A1A1A" }}>
                    {`<script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>`}
                    <br />
                    {`<${widgetTag} id= "${widgetId}"></${widgetTag}>`}
                </div>
            </div>

        </div>
    )
}

export default CodeWindow