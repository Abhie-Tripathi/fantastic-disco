import React from 'react'
import CaraouselView from '../CarouselView/CaraouselView'
import ListView from '../MultipleEvents/ListView'
import styles from './style.module.css'
import GridView from '../MultipleEvents/GridView';
import ListAndGridView from '../MultipleEvents/ListAndGridView';

interface Props {
  type: string;
}

const CaraouselAndViews = ({ type }: Props) => {
  return (
    <div className={styles.body}>
      <CaraouselView />
      {type === "list" ? <ListView /> :
        type === "grid" ? <GridView /> : <ListAndGridView />}
    </div>
  )
}

export default CaraouselAndViews