"use client"
import React, { useEffect, useState } from 'react'
import styles from './navbar.style.module.css'
import logo from '/public/croppedlogo.png'
import settingsIcon from '/public/settings.svg'
import Image from 'next/image'
import Link from 'next/link'
interface UserDetail {
  firstname: string,
  email: string
}
const Navbar = () => {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  // useEffect(() => {
  //   const data = JSON.parse(localStorage.getItem("user") || 'null');
  //   if(data.length!==0 ){
  //   // const data = JSON.parse(localStorage.getItem("user") || 'null');
  //   console.log(data);
  //   setUserDetail(data.user);
  //   }
  // }, [])
  console.log(userDetail);
  return (
    <div className={styles.navbar}>
      <Image className={styles.logo} src={logo} width={45} height={53} alt='logo' />
      <div className={styles.settings}>
      <Link href={'/widget'}><Image src={settingsIcon} alt='settings'/></Link>
        {/* <div className='userDetails'>
          <div>{userDetail?.firstname}</div>
          <div>{userDetail?.email}</div>
        </div> */}
      </div>
    </div>
  )
}

export default Navbar