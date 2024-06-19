'use client'
import React from 'react'
import Script from 'next/script'
import styles from './page.style.module.css'

const Page = () => {
    const list = ["name1","name2","name3", "name4","name5"]
    return (
        <div className={styles.list}>
            {/* {list.map((item,key)=>(
                <div className={styles.listItem} draggable>{item}</div>
            ))} */}
        </div>
    )
}

export default Page