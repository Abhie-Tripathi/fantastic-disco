'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import Designs from "@/app/components/TemplateViews/designs/Designs";
import Image from "next/image";
import FullScreeIcon from '/public/fullscreen.svg'
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner1 from '@/app/components/TemplateViews/previews/section/Herobanner/HeroBanner1';
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import ListAndGridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListAndGridView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import PortraitPopup from '@/app/components/TemplateViews/previews/popup/portraitstyles/PortraitPopup';
import LandscapePopup from '@/app/components/TemplateViews/previews/popup/landscapesstyles/LandscapePopup';
import CaraouselTop from '@/app/components/TemplateViews/previews/section/CaraouselTop'
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import DraftWidgets from "@/app/components/TemplateViews/draftwidgets/DraftWidgets";
import { useRouter } from 'next/navigation';
import InfoModal from '@/app/components/TemplateViews/infomodal/InfoModal';
import CaraouselView from '@/app/components/TemplateViews/previews/page/CarouselView/CaraouselView';

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
  const [draftwidgetsLength, setDraftwidgetsLength] = useState<number>();

  useEffect(() => {
    const storedDraftWidgets = localStorage.getItem('draftWidgets');
    if (storedDraftWidgets) {
      setDraftwidgetsLength(JSON.parse(storedDraftWidgets).length);
      setDraftWidgets(JSON.parse(storedDraftWidgets))
    }
  }, [])

  const router = useRouter();

  const handleDraftWidget = () => {
    let updatedDraftWidgets: DraftWidget[] = [];
    if (widgetSelected === "Sticky") {
      const existingStickyWidgets = draftWidgets.filter(widget => widget.widgetType === "Sticky");
      const samePreviewExists = existingStickyWidgets.some(widget => widget.preview === preview);

      if (samePreviewExists) {
        setInfoModal(true);
      } else {
        updatedDraftWidgets = [...draftWidgets, { widgetType: widgetSelected, preview }];
        setDraftWidgets(updatedDraftWidgets);
      }
    } else {
      const existingWidget = draftWidgets.find(widget => widget.widgetType === widgetSelected);

      if (existingWidget) {
        setInfoModal(true);
      } else {
        updatedDraftWidgets = [...draftWidgets, { widgetType: widgetSelected, preview }];
        setDraftWidgets(updatedDraftWidgets);
      }
    }
    if (updatedDraftWidgets.length > 0) {
      localStorage.setItem('draftWidgets', JSON.stringify(updatedDraftWidgets));
    }
  };

  const handleEditButton = () => {
    const existingWidget = draftWidgets.find(widget => widget.widgetType === widgetSelected);

    const query = new URLSearchParams({
      preview: preview
    }).toString();

    const editUrl = `/templates/edit/3763g?${query}`;

    if (existingWidget && existingWidget.preview) {
      router.push(editUrl);
    } else if (existingWidget && !existingWidget.preview) {
      setInfoModal(true);
    } else {
      router.push(editUrl);
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.navbar}>
        <div className={styles.heading}>Start with Selecting One or Multiple templates</div>
        <div className={styles.savedDraftsContainer} onClick={() => setDraftModal(true)}>
          <div className={styles.savedDraftHeading}>Saved Drafts</div>
          <div className={styles.savedDraftNumber}>{draftwidgetsLength}</div>
        </div>
      </div>
      <div className={`${styles.body} ${infoModal ? styles.blurBody : ""}`}>
        {!isFullScreen && <div className={styles.leftContainer}>
          <div className={styles.templateWindow}>
            <Designs setPreview={setPreview} setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} draftWidgets={draftWidgets} />
          </div>
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
                  preview === "sehb" ? <HeroBanner1 /> :
                    preview === "megv" ? <GridView /> :
                      preview === "melv" ? <ListView /> :
                          preview === "melgv" ? <ListAndGridView /> :
                            preview === "phblv" ? <HeroBannerAndViews type='list' /> :
                              preview === "phbgv" ? <HeroBannerAndViews type='grid' /> :
                                preview === "phblgv" ? <HeroBannerAndViews type='listandgrid' /> :
                                  preview === "pcslv" ? <CaraouselAndViews type='list' isFullScreen={isFullScreen}/> :
                                    preview === "pcsgv" ? <CaraouselAndViews type='grid' isFullScreen={isFullScreen}/> :
                                      preview === "pcslgv" ? <CaraouselAndViews type='listandgrid' isFullScreen={isFullScreen}/> :
                                        preview === "tscv" ? <CaraouselTop /> :
                                          preview === "tshs" ? <ScrollView type='top' /> :
                                            preview === "lsvs" ?
                                              <ScrollView type='left' /> :
                                              preview === "popup" ? <PortraitPopup /> : <></>}
            </div>
            <Image src={FullScreeIcon} alt="expand" className={styles.fullScreenIcon} onClick={() => setIsFullScreen(!isFullScreen)} />
          </div>
          <div className={styles.continue_saveContainer}>
            <button onClick={handleEditButton} className={styles.continueBtn}>Continue with this Template</button>
            <button className={styles.saveBtn} onClick={handleDraftWidget}>Save To Draft</button>
          </div>
        </div>
        <div className={`${styles.draftsModal} ${draftModal ? styles.open : ''}`}>
          <DraftWidgets setYourWidgetModal={setDraftModal} />
        </div>
      </div>
      {infoModal && <div className={styles.infoModal}>
        <InfoModal setInfoModal={setInfoModal} preview={preview} widgetSelected={widgetSelected} setDraftWidgets={setDraftWidgets} draftWidgets={draftWidgets} />
      </div>}

    </div>
  )
}

export default Page