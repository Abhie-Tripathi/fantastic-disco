import React from 'react'
import styles from './sketelon.style.module.css'
import Link from 'next/link';
import Image from 'next/image';
import Add from '/public/add.svg'

const SkeletonWidget = () => {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>Looks like you don't have any Widget set up yet.</div>
            <div className={styles.heading}>Let's Fix that</div>
            <Link className={styles.addBtn} href={"/widget/add"}>
                <div><Image src={Add} alt="add" /></div>
                <div>Add Widget</div>
            </Link>
        </div>
    );
}

export default SkeletonWidget