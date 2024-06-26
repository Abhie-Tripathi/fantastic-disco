"use client";
import React, { useState, useEffect } from 'react';
import styles from './manageAccess.style.module.css';
import TrackerOwner from '@/app/components/trackers/trackerOwner';
import TrackerUser from '@/app/components/trackers/trackerUser';
import Account from '/public/account.svg';
import Image from 'next/image';
import Link from 'next/link';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { usePathname } from 'next/navigation';
import { showToast } from "@/utils/showToast";

const Page = () => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [data, setData] = useState([]);
    const [id, setId] = useState<string>("");
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
      setDrop(true);
        const result = data.filter((item: any) =>
            item?.aliasName.toLowerCase().includes(filter.toLowerCase())
        );
        setFilteredData(result);
    }, [filter, data]);

    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            const baseUrl = url.substring(0, url.lastIndexOf('/'));
            setCurrentUrl(`${baseUrl}/trackedEvents`);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const url = `${baseUrl}/auth/users`;
            try {
                const { data, error } = await myFetch(url, {
                    method: 'GET'
                });
                if (error) {
                    console.error('Error fetching data:', error);
                } else {
                    console.log('Data fetched:', data);
                    setData(data);
                }
            } catch (err) {
                console.error('Fetch failed:', err);
            }
        };

        fetchData();
    }, []);

    const [share, setShare] = useState(false);
    const path = usePathname().split('/');
    const [drop,setDrop]=useState(true);
    const shareFunction = () => {
        if (!share) {
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

        window.addEventListener('popstate', handlePopState);

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
        id: path[path.length - 2],
    };
    console.log(path);

    const copyURL = () => {
        navigator.clipboard.writeText(currentUrl);
        showToast('success', "Copied");
    }

    const shareInvite = async () => {
        const formData = {
            accessEntity: "tracker",
            accessEntityId: path[path.length - 2],
            entityType: "employee",
            entityId: id,
            accessLevel: "EDIT",
            redirectUrl: currentUrl
        };
        const url = `${baseUrl}/access`;
        try {
            const { data, error } = await myFetch(url, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                console.log('Data fetched:', data);
                setData(data);
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        }
    }

    const saveShareInvite = (id: string, name: string) => {
        setId(id);
        setFilter(name);
        setFilteredData([]);
        setDrop(false);
    }

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
                            <div className={styles.link}>{currentUrl}</div>
                            <div className={styles.copy} onClick={copyURL}>Copy link</div>
                        </div>
                        <div className={styles.inviteAccess}>
                            <Image src={Account} alt="account" />
                            <div className={styles.inputArea}>
                                <input type="text" 
                                value={filter}
                                placeholder='Invite others by name or email' onChange={handleFilterChange} />
                            </div>
                        </div>
                       
                               {drop &&
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownContent}>
                                    {filteredData.map((item: any) => (
                                        <div key={item?.id} className={styles.dropdownItem} onClick={() => saveShareInvite(item?.id, item?.aliasName)}>
                                            {item?.aliasName}
                                        </div>
                                    ))}
                                </div>
                            </div>}
                            
                        <div className={styles.buttons}>
                            <button className={styles.send} onClick={shareInvite}>Send Invite</button>
                            <button className={styles.cancel} onClick={closeShareModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;
