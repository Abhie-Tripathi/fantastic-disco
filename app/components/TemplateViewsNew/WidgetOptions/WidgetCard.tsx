import React, { useEffect, useState } from 'react'
import styles from './widgetcard.style.module.css'
import PageWidgetImage from '/public/widgetimages/pageimages/PageWidgetImage.svg'
import SectionWidgetImage from '/public/widgetimages/sectionimages/SectionWidgetImage.svg'
import StickyWidgetImage from '/public/widgetimages/stickyimages/StickyWidgetImage.svg'
import PopupWidgetImage from '/public/widgetimages/popupimages/PopupWidgetImage.svg'
import Image from 'next/image'
import TickIcon from '/public/tick.svg'

interface WidgetCardProps {
    widgetType: 'Page' | 'Section' | 'Sticky' | 'Popup';
    setWidgetSelected : (value : string) => void;
    widgetSelected: string;
    smallCard : boolean;
}

interface WidgetConfig {
    name: string;
    length: number;
    desc: string;
    color : string;
}

const widgetConfig: Record<WidgetCardProps['widgetType'], WidgetConfig> = {
    Page: {
        name: "Page Widget",
        length: 9,
        desc: "An intuitive, interactive widget that lets users effortlessly select options from a comprehensive list",
        color : "#FFEFEF"
    },
    Section: {
        name: "Section Widget",
        length: 6,
        desc: "Widget allows users to seamlessly navigate and select options within a specific section of your website",
        color : "#FFF7E3"
    },
    Sticky: {
        name: "Sticky Widget",
        length: 2,
        desc: "A user-friendly widget type that promotes events by enhancing navigation & accessibility on your website",
        color : "#E5FAEA"
    },
    Popup: {
        name: "Pop-up Widget",
        length: 1,
        desc: "Interactive widget designed to capture attention and deliver important messages related to events on your website",
        color : "#E0ECFF"
    },
};
const WidgetCard = ({ widgetType, setWidgetSelected , widgetSelected, smallCard}: WidgetCardProps) => {
    const [widgetName, setWidgetName] = useState("");
    const [templateLength, setTemplateLength] = useState(0);
    const [widgetDesc, setWidgetDesc] = useState("");
    const [bgColor, setBgColor] = useState("");
    const [cardHeight, setCardHeight] = useState("300px")
    const [imageHolderHeight, setImageHolderHeight] = useState("160px")
    const [imageHeight, setImageHeight] = useState(161)
    const [imageWidth, setImageWidth] = useState(178)

    useEffect(()=>{
        if(smallCard){
            // setCardHeight("293px")
            setImageHolderHeight("108px")
            setImageHeight(108)
            setImageWidth(112)
        }
    },[smallCard])

    useEffect(() => {
        const config = widgetConfig[widgetType];
        if (config) {
            setWidgetName(config.name);
            setTemplateLength(config.length);
            setWidgetDesc(config.desc);
            setBgColor(config.color)
        }
    }, [widgetType]);
    return (
        <div className={styles.body} style={{height : ""}} onClick={()=>setWidgetSelected(widgetType)}>
            <div className={styles.banner} style={{height : imageHolderHeight}}>
                <Image src={widgetType === "Page" ? PageWidgetImage :
                    widgetType === "Section" ? SectionWidgetImage :
                        widgetType === "Sticky" ? StickyWidgetImage :
                            widgetType === "Popup" ? PopupWidgetImage : ""} alt='page' width={imageWidth} height={imageHeight} />
            </div>
            <div className={styles.content}>
                <div className={styles.headerContainer}>
                    <div className={styles.widgetTypeContainer}>
                        <WidgetIcon fillColor='#585871' />
                        <div>Widget Type</div>
                    </div>
                    <div className={styles.widgetLengthContainer} style={{backgroundColor : bgColor}}>+{templateLength} styles</div>
                </div>
                <div className={styles.widgetName}>{widgetName}</div>
                <div className={styles.widgetDesc}>{widgetDesc}</div>
            </div>
            {widgetType === widgetSelected && <Image src={TickIcon} alt='tick' className={styles.tickIcon}/>}
        </div>
    )
}

function WidgetIcon({ fillColor }: { fillColor: string }) {
    return (
        <svg width="15" height="15" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.52082 0.259766C1.18654 0.259766 0.865948 0.392559 0.629574 0.628933C0.3932 0.865307 0.260406 1.1859 0.260406 1.52018V2.89518C0.260406 3.22947 0.3932 3.55006 0.629574 3.78643C0.865948 4.02281 1.18654 4.1556 1.52082 4.1556H2.89582C3.23011 4.1556 3.5507 4.02281 3.78707 3.78643C4.02345 3.55006 4.15624 3.22947 4.15624 2.89518V1.52018C4.15624 1.1859 4.02345 0.865307 3.78707 0.628933C3.5507 0.392559 3.23011 0.259766 2.89582 0.259766H1.52082ZM0.947906 1.52018C0.947906 1.20393 1.20457 0.947266 1.52082 0.947266H2.89582C3.21207 0.947266 3.46874 1.20393 3.46874 1.52018V2.89518C3.46874 3.21143 3.21207 3.4681 2.89582 3.4681H1.52082C1.20457 3.4681 0.947906 3.21143 0.947906 2.89518V1.52018ZM1.52082 4.8431C1.18654 4.8431 0.865948 4.97589 0.629574 5.21227C0.3932 5.44864 0.260406 5.76923 0.260406 6.10352V7.47852C0.260406 7.8128 0.3932 8.13339 0.629574 8.36977C0.865948 8.60614 1.18654 8.73893 1.52082 8.73893H2.89582C3.23011 8.73893 3.5507 8.60614 3.78707 8.36977C4.02345 8.13339 4.15624 7.8128 4.15624 7.47852V6.10352C4.15624 5.76923 4.02345 5.44864 3.78707 5.21227C3.5507 4.97589 3.23011 4.8431 2.89582 4.8431H1.52082ZM0.947906 6.10352C0.947906 5.78727 1.20457 5.5306 1.52082 5.5306H2.89582C3.21207 5.5306 3.46874 5.78727 3.46874 6.10352V7.47852C3.46874 7.79477 3.21207 8.05143 2.89582 8.05143H1.52082C1.20457 8.05143 0.947906 7.79477 0.947906 7.47852V6.10352ZM4.84374 1.52018C4.84374 1.1859 4.97653 0.865307 5.21291 0.628933C5.44928 0.392559 5.76987 0.259766 6.10416 0.259766H7.47916C7.81344 0.259766 8.13403 0.392559 8.37041 0.628933C8.60678 0.865307 8.73957 1.1859 8.73957 1.52018V2.89518C8.73957 3.22947 8.60678 3.55006 8.37041 3.78643C8.13403 4.02281 7.81344 4.1556 7.47916 4.1556H6.10416C5.76987 4.1556 5.44928 4.02281 5.21291 3.78643C4.97653 3.55006 4.84374 3.22947 4.84374 2.89518V1.52018ZM6.10416 0.947266C5.78791 0.947266 5.53124 1.20393 5.53124 1.52018V2.89518C5.53124 3.21143 5.78791 3.4681 6.10416 3.4681H7.47916C7.79541 3.4681 8.05207 3.21143 8.05207 2.89518V1.52018C8.05207 1.20393 7.79541 0.947266 7.47916 0.947266H6.10416ZM6.10416 4.8431C5.76987 4.8431 5.44928 4.97589 5.21291 5.21227C4.97653 5.44864 4.84374 5.76923 4.84374 6.10352V7.47852C4.84374 7.8128 4.97653 8.13339 5.21291 8.36977C5.44928 8.60614 5.76987 8.73893 6.10416 8.73893H7.47916C7.81344 8.73893 8.13403 8.60614 8.37041 8.36977C8.60678 8.13339 8.73957 7.8128 8.73957 7.47852V6.10352C8.73957 5.76923 8.60678 5.44864 8.37041 5.21227C8.13403 4.97589 7.81344 4.8431 7.47916 4.8431H6.10416ZM5.53124 6.10352C5.53124 5.78727 5.78791 5.5306 6.10416 5.5306H7.47916C7.79541 5.5306 8.05207 5.78727 8.05207 6.10352V7.47852C8.05207 7.79477 7.79541 8.05143 7.47916 8.05143H6.10416C5.78791 8.05143 5.53124 7.79477 5.53124 7.47852V6.10352Z" fill={fillColor} />
        </svg>
    )
}

export default WidgetCard