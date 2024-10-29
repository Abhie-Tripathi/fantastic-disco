'use client'
import React, { useCallback, useEffect, useState,useRef } from 'react'
import styles from './participation.style.module.css'
import EditIcon from '/public/EditIcon.svg'
import Image from 'next/image'
import ParticipationIcon from '/public/ParticipationIcon.svg'
import ConfettiIcon from '/public/confetti.svg'
import AttendeeIcon from '/public/widgetimages/attendeeIcon.svg'
import SpeakerIcon from '/public/widgetimages/speakerIcon.svg'
import ExhibitorIcon from '/public/widgetimages/exhibitorIcon.svg'
import OrganiserIcon from '/public/widgetimages/organiserIcon.svg'
import { showToast } from "@/utils/showToast";
import HappyHoursIcon from '/public/widgetimages/Happyhours.png'
import FoundersIcon from '/public/widgetimages/foundersparty.png'
import CocktailHoursIcon from '/public/widgetimages/cocktailhours.png'
import { FormState } from '@/types/Formstate'
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

interface Props {
  handleChange: (field: keyof FormState, value: any) => void;
  formState: FormState
  formTheme: string;
  heading: string;
  size: string;
  theme?: string;
  type: string;
}

const ParticipationContainer = ({ size, theme, type, handleChange, formState, formTheme, heading }: Props) => {
  const mainOptions = [
    { label: 'Attendee', value: 'Attendee', icon: AttendeeIcon },
    { label: 'Speaker', value: 'Speaker', icon: SpeakerIcon },
    { label: 'Exhibitor', value: 'Exhibitor', icon: ExhibitorIcon },
    { label: 'Organiser', value: 'Organiser', icon: OrganiserIcon },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const optionsRef = useRef<HTMLDivElement>(null);

  const optionsData = [
    { type: "HappyHours", icon: HappyHoursIcon, label: "Happy Hours" },
    { type: "FoundersParty", icon: FoundersIcon, label: "Founders Party" },
    { type: "CocktailHours", icon: CocktailHoursIcon, label: "Cocktail Hours" },
    { type: "Summit", icon: Summit, label: "Summit" },
    { type: "Brunch/Lunch/Dinner", icon: Brunch, label: "Brunch/Lunch/Dinner" },
    
    { type: "Music festival", icon: MusicFestival, label: "Music festival" },
    { type: "Tea Party", icon: Teaparty, label: "Tea Party" },
    { type: "Masquerade", icon: Masquerade, label: "Masquerade" },
    { type: "Carnival", icon: Carnival, label: "Carnival" },
    { type: "BBQ", icon: BBQ, label: "BBQ" },
    { type: "Gameday", icon: Gameday, label: "Gameday" },
    { type: "Mini-Golf", icon: MiniGolf, label: "Mini-Golf" },
    { type: "Open mic", icon: OpenMic, label: "Open mic" },
    { type: "Retro", icon: Retro, label: "Retro" },
    { type: "Marathon", icon: Marathon, label: "Retro" }
    // { type: "Others", icon: CocktailHoursIcon, label: "Others" },
  ];
  // const sideOptions = [
  //   { label: 'Happy Hours', value: 'HappyHours', icon: HappyHoursIcon },
  //   { label: 'Cocktail Hours', value: 'CocktailHours', icon: CocktailHoursIcon },
  //   { label: 'Founders Party', value: 'FoundersParty', icon: FoundersIcon },
  // ];
  const handleSelection = (type: string) => {
    handleChange('participationType', type)
    handleChange('isEventParticipationEmpty', false)
  }
  const handleCloseSelection = () => {
    handleChange('participationType', "")
  }
  const handleInputChange = (e: any) => {
    let value = e.target.value;

    const specialCharRegex = /[@#$%^&*"|<>]/g;

    if (specialCharRegex.test(value)) {
      showToast("error", "Please check, input should not contain any special character");
    } else {
      handleChange('participationMessage', value)
      handleChange('isParticipationMessageEmpty', false)
    }
  };
  // const options = type === 'main' ? mainOptions : sideOptions;
  const options = mainOptions
  // Helper function to render selected option
  const renderSelectedOption = useCallback(() => {
    // if (!formState.participationType) return null;
    if (!formState.participationType || type === 'side') return null;
    const selectedOption = options.find(option => option.value === formState.participationType);
    if (!selectedOption) return null;

    return (
      <div className={styles.selectedOption}>
        <div className={styles.option}>
          <Image src={selectedOption.icon} alt={`${selectedOption.label} icon`} height={type === "main" ? 30 : 54} width={type === "main" ? 30 : 54} />
          <span className={formTheme === "dark" ? styles.darkLabel : styles.lightLabel}>{selectedOption.label}</span>
        </div>
        <div className={styles.inputContainer}>
          <input
            className={formTheme === "dark" ? styles.darkInput : ""}
            type="text"
            placeholder='Add your message here!'
            onChange={handleInputChange}
            value={formState.participationMessage}
          />
          <span onClick={handleCloseSelection}>x</span>
        </div>
        {formState.isParticipationMessageEmpty && <p className={styles.errorMessage}>Please add your message!</p>}
      </div>
    );
  }, [formState.participationType, options, formState.participationMessage, formState.isParticipationMessageEmpty]);
 
  

  const scrollBy = 200; // Amount to scroll on each click

  const handleNext = () => {
    if (optionsRef.current) {
      optionsRef.current.scrollLeft += scrollBy;
      setCurrentIndex((prev) => Math.min(prev + 1, optionsData.length - 1));
    }
  };

  const handlePrev = () => {
    if (optionsRef.current) {
      optionsRef.current.scrollLeft -= scrollBy;
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  
  return (
    <div className={`${styles.body} ${theme === "dark" ? styles.darkBody : ""}`}>
      {type === "side" ?
        // <div className={styles.options}>
        //   <div className={`${styles.option} ${formState.participationType === "HappyHours" ? styles.activeOption : ""}`} onClick={() => handleSelection("HappyHours")}
        //   >
        //     <Image src={HappyHoursIcon} alt={`icon`} height={54} width={54} />
        //     <span className={formTheme === "dark" ? styles.darkLabel : styles.lightLabel}>Happy Hours</span>
        //   </div>
        //   <div className={`${styles.option} ${formState.participationType === "FoundersParty" ? styles.activeOption : ""}`} onClick={() => handleSelection("FoundersParty")}
        //   >
        //     <Image src={FoundersIcon} alt={`icon`} height={54} width={54} />
        //     <span className={formTheme === "dark" ? styles.darkLabel : styles.lightLabel}>Founders Party</span>
        //   </div>
        //   <div className={`${styles.option} ${formState.participationType === "CocktailHours" ? styles.activeOption : ""}`} onClick={() => handleSelection("CocktailHours")}
        //   >
        //     <Image src={CocktailHoursIcon} alt={`icon`} height={54} width={54} />
        //     <span className={formTheme === "dark" ? styles.darkLabel : styles.lightLabel}>Cocktail Hours</span>
        //   </div>
        // </div> 


        <div className={styles.carouselContainer}>
        <button onClick={handlePrev} className={styles.arrowButton}><LeftArrow/></button>
        
        <div ref={optionsRef} className={styles.options}>
          {optionsData.map((option) => (
            <div key={option.type} className={`${styles.option} ${formState.participationType === option.type ? styles.activeOption : ""}`} onClick={() => handleChange("participationType", option.type)}>
              <Image src={option.icon} alt={`${option.label} icon`} height={54} width={54} style={{borderRadius:"4px"}}/>
              <span className={formTheme === "dark" ? styles.darkLabel : styles.lightLabel}>{option.label}</span>
            </div>
          ))}
        </div>
        
        <button onClick={handleNext} className={styles.arrowButton}><RightArrow/></button>
      </div>
        :
        formState.event_type !== "" && !formState.participationType ? (
          <>
            <div className={styles.header}>
              <Image src={type === "main" ? ParticipationIcon : ConfettiIcon} alt='svg' />
              <span className={formTheme === "dark" ? styles.darkHeading : styles.lightHeading}>{heading}</span>
            </div>
            <div className={`${styles.options} ${formState.isEventParticipationEmpty ? styles.errorHighlight : ""}`}>
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.option}`}
                  onClick={() => handleSelection(option.value)}
                >
                  <Image src={option.icon} alt={`${option.label} icon`} height={type === "main" ? 30 : 54} width={type === "main" ? 30 : 54} />
                  <span className={formTheme === "dark" ? styles.darkLabel : styles.lightLabel}>{option.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          renderSelectedOption()
        )}
    </div>
  );
};

export default ParticipationContainer;

function LeftArrow(){
  return (
    <svg width="10px" height="10px" viewBox="0 0 1024 1024" className="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" fill="#000000" /></svg>
  )
}

function RightArrow(){
  return (
    <svg width="10px" height="10px" viewBox="0 0 1024 1024" className="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" fill="#000000" /></svg>
  )
}