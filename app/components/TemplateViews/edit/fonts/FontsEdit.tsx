import React, { useState } from 'react'
import styles from './fontsedit.style.module.css'
import Image from 'next/image';
import DropdownIcon from '/public/dropDown.svg'

const FontsEdit = () => {
  const fontOptions = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Geneva',
    'Trebuchet MS',
    'Arial Black',
    'Impact'
  ];
  const [selectedFont, setSelectedFont] = useState<string>('Times New Roman');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [accordian, setAccordian] = useState<string>("")


  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    setIsDropdownOpen(false)
  };
  const handleAccordian = (value: string)=> {
    setAccordian(value)
  }

  return (
    <div className={styles.body}>
      <div className={styles.dropdownContainer}>
        <div className={styles.dropdownHeadingContainer} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div>Select Font</div>
          <Image src={DropdownIcon} alt='down' />
        </div>
        {isDropdownOpen && <div className={styles.fontsDropDown}>
          {fontOptions.map((font, key) => (
            <div key={key} className={styles.dropdownItem} style={{ fontFamily: font }} onClick={() => handleFontChange(font)}>
              {font}
            </div>
          ))}
        </div>}
      </div>
      <div className={styles.accordianContainer}>
        <div onClick={() => handleAccordian("event")}>Event Name</div>
        {accordian === "event" && <div className={styles.accordian}>abjhds</div>}
      </div>
      <div className={styles.accordianContainer}>
        <div onClick={() => handleAccordian("btn")}>Event Button</div>
        {accordian === "btn" && <div className={styles.accordian}>abjhds</div>}
      </div>  
      <div className={styles.accordianContainer}>
        <div onClick={() => handleAccordian("date")}>Event Date</div>
        {accordian === "date" && <div className={styles.accordian}>abjhds</div>}
      </div>
      <div className={styles.accordianContainer}>
        <div onClick={() => handleAccordian("locationy")}>Event Location</div>
        {accordian === "location" && <div className={styles.accordian}>abjhds</div>}
      </div>
    </div>
  )
}

export default FontsEdit