'use client'
import React, { useCallback, useState } from 'react'
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

interface Props {
  handleChange: (field: keyof FormState, value: any) => void;
  formState: FormState
  // setParticipationType: (value: string) => void
  heading: string;
  // participationType: string;
  // setParticipationMessage: (value: string) => void
  // participationMessage: string
  size: string;
  theme?: string;
  type: string;
  // isEventParticipationEmpty: boolean
  // setIsEventParticipationEmpty: (value: boolean) => void
  // isParticipationMessageEmpty: boolean;
  // setIsParticipationMessageEmpty: (value: boolean) => void

}

const ParticipationContainer = ({
  // setParticipationType, participationType,
  size, theme, type, handleChange, formState,
  // setParticipationMessage, participationMessage,  isEventParticipationEmpty, setIsEventParticipationEmpty, isParticipationMessageEmpty, setIsParticipationMessageEmpty, 
  heading }: Props) => {
  const mainOptions = [
    { label: 'Attendee', value: 'Attendee', icon: AttendeeIcon },
    { label: 'Speaker', value: 'Speaker', icon: SpeakerIcon },
    { label: 'Exhibitor', value: 'Exhibitor', icon: ExhibitorIcon },
    { label: 'Organiser', value: 'Organiser', icon: OrganiserIcon },
  ];

  const sideOptions = [
    { label: 'Happy Hours', value: 'HappyHours', icon: HappyHoursIcon },
    { label: 'Cocktail Hours', value: 'CocktailHours', icon: CocktailHoursIcon },
    { label: 'Founders Party', value: 'FoundersParty', icon: FoundersIcon },
  ];
  const handleSelection = (type: string) => {
    handleChange('participationType', type)
    // setParticipationType(type);
    // setDropdown(true)
    handleChange('isEventParticipationEmpty', false)
    // setIsEventParticipationEmpty(false)

  }
  const handleCloseSelection = () => {
    // setDropdown(false)
    handleChange('participationType', "")
    // setParticipationType("")
  }
  const handleInputChange = (e: any) => {
    let value = e.target.value;

    const specialCharRegex = /[@#$%^&*"|<>]/g;

    if (specialCharRegex.test(value)) {
      showToast("error", "Please check, input should not contain any special character");
    } else {
      handleChange('participationMessage', value)
      // setParticipationMessage(value);
      handleChange('isParticipationMessageEmpty', false)
      // setIsParticipationMessageEmpty(false)
    }
  };
  const options = type === 'main' ? mainOptions : sideOptions;

  // Helper function to render selected option
  const renderSelectedOption = useCallback(() => {
    if (!formState.participationType) return null;
    const selectedOption = options.find(option => option.value === formState.participationType);
    if (!selectedOption) return null;

    return (
      <div className={styles.selectedOption}>
        <div className={styles.option}>
          <Image src={selectedOption.icon} alt={`${selectedOption.label} icon`} height={type === "main" ? 30 : 54} width={type === "main" ? 30 : 54} />
          <span>{selectedOption.label}</span>
        </div>
        <div className={styles.inputContainer}>
          <input
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

  return (
    <div className={`${styles.body} ${theme === "dark" ? styles.darkBody : ""}`}>
      {!formState.participationType ? (
        <>
          <div className={styles.header}>
            <Image src={type === "main" ? ParticipationIcon : ConfettiIcon} alt='svg' />
            <span>{heading}</span>
          </div>
          <div className={`${styles.options} ${formState.isEventParticipationEmpty ? styles.errorHighlight : ""}`}>
            {options.map((option) => (
              <div
                key={option.value}
                className={styles.option}
                onClick={() => handleSelection(option.value)}
              >
                <Image src={option.icon} alt={`${option.label} icon`} height={type === "main" ? 30 : 54} width={type === "main" ? 30 : 54} />
                <span>{option.label}</span>
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