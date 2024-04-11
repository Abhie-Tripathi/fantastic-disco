import React from 'react'
import styles from './codewindow.style.module.css'
import Script from 'next/script';

interface CodeProps{
    stickyId : string;
}

const CodeWindow = ({stickyId}: CodeProps) => {
  return (
    <div className={styles.container}>
        <div>Your Code</div>
        {stickyId && <div className={styles.code}>
            <div>{`<script src='https://widget-webcomp-nolit.vercel.app/dist/eventgeni.js'></script>`}</div>
            <div>{`<sticky-widget sticky-id={"${stickyId}"}></sticky-widget>`}</div>
        </div>}
    </div>
  )
}

export default CodeWindow