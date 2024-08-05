import React, { ElementType } from 'react'
import HeroBanner1 from './HeroBanner1';
import HeroBanner2 from './HeroBanner2';
import HeroBanner3 from './HeroBanner3';
import { AddedEventsType } from '@/types/addedwidgetevents';

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
    selectedBtn? : "primary" | "secondary"
    fetchedAddedEvents?: AddedEventsType[]
}

const HeroBanner = ({ selectedCard, cardBgColor,cardBorderRadius,fontSettings,buttonSettings, selectedBtn,fetchedAddedEvents}: Props) => {

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