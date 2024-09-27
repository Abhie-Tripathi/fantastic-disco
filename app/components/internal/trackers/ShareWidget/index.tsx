import { myFetch } from '@/utils/myFetch';
import { ArrowUpRight } from 'geist-icons';
import { showToast } from '@/utils/showToast';
import React,{useState, useEffect} from 'react'
interface ShareWidgetProps {
  id:string
}
const ShareWidget: React.FC<ShareWidgetProps>= ({id})=>{
  const [searchValue,setSearchValue]=useState("");
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const url = window.location.href;
        const baseUrl = url.substring(0, url.lastIndexOf('/'));
        setCurrentUrl(`${baseUrl}/tracker/${id}/trackedEvents?type=`);
    }
}, []);
  const handleInvitSend=async()=>{
    const formData = {
      accessEntity: "tracker",
      accessEntityId: id,
      entityType: "employee",
      accessLevel: "EDIT",
      expiry:"",
      redirectUrl: `${currentUrl}`
  };
  console.log(formData);
  console.log(currentUrl);
  
  // const url = `${baseUrl}/access`;
 
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
  //         showToast("error",error.response);
  //         // fetchAccess();
  //           setSearchValue('');
  //     } 
  //     if(data) {
  //         console.log('Data fetched:', data);
  //         // GAEvent(
  //         //     "trackers",
  //         //     "Tracker Detail",
  //         //     "Share",
  //         //     "Invite"
  //         //   );
  //           showToast("success","Tracker shared successfully!")
  //           setSearchValue('');
  //         // setTimeout(()=>{
  //         //     window.location.reload();
  //         // },2000)
  //         // if(sendInvite) setSendInvite(false);
  //         // if(setAccessData)
  //         // setAccessData(data);
  //     }
  // } catch (err) {
  //     console.error('Fetch failed:', err);
  // }
  
}

    return(
            <div className="flex flex-col gap-2 bg-white border-[1px] border-solid border-[var(--border-color)] rounded-[12px] p-4 w-[100%]">
               <div className='flex items-center gap-2 text-[var(--primary-color)]'>
                <div className='font-semibold'>Manage Access</div>
               </div>
               <div className='flex flex-col text-sm'>
               Share or Invite your team members to keep track of events 
               </div>
               <div className='flex p-2 border-[1px] border-solid border-[var(--border-color)] rounded gap-2 justify-between h-[40px] bg-[var(--background-secondary-color)]'>
               <input
              className="outline-none w-full bg-[var(--background-secondary-color)]"
              placeholder="Email"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
             <button className="w-[50px] flex text-white font-bold py-2 px-4 rounded text-sm items-center justify-center"
        style={{ background: "var(--primary-color)" }} onClick={handleInvitSend}>
            <span>Invite</span>
          </button>
               </div>
            </div>
    )
}
export default ShareWidget;