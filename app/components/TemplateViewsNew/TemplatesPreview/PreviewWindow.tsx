import React from 'react'
import styles from './preview.style.module.css'
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
import { StaticImageData } from 'next/image';
import { baseUrl } from '@/constants';
import { myFetch } from '@/utils/myFetch';
import { useRouter } from 'next/navigation';
import { AddedEventsType } from '@/types/addedwidgetevents';

interface FontSettings {
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    fontWeight: string;
}

interface ButtonSettings {
    buttonColor: string;
    fontColor: string;
    borderRadius: number;
    borderColor: string;
    buttonText: string;
}
interface PreviewProps {
    selectedTemplate?: string;
    selectedCard?: string;
    setSelectedCard?: (value: string) => void
    setIsFullScreen: (value: boolean) => void
    isFullScreen: boolean
    widgetSelected?: string;
    // templateName?: string;
    selectedImage?: StaticImageData
    cardBgColor?: string;
    cardBorderRadius?: number;
    fontSettings?: {
        heading: FontSettings;
        subheading: FontSettings;
        body: FontSettings;
    };
    buttonSettings?: {
        primary: ButtonSettings;
        secondary: ButtonSettings;
    };
    selectedBtn?: "primary" | "secondary"
    draftWidget?: boolean;
    // setDraftWidgets: (value: DraftWidgetsType[]) => void
    draftWidgets?: DraftWidgetsType[]
    fetchDraftWidgets?: () => Promise<void>; 
    fetchedAddedEvents?:  AddedEventsType[]
}
interface DraftWidgetsType {
    widgetType: string;
    templateId: string;
    widgetId: string;
    status: string;
}

const PreviewWindow = ({ selectedTemplate, selectedCard, setIsFullScreen, isFullScreen, setSelectedCard, widgetSelected, draftWidget,fetchDraftWidgets,
    cardBgColor = "#ffffff", cardBorderRadius = 20,
    fontSettings = {
        heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
        subheading: { fontFamily: "arial", fontSize: 16, fontColor: "#000000", fontWeight: "bolder" },
        body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "bolder" }
    },
    buttonSettings = {
        primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
        secondary: { buttonColor: "#6750a4", fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
    },
    selectedBtn = "primary", fetchedAddedEvents }: PreviewProps) => {
    const { theme } = useTheme()
    const router = useRouter();
    const getAsciiString = (str: string): string => {
        return str.split('').map(char => char.charCodeAt(0).toString()).join('');
    };

    const handleDraftWidgets = async (navigate: boolean) => {
        if (!selectedTemplate || !widgetSelected || !fontSettings || !buttonSettings || !selectedCard) {
            console.error('Missing required data');
            return;
        }
        const templatePublicId = getAsciiString(selectedTemplate);
        const customizeData = new FormData();

        customizeData.append('templatePublicId', templatePublicId);
        let tempSelectedWidget = widgetSelected;
        if (widgetSelected === "Sticky") {
            tempSelectedWidget = "StickyTop";
        }
        customizeData.append('type', tempSelectedWidget);
        customizeData.append('status', 'draft');
        customizeData.append('domain', 'http://example.com'); // replace with actual domain
        const customizationData = {
            fontSettings,
            buttonSettings,
            cardBgColor,
            cardBorderRadius,
            selectedBtn,
            selectedCard,
        };
        customizeData.append('customizationData', JSON.stringify(customizationData));
        const { data, error } = await myFetch(
            `${baseUrl}/widget`,
            {
                method: 'POST',
                body: customizeData,
            }
        );
        if (data) {
            console.log(data);
            if(fetchDraftWidgets){
                fetchDraftWidgets();
            }
            if (navigate && data.id) {
                router.push(`/widget/edit/${data.id}`);
            }
        } else {
            console.log(error);
        }
    };
    return (
        <div className={styles.body}>
            <div className={styles.heading_btnContainer}>
                <div className={styles.heading}>Preview</div>
                {(selectedTemplate === "LS" || selectedTemplate === "GS" || selectedTemplate === "HBL" || selectedTemplate === "HBG" || selectedTemplate === "CVL" || selectedTemplate === "CVG" || selectedTemplate === "HS" || selectedTemplate === "LScroll" || selectedTemplate === "RScroll" || selectedTemplate === "CV" || selectedTemplate === "HB" || selectedTemplate === "PUVP" || selectedTemplate === "PUVL") && setSelectedCard && (
                    <div className={`${styles.styleBtns} ${theme == "dark" ? styles.darkStyleBtns : ""}`}>
                        <button
                            className={`${styles.styleBtn} ${selectedCard === "style1" ? styles.activeBtn : ""} ${theme === "dark" ? styles.darkStyleBtn : ""}`}
                            onClick={() => setSelectedCard("style1")}
                        >
                            Style 1
                        </button>
                        <button
                            className={`${styles.styleBtn} ${selectedCard === "style2" ? styles.activeBtn : ""} ${theme === "dark" ? styles.darkStyleBtn : ""}`}
                            onClick={() => setSelectedCard("style2")}
                        >
                            Style 2
                        </button>
                        <button
                            className={`${styles.styleBtn} ${selectedCard === "style3" ? styles.activeBtn : ""} ${theme === "dark" ? styles.darkStyleBtn : ""}`}
                            onClick={() => setSelectedCard("style3")}
                        >
                            Style 3
                        </button>
                    </div>
                )}

                <div className={styles.viewBtnContainer}>
                    <div><MobileIcon color={theme === "dark" ? "white" : "black"} /></div>
                    <div><DesktopIcon color={theme === "dark" ? "white" : "black"} /></div>
                    <div onClick={() => setIsFullScreen(!isFullScreen)}><FullScreenIcon color={theme === "dark" ? "white" : "black"} /></div>
                </div>

            </div>
            <div className={styles.preview_btnContainer}>
                <div className={`${styles.preview} ${theme === "dark" ? styles.darkPreview : ""}`}>
                    {selectedTemplate === "ST" ? <StickyPreview type="top" /> :
                        selectedTemplate === "SB" ? <StickyPreview type="down" /> :
                            selectedTemplate === "HB" ? <HeroBanner fetchedAddedEvents={fetchedAddedEvents}  selectedBtn={selectedBtn} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} /> :
                                selectedTemplate === "GS" ? <GridView fetchedAddedEvents={fetchedAddedEvents}  selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                    selectedTemplate === "LS" ? <ListView fetchedAddedEvents={fetchedAddedEvents} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                        selectedTemplate === "HBL" ? <HeroBannerAndViews type='list' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                            selectedTemplate === "HBG" ? <HeroBannerAndViews type='grid' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                                selectedTemplate === "CVL" ? <CaraouselAndViews  type='list' selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                                    selectedTemplate === "CVG" ? <CaraouselAndViews type='grid' selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                                        selectedTemplate === "CV" ? <CaraouselView fetchedAddedEvents={fetchedAddedEvents} selectedCard={selectedCard} isFullScreen={isFullScreen} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                                            selectedTemplate === "HS" ? <ScrollView fetchedAddedEvents={fetchedAddedEvents} type='top' selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                                                selectedTemplate === "LSR" ? <ScrollView fetchedAddedEvents={fetchedAddedEvents} selectedCard={selectedCard} type='left' cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                                                    selectedTemplate === "RSR" ? <ScrollView fetchedAddedEvents={fetchedAddedEvents}selectedCard={selectedCard} type='right' cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} /> :
                                                                        selectedTemplate === "PUVP" ? <PortraitPopup fetchedAddedEvents={fetchedAddedEvents} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} selectedBtn={selectedBtn} /> : selectedTemplate === "PUVL" ? <LandscapePopup fetchedAddedEvents={fetchedAddedEvents} selectedCard={selectedCard} cardBgColor={cardBgColor} cardBorderRadius={cardBorderRadius} fontSettings={fontSettings} buttonSettings={buttonSettings} selectedBtn={selectedBtn} /> : <></>}
                </div>
                {draftWidget && <div className={styles.previewBtnContainer}>
                    <button onClick={() => handleDraftWidgets(false)} className={styles.previewBtn}>Save to my widgets</button>
                    <button onClick={() => handleDraftWidgets(true)} className={styles.previewBtn}> Continue with this template</button>
                </div>}
            </div>
        </div>
    )
}

export default PreviewWindow
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