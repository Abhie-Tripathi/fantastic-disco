import React from 'react'
import CaraouselView from '../CarouselView/CaraouselView'
import ListView from '../MultipleEvents/ListView'
import styles from './style.module.css'
import GridView from '../MultipleEvents/GridView';
import ListAndGridView from '../MultipleEvents/ListAndGridView';

interface Props {
  type: string;
  selectedCard?: string;
  isFullScreen : boolean;
}

const CaraouselAndViews = ({ type, selectedCard, isFullScreen }: Props) => {
  return (
    <div className={styles.body}>
      <CaraouselView selectedCard={selectedCard} isFullScreen={isFullScreen}/>
      {type === "list" ? <ListView selectedCard={selectedCard} /> :
        type === "grid" ? <GridView selectedCard={selectedCard}/> : <ListAndGridView />}
    </div>
  )
}

export default CaraouselAndViews