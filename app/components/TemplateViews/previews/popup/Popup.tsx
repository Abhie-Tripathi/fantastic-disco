import React, { ElementType } from 'react'
import styles from './popup.style.module.css'
import Image from 'next/image'
import Placeholder from '/public/placeholder.png'
import Popup1 from './Popup1'
import Popup2 from './Popup2'
import Popup3 from './Popup3'

interface Props {
    selectedCard?: string;
}

const Popup = ({selectedCard }: Props) => {
    let EventCard: ElementType;

    switch (selectedCard) {
        case 'card1':
            EventCard = Popup1;
            break;
        case 'card2':
            EventCard = Popup2;
            break;
        default:
            EventCard = Popup3; // Or some default component or message
    }
        return (
            <EventCard/>
        )
}

export default Popup
