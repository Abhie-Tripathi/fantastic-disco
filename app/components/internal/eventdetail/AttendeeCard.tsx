'use client'
import React, { useState, useEffect } from 'react'
import styles from './attendeecard.style.module.css'
import Image from 'next/image'
import searchIcon from '/public/internal/SearchInput.svg'
import UserList from '../../../../public/data/employeeData.json'
import UserProfile from '../../userProfile/UserProfile'
import userImageIcon from '/public/person2.svg'
import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import { useTheme } from '@/context'

interface Props{
    cardType: string,
    userList?: any,
    shortlistedUsers?: string[],
    setShortlistedUsers?: React.Dispatch<React.SetStateAction<string[]>>,
}

interface User {
    id: string;
    name: string;
    designation: string;
    profilePicture: string;
    status: string;
    // initials: string;
    selected?: boolean;
}

const AttendeeCard = ({cardType, userList, shortlistedUsers, setShortlistedUsers} : Props) => {

    if(!userList){
        userList = UserList;
    }
    const [userData, setUserData] = useState<User[]>(userList);
    const [searchUser, setSearchUser] = useState<string>("");
    const [allSelected, setAllSelected] = useState<boolean>(false);
    const [selectedUserCount, setSelectedUserCount] = useState<number>(0);
    const {theme} = useTheme();
    const iconClass = theme === 'light' ? 'icons_light' : 'icon'

    const handleAllSelect = () => {
        const updatedUserData = userData.map(user => ({ ...user, status: (user.status=='PENDING')?'SHORTLISTED':'PENDING' }));
        setUserData(updatedUserData);
        setAllSelected(!allSelected);
    }

    const onUserSelect = (user: User) => {
        setUserData(prevUserData => {
            const userIndex = prevUserData.findIndex(item => item.id === user.id);
            
            if (userIndex !== -1) {
                const updatedUserData = [...prevUserData];
                updatedUserData[userIndex] = { ...updatedUserData[userIndex], status: (user.status=='PENDING')?'SHORTLISTED':'PENDING' };
                return updatedUserData;
            }
            
            return prevUserData;
        });
    }

    const updateSelectedUserCount = () => {
        const count = userData.filter(user => (user.status=='SHORTLISTED')).length;
        setSelectedUserCount(count);

        if(shortlistedUsers && setShortlistedUsers){
            const selectedUserIds = userData.filter(user => (user.status=='SHORTLISTED')).map(user => user.id);
            setShortlistedUsers(prev=>[...prev, ...selectedUserIds]);
            console.log('selectedUserIds', selectedUserIds);
        }
    };

    useEffect(() => {        
        updateSelectedUserCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    useEffect(() => {
        const filterUser = (item: any) => {
            let u_name = item.name.toLowerCase();
            return u_name.includes(searchUser.toLowerCase())
        }

        if (searchUser.trim() !== '') {
            const matches = userList.filter(filterUser);
            setUserData(matches);
        } else {
            setUserData(userList);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchUser]);

    return(
        <div className={styles.card_container} >
            <div className={styles.card_title} >
                <div className={styles.total_request}>
                    <CheckboxInput
                        id={'abc'}
                        onChange={handleAllSelect}
                        checked={allSelected}
                    />
                    {userList.length} {cardType} Requests
                </div>
                <span className={styles.selected_users}>{selectedUserCount} selected</span>
            </div>
            <div className={styles.search_container} >
                <input 
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className={styles.searchInput}
                    placeholder="Search @ user name"
                    type="text" >
                </input>
                <Image src={searchIcon} alt="search" className={iconClass} />
            </div>
            <div className={styles.users_list} >
                {userData.map(user => (
                    <div key={user.id} className={styles.userItem} >
                        <CheckboxInput
                            id={'abc'}
                            onChange={() => onUserSelect(user)}
                            checked={ 
                                (user.status == 'SHORTLISTED')? true : false
                            }
                        />
                        <span className={styles.imgContainer}>
                        {user.profilePicture? <Image src={user.profilePicture} alt="userProfile" width={45} height={45} style={{borderRadius:"50%"}} className='w-[45px] h-[45px]' />:
                         <UserProfile name={user.name} width={45} height={45} borderRadius="50%"/>
                        }
                       
                        </span>
                        <div className={styles.comment_name}>
                            <span>
                                {user.name}
                            </span>
                            <p className={styles.designationText}>{user?.designation}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AttendeeCard