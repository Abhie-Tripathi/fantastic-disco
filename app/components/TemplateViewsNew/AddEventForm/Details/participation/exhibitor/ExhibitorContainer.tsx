import React, { useState } from 'react'
import styles from './exhibitor.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import ExhibitorIcon from '/public/exhibitoricon.svg'

const ExhibitorContainer = () => {

    const [boothNumber, setBoothNumber] = useState<string>("")
    const [dropdown, setDropdown] = useState<boolean>(false)

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                {!boothNumber ? <div className={styles.header}>
                    <Image src={ExhibitorIcon} alt='icon' />
                    <span>Add Booth / Stall details</span>
                </div> : 
                <div className={styles.boothContainer}>
                    <div>Booth Number</div>
                    <div>{boothNumber}</div>
                </div>}
                <Image src={EditIcon} className={styles.editBtn} alt='edit' onClick={()=>setDropdown(!dropdown)}/>
            </div>
            {dropdown && 
            <div className={styles.dropdown}>
                <input placeholder='Stall/booth number' onChange={(e)=>setBoothNumber(e.target.value)} maxLength={40}/>
            </div>}
        </div>
    )
}

export default ExhibitorContainer