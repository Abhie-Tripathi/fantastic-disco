import React from 'react'
import styles from './style.module.css'
import HeroBanner from '../MultipleEvents/HeroBanner';
import GridView from '../MultipleEvents/GridView';

const HeroBannerAndGrid = () => {
  return (
    <div className={styles.body}>
        <HeroBanner/>
        <GridView/>
    </div>
  )
}

export default HeroBannerAndGrid