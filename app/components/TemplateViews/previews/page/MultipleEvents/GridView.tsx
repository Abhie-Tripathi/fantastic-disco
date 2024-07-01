import React from 'react'
import styles from './gridview.style.module.css'
import EventCard from '../../EventCard';
import EventCard2 from '../../EventCard2';

interface EditProps {
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
}

const GridView = ({ cardRadius,
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
    btnFontSize }: EditProps) => {
    return (
        <div className={styles.gridView}>
            <EventCard2 cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} />
            <EventCard2 cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} />
            <EventCard2 cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} />
            <EventCard2 cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} />
            <EventCard2 cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} />
        </div>
    )
}

export default GridView