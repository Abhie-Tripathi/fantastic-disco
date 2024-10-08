import React, { useState } from 'react'
import styles from './guestlist.style.module.css'
import FilterIcon from '/public/filter.svg'
import Image from 'next/image'
import useOutsideClick from '@/hooks/useOutsideClick'
import DownloadIcon from '/public/downloadIcon.svg'

const GuestList = () => {

  const [activeFilterBtn, setActiveFilterBtn] = useState<string>("All Guests")
  const [activeSortBtn, setActiveSortBtn] = useState<string>("Name")
  const [filterDropdown, setFilterdropdown] = useState<boolean>(false)
  const [sortDropdown, setSortDropdown] = useState<boolean>(false)
  const filterDropdownRef = useOutsideClick(() => setFilterdropdown(false))
  const sortDropdownRef = useOutsideClick(() => setSortDropdown(false))

  const guests = [{ name: "Walter White", email: "killguss@yahoo.com", status: "Going" }, { name: "Sheldon Cooper", email: "bazinga.buzz@gmail.com", status: "Waitlist" }, { name: "Joey Trib", email: "howyoudoin@gmail.com", status: "Not Going" }]

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div className={styles.heading}>Guest List</div>
        <div className={styles.downloadBtn}><Image src={DownloadIcon} alt='download'/></div>
      </div>

      <div className={styles.inputContainer}>
        <SearchIcon />
        <input type="text" className={styles.inputSearch} placeholder='Search Guests' />
      </div>
      <div className={styles.filterSortingContainer}>
        <div className={styles.filterBtnContainer}>
          <button className={styles.dropBtn} onClick={() => setFilterdropdown(!filterDropdown)}><Image src={FilterIcon} alt='filter' />{activeFilterBtn}</button>
          {filterDropdown && <div className={styles.dropdown} ref={filterDropdownRef}>
            <li onClick={() => setActiveFilterBtn("All Guests")}>{activeFilterBtn === "All Guests" && <TickIcon />}All Guests</li>
            <li onClick={() => setActiveFilterBtn("Going")}>{activeFilterBtn === "Going" && <TickIcon />}Going<span>2</span></li>
            <li onClick={() => setActiveFilterBtn("Invited")}>{activeFilterBtn === "Invited" && <TickIcon />}Invited <span>0</span></li>
            <li onClick={() => setActiveFilterBtn("Waitlist")}>{activeFilterBtn === "Waitlist" && <TickIcon />}Waitlist <span>1</span></li>
            <li onClick={() => setActiveFilterBtn("Not going")}>{activeFilterBtn === "Not going" && <TickIcon />}Not going <span>0</span></li>
          </div>}
        </div>
        <div className={styles.sortBtnContainer}>
          <button className={styles.dropBtn} onClick={() => setSortDropdown(!sortDropdown)}><Image src={FilterIcon} alt='filter' />{activeSortBtn}</button>
          {sortDropdown && <div className={styles.dropdown} ref={sortDropdownRef}>
            <li onClick={() => setActiveSortBtn("Name")}>{activeSortBtn === "Name" && <TickIcon />}Name</li>
            <li onClick={() => setActiveSortBtn("Email")}>{activeSortBtn === "Email" && <TickIcon />}Email</li>
            <li onClick={() => setActiveSortBtn("Register Time")}>{activeSortBtn === "Register Time" && <TickIcon />}Register Time</li>
          </div>}
        </div>
      </div>
      <div className={styles.guestListContainer}>
        {guests.map((guest, key) => (
          <div className={styles.guest} key={key}>
            <div className={styles.nameMailContainer}>
              <div className={styles.guestName}>{guest.name}</div>
              <div className={styles.guestEmail}>{guest.email}</div>
            </div>
            <div className={`${styles.guestStatus} ${guest.status === "Waitlist" ? styles.wait : guest.status === "Going" ? styles.going : styles.notgoing}`}>{guest.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuestList

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -960 960 960"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" fill="#666666" /></svg>
  )
}
function TickIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 -960 960 960" width="14"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="#0072F5" /></svg>
  )
}