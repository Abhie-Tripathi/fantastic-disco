import React, { useEffect, useState } from 'react'
import styles from './templatepreview.style.module.css'
import PageTemplates from '../PageTemplates/PageTemplates'
import SectionTemplates from '../SectionTemplates/SectionTemplates';
import StickyTemplates from '../StickyTemplates/StickyTemplates';
import PopupTemplate from '../PopupTemplate/PopupTemplate';
import Image from 'next/image';
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '../../TemplateViews/previews/section/Herobanner/HeroBanner';
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import PortraitPopup from '../../TemplateViews/previews/popup/portraitstyles/PortraitPopup';
import LandscapePopup from '../../TemplateViews/previews/popup/landscapesstyles/LandscapePopup';
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import CaraouselView from '@/app/components/TemplateViews/previews/page/CarouselView/CaraouselView';
import { useTheme } from '@/context';

interface Props {
    widgetSelected: string;
}

const TemplatesPreview = ({ widgetSelected }: Props) => {
    const { theme } = useTheme()
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [selectedCard, setSelectedCard] = useState<string>("style1");

    useEffect(() => {
        if (widgetSelected === "Page") {
            setSelectedTemplate("LS");
        } else if (widgetSelected === "Section") {
            setSelectedTemplate("HB");
        } else if (widgetSelected === "Sticky") {
            setSelectedTemplate("ST");
        } else {
            setSelectedTemplate("PUVP");
        }
    }, [widgetSelected]);

    return (
        <div className={`${styles.body}`}>
            {!isFullScreen && <div className={styles.templatesContainer}>
                <div className={styles.heading}>Choose your {widgetSelected} widget style</div>
                <div className={styles.templates}>
                    {widgetSelected === "Page" ? <PageTemplates selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} /> :
                        widgetSelected === "Section" ? <SectionTemplates selectedTemplate={selectedTemplate}  setSelectedTemplate={setSelectedTemplate} /> :
                            widgetSelected === "Sticky" ? <StickyTemplates selectedTemplate={selectedTemplate}  setSelectedTemplate={setSelectedTemplate} /> :
                                widgetSelected === "Popup" ? <PopupTemplate selectedTemplate={selectedTemplate}  setSelectedTemplate={setSelectedTemplate} /> : <></>}
                </div>
            </div>}
            <div className={`${styles.previewContainer} ${isFullScreen ? styles.fullPreview : ""}`}>
                <div className={styles.heading_btnContainer}>
                    <div className={styles.heading}>Preview</div>
                    {(selectedTemplate === "LS" || selectedTemplate === "GS" || selectedTemplate === "HBL" || selectedTemplate === "HBG" || selectedTemplate === "CVL" || selectedTemplate === "CVG" || selectedTemplate === "HS" || selectedTemplate === "LScroll" || selectedTemplate === "RScroll" || selectedTemplate === "CV" || selectedTemplate === "HB" || selectedTemplate === "PUVP" || selectedTemplate === "PUVL") && <div className={`${styles.styleBtns} ${theme == "dark" ? styles.darkStyleBtns : ""}`}>
                        <button className={`${styles.styleBtn} ${selectedCard === "style1" ? styles.activeBtn : ""} ${theme === "dark" ? styles.darkStyleBtn : ""}`} onClick={() => setSelectedCard("style1")}>Style 1</button>
                        <button className={`${styles.styleBtn} ${selectedCard === "style2" ? styles.activeBtn : ""} ${theme === "dark" ? styles.darkStyleBtn : ""}`} onClick={() => setSelectedCard("style2")}>Style 2</button>
                        <button className={`${styles.styleBtn} ${selectedCard === "style3" ? styles.activeBtn : ""} ${theme === "dark" ? styles.darkStyleBtn : ""}`} onClick={() => setSelectedCard("style3")}>Style 3</button>
                    </div>}
                    <div className={styles.btnContainer}>
                        <div><MobileIcon color={theme === "dark" ? "white" : "black"} /></div>
                        <div><DesktopIcon color={theme === "dark" ? "white" : "black"} /></div>
                        <div onClick={() => setIsFullScreen(!isFullScreen)}><FullScreenIcon color={theme === "dark" ? "white" : "black"} /></div>
                    </div>

                </div>
                <div className={`${styles.preview_btnContainer} ${theme === "dark" ? styles.darkpreview_btnContainer : ""}`}>
                    <div className={styles.preview}>
                        {selectedTemplate === "ST" ? <StickyPreview type="top" /> :
                            selectedTemplate === "SB" ? <StickyPreview type="down" /> :
                                selectedTemplate === "HB" ? <HeroBanner selectedCard={selectedCard} /> :
                                    selectedTemplate === "GS" ? <GridView selectedCard={selectedCard} /> :
                                        selectedTemplate === "LS" ? <ListView selectedCard={selectedCard} /> :
                                            selectedTemplate === "HBL" ? <HeroBannerAndViews type='list' selectedCard={selectedCard} /> :
                                                selectedTemplate === "HBG" ? <HeroBannerAndViews type='grid' selectedCard={selectedCard} /> :
                                                    selectedTemplate === "CVL" ? <CaraouselAndViews type='list' selectedCard={selectedCard} isFullScreen={isFullScreen} /> :
                                                        selectedTemplate === "CVG" ? <CaraouselAndViews type='grid' selectedCard={selectedCard} isFullScreen={isFullScreen} /> :
                                                            selectedTemplate === "CV" ? <CaraouselView selectedCard={selectedCard} isFullScreen={isFullScreen} /> :
                                                                selectedTemplate === "HS" ? <ScrollView type='top' selectedCard={selectedCard} /> :
                                                                    selectedTemplate === "LScroll" ? <ScrollView selectedCard={selectedCard} type='left' /> :
                                                                        selectedTemplate === "RScroll" ? <ScrollView selectedCard={selectedCard} type='right' /> :
                                                                            selectedTemplate === "PUVP" ? <PortraitPopup selectedCard={selectedCard} /> : selectedTemplate === "PUVL" ? <LandscapePopup selectedCard={selectedCard} /> : <></>}
                    </div>
                    <div className={styles.previewBtnContainer}>
                        <button className={styles.previewBtn}>Save to my widgets</button>
                        <button className={styles.previewBtn}>Continue with this template</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplatesPreview

interface IconProps {
    color: string;
}

function MobileIcon({ color }: IconProps) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 6H13.5M16.286 3H7.714C6.768 3 6 3.806 6 4.8V19.2C6 20.194 6.768 21 7.714 21H16.286C17.233 21 18 20.194 18 19.2V4.8C18 3.806 17.233 3 16.286 3Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}
function DesktopIcon({ color }: IconProps) {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M9 20H12M12 20H15M12 20V17M12 17H19C19.5304 17 20.0391 16.7893 20.4142 16.4142C20.7893 16.0391 21 15.5304 21 15V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H12Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}
function FullScreenIcon({ color }: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={color}><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z" /></svg>
    )
}