"use client";
import React, { useEffect, useState } from "react";
import styles from './page.style.module.css';
import Designs from "@/app/components/TemplateViews/designs/Designs";
import BrandKit from "@/app/components/TemplateViews/brandkit/BrandKit";
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '@/app/components/TemplateViews/previews/page/MultipleEvents/HeroBanner'
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import ListAndGridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListAndGridView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import CaraouselTop from '@/app/components/TemplateViews/previews/section/CaraouselTop'
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import Filters from "@/app/components/TemplateViews/filter/Filters";
import CodeWindow from '@/app/components/widgetconfigure/CodeWindow'
import Popup from "@/app/components/TemplateViews/previews/popup/Popup";
<<<<<<< HEAD
=======
import YourWidgets from "@/app/components/TemplateViews/yourwidgets/YourWidgets";
import Image from "next/image";
import FullScreeIcon from '/public/fullscreen.svg'
>>>>>>> e382fe65f31e4f8c178f89fe534db35d61dc2302

const Page = () => {
  const [activeNavItem, setActiveNavItem] = useState<string>("Designs");
  const [preview, setPreview] = useState("sehb");
  const [cardRadius, setCardRadius] = useState<number>(10);
  const [cardBgColor, setCardBgColor] = useState<string>('#688bc4');
  const [eventNameColor, setEventNameColor] = useState<string>('#000000');
  const [eventNameSize, setEventNameSize] = useState<number>(18);
  const [dateFontSize, setDateFontSize] = useState<number>(15)
  const [locationFontSize, setLocationFontSize] = useState<number>(15)
  const [btnBgColor, setBtnBgColor] = useState<string>('#9968c4');
  const [btnFontColor, setBtnFontColor] = useState<string>('#ffffff');
  const [btnBorderWidth, setBtnBorderWidth] = useState<number>(1);
  const [btnBorderColor, setBtnBorderColor] = useState<string>('#9968c4');
  const [btnRadius, setBtnRadius] = useState<number>(5);
  const [btnFontSize, setBtnFontSize] = useState<number>(15);
  const [bgColor, setBgColor] = useState<string>("#9968c4")
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([])
<<<<<<< HEAD
  // const [multipleWidgetOn, setMultipleWidgetOn] = useState<boolean>(false)
  const [widgetSelected, setWidgetSelected] = useState<string>("");
=======

  const [promotedEventOn, setPromotedEventOn] = useState<boolean>(false);
  const [promotedEventLimit, setPromotedEventLimit] = useState<number>(0);
  // const [multipleWidgetOn, setMultipleWidgetOn] = useState<boolean>(false)
  const [widgetSelected, setWidgetSelected] = useState<string>("");
  const [yourWidgetModal, setYourWidgetModal] = useState<boolean>(false)

  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
>>>>>>> e382fe65f31e4f8c178f89fe534db35d61dc2302

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  // useEffect(() => {
  //   // If multiple widget checkbox is on, we will keep adding the widgets
  //   if (multipleWidgetOn) {
  //     setSelectedWidgets((prevWidgets) => {
  //       // Check if preview is already present in the widgets
  //       if (!prevWidgets.includes(preview)) {
  //         return [...prevWidgets, preview];
  //       }
  //       return prevWidgets;
  //     });
  //   }
  // }, [preview]);
<<<<<<< HEAD

  const handleStep = () => {
    if (activeNavItem === "Designs") {
      setActiveNavItem("BrandKit")
    } else if (activeNavItem === "BrandKit") {
      setActiveNavItem("Filter")
    } else if (activeNavItem === "Filter") {
      setActiveNavItem("Code")
=======
  useEffect(() => {
    // When the preview changes, set the value of promotedEventOn and promotedEventLimit
    if (preview === "phblv" || preview === "phbgv" || preview === "phblgv") {
      setPromotedEventOn(true);
      setPromotedEventLimit(1);
    } else if (preview === "pcslv" || preview === "pcsgv" || preview === "pcslgv") {
      setPromotedEventOn(true);
      setPromotedEventLimit(3);
    } else {
      setPromotedEventOn(false);
      setPromotedEventLimit(0);
>>>>>>> e382fe65f31e4f8c178f89fe534db35d61dc2302
    }
  }

  const handleStep = () => {
    if (activeNavItem === "Designs") {
      setActiveNavItem("BrandKit")
    } else if (activeNavItem === "BrandKit") {
      setActiveNavItem("Filter")
    } else if (activeNavItem === "Filter") {
      setActiveNavItem("Code")
    }
  }

  return (
    <div className={styles.layout}>
      <div className={styles.navbar}>
<<<<<<< HEAD
        <div className={styles.heading}>Add Widget : </div>
        <div
          className={`${styles.navItem} ${activeNavItem === "Designs" ? styles.active : (activeNavItem !== "Designs" ? styles.completed : "")}`}
          onClick={() => handleNavItemClick("Designs")}
        >
          Designs
        </div>
        <div
          className={`${styles.navItem} ${activeNavItem === "BrandKit" ? styles.active : (activeNavItem === "Filter" || activeNavItem === "Code" ? styles.completed : "")}`}
          onClick={() => handleNavItemClick("BrandKit")}
        >
          Brand Kit
        </div>
        <div
          className={`${styles.navItem} ${activeNavItem === "Filter" ? styles.active : (activeNavItem === "Code" ? styles.completed : "")}`}
          onClick={() => handleNavItemClick("Filter")}
        >
          Filter Events
        </div>
        <div
          className={`${styles.navItem} ${activeNavItem === "Code" ? styles.active : ""}`}
          onClick={() => handleNavItemClick("Code")}
        >
          Code
        </div>
        <div></div>
      </div>
      <div className={styles.body}>
        <div className={styles.editWindow}>
=======
        <div className={styles.navLeft}>
          <div className={styles.heading}>Add Widget : </div>
          <div
            className={`${styles.navItem} ${activeNavItem === "Designs" ? styles.active : (activeNavItem !== "Designs" ? styles.completed : "")}`}
            onClick={() => handleNavItemClick("Designs")}
          >
            Designs
          </div>
          <div
            className={`${styles.navItem} ${activeNavItem === "BrandKit" ? styles.active : (activeNavItem === "Filter" || activeNavItem === "Code" ? styles.completed : "")}`}
            onClick={() => handleNavItemClick("BrandKit")}
          >
            Brand Kit
          </div>
          <div
            className={`${styles.navItem} ${activeNavItem === "Filter" ? styles.active : (activeNavItem === "Code" ? styles.completed : "")}`}
            onClick={() => handleNavItemClick("Filter")}
          >
            Filter Events
          </div>
          <div
            className={`${styles.navItem} ${activeNavItem === "Code" ? styles.active : ""}`}
            onClick={() => handleNavItemClick("Code")}
          >
            Code
          </div>
        </div>
        <div className={styles.yourWidgets} onClick={() => setYourWidgetModal(true)}>Your Widgets</div>
      </div>
      <div className={styles.body}>
        {!isFullScreen && <div className={styles.editWindow}>
>>>>>>> e382fe65f31e4f8c178f89fe534db35d61dc2302
          {activeNavItem === "Designs" && <Designs setPreview={setPreview} setWidgetSelected={setWidgetSelected} widgetSelected={widgetSelected} />}
          {activeNavItem === "BrandKit" && <BrandKit
            setDateFontSize={setDateFontSize}
            setLocationFontSize={setLocationFontSize}
            setCardRadius={setCardRadius}
            setCardBgColor={setCardBgColor}
            setEventNameColor={setEventNameColor}
            setEventNameSize={setEventNameSize}
            setBtnBgColor={setBtnBgColor}
            setBtnFontColor={setBtnFontColor}
            setBtnBorderWidth={setBtnBorderWidth}
            setBtnBorderColor={setBtnBorderColor}
            setBtnRadius={setBtnRadius}
            setBtnFontSize={setBtnFontSize} 
            setBgColor={setBgColor} />}
<<<<<<< HEAD
          {activeNavItem === "Filter" && <Filters  />}
          {activeNavItem === "Code" && <CodeWindow widgetId="1524gus" type={"sticky"} />}
        </div>
        <div className={styles.previewWindow}>
=======
          {activeNavItem === "Filter" && <Filters promotedEventLimit={promotedEventLimit} promotedEventOn={promotedEventOn} />}
          {activeNavItem === "Code" && <CodeWindow widgetId="1524gus" type={"sticky"} />}
        </div>}
        <div className={`${styles.previewWindow} ${isFullScreen ? styles.fullPreview :""}`}>
>>>>>>> e382fe65f31e4f8c178f89fe534db35d61dc2302
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
                preview === "sehb" ? <HeroBanner cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                  preview === "megv" ? <GridView cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                    preview === "melv" ? <ListView cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                      preview === "melgv" ? <ListAndGridView /> :
                        preview === "phblv" ? <HeroBannerAndViews type='list' cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                          preview === "phbgv" ? <HeroBannerAndViews type='grid' cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} dateFontSize={dateFontSize} locationFontSize={locationFontSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                            preview === "phblgv" ? <HeroBannerAndViews type='listandgrid' /> :
                              preview === "pcslv" ? <CaraouselAndViews type='list' /> :
                                preview === "pcsgv" ? <CaraouselAndViews type='grid' /> :
                                  preview === "pcslgv" ? <CaraouselAndViews type='listandgrid' /> :
                                    preview === "tscv" ? <CaraouselTop /> :
                                      preview === "tshs" ? <ScrollView type='top' /> :
                                        preview === "lsvs" ?
                                          <ScrollView type='left' /> :
                                          preview === "popup" ? <Popup cardRadius={cardRadius} cardBgColor={cardBgColor} eventNameColor={eventNameColor} eventNameSize={eventNameSize} btnBgColor={btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> : <></>}
          </div>
           <Image src={FullScreeIcon} alt="expand" className={styles.fullScreenIcon} onClick={()=>setIsFullScreen(!isFullScreen)}/>   
        </div>
        <button className={styles.submitBtn} onClick={handleStep} type="button">Next</button>
<<<<<<< HEAD
=======
      </div>
      <div className={`${styles.yourWidgetModal} ${yourWidgetModal ? styles.open : ''}`}>
        <YourWidgets setYourWidgetModal={setYourWidgetModal}/>
>>>>>>> e382fe65f31e4f8c178f89fe534db35d61dc2302
      </div>
    </div>
  );
};

export default Page;
