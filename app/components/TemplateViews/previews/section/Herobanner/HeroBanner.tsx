import React, { ElementType } from 'react'
import HeroBanner1 from './HeroBanner1';
import HeroBanner2 from './HeroBanner2';
import HeroBanner3 from './HeroBanner3';

interface Props {
    selectedCard?: string;
}

const HeroBanner = ({selectedCard}: Props) => {

    let EventCard: ElementType;

    switch (selectedCard) {
        case 'style1':
            EventCard = HeroBanner1;
            break;
        case 'style2':
            EventCard = HeroBanner2;
            break;
        default:
            EventCard = HeroBanner3; // Or some default component or message
    }

  return (
    <EventCard/>
  )
}

export default HeroBanner