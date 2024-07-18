import React, { ElementType } from 'react'
import Popup1 from './Popup1';
import Popup2 from './Popup2';
import Popup3 from './Popup3';

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface ButtonSettings {
    buttonColor: string;
    fontColor: string;
    borderRadius: number;
    borderColor: string;
    buttonText: string;
}
interface Props {
    selectedCard?: string;
    cardBgColor?: string;
    cardBorderRadius?: number;
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

const LandscapePopup = ({ selectedCard, cardBgColor, cardBorderRadius, fontSettings, buttonSettings }: Props) => {
    let EventCard: ElementType;

    switch (selectedCard) {
        case 'style1':
            EventCard = Popup1;
            break;
        case 'style2':
            EventCard = Popup2;
            break;
        default:
            EventCard = Popup3; // Or some default component or message
    }
  return (
    <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} />
  )
}

export default LandscapePopup