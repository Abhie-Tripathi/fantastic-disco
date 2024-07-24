import React, { useState } from 'react'
import styles from './location.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import LocationDropdown from './LocationDropdown'

const LocationContainer = () => {
    const [dropdown, setDropdown] = useState<boolean>(false)

    return (
        <div className={styles.body}>
            <div className={styles.locationContainer}>
                <LocationIcon />
                <div className={styles.eventLocation}>
                    <div className={styles.eventLocationOne}>Add Event Location</div>
                    <div className={styles.eventLocationTwo}>Offline location or Virtual Link</div>
                </div>
            </div>
            <Image className={styles.editIcon} src={EditIcon} alt='edit' onClick={()=>setDropdown(!dropdown)}/>
            {dropdown && <div className={styles.dropdown}><LocationDropdown/></div>}
        </div>
    )
}

export default LocationContainer

function LocationIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" fill="#7D7D7D" /></svg>
    )
}