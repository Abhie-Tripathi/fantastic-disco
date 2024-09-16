import React, { ElementType } from 'react'
import HeroBanner1 from './HeroBanner1';
import HeroBanner2 from './HeroBanner2';
import HeroBanner3 from './HeroBanner3';
import { ButtonSettingsState } from '@/types/buttoncustomizetypes';
import { PrefilledAddedEventsType } from '@/types/prefilledaddedeventtype';

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
    buttonSettings?: ButtonSettingsState
    selectedBtn? : "primary" | "secondary"
    fetchedAddedOtherData?: PrefilledAddedEventsType[]
}

const HeroBanner = ({ selectedCard, cardBgColor,cardBorderRadius,fontSettings,buttonSettings, selectedBtn,fetchedAddedOtherData}: Props) => {

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
        <EventCard cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings}/>
    )
}

export default HeroBanner