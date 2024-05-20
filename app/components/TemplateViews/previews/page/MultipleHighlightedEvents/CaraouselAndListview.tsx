import React from 'react'
import CaraouselView from '../CarouselView/CaraouselView'
import ListView from '../MultipleEvents/ListView'
import styles from './style.module.css'

const CaraouselAndListview = () => {
  return (
    <div className={styles.body}>
        <CaraouselView/>
        <ListView/>
    </div>
  )
}

export default CaraouselAndListview