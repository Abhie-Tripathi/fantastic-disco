import React,{useState, useEffect} from 'react'
import styles from './shareModal.style.module.css';
import Account from '/public/account.svg';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
// import { showToast } from "@/utils/showToast";
import { baseUrl } from '@/constants';
import { useToast } from "@/hooks/use-toast";
import { myFetch } from '@/utils/myFetch';
import { GAEvent } from '@/utils/GAEvent';
import { useTrackerServices } from '@/services/trackerServices';
import { Button } from "@/components/ui/button";
interface ShareModalProps {
    fetchAccess?: any;
  closeShareModal?: () => void;
 
  id?: string;
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
     const { toast } = useToast();
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
                const url = window.location.origin;
                const baseUrl = url.substring(0, url.lastIndexOf('/'));
                setCurrentUrl(`${url}`);
            }
        }, []);
        const handleFilterChange = (e: any) => {
            setFilter(e.target.value);
            setId?.('');
        };
        const shareInvite = async () => {
            // const formData = {
            //     accessEntity: "tracker",
            //     accessEntityId: path[path.length - 2],
            //     entityType: "employee",
            //     entityId: id,
            //     accessLevel: "EDIT",
            //     expiry:"",
            //     redirectUrl: `${currentUrl}`
            // };
            const formData={
                accessReceiverEmail: filter,
                accessType: "admin",
                redirectDomain: currentUrl
            }
              
            
            try {
                const result= await shareTrackerInvite(formData, path[path.length - 2]);

                GAEvent(
                                        "trackers",
                                        "Tracker Detail",
                                        "Share",
                                        "Invite"
                                      );
                                      toast({
                                        title: "Success",
                                        description: "Tracker shared successfully!",
                                        variant: "default",
                                      });
                                      fetchAccess?.();
                                      if(shareFunction)
                                      shareFunction();
                                      setId?.('');
                                      setIsClicked(false);
                                      setFilter('');
                                    if(setAccessData)
                                    setAccessData(data);
                                console.log(isLoading);
                                
            } catch (error:any) {
                            toast({
                                title: "Error",
                                description: error.message,
                                variant: "destructive",
                              });
                            fetchAccess?.();
                              setFilter('');
                              setIsClicked(false);
                              if(shareFunction)
                              shareFunction();
            }
            // }
        }
        const saveShareInvite = (id: string, name: string, email:string) => {
            setId?.(id);
            setFilter(name);
            setFilteredData([]);
            setDrop(false);
        }
        const shareInvites=()=>{
            setIsClicked(true);
            // if(id.length===0){
            //     shareNewInvite();
            // }
        }
        useEffect(() => {
            
            if (isClicked) {
                shareInvite();
                if(closeShareModal)
                closeShareModal();
            }
        }, [id, isClicked]);
        useEffect(() => {
            if (error) {
              console.error('API Error:', error);
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
                            {/* <button className={styles.send} onClick={shareInvites}>Send Invite</button> */}
                            <Button className='text-white' onClick={shareInvites}>Send Invite</Button>
                            {/* <button className={styles.cancel} onClick={closeShareModal}>Cancel</button> */}
                            <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]" onClick={closeShareModal}>Cancel</Button>
                        </div>
                    </div>
  )
}

export default ShareModal