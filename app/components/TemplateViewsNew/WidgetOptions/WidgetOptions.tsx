import React, { useEffect, useState } from 'react'
import styles from './widgetoptions.style.module.css'
import WidgetCard from './WidgetCard'

interface Props {
    setWidgetSelected: (value: string) => void
    widgetSelected: string;
    exploreWindow: boolean;
    widgetOptionsWindow: boolean;
    handleExplore : (value : void)=>void
}
type TextAlign = 'left' | 'right' | 'center' | 'justify' | 'initial' | 'inherit';

const WidgetOptions = ({ setWidgetSelected, widgetSelected, widgetOptionsWindow, exploreWindow,handleExplore }: Props) => {

    const [textAlign, setTextAlign] = useState<TextAlign>("center");
    const [headingSize, setHeadingSize] = useState<string>("40px")
    const [subHeadingSize, setSubHeadingSize] = useState<string>("16px")
    const [subHeadingMargin, setSubHeadingMargin] = useState<string>("24px")
    const [widgetCardMargin, setWidgetCardMargin] = useState<string>("20px")

    useEffect(() => {
        if (widgetOptionsWindow && exploreWindow) {
            setTextAlign("left")
            setHeadingSize("18px")
            setSubHeadingSize("12px")
            setSubHeadingMargin("5px")
            setWidgetCardMargin("26px")
        }
    }, [widgetOptionsWindow, exploreWindow])

   useEffect(()=>{
    handleExplore()
   },[widgetSelected])
    
    return (
        <div className={`${styles.body}`}>
            <div className={`${styles.headingContainer}`} style={{ textAlign }}>
                <div className={`${styles.heading}`} style={{ fontSize: headingSize }}>Select Your Widget Type</div>
                <div className={`${styles.subheading}`} style={{ fontSize: subHeadingSize, marginTop: subHeadingMargin }}>
                    Customize Your Website&apos;s Functionality with the widget that perfectly fits your style!
                </div>
            </div>
            <div className={`${styles.widgetOptions}`} style={{ marginTop: widgetCardMargin }}>
                <WidgetCard widgetType="Page" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} smallCard={exploreWindow && widgetOptionsWindow} />
                <WidgetCard widgetType="Section" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} smallCard={exploreWindow && widgetOptionsWindow} />
                <WidgetCard widgetType="Sticky" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} smallCard={exploreWindow && widgetOptionsWindow} />
                <WidgetCard widgetType="Pop" setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} smallCard={exploreWindow && widgetOptionsWindow} />
            </div>
        </div>
    )
}


export default WidgetOptions