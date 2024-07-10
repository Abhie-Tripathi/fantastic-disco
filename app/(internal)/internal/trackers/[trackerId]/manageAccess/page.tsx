"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './manageAccess.style.module.css';
import TrackerOwner from '@/app/components/trackers/trackerOwner';
import TrackerUser from '@/app/components/trackers/trackerUser';
import Account from '/public/account.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { usePathname } from 'next/navigation';
import { showToast } from "@/utils/showToast";
import { GAEvent } from '@/utils/GAEvent';

const Page = () => {
    const router = useRouter();
    const [currentUrl, setCurrentUrl] = useState('');
    const [accessdata, setAccessData] = useState([]);
    const [data, setData] = useState([]);
    const [id, setId] = useState<string>("");
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('');
    const [sendInvite,setSendInvite]=useState(false);
    
    useEffect(() => {
      setDrop(true);
      console.log(data)
      if(data?.length>0)
       { const result = data?.filter((item: any) =>
       
            item?.aliasName
            ?.toLowerCase()?.includes(filter?.toLowerCase())
        );
        console.log(result);
        
        setFilteredData(result);}
    }, [filter, data]);

    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            const baseUrl = url.substring(0, url.lastIndexOf('/'));
            setCurrentUrl(`${baseUrl}/trackedEvents?`);
        }
    }, []);
    useEffect(()=>{

    },[])
    useEffect(() => {
       fetchData();
    }, []);
    const fetchData = async () => {
        const url = `${baseUrl}/auth/users?limit=100`;
        try {
            const { data, error } = await myFetch(url, {
                method: 'GET'
            });
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                console.log('Data fetched:', data);
                setData(data?.users);
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        }
    };
    console.log(data);
    
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
      if(share===true)
        setShare(false);
    
      else if(sendInvite) setSendInvite(false);
        document.body.style.height = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        setFilter("");
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
    }, [share, sendInvite]);

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
            expiry:"",
            redirectUrl: `${currentUrl}`
        };
        const url = `${baseUrl}/access`;
        if(id){
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
            } 
            if(data) {
                console.log('Data fetched:', data);
                GAEvent(
                    "trackers",
                    "Tracker Detail",
                    "Share",
                    "Invite"
                  );
                  showToast("success","Tracker shared successfully!")
                  fetchData();
                setTimeout(()=>{
                    window.location.reload();
                },2000)
                
                if(share) setShare(false);
                if(sendInvite) setSendInvite(false);
                setAccessData(data);
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        }
        }
    }
    const shareNewInvite=async()=>{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const formData = 
        {
          firstname:filter.substring(0,filter.lastIndexOf('@')),
        lastname:"",
            email: filter
      };
    if(emailRegex.test(filter)){
    const url = `${baseUrl}/tracker/invite`;
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
            console.log(data.user.id);
            setId(data?.user?.id);
            // setData(data);
        }
    } catch (err) {
        console.error('Fetch failed:', err);
    }
    }
    // setId("");
    }
    const saveShareInvite = (id: string, name: string) => {
        setId(id);
        setFilter(name);
        setFilteredData([]);
        setDrop(false);
    }
    const [userAccessData,setUserAccessData]=useState<any>();
    useEffect(()=>{
      const fetchAccess=async()=>{
        const url = `${baseUrl}/tracker/access?accessEntity=TRACKER&accessEntityId=${path[path.length-2]}`;
        try {
            const { data, error } = await myFetch(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (error) {
                console.error('Error fetching data:', error);
            } else {
                console.log('Data fetched:', data);
                setUserAccessData(data);
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        }
      }
      fetchAccess();
    },[])
    console.log(userAccessData?.access?.admin);
    useEffect(() => {
        if (id && share) {
            shareInvite();
        }
    }, [id]);
    console.log(id);
    console.log(drop);
    
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
                    <TrackerOwner adminData={userAccessData?.access?.admin}/>
                </div>
                <div className={styles.containerBottomRight}>
                    <TrackerUser userData={userAccessData?.access?.other} setSendInvite={setSendInvite}/>
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
                        <div className={styles.accountImg}>
                            <Image src={Account} alt="account" />
                        </div>
                            <div className={styles.inputArea}>
                                <input type="text" 
                                value={filter}
                                placeholder='Invite others by email' onChange={handleFilterChange} />
                            </div>
                        </div>
                       
                            
                        <div className={styles.buttons} >
                            <button className={styles.send} onClick={shareNewInvite}>Send Invite</button>
                            <button className={styles.cancel} onClick={closeShareModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {sendInvite && (
              <div className={styles.shareModal} onClick={closeModal}>
              <div className={styles.innerModal}>
                  <div className={styles.shareHead}>Invite People</div>
                  <div className={styles.inviteAccess}>
                  <div className={styles.accountImg}>
                      <Image src={Account} alt="account" />
                      </div>
                      <div className={styles.inputArea}>
                          <input type="text" 
                          value={filter}
                          placeholder='Invite others by name' onChange={handleFilterChange} />
                      </div>
                      <div className={styles.buttons}>
                      <button className={styles.send} onClick={shareInvite}>Send Invite</button>
                  </div>
                  </div>
                 
                         {filter?.length > 0 && filteredData?.length > 0 && drop &&
                      <div className={styles.dropdown}>
                          <div className={styles.dropdownContent}>
                              {filteredData.map((item: any) => (
                                  <div key={item?.id} className={styles.dropdownItem} onClick={() => saveShareInvite(item?.id, item?.aliasName)}>
                                      {item?.aliasName}
                                  </div>
                              ))}
                          </div>
                      </div>}
                      
                  
              </div>
          </div>
            )}
        </div>
    );
}

export default Page;
