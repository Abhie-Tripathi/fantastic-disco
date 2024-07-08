import React, { ElementType, useState } from 'react'
import styles from './listview.style.module.css'
import EventListCard1 from '../../listcardsstyles/EventListCard1';
import EventListCard2 from '../../listcardsstyles/EventListCard2';
import EventListCard3 from '../../listcardsstyles/EventListCard3';

interface EditProps {
    bgColor?: string;
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
    btnFontSize,
    selectedCard }: EditProps) => {
    let EventListCard: ElementType;

    switch (selectedCard) {
        case 'style1':
            EventListCard = EventListCard1;
            break;
        case 'style2':
            EventListCard = EventListCard2;
            break;
        default:
            EventListCard = EventListCard3; // Or some default component or message
    }
    return (
        <div className={styles.listView}>
            <EventListCard
                cardRadius={cardRadius}
                cardBgColor={cardBgColor}
                eventNameColor={eventNameColor}
                eventNameSize={eventNameSize}
                dateFontSize={dateFontSize}
                locationFontSize={locationFontSize}
                btnBgColor={btnBgColor}
                btnFontColor={btnFontColor}
                btnBorderWidth={btnBorderWidth}
                btnBorderColor={btnBorderColor}
                btnRadius={btnRadius}
                btnFontSize={btnFontSize}
            />
                  <EventListCard
                cardRadius={cardRadius}
                cardBgColor={cardBgColor}
                eventNameColor={eventNameColor}
                eventNameSize={eventNameSize}
                dateFontSize={dateFontSize}
                locationFontSize={locationFontSize}
                btnBgColor={btnBgColor}
                btnFontColor={btnFontColor}
                btnBorderWidth={btnBorderWidth}
                btnBorderColor={btnBorderColor}
                btnRadius={btnRadius}
                btnFontSize={btnFontSize}
            />
                  <EventListCard
                cardRadius={cardRadius}
                cardBgColor={cardBgColor}
                eventNameColor={eventNameColor}
                eventNameSize={eventNameSize}
                dateFontSize={dateFontSize}
                locationFontSize={locationFontSize}
                btnBgColor={btnBgColor}
                btnFontColor={btnFontColor}
                btnBorderWidth={btnBorderWidth}
                btnBorderColor={btnBorderColor}
                btnRadius={btnRadius}
                btnFontSize={btnFontSize}
            />
                  <EventListCard
                cardRadius={cardRadius}
                cardBgColor={cardBgColor}
                eventNameColor={eventNameColor}
                eventNameSize={eventNameSize}
                dateFontSize={dateFontSize}
                locationFontSize={locationFontSize}
                btnBgColor={btnBgColor}
                btnFontColor={btnFontColor}
                btnBorderWidth={btnBorderWidth}
                btnBorderColor={btnBorderColor}
                btnRadius={btnRadius}
                btnFontSize={btnFontSize}
            />
        </div>
    )
}

export default ListView