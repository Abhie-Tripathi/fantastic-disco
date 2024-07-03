import React from 'react'
import styles from './style.module.css'
import HeroBanner from '../../section/Herobanner/HeroBanner';
import ListView from '../MultipleEvents/ListView';
import GridView from '../MultipleEvents/GridView';
import ListAndGridView from '../MultipleEvents/ListAndGridView';

interface EditProps {
    type: string;
    cardRadius?: number;
    cardBgColor?: string;
    eventNameColor?: string;
    eventNameSize?: number;
    dateFontSize?: number;
    locationFontSize?: number;
    btnBgColor?: string;
    btnFontColor?: string;
    btnBorderWidth?: number;
    btnBorderColor?: string;
    btnRadius?: number;
    btnFontSize?: number;
    selectedCard?: string;
}
const HeroBannerAndViews = ({ cardRadius,
    cardBgColor,
    eventNameColor,
    eventNameSize,
    dateFontSize,
    locationFontSize,
    btnBgColor,
    btnFontColor,
    btnBorderWidth,
    btnBorderColor,
    btnRadius,
    btnFontSize,
    type,
    selectedCard }: EditProps) => {
    return (
        <div className={styles.body}>
            <HeroBanner selectedCard={selectedCard} />
            <div className={styles.bottomView}>
                {type === "list" ? <ListView selectedCard={selectedCard} cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                    type === "grid" ? <GridView selectedCard={selectedCard} cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                        <ListAndGridView />}</div>
        </div>
    )
}

export default HeroBannerAndViews