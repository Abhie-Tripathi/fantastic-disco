import React, { useState } from 'react'
import styles from './typography.style.module.css'

const TypographyModal = () => {
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
  const [selectedFont, setSelectedFont] = useState('Times New Roman');
  // Function to handle font selection change
  const handleFontChange = (event: any) => {
    setSelectedFont(event.target.value);
  };
  return (
    <div className={styles.body}>
      <div className={styles.fontTypes}>
        <div className={styles.selectedFont} style={{ fontFamily: selectedFont }}>
          {selectedFont}
        </div>
      </div>
      <div className={styles.fontConfig}>
        <div className={styles.fontPreview} style={{ fontFamily: selectedFont }}>
          <div className={styles.fontBody}>Your Font Style</div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        <div className={styles.fontsDropDown}>
          {/* Dropdown to select font */}
          <select value={selectedFont} onChange={handleFontChange}>
            {fontOptions.map((font, index) => (
              <option key={index} value={font}>{font}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default TypographyModal