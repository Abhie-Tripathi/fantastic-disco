import React, { ElementType } from 'react'
import Popup1 from './Popup1'
import Popup2 from './Popup2'
import Popup3 from './Popup3'

interface Props {
    selectedCard?: string;
}
const PortraitPopup = ({selectedCard} : Props) => {
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

export default PortraitPopup