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
  // Initializing state variables
  const [eventNameSize, setEventNameSize] = useState(16); // Default size is 16px
  const [eventButtonFontSize, setEventButtonFontSize] = useState(14); // Default size is 14px
  const [locationFontSize, setLocationFontSize] = useState(12); // Default size is 12px
  const [dateFontSize, setDateFontSize] = useState(10); // Default size is 10px


  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    setIsDropdownOpen(false)
  };
  const handleAccordian = (value: string) => {
    setAccordian(value)
  }

  return (
    <div className={styles.body}>
      <div className={styles.dropdownContainer}>
        <div style={{fontFamily : selectedFont}}>Your Font : </div>
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
        <div onClick={() => handleAccordian("event")} className={styles.heading}>Event Name</div>
        {accordian === "event" && <div className={styles.accordian}>
          <label>
            Font Size:
            <input
              type="range"
              min="0"
              max="50"
              value={eventNameSize}
              onChange={(e) => setEventNameSize(Number(e.target.value))}
            />
            <span>{eventNameSize}px</span>
          </label>
        </div>}
      </div>
      <div className={styles.accordianContainer}>
        <div onClick={() => handleAccordian("btn")} className={styles.heading}>Event Button</div>
        {accordian === "btn" && <div className={styles.accordian}> <label>
          Font Size:
          <input
            type="range"
            min="0"
            max="50"
            value={eventButtonFontSize}
            onChange={(e) => setEventButtonFontSize(Number(e.target.value))}
          />
          <span>{eventButtonFontSize}px</span>
        </label></div>}
      </div>
      <div className={styles.accordianContainer}>
        <div onClick={() => handleAccordian("date")} className={styles.heading}>Event Date</div>
        {accordian === "date" && <div className={styles.accordian}> <label>
          Font Size:
          <input
            type="range"
            min="0"
            max="50"
            value={dateFontSize}
            onChange={(e) => setDateFontSize(Number(e.target.value))}
          />
          <span>{dateFontSize}px</span>
        </label></div>}
      </div>
      <div className={styles.accordianContainer}>
        <div onClick={() => handleAccordian("location")} className={styles.heading}>Event Location</div>
        {accordian === "location" && <div className={styles.accordian}> <label>
          Font Size:
          <input
            type="range"
            min="0"
            max="50"
            value={locationFontSize}
            onChange={(e) => setLocationFontSize(Number(e.target.value))}
          />
          <span>{locationFontSize}px</span>
        </label></div>}
      </div>
    </div>
  )
}

export default FontsEdit