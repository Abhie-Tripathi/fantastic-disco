import React, { useState } from 'react'
import styles from './templatepreview.style.module.css'
import PageTemplates from '../PageTemplates/PageTemplates'
import SectionTemplates from '../SectionTemplates/SectionTemplates';
import StickyTemplates from '../StickyTemplates/StickyTemplates';
import PopupTemplate from '../PopupTemplate/PopupTemplate';
import FullScreenIcon from '/public/fullscreen.svg'
import MobileIcon from '/public/mobile.svg'
import DesktopIcon from '/public/desktop.svg'
import Image from 'next/image';
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '@/app/components/TemplateViews/previews/page/MultipleEvents/HeroBanner'
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import Popup from "@/app/components/TemplateViews/previews/popup/Popup";
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import CaraouselView from '@/app/components/TemplateViews/previews/page/CarouselView/CaraouselView';

interface Props {
    widgetSelected: string;
}

const TemplatesPreview = ({ widgetSelected }: Props) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [selectedCard, setSelectedCard] = useState<string>("card1");

    return (
        <div className={`${styles.body}`}>
            {!isFullScreen && <div className={styles.templatesContainer}>
                <div className={styles.heading}>Choose your {widgetSelected} widget style</div>
                <div className={styles.templates}>
                    {widgetSelected === "Page" ? <PageTemplates setSelectedTemplate={setSelectedTemplate} /> :
                        widgetSelected === "Section" ? <SectionTemplates setSelectedTemplate={setSelectedTemplate} /> :
                            widgetSelected === "Sticky" ? <StickyTemplates setSelectedTemplate={setSelectedTemplate} /> :
                                widgetSelected === "Popup" ? <PopupTemplate setSelectedTemplate={setSelectedTemplate} /> : <></>}
                </div>
            </div>}
            <div className={`${styles.previewContainer} ${isFullScreen ? styles.fullPreview : ""}`}>
                <div className={styles.heading_btnContainer}>
                    <div className={styles.heading}>Preview</div>
                    {(selectedTemplate === "LS" || selectedTemplate === "GS" || selectedTemplate === "HBL" || selectedTemplate === "HBG" || selectedTemplate === "CVL" || selectedTemplate === "CVG") && <div className={styles.listTemplateBtns}>
                        <button className={`${styles.listTemplateBtn} ${selectedCard === "card1" ? styles.activeBtn : ""}`} onClick={() => setSelectedCard("card1")}>Card Style 1</button>
                        <button className={`${styles.listTemplateBtn} ${selectedCard === "card2" ? styles.activeBtn : ""}`} onClick={() => setSelectedCard("card2")}>Card Style 2</button>
                        <button className={`${styles.listTemplateBtn} ${selectedCard === "card3" ? styles.activeBtn : ""}`} onClick={() => setSelectedCard("card3")}>Card Style 3</button>
                    </div>}
                    <div className={styles.btnContainer}>
                        <Image src={MobileIcon} alt='mobile' />
                        <Image src={DesktopIcon} alt='desktop' />
                        <Image src={FullScreenIcon} alt='fullscreen' onClick={() => setIsFullScreen(!isFullScreen)} />
                    </div>

                </div>
                <div className={styles.preview_btnContainer}>
                    <div className={styles.preview}>
                        {selectedTemplate === "ST" ? <StickyPreview type="top" /> :
                            selectedTemplate === "SB" ? <StickyPreview type="down" /> :
                                selectedTemplate === "HB" ? <HeroBanner /> :
                                    selectedTemplate === "GS" ? <GridView selectedCard = {selectedCard} /> :
                                        selectedTemplate === "LS" ? <ListView selectedCard = {selectedCard} /> :
                                            selectedTemplate === "HBL" ? <HeroBannerAndViews type='list' selectedCard = {selectedCard}/> :
                                                selectedTemplate === "HBG" ? <HeroBannerAndViews type='grid' selectedCard = {selectedCard}/> :
                                                    selectedTemplate === "CVL" ? <CaraouselAndViews type='list' selectedCard = {selectedCard}/> :
                                                        selectedTemplate === "CVG" ? <CaraouselAndViews type='grid' selectedCard = {selectedCard}/> :
                                                            selectedTemplate === "CV" ? <CaraouselView /> :
                                                                selectedTemplate === "HS" ? <ScrollView type='top' /> :
                                                                    selectedTemplate === "LScroll" ? <ScrollView type='left' /> :
                                                                        selectedTemplate === "RScroll" ? <ScrollView type='right' /> :
                                                                            selectedTemplate === "PUV" ? <Popup /> : <></>}
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