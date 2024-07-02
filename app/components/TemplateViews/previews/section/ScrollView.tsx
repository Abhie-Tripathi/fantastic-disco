import React, { ElementType } from 'react'
import styles from './scrollview.style.module.css'
import EventCard1 from '../cardstyles/EventCard1';
import EventCard2 from '../cardstyles/EventCard2';
import EventCard3 from '../cardstyles/EventCard3';

interface Props{
    type : string;
    selectedCard? : string;
}

const ScrollView = ({type, selectedCard}: Props) => {
    let EventCard: ElementType;

    switch (selectedCard) {
        case 'card1':
            EventCard = EventCard1;
            break;
        case 'card2':
            EventCard = EventCard2;
            break;
        default:
            EventCard = EventCard3; // Or some default component or message
    }
    return (
       <div className={type === "top" ? styles.horizontalScroll : styles.verticalScroll}>
           <EventCard />
           <EventCard />
           <EventCard />
           <EventCard />   
           <EventCard />   
       </div>
    )
}

export default ScrollView