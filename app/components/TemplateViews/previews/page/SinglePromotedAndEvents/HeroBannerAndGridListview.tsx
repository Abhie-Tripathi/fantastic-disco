import React from 'react'
import styles from './style.module.css'
import HeroBanner from '../MultipleEvents/HeroBanner'
import ListAndGridView from '../MultipleEvents/ListAndGridView'

const HeroBannerAndGridListview = () => {
  return (
    <div className={styles.body}>
        <HeroBanner/>
        <ListAndGridView/>
    </div>
  )
}

export default HeroBannerAndGridListview