import React from 'react'
import styles from './listview.style.module.css'
import EventListCard from '../../EventListCard';

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


const ListView = ({ cardRadius,
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
        <div className={styles.listView}>
            <EventListCard cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} />
            <EventListCard cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}/>
            <EventListCard cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}/>
            <EventListCard cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}/>
        </div>
    )
}

export default ListView