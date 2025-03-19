import React, { useEffect, useRef, useState } from 'react';
import styles from './trackerUser.style.module.css';
import Image from 'next/image';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { usePathname } from 'next/navigation';
import Router from "next/router";
import { showToast } from '@/utils/showToast';
import UserProfile from '../../userProfile/UserProfile';
import { useTrackerServices } from '@/services/trackerServices';

interface UserAccess {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    accessType: string;
    accessId: string;
}

type TrackerUserProps = {
  setSendInvite?: (value: boolean) => void;
  fetchAccess?: ()=>void;
  userData: UserAccess[];
  type:string;
  heading:string;
};

const TrackerUser: React.FC<TrackerUserProps> = ({ setSendInvite, userData, fetchAccess, type, heading }) => {
  const path = usePathname().split('/');
  const trackerId = path?.[path.length - 2];
  const {removeAccess,editAccess, error} = useTrackerServices();
  const [accessId, setAccessId] = useState<string | null>(null);
  const [drop, setDrop] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDrop(false);
      setAccessId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userHandle = (name: string): string => {
    const last = name.substring(1).split(' ').map(item => item.toLowerCase()).join('');
    return `@${name.charAt(0)}${last}`;
  };

  const abbreviation = (name: string): string => {
    return name?.split(' ').map(word => word[0]?.toUpperCase()).join('') || '';
  };

  const changeAccess = async (accessEntry: string, access: string, accessLevel:string) => {
    console.log(accessEntry);
    
    if(accessLevel!==access){
    const url = `${baseUrl}/access/${accessEntry}`;
    const formData = {
      entityId: accessId,
      accessLevel: access,
    };

    try {
        const data= await editAccess(accessEntry, formData)
        if(data){
          console.log('Data fetched:', data);
          showToast("success","Access updated successfully")
          if(fetchAccess)
          fetchAccess();
        }
        else if (error) {
          console.error('Error fetching data:', error);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
  }
  };

  const toggleDropdown = (id: string) => {
    if (accessId === id) {
      setAccessId(null);
      setDrop(false);
    } else {
      setAccessId(id);
      setDrop(true);
    }
  };

  const deleteEntry = async (accessId: string) => {
    // const formData = {
    //   entityId: id,
    //   published: false,
    // };

    try {
      const data = await removeAccess( accessId, trackerId);
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Data fetched:', data);
        showToast("success", "Access removed successfully")
        if(fetchAccess)
        fetchAccess();
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };
  console.log(userData);
  
  return (
    <div className="flex w-[100%] p-5 flex-col gap-3 border border-[var(--border-color)] rounded-[12px]">
      
      <>
      <div className="flex w-[100%] justify-between items-center">
        <div className="text-[var(--secondary-text-color)] font-medium">{heading}</div>
        {/* <div className={styles.add} onClick={() => setSendInvite(true)}>Add Users</div> */}
      </div>
      <div style={{border:"1px solid var(--border-color)"}}></div>
      {userData.length==0 ?
      <div className='flex justify-center text-[var(--secondary-text-color)]'>Share tracker with your team.</div>:
      <div className="flex flex-col gap-6">
        {userData && userData.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {type==="others" &&
              <div className="w-[15px] flex items-center justify-center h-[15px] text-[var(--primary-color)] border border-[var(--primary-color)] cursor-pointer" onClick={() => deleteEntry(item.accessId)}>-</div>
              }       
              {item.imageUrl?<Image src={item.imageUrl} alt="profilePhoto" height={40} width={40} style={{borderRadius:"50%", height:"40px", width:"40px"}} />:
              <UserProfile name={item.name}/>
              }
              <div>
                <div className="text-[var(--primary-text-color)]">{item.name}{" "}</div>
                <span className="text-[var(--primary-color)] text-sm">{userHandle(item.name)}</span>
                {/* <div className={styles.email}>{item?.email}</div> */}
              </div>
            </div>
            {/* {type==="otherss"?
            <div
              className="text-[var(--primary-color)] text-sm font-medium"
              // ref={dropdownRef}
              style={{ textDecoration: "none", position: "relative", cursor: "pointer" }}
              onClick={() => toggleDropdown(item.id)}
            >
              {item.accessType.charAt(0).toUpperCase()}{item.accessType.substring(1).toLowerCase()}
              {drop && item.id === accessId && (
                <div className="absolute top-full left-0" style={{boxShadow:"0 2px 10px rgba(0, 0, 0, 0.1"}}>
                  <div className={styles.dropdown}>
                    <div className={styles.edit} onClick={() => changeAccess(item.accessId, "EDIT", item.accessType )}>Edit</div>
                    <div className={styles.read} onClick={() => changeAccess(item.accessId, "READ", item.accessType)}>Read</div>
                  </div>
                  <div onClick={() => changeAccess(item.accessId, "ADMIN")}>Admin</div>
                </div>
              )}
            </div>:
            <div className="text-sm text-[var(--primary-color)] font-medium" style={{ textDecoration: "none" }}>
            Super Admin
          </div>
            } */}
          </div>
        ))}
      </div>
      }
      </>
      
    </div>
  );
};

export default TrackerUser;