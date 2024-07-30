import React, { ElementType, useState } from 'react'
import styles from './listview.style.module.css'
import EventListCard1 from '../../listcardsstyles/EventListCard1';
import EventListCard2 from '../../listcardsstyles/EventListCard2';
import EventListCard3 from '../../listcardsstyles/EventListCard3';

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface EditProps {
    cardBorderRadius? : number;
    cardBgColor? : string;
    selectedCard?: string;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
}


const ListView = ({ cardBgColor, cardBorderRadius, fontSettings,selectedCard }: EditProps) => {
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
            <EventListCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}/>
            <EventListCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}/>
            <EventListCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings}/>
            
        </div>
    )
}

export default ListView