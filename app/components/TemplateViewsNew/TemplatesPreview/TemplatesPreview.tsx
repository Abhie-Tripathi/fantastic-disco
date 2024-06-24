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
import ListAndGridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListAndGridView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import Popup from "@/app/components/TemplateViews/previews/popup/Popup";
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import DraftWidgets from "@/app/components/TemplateViews/draftwidgets/DraftWidgets";
import CaraouselView from '@/app/components/TemplateViews/previews/page/CarouselView/CaraouselView';

interface Props {
    widgetSelected: string;
}

const TemplatesPreview = ({ widgetSelected }: Props) => {
    const [selectedTemplate, setSelectedTemplate] = useState<string>("");

    return (
        <div className={`${styles.body}`}>
            <div className={styles.templatesContainer}>
                <div className={styles.heading}>Choose your {widgetSelected} widget style</div>
                <div className={styles.templates}>
                    {widgetSelected === "Page" ? <PageTemplates setSelectedTemplate={setSelectedTemplate} /> :
                        widgetSelected === "Section" ? <SectionTemplates setSelectedTemplate={setSelectedTemplate} /> :
                            widgetSelected === "Sticky" ? <StickyTemplates setSelectedTemplate={setSelectedTemplate} /> :
                                widgetSelected === "Popup" ? <PopupTemplate setSelectedTemplate={setSelectedTemplate} /> : <></>}
                </div>
            </div>
            <div className={styles.previewContainer}>
                <div className={styles.heading_btnContainer}>
                    <div className={styles.heading}>Preview</div>
                    <div className={styles.btnContainer}>
                        <Image src={MobileIcon} alt='mobile' />
                        <Image src={DesktopIcon} alt='desktop' />
                        <Image src={FullScreenIcon} alt='fullscreen' />
                    </div>
                </div>
                <div className={styles.preview_btnContainer}>
                    <div className={styles.preview}>
                        {selectedTemplate === "ST" ? <StickyPreview type="top" /> :
                        selectedTemplate === "SB" ? <StickyPreview type="down" /> :
                        selectedTemplate === "HB" ? <HeroBanner /> :
                        selectedTemplate === "GS" ? <GridView /> :
                        selectedTemplate === "LS" ? <ListView /> :
                        selectedTemplate === "HBL" ? <HeroBannerAndViews type='list' /> :
                        selectedTemplate === "HBG" ? <HeroBannerAndViews type='grid' /> :
                        selectedTemplate === "CVL" ? <CaraouselAndViews type='list' /> :
                        selectedTemplate === "CVG" ? <CaraouselAndViews type='grid' /> :
                        selectedTemplate === "CV" ? <CaraouselView /> :
                        selectedTemplate === "HS" ? <ScrollView type='top' /> :
                        selectedTemplate === "LScroll" ?<ScrollView type='left' /> : 
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