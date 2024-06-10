"use client"
import React,{useEffect, useState} from 'react'
import styles from './savedEvent.style.module.css'
import ExpandAll from "/public/expandAll.svg";
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/theme'
import { myFetch} from '@/utils/myFetch';
import { baseUrl } from '@/constants';
const Page = () => {
  const urlPath=usePathname().split('/');
  const lastParam=urlPath[urlPath.length-1];
  console.log(lastParam);
  
  const eventPerPage = [
    {
      "Event": "Music Concert",
      "Date": "02 Apr, 2024 - 05 Apr, 2024",
      "Venue": "Madison Square Garden",
      "City": "New York",
      "Country": "USA",
      "Category": "Music",
      "Rank": 1,
      "Growth": "10%",
      "Est. Audience": "1000-2000",
      "Organizer": "Live Nation"
    },
    {
      "Event": "Tech Conference",
      "Date": "02 May, 2024 - 08 May, 2024",
      "Venue": "Moscone Center",
      "City": "San Francisco",
      "Country": "USA",
      "Category": "Technology",
      "Rank": 2,
      "Growth": "20%",
      "Rept. Sentiment": "Neutral",
      "Organizer": "Tech World"
    },
    {
      "Event": "Art Exhibition",
      "Date": "22 May, 2024 - 28 May, 2024",
      "Venue": "Louvre Museum",
      "City": "Paris",
      "Country": "France",
      "Category": "Art",
      "Rank": 3,
      "Growth": "15%",
      "Rept. Sentiment": "Positive",
      "Organizer": "Louvre"
    },
    {
      "Event": "Food Festival",
      "Date": "12 May, 2024 - 18 May, 2024",
      "Venue": "Hyde Park",
      "City": "London",
      "Country": "UK",
      "Category": "Food",
      "Rank": 4,
      "Growth": "25%",
      "Rept. Sentiment": "Positive",
      "Organizer": "Foodies Unite"
    },
    {
      "Event": "Film Premiere",
      "Date": "02 May, 2024 - 08 May, 2024",
      "Venue": "Grauman's Chinese Theatre",
      "City": "Los Angeles",
      "Country": "USA",
      "Category": "Film",
      "Rank": 5,
      "Growth": "30%",
      "Rept. Sentiment": "Negative",
      "Organizer": "Hollywood Films"
    },
    {
      "Event": "Music Concert",
      "Date": "07 May, 2024 - 12 May, 2024",
      "Venue": "Madison Square Garden",
      "City": "New York",
      "Country": "USA",
      "Category": "Music",
      "Rank": 1,
      "Growth": "10%",
      "Rept. Sentiment": "Positive",
      "Organizer": "Live Nation"
    },
    {
      "Event": "Tech Conference",
      "Date": "02 Jan, 2024 - 08 Jan, 2024",
      "Venue": "Moscone Center",
      "City": "San Francisco",
      "Country": "USA",
      "Category": "Technology",
      "Rank": 2,
      "Growth": "20%",
      "Rept. Sentiment": "Neutral",
      "Organizer": "Tech World"
    },
    {
      "Event": "Art Exhibition",
      "Date": "12 Feb, 2024 - 18 Feb, 2024",
      "Venue": "Louvre Museum",
      "City": "Paris",
      "Country": "France",
      "Category": "Art",
      "Rank": 3,
      "Growth": "15%",
      "Rept. Sentiment": "Positive",
      "Organizer": "Louvre"
    },
    {
      "Event": "Food Festival",
      "Date": "02 May, 2024 - 08 May, 2024",
      "Venue": "Hyde Park",
      "City": "London",
      "Country": "UK",
      "Category": "Food",
      "Rank": 4,
      "Growth": "25%",
      "Rept. Sentiment": "Positive",
      "Organizer": "Foodies Unite"
    },
    {
      "Event": "Film Premiere",
      "Date": "07 May, 2024 - 12 May, 2024",
      "Venue": "Grauman's Chinese Theatre",
      "City": "Los Angeles",
      "Country": "USA",
      "Category": "Film",
      "Rank": 5,
      "Growth": "30%",
      "Rept. Sentiment": "Negative",
      "Organizer": "Hollywood Films"
    }
  ];
  
 
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const [currPage, setCurrPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const handlePageItems = (event:React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    setItemsPerPage(parseInt(event.target.value));
  }
  const [data,setData]=useState();
  const fetchData = async (secondLast:string) => {
    const { data, error } = await myFetch(`${baseUrl}/tracker/${secondLast}/events`);
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data);
      if(data?.events?.length>0){
        setData(data.events);
      }
      // setCatgeoryData(data);
    }
  };
  const fetchSavedData=async()=>{
    const { data, error } = await myFetch(`${baseUrl}/tracker/saved-events`);
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log(data);
      if(data?.savedEvents?.length>0){
        setData(data.savedEvents);
      }
      // setCatgeoryData(data);
    }
  }
  useEffect(()=>{
    if(lastParam==="trackedEvents"){
      const secondLast=urlPath[urlPath.length-2];
      fetchData(secondLast);
    }else {
      fetchSavedData();
    }
  },[])
  function formatDate(dateString:Date) {
    const date = new Date(dateString);
    
    // Get day
    const day = date.getDate();
    
    // Get month and convert it to short format
    const month = date.toLocaleString('default', { month: 'short' });
    
    // Get year
    const year = date.getFullYear();
    
    // Format the date
    const formattedDate = `${day} ${month}, ${year}`;
    
    return formattedDate;
}
 const saveEvent=async()=>{
  console.log(1);
  
  const url=`${baseUrl}/tracker/saved-events`
  const dataToSend={
    "eventGroupIds":["00016011-d26b-40ef-baf6-c5929bfb862c"]
}
   const {data,error}=await myFetch(url,{
      method:"POST",
      body: JSON.stringify(dataToSend),
          headers: {
            "Content-Type": "application/json",
          },
   })
   if(data)
   console.log(data);
  else console.log(error);
  
   
 }
 console.log(data);
 const [openCheck,setOpenCheck]=useState(false);
 const [isChecked,setChecked]=useState(false);
 const handleCheckboxChange=()=>{
  setChecked(!isChecked);
 }
  return (
    <>
    {/* {data && data?.map((item,ind)=>(
      
    ))} */}
    {lastParam==="savedEvents" &&
    <div className={styles.savedDiv}>
      <div className={styles.saved}>Saved Events</div>
      <div className={styles.deleteBtn} onClick={()=>setOpenCheck(!openCheck)}>Delete</div>
    </div>
    }
    <div></div>
    <div
      className={`${styles.table_wrapper} ${theme === "light" ? styles.table_wrapper_light : ""
        }`}
    >
      <table className={styles.table}>
        <thead
          className={`${styles.table_head} ${theme === "light" ? styles.table_head_light : ""
            }`}
        >
          <tr className={styles.table_head_row}>
            <th className={styles.table_firstColumn}>
              <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
              {/* {openCheck && 
              <div style={{display:"flex"}}><input
              type="checkbox"
              // checked={isChecked}
              // onChange={handleCheckboxChange}
            /></div>
              } */}
              
              Event
              </div>
            </th>
            <th>Date</th>
            <th>Venue</th>
            <th>Category</th>
            <th>Est. Audience</th>
            <th>Intl. Audience</th>
            {lastParam==="trackedEvents" && <th>Save</th>}
            {/* <th
              className={`${styles.table_actionColumn} ${styles.table_actionColumn_header
                } ${theme === "light" ? styles.table_actionColumn_light : ""}`}
            >
              Actions
            </th> */}
          </tr>
        </thead>

        <tbody className={styles.table_body}>
          {data && data?.map((event: any,ind:number) => (
            <tr key={ind}>
              <td>
                <div style={{display:"flex", gap:"5px", alignItems:"center"}}>
                {openCheck && 
              <div><input
              type="checkbox"
              style={{display:"flex"}}
              // checked={isChecked}
              // onClick={()=>setChecked(!isChecked)}
              // onChange={handleCheckboxChange}
            /></div>
              }
                {event?.title?.length > 80
                      ? event.title.slice(0, 80) + "..."
                      : event.title}
                  <div className={styles.event_organizer}>
                    {event.Organizer}
                  </div>
                </div>
              </td>
              <td>
                <div>{formatDate(event?.startingDateTime)} - {formatDate(event?.endingDateTime)}</div>
                {/* <div>{event.Date.substring(14,event.Date.length)}</div> */}
              </td>
              <td>
                {event?.venue?.city}
              </td>
              <td>Abc</td>
              <td>{event?.totalAttendance}</td>
              <td>{!event.internationalAttendance? <div>High</div> :event?.internationalAttendance}</td>
              {lastParam==="trackedEvents" && 
              <td>
                <button className={styles.saveBtn} onClick={()=>saveEvent()}>Save</button>
                </td>}
            </tr>
          ))}
        </tbody>
        
      </table>
    
    </div>

    <div
        className={`${styles.pagination_container} ${
          theme === "light" ? styles.pagination_container_light : ""
        }`}
      >
        <div
          className={`${styles.pagination_control_button} ${
            currPage === 1 ? styles.disabled : ""
          }`}
          onClick={() => setCurrPage((page) => page - 1)}
        >
          Previous
        </div>

        <div className={styles.pagination_info_container}>
          <div>Showing</div>
          {/* <Image src={ExpandAll} alt="expandall" className={iconClass} /> */}
          <div className={styles.pagination_current_pageno}>
            <select onChange={handlePageItems} name="" id="" className={styles.pagination_noOfPage}>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </div>
          <div>results/Page</div>
        </div>

        <div className={styles.pagination_page_control_container}>
          <div>Page</div>
          <div className={styles.pagination_current_page}>{currPage}</div>
          <div>of {totalPages}</div>
        </div>

        <div
          className={`${styles.pagination_control_button} ${
            currPage === totalPages ? styles.disabled : ""
          }`}
          onClick={() => setCurrPage((page) => page + 1)}
        >
          Next
        </div>
      </div>
    </>
  )
}

export default Page
