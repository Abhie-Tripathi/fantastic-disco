'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import Designs from "@/app/components/TemplateViews/designs/Designs";
import Image from "next/image";
import FullScreeIcon from '/public/fullscreen.svg'
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '@/app/components/TemplateViews/previews/page/MultipleEvents/HeroBanner'
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import ListAndGridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListAndGridView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import Popup from "@/app/components/TemplateViews/previews/popup/Popup";
import CaraouselTop from '@/app/components/TemplateViews/previews/section/CaraouselTop'
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import DraftWidgets from "@/app/components/TemplateViews/draftwidgets/DraftWidgets";
import { useRouter } from 'next/navigation';
import InfoModal from '@/app/components/TemplateViews/infomodal/InfoModal';

interface DraftWidget {
  widgetType: string;
  preview: string;
}

const Page = () => {

  const [draftModal, setDraftModal] = useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [preview, setPreview] = useState("sehb");
  const [widgetSelected, setWidgetSelected] = useState<string>("");
  const [draftWidgets, setDraftWidgets] = useState<DraftWidget[]>([]);
  const [infoModal, setInfoModal] = useState<boolean>(false)
  const router = useRouter();

  const handleDraftWidget = () => {
    if (widgetSelected === "Sticky") {
      const existingStickyWidgets = draftWidgets.filter(widget => widget.widgetType === "Sticky");

      const samePreviewExists = existingStickyWidgets.some(widget => widget.preview === preview);

      if (samePreviewExists) {
        setInfoModal(true);
      } else {
        setDraftWidgets([...draftWidgets, { widgetType: widgetSelected, preview }]);
      }
    } else {
      const existingWidget = draftWidgets.find(widget => widget.widgetType === widgetSelected);

      if (existingWidget) {
        setInfoModal(true);
      } else {
        setDraftWidgets([...draftWidgets, { widgetType: widgetSelected, preview }]);
      }
    }
  };

  const handleEditButton = () => {
    const existingWidget = draftWidgets.find(widget => widget.widgetType === widgetSelected);

    if (existingWidget && existingWidget.preview) {
      router.push("/templates/edit/3763g");
    } else if (existingWidget && !existingWidget.preview) {
      setInfoModal(true);
    } else {
      router.push("/templates/edit/3763g");
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.navbar}>
        <div className={styles.heading}>Start with Selecting One or Multiple templates</div>
        <div className={styles.savedDraftsContainer} onClick={() => setDraftModal(true)}>
          <div className={styles.savedDraftHeading}>Saved Drafts</div>
          <div className={styles.savedDraftNumber}>{draftWidgets.length}</div>
        </div>
      </div>
      <div className={`${styles.body} ${infoModal ? styles.blurBody : ""}`}>
        {!isFullScreen && <div className={styles.leftContainer}>
          <div className={styles.templateWindow}>
            <Designs setPreview={setPreview} setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} draftWidgets={draftWidgets} />
          </div>
          {/* <div className={styles.add_draftContainer}>

            <button className={styles.addBtn}>Add Another Template</button>
          </div> */}
        </div>}
        <div className={`${styles.rightContainer} ${isFullScreen ? styles.fullPreview : ""}`}>
          <div className={styles.previewContainer}>
            <div className={styles.heading}>
              {preview === "stickytop" ? "Sticky Top" :
                preview === "stickydown" ? "Sticky Footer" :
                  preview === "sehb" ? "Hero Banner" :
                    preview === "megv" ? "Grid View" :
                      preview === "melv" ? "List View" :
                        preview === "melgv" ? "List and Grid view" :
                          preview === "phblv" ? "Hero Banner and List view" :
                            preview === "phbgv" ? "Hero Banner and Grid view" :
                              preview === "phblgv" ? "Hero Banner and List Grid view" :
                                preview === "pcslv" ? "Caraousel and List view" :
                                  preview === "pcsgv" ? "Caraousel and Grid view" :
                                    preview === "pcslgv" ? "Caraousel and List Grid view" :
                                      preview === "tscv" ? "Top Section Caraousel view" :
                                        preview === "tshs" ? "Top Section Horizontal Scroll view" :
                                          preview === "lsvs" ? "Left Section Veritcal Scroll view" :
                                            preview === "popup" ? "Pop-up" : ""}
            </div>
            <div className={styles.preview}>
              {preview === "stickytop" ? <StickyPreview type="top" /> :
                preview === "stickydown" ? <StickyPreview type="down" /> :
                  preview === "sehb" ? <HeroBanner /> :
                    preview === "megv" ? <GridView /> :
                      preview === "melv" ? <ListView /> :
                        preview === "melgv" ? <ListAndGridView /> :
                          preview === "phblv" ? <HeroBannerAndViews type='list' /> :
                            preview === "phbgv" ? <HeroBannerAndViews type='grid' /> :
                              preview === "phblgv" ? <HeroBannerAndViews type='listandgrid' /> :
                                preview === "pcslv" ? <CaraouselAndViews type='list' /> :
                                  preview === "pcsgv" ? <CaraouselAndViews type='grid' /> :
                                    preview === "pcslgv" ? <CaraouselAndViews type='listandgrid' /> :
                                      preview === "tscv" ? <CaraouselTop /> :
                                        preview === "tshs" ? <ScrollView type='top' /> :
                                          preview === "lsvs" ?
                                            <ScrollView type='left' /> :
                                            preview === "popup" ? <Popup /> : <></>}
            </div>
            <Image src={FullScreeIcon} alt="expand" className={styles.fullScreenIcon} onClick={() => setIsFullScreen(!isFullScreen)} />
          </div>
          <div className={styles.continue_saveContainer}>
            <button onClick={handleEditButton} className={styles.continueBtn}>Continue with this Template</button>
            <button className={styles.saveBtn} onClick={handleDraftWidget}>Save To Draft</button>
          </div>
        </div>
        <div className={`${styles.draftsModal} ${draftModal ? styles.open : ''}`}>
          <DraftWidgets setYourWidgetModal={setDraftModal} draftWidgets={draftWidgets} />
        </div>
      </div>
      {infoModal && <div className={styles.infoModal}>
        <InfoModal setInfoModal={setInfoModal} preview={preview} widgetSelected={widgetSelected} setDraftWidgets={setDraftWidgets} draftWidgets={draftWidgets} />
      </div>}

    </div>
  ) 
}

export default Page