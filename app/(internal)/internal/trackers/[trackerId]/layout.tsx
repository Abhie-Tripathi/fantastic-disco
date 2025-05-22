"use client"
import React,{Suspense, useEffect, useState} from "react";
import styles from "./layout.style.module.css";
import SideNav from '@/app/components/trackers/sideNav';
import Back from '/public/back.svg';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Loading from "@/app/components/UI/Loading";
import { useAuthContext } from "@/context";
import { useTrackerServices } from '@/services/trackerServices';
// import { useTheme } from "@/context/theme";
// import Image from "next/image";
// import MoreIcon from "/public/dots.svg";
// import Add from "/public/add.svg";
function Location({ fillColor }:{fillColor:string}) {
  return (
    <svg  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill={fillColor} /></svg>
  )
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  const {isVerifiedToken}=useAuthContext();
  const {getTrackerDetail, error}=useTrackerServices();
  const pathName = usePathname().split('/');
  const secondLast = pathName[pathName.length - 2];
  console.log(isVerifiedToken);
  const [data, setData] = useState<any>([]);
//   const fetchData=async()=>{
//     const result = await getTrackerDetail(secondLast)
//     if(result){
//       setData(result);
//     }
//     if(error){
//       console.error('Error fetching data:', error);
//     }
// }
// useEffect(()=>{
// fetchData();
// },[])
  return (
    <div className={`${styles.container}`} style={{position:"relative"}}>
      
        {/* <div className={styles.bar}>
            <div className={styles.leftNav}>
              <Link href='/internal/trackers'>
              <Image style={{display:"flex"}}src={Back} alt="back"/>
              </Link>
            Events in Bangalore
            </div>
            <div className={styles.rightNav}>
                <div className={styles.rightNavInner }>
                  <Location fillColor="#696B83"/>
                  Bengaluru, Karnataka, India (1.34 mi radius) 
                  </div>
            </div>
        </div> */}
        {/* {isVerifiedToken===false? <Loading/>: */}
        <div className={styles.containerBottom}>
        <div className={styles.containerLeft}>
          <SideNav/>
        </div>
        <div className={styles.containerRight}>
        <Suspense fallback={<Loading/>}>
        {children}
        </Suspense>
        </div>
      </div>
        {/* } */}
        
      
    </div>
  );
};

export default Layout;