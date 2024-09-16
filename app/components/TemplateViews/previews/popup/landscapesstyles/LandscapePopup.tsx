import React, { ElementType } from 'react'
import Popup1 from './Popup1';
import Popup2 from './Popup2';
import Popup3 from './Popup3';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes';

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
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
    buttonSettings?: ButtonSettingsState,
    selectedBtn? : "primary" | "secondary"
    fetchedAddedOtherData? : PrefilledAddedEventsType[]
    smallCard : boolean;
}

const LandscapePopup = ({ selectedCard, cardBgColor, cardBorderRadius, fontSettings, buttonSettings,selectedBtn,fetchedAddedOtherData,smallCard }: Props) => {
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
    <EventCard smallCard={smallCard} fetchedAddedEvents={fetchedAddedOtherData} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} selectedBtn={selectedBtn}/>
  )
}

export default LandscapePopup