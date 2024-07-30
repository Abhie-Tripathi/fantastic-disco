import React,{useState, useEffect} from 'react'
import styles from './shareModal.style.module.css';
import Account from '/public/account.svg';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { showToast } from "@/utils/showToast";
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { GAEvent } from '@/utils/GAEvent';
interface ShareModalProps {
    fetchAccess?: any;
  closeShareModal: () => void;
  data: any;
  id: string;
  setId: any;
  shareFunction: () => void;
  share: boolean;
  setShare: any
  setAccessData?: (data: any) => void;
}
const ShareModal: React.FC<ShareModalProps> = ({
    fetchAccess,
    closeShareModal,
    data,
    id,
    setId,
    shareFunction,
    share,
    setShare,
    setAccessData
}) => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('');
    const [drop,setDrop]=useState(true);
    const path = usePathname().split('/');
    const searchParams = useSearchParams();
    const type  = searchParams.get('type');
    const [isClicked,setIsClicked]=useState(false);
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
                    showToast("error",error.response);
                    fetchAccess();
                      setFilter('');
                      setIsClicked(false);
                      shareFunction();
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
                      fetchAccess();
                      shareFunction();
                      setId('');
                      setIsClicked(false);
                      setFilter('');
                    // setTimeout(()=>{
                    //     window.location.reload();
                    // },2000)
                    // if(sendInvite) setSendInvite(false);
                    if(setAccessData)
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
                setId(data.user.id);
                // setData(data);
            }
        } catch (err) {
            console.error('Fetch failed:', err);
        }
        } else {
            showToast("error", "Enter Valid Name or Email");
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
                closeShareModal();
            }
        }, [id, isClicked]);
  return (
    <div className={styles.innerModal}>
                        <div className={styles.shareHead}>Share Tracker</div>
                        {/* <div className={styles.bar}></div> */}
                        {/* <div className={styles.linkCopy}>
                            <div className={styles.link}>{currentUrl}</div>
                            <div className={styles.copy} onClick={copyURL}>Copy link</div>
                        </div> */}
                        <div className={styles.inviteAccess}>
                        <div className={styles.accountImg}>
                            <Image src={Account} alt="account" />
                        </div>
                            <div className={styles.inputArea}>
                                <input type="text" 
                                value={filter}
                                placeholder='Invite others by email or name' onChange={handleFilterChange} />
                            </div>
                        </div>
                        {filter?.length > 0 && filteredData?.length > 0 && drop &&
                      <div className={styles.dropdown}>
                          <div className={styles.dropdownContent}>
                              {filteredData.map((item: any) => (
                                  <div key={item?.id} className={styles.dropdownItem} onClick={() => saveShareInvite(item?.id, item?.aliasName, item?.email)}>
                                      {item?.aliasName}
                                  </div>
                              ))}
                          </div>
                      </div>}
                            
                        <div className={styles.buttons} >
                            <button className={styles.send} onClick={shareInvites}>Send Invite</button>
                            <button className={styles.cancel} onClick={closeShareModal}>Cancel</button>
                        </div>
                    </div>
  )
}

export default ShareModal