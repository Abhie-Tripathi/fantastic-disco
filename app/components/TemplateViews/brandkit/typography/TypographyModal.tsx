import React, { useEffect, useState } from 'react'
import styles from './typography.style.module.css'
import FontPreviewSelect from './FontPreviewSelect';
import HeadingSizeConfig from './HeadingSizeConfig';

const TypographyModal = () => {
  const [selectedFont, setSelectedFont] = useState<string>('Times New Roman');
  const [activeBtn, setActiveBtn] = useState<string>("fonttype")
  const [primaryFontSize, setPrimaryFontSize] = useState<string>("24px")
  const [secondaryFontSize, setSecondaryFontSize] = useState<string>("20px")
  const [descFontSize, setDescFontSize] = useState<string>("16px")

  return (
    <div className={styles.body}>
      <div className={styles.fontTypes}>
        <div className={styles.defaultFontContainer}>
          <div className={styles.fontTypesHeading}>Default Font</div>
          <div className={`${styles.selectedFont} ${activeBtn === "fonttype" ? styles.activeBtn : ""}`} onClick={() => (setActiveBtn("fonttype"))} style={{ fontFamily: selectedFont }}>
            {selectedFont}
          </div>
        </div>
        <div className={styles.variousFontContainer}>
          <div className={styles.fontTypesHeading}>
            Different Fonts
          </div>
          <div className={`${styles.fontsizeContainer} ${activeBtn === "Primary" ? styles.activeBtn : ""}`} onClick={() => (setActiveBtn("Primary"))}>
            <div className={styles.primaryHeading} style={{ fontFamily: selectedFont }}>Primary Heading</div>
            <div className={styles.fontSize}>Font size : {primaryFontSize}</div>
          </div>
          <div className={`${styles.fontsizeContainer} ${activeBtn === "Secondary" ? styles.activeBtn : ""}`} onClick={() => (setActiveBtn("Secondary"))}>
            <div className={styles.secondaryHeading} style={{ fontFamily: selectedFont }}>Secondary Heading</div>
            <div className={styles.fontSize}>Font size : {secondaryFontSize}</div>
          </div>
          <div className={`${styles.fontsizeContainer} ${activeBtn === "Description" ? styles.activeBtn : ""}`} onClick={() => (setActiveBtn("Description"))}>
            <div className={styles.desc} style={{ fontFamily: selectedFont }}>Description</div>
            <div className={styles.fontSize}>Font size : {descFontSize}</div>
          </div>
        </div>
      </div>
      <div className={styles.fontConfigContainer}>
        {activeBtn === "fonttype" ? <FontPreviewSelect setSelectedFont={setSelectedFont} /> : <HeadingSizeConfig selectedFont={selectedFont} type={activeBtn} setPrimaryFontSize = {setPrimaryFontSize} setSecondaryFontSize = {setSecondaryFontSize} setDescFontSize = {setDescFontSize} />}
      </div>
    </div>
  );
}

export default TypographyModal