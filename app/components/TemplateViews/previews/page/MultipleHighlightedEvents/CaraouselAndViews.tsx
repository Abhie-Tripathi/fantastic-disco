import React from 'react'
import CaraouselView from '../CarouselView/CaraouselView'
import ListView from '../MultipleEvents/ListView'
import styles from './style.module.css'
import GridView from '../MultipleEvents/GridView';
import ListAndGridView from '../MultipleEvents/ListAndGridView';

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontWeight: string;
}

interface Props {
  type: string;
  isFullScreen : boolean;
  cardBorderRadius?: number;
  cardBgColor?: string;
  selectedCard?: string;
  fontSettings?: {
      heading: FontSettings;
      subheading: FontSettings;
      body: FontSettings;
  };
}

const CaraouselAndViews = ({ type, selectedCard, isFullScreen,cardBgColor, cardBorderRadius, fontSettings }: Props) => {
  return (
    <div className={styles.body}>
    <CaraouselView selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}/> 
      {type === "list" ? <ListView selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}/> :
        type === "grid" ? <GridView selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}/> : <ListAndGridView />}
    </div>
  )
}

export default CaraouselAndViews