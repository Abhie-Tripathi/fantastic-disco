"use client"
import React, { useEffect, useState } from 'react';
import styles from './navbar.style.module.css';
import logo from '/public/croppedlogo.png';
import settingsIcon from '/public/settings.svg';
import Image from 'next/image';
import Link from 'next/link';
import DropDown from '@/app/components/employee/listView/DropdownRef'
import { useAuthContext } from "@/context";
interface UserDetail {

  firstname: string;
  email: string;
  lastname: string;


}

const Navbar = () => {
  const { user, signOut } = useAuthContext();
  const profilectas = DropDown();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(user ? user : null);


  useEffect(() => {
    setUserDetail(user);
  }, [user]);
  console.log("User object:", userDetail);
  console.log("User firstname:", userDetail?.firstname);
  const toggleDropdown = () => {
    profilectas.setIsOpen(!profilectas.isOpen);
  }
  return (
    <div className={styles.navbar}>
      <Link href='/'><Image className={styles.logo} src={logo} width={45} height={53} alt='logo' /></Link>
      <div className={styles.settings}>
        <Link className={styles.circle} style={{ marginRight: "10px" }} href={'/widget'}>
          <Image src={settingsIcon} alt='settings' />
        </Link>
        {userDetail &&
          <div style={{ display: "flex", gap: "8px", cursor: "pointer", position: "relative" }} ref={profilectas.dropdownRef} onClick={toggleDropdown}>
            <div className={styles.circle}>{userDetail?.firstname.charAt(0)}{userDetail?.lastname.charAt(0)}</div>
            <div className={styles.userDetails}>
              <div>
                <div>{userDetail?.firstname} {userDetail?.lastname}</div>
                <div style={{ fontSize: "12px" }}>{userDetail?.email}</div>
              </div>


            </div>
            {profilectas.isOpen &&
              <div className={styles.userDropdown}>
                <div className={styles.btns}>Profile</div>
                <div className={styles.btns} onClick={signOut}>Log Out</div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
};

export default Navbar;