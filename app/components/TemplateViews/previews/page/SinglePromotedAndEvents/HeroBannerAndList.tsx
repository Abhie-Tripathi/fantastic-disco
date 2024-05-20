import React from 'react'
import styles from './herobannerlist.style.module.css'
import HeroBanner from '../MultipleEvents/HeroBanner';
import ListView from '../MultipleEvents/ListView';

const HeroBannerAndList = () => {
    return (
        <div className={styles.hero_listContainer}>
            <HeroBanner/>
            <ListView/>
        </div>
    )
}

export default HeroBannerAndList