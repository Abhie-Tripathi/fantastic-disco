import React from 'react'
import styles from './style.module.css'
import HeroBanner from '../MultipleEvents/HeroBanner';
import ListView from '../MultipleEvents/ListView';

const HeroBannerAndList = () => {
    return (
        <div className={styles.body}>
            <HeroBanner/>
            <ListView/>
        </div>
    )
}

export default HeroBannerAndList