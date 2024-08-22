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
}
interface DraftWidgetsType {
    widgetType: string;
    templateId: string;
    widgetId: string;
    status: string;
  }


const TemplatesPreview = ({ widgetSelected, draftWidgets,setDraftWidgets ,fetchDraftWidgets}: Props) => {
    // const { theme } = useTheme()
    const [selectedTemplate, setSelectedTemplate] = useState<string>(""); // THIS IS TEMPLATE CODE
    const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
    const [selectedCard, setSelectedCard] = useState<string>("style1");
    const [templateName, setTemplateName] = useState<string>("") // THIS IS TEMPLATE NAME
    const [selectedImage, setSelectedImage] = useState<StaticImageData>(CarouselGridImage); // THIS IS FOR DRAFT WIDGETS TO SHOW THE TEMPLATE POSTER
    
    useEffect(() => {
        if (widgetSelected === "Page") {
            setSelectedTemplate("LS");
            setTemplateName("Left Scroll")
        } else if (widgetSelected === "Section") {
            setSelectedTemplate("HB");
            setTemplateName("Hero Banner")
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
                    {widgetSelected === "Page" ? <PageTemplates setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> :
                        widgetSelected === "Section" ? <SectionTemplates setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> :
                            widgetSelected === "Sticky" ? <StickyTemplates setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> :
                                widgetSelected === "Pop" ? <PopupTemplate setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} setTempelateName={setTemplateName} /> : <></>}
                </div>
            </div>}
            <div className={`${styles.previewContainer} ${isFullScreen ? styles.fullPreview : ""}`}>
                <PreviewWindow smallCard={isFullScreen ? false : true} draftWidgets={draftWidgets} draftWidget={true} selectedCard={selectedCard} setSelectedCard={setSelectedCard} selectedTemplate={selectedTemplate} selectedImage={selectedImage} widgetSelected={widgetSelected} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} fetchDraftWidgets={fetchDraftWidgets}/>
            </div>
        </div>
    )
}

export default TemplatesPreview

