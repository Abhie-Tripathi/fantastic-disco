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
import HeroBanner from '../../TemplateViews/previews/section/Herobanner/HeroBanner';
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import PortraitPopup from '../../TemplateViews/previews/popup/portraitstyles/PortraitPopup';
import LandscapePopup from '../../TemplateViews/previews/popup/landscapesstyles/LandscapePopup';
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
                    {(selectedTemplate === "LS" || selectedTemplate === "GS" || selectedTemplate === "HBL" || selectedTemplate === "HBG" || selectedTemplate === "CVL" || selectedTemplate === "CVG" || selectedTemplate === "HS" || selectedTemplate === "LScroll" || selectedTemplate === "RScroll"|| selectedTemplate === "CV" || selectedTemplate === "HB" || selectedTemplate === "PUVP"|| selectedTemplate === "PUVL") && <div className={styles.styleBtns}>
                        <button className={`${styles.styleBtn} ${selectedCard === "card1" ? styles.activeBtn : ""}`} onClick={() => setSelectedCard("card1")}>Style 1</button>
                        <button className={`${styles.styleBtn} ${selectedCard === "card2" ? styles.activeBtn : ""}`} onClick={() => setSelectedCard("card2")}>Style 2</button>
                        <button className={`${styles.styleBtn} ${selectedCard === "card3" ? styles.activeBtn : ""}`} onClick={() => setSelectedCard("card3")}>Style 3</button>
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
                                selectedTemplate === "HB" ? <HeroBanner selectedCard = {selectedCard}/> :
                                    selectedTemplate === "GS" ? <GridView selectedCard = {selectedCard} /> :
                                        selectedTemplate === "LS" ? <ListView selectedCard = {selectedCard} /> :
                                            selectedTemplate === "HBL" ? <HeroBannerAndViews type='list' selectedCard = {selectedCard}/> :
                                                selectedTemplate === "HBG" ? <HeroBannerAndViews type='grid' selectedCard = {selectedCard}/> :
                                                    selectedTemplate === "CVL" ? <CaraouselAndViews type='list' selectedCard = {selectedCard} isFullScreen={isFullScreen}/> :
                                                        selectedTemplate === "CVG" ? <CaraouselAndViews type='grid' selectedCard = {selectedCard} isFullScreen={isFullScreen}/> :
                                                            selectedTemplate === "CV" ? <CaraouselView selectedCard = {selectedCard} isFullScreen={isFullScreen}/> :
                                                                selectedTemplate === "HS" ? <ScrollView type='top' selectedCard = {selectedCard}/> :
                                                                    selectedTemplate === "LScroll" ? <ScrollView selectedCard = {selectedCard} type='left' /> :
                                                                        selectedTemplate === "RScroll" ? <ScrollView selectedCard = {selectedCard} type='right' /> :
                                                                            selectedTemplate === "PUVP" ? <PortraitPopup selectedCard={selectedCard} /> :selectedTemplate === "PUVL" ? <LandscapePopup selectedCard={selectedCard} /> : <></>}
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