'use client'
import React, { useEffect, useState } from 'react'
import styles from './codewindow.style.module.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import CopyIcon from '/public/page.svg'
import Image from 'next/image';
import TickIcon from '/public/tick.svg'
import BackIcon from '/public/leftArrow.svg'
import { useRouter } from 'next/navigation';

interface CodeProps {
    widgetId: string;
    type: string;
}
const CodeWindow = ({ widgetId, type }: CodeProps) => {
    const [code, setCode] = useState<string>("")
    const [copyClick, setCopyClick] = useState(false) //To change the icon if the copy button is clicked
    const router = useRouter()

    useEffect(() => {
        if (type === "Sticky") {
            setCode(`<sticky-widget sticky-id={"${widgetId}"}></sticky-widget>`)
        } else if (type === "Page") {
            setCode(`<page-widget page-id={"${widgetId}"}></page-widget>`)
        } else {
            setCode(`<section-widget page-id={"${widgetId}"}></section-widget>`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCopy = () => {
        setCopyClick(true)
        const textToCopy = `
            <script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>
            ${code}
        `;
        navigator.clipboard.writeText(textToCopy);
    };

    const handleBack = ()=>{
        router.push("/widget")
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <div>Your Code</div>
                {!copyClick && <div className={styles.copyContainer} data-name="Copy" onClick={handleCopy}>
                    <Image src={CopyIcon} alt='copy' className={styles.copyIcon} />
                </div>}
                {copyClick && <div className={styles.copyContainer} data-name="Copied">
                    <Image src={TickIcon} alt='copied' className={styles.copyIcon} />
                </div>}
            </div>
            {widgetId && (
                <SyntaxHighlighter language="javascript" style={darcula}>
                    {`<script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>`}
                </SyntaxHighlighter>
            )}
            {widgetId && (
                <SyntaxHighlighter language="html" style={darcula}>
                    {code}
                </SyntaxHighlighter>
            )}
            <div className={styles.backBtnContainer} onClick={handleBack}>
                <Image src={BackIcon} alt='back'/>
                <div>Back</div>
            </div>
        </div>
    );
};

export default CodeWindow