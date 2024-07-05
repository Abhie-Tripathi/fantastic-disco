'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import ResourceCard from '@/app/components/resources/ResourceCard'
import DicussModal from '@/app/components/resources/DicussModal'

const page = () => {

    const promote = ["Wear Company T-Shirt", "Host an after party", "Give ads on Uber", "Mention logo and event Mails", "Give out Merchs"]

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    return (
        <div className={styles.body}>
            <div className={styles.heading}>Ways to Promote Events</div>
            <div className={styles.cards}>
                {promote.map((desc,key)=>(
                    <ResourceCard description={desc} key={key} setIsModalOpen={setIsModalOpen}/>
                ))}
            </div>
            {isModalOpen && 
            <div className={styles.modal}>
                <DicussModal setIsModalOpen={setIsModalOpen}/>
            </div>}
            
        </div>
    )
}

export default page