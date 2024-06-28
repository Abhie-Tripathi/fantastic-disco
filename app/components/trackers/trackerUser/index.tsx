import React, { useState } from 'react';
import styles from './trackerUser.style.module.css';
import Image from 'next/image';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { usePathname } from 'next/navigation';
import Router from "next/router";
type User = {
  id: string;
  name: string;
  email: string;
  accessLevel: string;
  accessId: string;
};

type TrackerUserProps = {
  setSendInvite: (value: boolean) => void;
  userData: User[];
};

const TrackerUser: React.FC<TrackerUserProps> = ({ setSendInvite, userData }) => {
  const path = usePathname().split('/');
  const [accessId, setAccessId] = useState<string | null>(null);

  const userHandle = (name: string): string => {
    const last = name.substring(1).split(' ').map(item => item.toLowerCase()).join('');
    return `@${name.charAt(0)}${last}`;
  };

  const abbreviation = (name: string): string => {
    return name?.split(' ').map(word => word[0]?.toUpperCase()).join('') || '';
  };

  const changeAccess = async (accessEntry: string, access: string) => {
    const url = `${baseUrl}/access/${accessEntry}`;
    const formData = {
      entityId: accessId,
      accessLevel: access,
    };

    try {
      const { data, error } = await myFetch(url, {
        method: 'PATCH',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Data fetched:', data);
        window.location.reload();
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  const toggleDropdown = (id: string) => {
    setAccessId(accessId === id ? null : id);
  };

  const deleteEntry = async (id: string, accessEntry: string) => {
    const url = `${baseUrl}/access/${accessEntry}`;
    const formData = {
      entityId: id,
      published: false,
    };

    try {
      const { data, error } = await myFetch(url, {
        method: 'PATCH',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        console.log('Data fetched:', data);
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerFirst}>
        <div className={styles.owner}>Tracker Users</div>
        <div className={styles.add} onClick={() => setSendInvite(true)}>Add Users</div>
      </div>
      <div className={styles.bar}></div>
      <div className={styles.profiles}>
        {userData && userData.map((item, index) => (
          <div key={index} className={styles.profile}>
            <div className={styles.profileInner}>
              <div className={styles.square} onClick={() => deleteEntry(item.id, item.accessId)}>-</div>
              <div className={styles.profileCircle}>{abbreviation(item.name)}</div>
              <div>
                <div className={styles.name}>{item.name}{" "}<span className={styles.tag}>{userHandle(item.name)}</span></div>
                <div className={styles.email}>{item?.email}</div>
              </div>
            </div>
            <div
              className={styles.add}
              style={{ textDecoration: "none", position: "relative", cursor: "pointer" }}
              onClick={() => toggleDropdown(item.id)}
            >
              {item.accessLevel.charAt(0).toUpperCase()}{item.accessLevel.substring(1).toLowerCase()}
              {item.id === accessId && (
                <div className={styles.dropdown}>
                  <div onClick={() => changeAccess(item.accessId, "EDIT")}>Edit</div>
                  <div onClick={() => changeAccess(item.accessId, "READ")}>Read</div>
                  {/* <div onClick={() => changeAccess(item.accessId, "ADMIN")}>Admin</div> */}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackerUser;
