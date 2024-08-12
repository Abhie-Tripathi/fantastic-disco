'use client'
import React, { useState } from 'react'
import styles from './sharebtns.style.module.css'
import TickIcon from '/public/tick.svg'
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, EmailShareButton } from 'react-share';
import Image from 'next/image'

interface Props {
    shareUrl: string;
    title?: string;
    hashtags?: string[];
    emailSubject?: string;
    emailBody?: string;
}

const ShareButtons = ({ shareUrl, title, hashtags, emailSubject, emailBody }: Props) => {
    const [copyClick, setCopyClick] = useState(false)
    const handleCopy = () => {
        setCopyClick(true)
        const textToCopy = "https://console.eventgeni.com/detailpage"
        navigator.clipboard.writeText(textToCopy);
    };

    return (
        <div className={styles.shareIconContainer}>
            <FacebookShareButton url={shareUrl} title={title} hashtag={hashtags ? hashtags[0] : "#sometag"}>
                <FaceBookIcon/>
            </FacebookShareButton>
            <TwitterShareButton url={shareUrl} title={title} hashtags={hashtags}>
                <TwitterIcon/>
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={title} source='Eventgeni'>
                <LinkedinIcon/>
            </LinkedinShareButton>
            <EmailShareButton url={shareUrl} title={title} body={emailBody} subject={emailSubject}>
                <EmailIcon/>
            </EmailShareButton>
            {!copyClick && <div className={styles.copyContainer} data-name="Copy" onClick={handleCopy}>
                <CopyIcon/>
            </div>}
            {copyClick && <div className={styles.copyContainer} data-name="Copied">
                <Image src={TickIcon} alt='copied' className={styles.copyIcon} width={20} height={20} />
            </div>}
        </div>
    )
}

export default ShareButtons
function FaceBookIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.1286 17.9299C14.5665 17.3747 18 13.5883 18 9C18 4.02943 13.9706 0 9 0C4.02943 0 0 4.02943 0 9C0 13.2943 3.00759 16.8861 7.03125 17.784V11.7341H5.0625V9H7.03125V7.80715C7.03125 4.74967 8.19519 3.3341 11.1952 3.3341C11.7629 3.3341 12.7437 3.44547 13.1461 3.55684V6.04308C12.9341 6.02153 12.564 6.01075 12.1078 6.01075C10.6347 6.01075 10.125 6.56764 10.125 8.01913V9H13.0024L12.4994 11.7341H10.1286V17.9299Z" fill="#A1A1A1" />
        </svg>

    )
}
function LinkedinIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.25 0C1.00736 0 0 1.00736 0 2.25V15.75C0 16.9927 1.00736 18 2.25 18H15.75C16.9927 18 18 16.9927 18 15.75V2.25C18 1.00736 16.9927 0 15.75 0H2.25ZM5.625 7.59375V14.625H3.375V7.59375H5.625ZM5.625 5.06259C5.625 5.68748 5.19085 6.1875 4.49334 6.1875H4.4803C3.80905 6.1875 3.375 5.68748 3.375 5.06259C3.375 4.42365 3.82236 3.9375 4.50657 3.9375C5.19085 3.9375 5.61201 4.42365 5.625 5.06259ZM9.5625 14.625H7.3125C7.3125 14.625 7.34825 8.36127 7.31258 7.59375H9.5625V8.75667C9.5625 8.75667 10.125 7.59375 11.8125 7.59375C13.5 7.59375 14.625 8.54755 14.625 11.06V14.625H12.375V11.3741C12.375 11.3741 12.375 9.52443 10.9531 9.52443C9.53123 9.52443 9.5625 11.1822 9.5625 11.1822V14.625Z" fill="#A1A1A1" />
        </svg>

    )
}
function TwitterIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.5625 0.5625H6.46875L10.6697 6.42435L15.75 0.5625H18L11.6882 7.84539L18.5625 17.4375H12.6562L8.45526 11.5757L3.375 17.4375H1.125L7.43685 10.1546L0.5625 0.5625ZM13.523 15.75L3.84798 2.25H5.60202L15.2771 15.75H13.523Z" fill="#A1A1A1" />
        </svg>

    )
}
function CopyIcon() {
    return (
        <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.59375 1.6875H8.40625C8.71691 1.6875 8.96875 1.93934 8.96875 2.25C8.96875 2.56066 8.71691 2.8125 8.40625 2.8125H5.59375C5.28309 2.8125 5.03125 2.56066 5.03125 2.25C5.03125 1.93934 5.28309 1.6875 5.59375 1.6875ZM3.41464 1.6875C3.66441 0.717059 4.54534 0 5.59375 0H8.40625C9.45464 0 10.3356 0.717059 10.5854 1.6875H12.9062H13.75V2.53125V14.3438C13.75 16.363 12.113 18 10.0938 18H3.90625C1.88695 18 0.25 16.363 0.25 14.3438V2.53125V1.6875H1.09375H3.41464ZM3.64475 3.375H3.625H1.9375V14.3438C1.9375 15.4311 2.81894 16.3125 3.90625 16.3125H10.0938C11.1811 16.3125 12.0625 15.4311 12.0625 14.3438V3.375H10.375H10.3552C9.96618 4.04752 9.23907 4.5 8.40625 4.5H5.59375C4.76093 4.5 4.03379 4.04752 3.64475 3.375Z" fill="#A1A1A1" />
        </svg>

    )
}
function EmailIcon() {
    return (
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.9222 1.9375H3.07775L9 7.01371L14.9222 1.9375ZM1.6875 2.96843V10.9375C1.6875 11.5588 2.19118 12.0625 2.8125 12.0625H15.1875C15.8088 12.0625 16.3125 11.5588 16.3125 10.9375V2.96843L9.5491 8.76562L9 9.23629L8.4509 8.76562L1.6875 2.96843ZM0 0.25H1.6875H16.3125H18V1.9375V10.9375C18 12.4908 16.7408 13.75 15.1875 13.75H2.8125C1.2592 13.75 0 12.4908 0 10.9375V1.9375V0.25Z" fill="#A1A1A1" />
        </svg>

    )
}