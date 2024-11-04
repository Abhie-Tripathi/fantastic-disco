import React from 'react'
import styles from './participation.style.module.css'
import AttendeeIcon from '/public/widgetimages/attendeeIcon.svg'
import SpeakerIcon from '/public/widgetimages/speakerIcon.svg'
import ExhibitorIcon from '/public/widgetimages/exhibitorIcon.svg'
import OrganiserIcon from '/public/widgetimages/organiserIcon.svg'
import HappyHoursIcon from '/public/widgetimages/Happyhours.png'
import FoundersIcon from '/public/widgetimages/foundersparty.png'
import CocktailHoursIcon from '/public/widgetimages/cocktailhours.png'
import Masquerade from '/public/widgetimages/masquarade.jpg'
import Summit from '/public/widgetimages/summit.jpg'
import Brunch from '/public/widgetimages/brunchDinner.png'
import MusicFestival from '/public/widgetimages/musicfestival.webp'
import Teaparty from '/public/widgetimages/teaparty.jpg';
import Carnival from '/public/widgetimages/carnival.jpg';
import BBQ from '/public/widgetimages/bbq.jpeg';
import Gameday from '/public/widgetimages/gameday.jpeg';
import MiniGolf from '/public/widgetimages/minigolf.jpeg';
import OpenMic from '/public/widgetimages/openMic.jpeg';
import Retro from '/public/widgetimages/retro.jpeg';
import Marathon from '/public/widgetimages/marathon.jpeg';
import Image from 'next/image'

interface Props {
    participationType?: string;
}

const ParticipationContainer = ({ participationType }: Props) => {

    const participationImage = participationType === "Attendee" ? AttendeeIcon : 
    participationType === "Speaker" ? SpeakerIcon : 
    participationType === "Exhibitor" ? ExhibitorIcon : 
    participationType === "Organiser" ? OrganiserIcon: 
    participationType === "HappyHours" ? HappyHoursIcon : 
    participationType === "CocktailHours" ? CocktailHoursIcon : 
    participationType === "FoundersParty" ? FoundersIcon :
    participationType === "Brunch/Lunch/Dinner" ? Brunch :
    participationType === "Music festival" ? MusicFestival :
    participationType === "Tea Party" ? Teaparty :
    participationType === "Masquerade" ? Masquerade :
    participationType === "Carnival" ? Carnival :
    participationType === "BBQ" ? BBQ :
    participationType === "Gameday" ? Gameday :
    participationType === "Mini-Golf" ? MiniGolf :
    participationType === "Open mic" ? OpenMic :
    participationType === "Retro" ? Retro :
    participationType === "Marathon" ? Marathon :
    participationType === "Summit" ? Summit :
    ""
    return (
        <div className={styles.body}>
            <Image src={participationImage} alt='icon' height={30} width={30} style={{borderRadius:"2px"}}/>
            <div className={styles.type}>{participationType === "Brunch/Lunch/Dinner"?"Bru../Lun../Din..": participationType }</div>
        </div>
    )
}

export default ParticipationContainer