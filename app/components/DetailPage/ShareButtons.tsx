'use client'
import React, { useState } from 'react'
import styles from './sharebtns.style.module.css'
import CopyIcon from '/public/page.svg'
import TickIcon from '/public/tick.svg'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, TwitterIcon } from 'react-share';
import Image from 'next/image'

interface Props{
    shareUrl : string;
    title : string;
}

const ShareButtons = ({shareUrl,title}: Props) => {

    const [copyClick, setCopyClick] = useState(false)
    const handleCopy = () => {
        setCopyClick(true)
        const textToCopy = "https://console.eventgeni.com/detailpage"
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <div className={styles.shareIconContainer}>
            <FacebookShareButton url={shareUrl} title={title} hashtag='paintfest'>
                <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={title} summary="This is a summary of the content" source="Your Website">
                <LinkedinIcon size={32} round={true} />
            </LinkedinShareButton>
            {!copyClick && <div className={styles.copyContainer} data-name="Copy" onClick={handleCopy}>
                <Image src={CopyIcon} alt='copy' className={styles.copyIcon} />
            </div>}
            {copyClick && <div className={styles.copyContainer} data-name="Copied">
                <Image src={TickIcon} alt='copied' className={styles.copyIcon} width={30} height={30} />
            </div>}
        </div>
    )
}

export default ShareButtons