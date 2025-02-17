
"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './manageAccess.style.module.css';
import TrackerUser from '@/app/components/trackers/trackerUser';
import Image from 'next/image';
import Link from 'next/link';
import ShareModal from '@/app/components/internal/trackers/shareModal'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { showToast } from "@/utils/showToast";
import { GAEvent } from '@/utils/GAEvent';
import { useQuery } from "@tanstack/react-query";
import { useTrackerServices } from '@/services/trackerServices';
// import SideNav from '@/app/components/trackers/sideNav';

const Page = () => {
    const router = useRouter();
    const {getShareAccess} = useTrackerServices();
    const [currentUrl, setCurrentUrl] = useState('');
    const [accessdata, setAccessData] = useState([]);
    const [data, setData] = useState([]);
    const [allUsers,setAllUsers]=useState([]);
    const [id, setId] = useState<string>("");
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('');
    const [sendInvite,setSendInvite]=useState(false);
    const path = usePathname().split('/');
    const trackerId = path?.[path.length - 2];
    useEffect(() => {
    if(!id)
      setDrop(true);
      if(data?.length>0)
       { const result = data?.filter((item: any) =>
       
            item?.aliasName
            ?.toLowerCase()?.includes(filter?.toLowerCase())
        );
        
        setFilteredData(result);}
    }, [filter, data]);

    const handleFilterChange = (e: any) => {
        setFilter(e.target.value);
        setId('');
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = window.location.href;
            const baseUrl = url.substring(0, url.lastIndexOf('/'));
            setCurrentUrl(`${baseUrl}/trackedEvents?`);
        }
    }, []);
    
    const [share, setShare] = useState(false);
   
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
    const {
        data: userAccessData,
        error,
        isLoading,
      } = useQuery({
        queryKey: ["accessData", trackerId], // Ensure unique caching per tracker
        queryFn: () => getShareAccess(trackerId, "tracker"),
        enabled: !!trackerId, // Prevents the query from running if trackerId is undefined
        staleTime: 1000 * 60 * 5,
      });
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

    const copyURL = () => {
        navigator.clipboard.writeText(currentUrl);
        showToast('success', "Copied");
    }
    
    const saveShareInvite = (id: string, name: string, email:string) => {
        setId(id);
        setFilter(name);
        setFilteredData([]);
        setDrop(false);
    }
    // const [userAccessData,setUserAccessData]=useState<any>();
    // useEffect(()=>{
      
    //   fetchAccess();
    // },[])
    console.log(userAccessData);
    
    // useEffect(() => {
    //     if (id && share) {
    //         shareInvite();
    //     }
    // }, [id]);
    const fetchAccess=async()=>{
        // const url = `${baseUrl}/tracker/access?accessEntity=TRACKER&accessEntityId=${path[path.length-2]}`;
        // try {
        //     const { data, error } = await myFetch(url, {
        //         method: 'GET',
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     });
        //     if (error) {
        //         console.error('Error fetching data:', error);
        //     } else {
        //         console.log('Data fetched:', data);
        //         setUserAccessData(data);
        //     }
        // } catch (err) {
        //     console.error('Fetch failed:', err);
        // }
        const result = await getShareAccess(`${path[path.length-2]}`, "tracker");
        if(error){
            console.error('Error fetching data:', error);
        }else{
            // setUserAccessData(result);
        }
      }
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex fixed w-[calc(100vw-134px)] mt-[54px] items-center justify-between bg-[var(--heading-background-color)] p-3" style={{zIndex:"5"}}>
            {/* <SideNav/> */}
                <div className='flex items-center'>
                    <div></div>
                    <div className="flex flex-col">
                        <div className="text-[var(--primary-color)] font-bold text-lg" >
                            Share Tracker
                        </div>
                       
                        <div className="text-sm text-[var(--secondary-text-color)]">
                            Select people within your team and share your tracker details
                        </div>
                    </div>
                </div>
                <div className={styles.containerTopRight}>
                    <Button className="text-white" onClick={shareFunction}>Share Tracker</Button>
                </div>
            </div>
            <div className='flex gap-2 w-[calc(100vw-134px)] mt-[140px]'>
            {/* <div className='fixed top-0 w-[calc(100vw-134px)] bg-[var(--primary-foreground)] h-[224px] z-3'></div> */}
                <div className="flex w-[40%] h-fit">
                    {/* <TrackerOwner adminData={userAccessData?.access?.admin}/> */}
                    <TrackerUser userData={userAccessData} type="admins" heading="Tracker Owners"/>
                </div>
                <div className="flex w-[60%]">
                <TrackerUser userData={userAccessData} type="others" heading="Tracker Users"/>
                </div>
            </div>
            {share && (
                <div className={styles.shareModal} onClick={closeModal}>
                    {share && 
        <div className={styles.shareModal} onClick={closeModal}>
          <ShareModal fetchAccess={fetchAccess} id={id} setId={setId} closeShareModal={closeShareModal} share={share} setShare={setShare} shareFunction={shareFunction}/>
        </div>
        }
                </div>
            )}
            {/* {sendInvite && (
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
            )} */}
        </div>
    );
}

export default Page;