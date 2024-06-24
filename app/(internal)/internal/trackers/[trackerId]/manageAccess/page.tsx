"use client";
import React, { useState, useEffect } from 'react';
import styles from './manageAccess.style.module.css';
import TrackerOwner from '@/app/components/trackers/trackerOwner';
import TrackerUser from '@/app/components/trackers/trackerUser';
import Account from '/public/account.svg'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const Page = () => {
    const [share, setShare] = useState(false);
    const path=usePathname().split('/');
    const shareFunction = () => {
        if (!share) {
            // Add a custom state to the history
            window.history.pushState({ shareOpen: true }, '');
            setShare(true);
            document.body.style.height = '100vh';
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            closeShareModal();
        }
    };

    const closeShareModal = () => {
        setShare(false);
        document.body.style.height = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
    };

    useEffect(() => {
        const handlePopState = (event: any) => {
            if (event.state && event.state.shareOpen) {
                closeShareModal();
            } else if (share) {
                closeShareModal();
            }
        };

        // Add event listener for popstate
        window.addEventListener('popstate', handlePopState);

        // Remove event listener when component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [share]);

    const closeModal = (e: any) => {
        const targetElement = e.target;
        if (targetElement.classList.contains(styles.shareModal)) {
            closeShareModal();
        }
    };
    const queryParams = {
        id: path[path.length-2],
      };

    return (
        <div className={styles.container}>
            <div className={styles.containerTop}>
                <div className={styles.containerTopLeft}>
                    <div></div>
                    <div className={styles.trackerType}>
                        <div className={styles.heading} onClick={shareFunction}>
                            Share Tracker
                        </div>
                        <div className={styles.content}>
                            Select people within your team and share your tracker details
                        </div>
                    </div>
                </div>
                <div className={styles.containerTopRight}>
                    <button onClick={shareFunction}>Share Tracker</button>
                </div>
            </div>
            <div className={styles.containerBottom}>
                <div className={styles.containerBottomLeft}>
                    <TrackerOwner />
                </div>
                <div className={styles.containerBottomRight}>
                    <TrackerUser />
                </div>
            </div>
            {share && (
                <div className={styles.shareModal} onClick={closeModal}>
                    <div className={styles.innerModal}>
                        <div className={styles.shareHead}>Share Tracker</div>
                        <div className={styles.bar}></div>
                        <div className={styles.linkCopy}>
                            <div className={styles.link}>https://Eventgeni.internal/trackers/eventinbangalore</div>
                            <div className={styles.copy}>Copy link</div>
                        </div>
                        <div className={styles.inviteAccess}>
                            <Image src={Account} alt="account" />
                            <div className={styles.inputArea}>
                                <input type="text" placeholder='Invite others by name or email' />

                            </div>
                        </div>
                        <div className={styles.buttons}>
                            <Link href={{ pathname: '/signin', query: queryParams }} legacyBehavior>
                                <a target="_blank" rel="noopener noreferrer">
                                    <button className={styles.send}>Send Invite</button>
                                </a>
                            </Link>
                            <button className={styles.cancel} onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
