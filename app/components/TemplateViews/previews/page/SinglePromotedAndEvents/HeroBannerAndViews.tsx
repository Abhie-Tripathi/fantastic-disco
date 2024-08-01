import React from 'react'
import styles from './style.module.css'
import HeroBanner from '../../section/Herobanner/HeroBanner';
import ListView from '../MultipleEvents/ListView';
import GridView from '../MultipleEvents/GridView';
import ListAndGridView from '../MultipleEvents/ListAndGridView';

interface ButtonSettings {
    buttonColor: string;
    fontColor: string;
    borderRadius: number;
    borderColor: string;
    buttonText: string;
}
interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface EditProps {
    type: string;
    cardBorderRadius?: number;
    cardBgColor?: string;
    selectedCard?: string;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    buttonSettings?: {
        primary: ButtonSettings;
        secondary: ButtonSettings;
    };
}
const HeroBannerAndViews = ({ type, cardBgColor, cardBorderRadius, fontSettings, buttonSettings, selectedCard }: EditProps) => {
    return (
        <div className={styles.body}>
            <HeroBanner selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} />
            <div className={styles.bottomView}>
                {type === "list" ? <ListView selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                    type === "grid" ? <GridView selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                        <ListAndGridView />}</div>
        </div>
    )
}

export default HeroBannerAndViews