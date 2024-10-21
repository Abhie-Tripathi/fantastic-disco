import React,{useState, useEffect} from 'react'
import styles from './shareModal.style.module.css';
import Account from '/public/account.svg';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { showToast } from "@/utils/showToast";
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { GAEvent } from '@/utils/GAEvent';
import { useTrackerServices } from '@/services/trackerServices';
interface ShareModalProps {
    fetchAccess?: any;
  closeShareModal?: () => void;
 
  id: string;
  setId?: any;
  shareFunction?: () => void;
  share?: boolean;
  setShare?: any
  setAccessData?: (data: any) => void;
}
const ShareModal: React.FC<ShareModalProps> = ({
    fetchAccess,
    closeShareModal,
    id,
    setId,
    shareFunction,
    share,
    setShare,
    setAccessData
}) => {
    const [currentUrl, setCurrentUrl] = useState('');
    const {shareTrackerInvite,createNewAccess, error, isLoading}= useTrackerServices();
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('');
    const [drop,setDrop]=useState(true);
    const [data, setData] = useState<any>([]);
    const path = usePathname().split('/');
    const searchParams = useSearchParams();
    const type  = searchParams.get('type');
    const [isClicked,setIsClicked]=useState(false);
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
        useEffect(() => {
              fetchData();
            }, []);
    useEffect(() => {
        if(!id)
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
        useEffect(() => {
            if (typeof window !== 'undefined') {
                const url = window.location.href;
                const baseUrl = url.substring(0, url.lastIndexOf('/'));
                setCurrentUrl(`${baseUrl}/trackedEvents?type=${type}`);
            }
        }, []);
        const handleFilterChange = (e: any) => {
            setFilter(e.target.value);
            setId('');
        };
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
            console.log(formData);
            if(id){
              
            
            try {
                const result= await shareTrackerInvite(formData);

                GAEvent(
                                        "trackers",
                                        "Tracker Detail",
                                        "Share",
                                        "Invite"
                                      );
                                      showToast("success","Tracker shared successfully!")
                                      fetchAccess();
                                      if(shareFunction)
                                      shareFunction();
                                      setId('');
                                      setIsClicked(false);
                                      setFilter('');
                                    if(setAccessData)
                                    setAccessData(data);
                                console.log(isLoading);
                                
            } catch (error:any) {
                console.error('Error fetching data:', error);
                            showToast("error",error.response);
                            fetchAccess();
                              setFilter('');
                              setIsClicked(false);
                              if(shareFunction)
                              shareFunction();
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
        // try{
        //     const result= await createNewAccess(formData);
        // }catch(error){

        // }
        const result= await createNewAccess(formData);
        console.log(error);
        
        // try {
        //     const { data, error } = await myFetch(url, {
        //         method: 'POST',
        //         body: JSON.stringify(formData),
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //     });
        //     if (error) {
        //         console.error('Error fetching data:', error);
        //         showToast('error',error.message.charAt(0).toUpperCase() + error.message.substring(1));
        //         setFilter("");
        //     } else {
        //         console.log(data.user.id);
        //         setId(data.user.id);
        //         // setData(data);
        //     }
        // } catch (err) {
        //     console.error('Fetch failed:', err);
        // }
        } else {
            showToast("error", "Enter Valid Name or Email");
            setFilter('');
            setIsClicked(false);
            
        }

        // setId("");
        }
        const saveShareInvite = (id: string, name: string, email:string) => {
            setId(id);
            setFilter(name);
            setFilteredData([]);
            setDrop(false);
        }
        const shareInvites=()=>{
            setIsClicked(true);
            if(id.length===0){
                shareNewInvite();
            }
        }
        useEffect(() => {
            
            if (id && isClicked) {
                shareInvite();
                if(closeShareModal)
                closeShareModal();
            }
        }, [id, isClicked]);
        useEffect(() => {
            if (error) {
              console.error('API Error:', error); // This logs the error from `useApi`'s state.
              showToast('error', error.message || 'An error occurred'); // Display error in toast
            }
          }, [error]);  
        
  return (
    <div className="flex flex-col w-[500px] gap-[var(--spacing-sm)] justify-center bg-[var(--primary-foreground)] p-5 rounded-[4px]" style={{boxShadow:"var(--elevation-medium)"}}>
                        <div className="font-medium text-[var(--primary-color)]">Share Tracker</div>
                        {/* <div className={styles.bar}></div> */}
                        {/* <div className={styles.linkCopy}>
                            <div className={styles.link}>{currentUrl}</div>
                            <div className={styles.copy} onClick={copyURL}>Copy link</div>
                        </div> */}
                        <div className="flex gap-1 border border-[var(--border-color)] rounded-[4px] items-stretch">
                        <div className={styles.accountImg}>
                            <Image src={Account} alt="account" />
                        </div>
                            <div className={styles.inputArea}>
                                <input type="text" 
                                className='w-full border-0 text-[var(--primary-text-color)] outline-none bg-inherit p-2'
                                value={filter}
                                placeholder='Invite others by email or name' onChange={handleFilterChange} />
                            </div>
                        </div>
                        {filter?.length > 0 && filteredData?.length > 0 && drop &&
                      <div className="relative w-full inline-block">
                          <div className={styles.dropdownContent}>
                              {filteredData.map((item: any) => (
                                  <div key={item?.id} className={styles.dropdownItem} onClick={() => saveShareInvite(item?.id, item?.aliasName, item?.email)}>
                                      {item?.aliasName}
                                  </div>
                              ))}
                          </div>
                      </div>}
                            
                        <div className="flex gap-3 flex-row-reverse" >
                            <button className={styles.send} onClick={shareInvites}>Send Invite</button>
                            <button className={styles.cancel} onClick={closeShareModal}>Cancel</button>
                        </div>
                    </div>
  )
}

export default ShareModal