'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import PreviewWindow from '@/app/components/TemplateViewsNew/TemplatesPreview/PreviewWindow'
import EditScreen from '@/app/components/TemplateViewsNew/EditScreen/EditScreen'

const Page = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // This page will have an Id, through which we will be fetching out all the Events, Customizations etc.
  // When the user will come here for the first time, all the feilds will be empty because there is nothing posted yet

  // These states will be filled up with the fetched data, and if no data will be there, these will have default values
  const [cardBgColor, setCardBgColor] = useState<string>("#ffffff");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(20);
  const [fontSettings, setFontSettings] = useState({
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
  });
  const [buttonSettings, setButtonSettings] = useState({
    primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
    secondary: { buttonColor: "#6750a4", fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
  })

  const [cardStyle, setCardStyle] = useState<string>("style1")

  // Selected Template will be fetched through Database, Right now we can pass as static

  return (

    <div className={styles.body}>
      <div className={styles.editContainer}>
        <EditScreen
          cardStyle={cardStyle}
          setCardStyle={setCardStyle}
          setCardBgColor={setCardBgColor}
          setCardBorderRadius={setCardBorderRadius}
          setFontSettings={setFontSettings}
          fontSettings={fontSettings}
          setButtonSettings={setButtonSettings}
          buttonSettings={buttonSettings}
          cardBgColor={cardBgColor}
          cardBorderRadius={cardBorderRadius}
        />
      </div>
      <div className={styles.previewContainer}>
        <PreviewWindow
          selectedTemplate='GS'
          selectedCard={cardStyle}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          cardBgColor={cardBgColor}
          cardBorderRadius={cardBorderRadius}
          fontSettings={fontSettings}
          buttonSettings={buttonSettings}
        />
      </div>
    </div>
  )
}

export default Page