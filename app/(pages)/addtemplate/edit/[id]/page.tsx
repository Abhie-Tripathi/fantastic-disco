'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import PreviewWindow from '@/app/components/TemplateViewsNew/TemplatesPreview/PreviewWindow'
import EditScreen from '@/app/components/TemplateViewsNew/EditScreen/EditScreen'

const Page = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // This page will have an Id, through which we will be fetching out all the Events, Customizations etc.
  // When the user will come here for the first time, all the feilds will be empty because there is nothing posted yet

  const [cardBgColor, setCardBgColor] = useState<string>("#ffffff");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(2);
  const [fontSettings, setFontSettings] = useState({
    heading: { fontFamily: "", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    body: { fontFamily: "", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" }
  });
  const [buttonSettings, setButtonSettings] = useState({
    primary : {buttonColor : "#0072F5", fontColor : "#000000", borderRadius : 4, borderColor : "#0072F5", buttonText : "Meet Us"},
    secondary : {buttonColor : "#6750a4", fontColor : "#000000", borderRadius : 4, borderColor : "#6750a4", buttonText : "Meet Us"}
  })

  return (

    <div className={styles.body}>
      <div className={styles.editContainer}>
        <EditScreen
          setCardBgColor={setCardBgColor}
          setCardBorderRadius={setCardBorderRadius}
          setFontSettings={setFontSettings}
          setButtonSettings = {setButtonSettings}
          buttonSettings = {buttonSettings}
          cardBgColor ={cardBgColor}
          cardBorderRadius = {cardBorderRadius}
        />
      </div>
      <div className={styles.previewContainer}>
        <PreviewWindow isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
      </div>
    </div>
  )
}

export default Page