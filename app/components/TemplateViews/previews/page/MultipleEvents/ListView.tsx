import React from 'react'
import styles from './listview.style.module.css'
import EventListCard1 from '../../listcardsstyles/EventListCard1';
import EventListCard2 from '../../listcardsstyles/EventListCard2';
import EventListCard3 from '../../listcardsstyles/EventListCard3';

interface EditProps {
    bgColor? :string;
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
            <EventListCard2 cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} />
            <EventListCard1 cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}/>
            <EventListCard3 cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}/>
            <EventListCard1 cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}/>
        </div>
    )
}

export default ListView