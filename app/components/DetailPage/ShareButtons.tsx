'use client'
import React, { useState } from 'react'
import styles from './sharebtns.style.module.css'
import CopyIcon from '/public/page.svg'
import TickIcon from '/public/tick.svg'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, TwitterIcon, EmailShareButton, EmailIcon } from 'react-share';
import Image from 'next/image'

interface Props {
    shareUrl: string;
    title: string;
    hashtags : string[];
    emailSubject : string;
    emailBody : string;
}

const ShareButtons = ({ shareUrl, title,hashtags, emailSubject, emailBody }: Props) => {
    const [copyClick, setCopyClick] = useState(false)
    const handleCopy = () => {
        setCopyClick(true)
        const textToCopy = "https://console.eventgeni.com/detailpage"
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <div className={styles.shareIconContainer}>
            <FacebookShareButton url={shareUrl} title={title} hashtag={hashtags[0]}>
                <FacebookIcon size={24} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title} hashtags={hashtags}>
                <TwitterIcon size={24} round={true} />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={title} source='Eventgeni'>
                <LinkedinIcon size={24} round={true} />
            </LinkedinShareButton>
            <EmailShareButton url={shareUrl} title={title} body={emailBody} subject={emailSubject}>
                <EmailIcon size={24} round={true} />
            </EmailShareButton>
            {!copyClick && <div className={styles.copyContainer} data-name="Copy" onClick={handleCopy}>
                <Image src={CopyIcon} alt='copy' className={styles.copyIcon} />
            </div>}
            {copyClick && <div className={styles.copyContainer} data-name="Copied">
                <Image src={TickIcon} alt='copied' className={styles.copyIcon} width={20} height={20} />
            </div>}
        </div>
    )
}

export default ShareButtons