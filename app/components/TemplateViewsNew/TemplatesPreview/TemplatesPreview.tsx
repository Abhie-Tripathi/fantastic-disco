import React, { useEffect, useState } from 'react'
import styles from './templatepreview.style.module.css'
import PageTemplates from '../PageTemplates/PageTemplates'
import SectionTemplates from '../SectionTemplates/SectionTemplates';
import StickyTemplates from '../StickyTemplates/StickyTemplates';
import PopupTemplate from '../PopupTemplate/PopupTemplate';
import { StaticImageData } from 'next/image';
import CarouselGridImage from '/public/widgetimages/pageimages/CarouselGrid.png'
import PreviewWindow from './PreviewWindow';

interface Props {
    widgetSelected: string;
    draftWidgets: DraftWidgetsType[]
    setDraftWidgets: React.Dispatch<React.SetStateAction<DraftWidgetsType[]>>;
    fetchDraftWidgets: () => Promise<void>;
    isFullScreen: boolean;
    setIsFullScreen: (value: boolean) => void;
    setIsDraftSaved: (value: boolean) => void;
}
interface DraftWidgetsType {
    widgetType: string;
    templateId: string;
    widgetId: string;
    status: string;
    eventSize: number;
    widgetStatus: string;
}


const TemplatesPreview = ({ widgetSelected, draftWidgets, setDraftWidgets, fetchDraftWidgets, isFullScreen, setIsFullScreen, setIsDraftSaved }: Props) => {
    // const { theme } = useTheme()
    const [selectedTemplate, setSelectedTemplate] = useState<string>(""); // THIS IS TEMPLATE CODE

    const [selectedCard, setSelectedCard] = useState<string>("style1");
    const [templateName, setTemplateName] = useState<string>("") // THIS IS TEMPLATE NAME
    const [selectedImage, setSelectedImage] = useState<StaticImageData>(CarouselGridImage); // THIS IS FOR DRAFT WIDGETS TO SHOW THE TEMPLATE POSTER
    const [activeBtn, setActiveBtn] = useState<string>("NonHighlighted") //This is for page widget

    useEffect(() => {
        if (widgetSelected === "Page") {
            setSelectedTemplate("LS");
            setTemplateName("List Style")
        } else if (widgetSelected === "Section") {
            setSelectedTemplate("CV");
            setTemplateName("Carousel Section")
        } else if (widgetSelected === "Sticky") {
            setSelectedTemplate("ST");
            setTemplateName("Sticky Top")
        } else {
            setSelectedTemplate("PUVP");
            setTemplateName("Pop-up Portrait")
        }
    }, [widgetSelected]);

    return (
        <div className={`${styles.body}`}>
            {!isFullScreen && <div className={styles.templatesContainer}>
                <div className={styles.heading}>Choose your {widgetSelected} widget style</div>
                <div className={styles.templates}>
                    {widgetSelected === "Page" ? <PageTemplates setActiveBtn={setActiveBtn} activeBtn={activeBtn} setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> :
                        widgetSelected === "Section" ? <SectionTemplates setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> :
                            widgetSelected === "Sticky" ? <StickyTemplates setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> :
                                widgetSelected === "Pop" ? <PopupTemplate setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> : <></>}
                </div>
            </div>}
            <div className={`${styles.previewContainer} ${isFullScreen ? styles.fullPreview : ""}`}>
                <PreviewWindow setIsDraftSaved={setIsDraftSaved} smallCard={isFullScreen ? false : true} draftWidgets={draftWidgets} draftWidget={true} selectedCard={selectedCard} setSelectedCard={setSelectedCard} selectedTemplate={selectedTemplate} selectedImage={selectedImage} widgetSelected={widgetSelected} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} fetchDraftWidgets={fetchDraftWidgets} />
            </div>
        </div>
    )
}

export default TemplatesPreview

