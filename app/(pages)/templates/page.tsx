"use client";
import React, { useState } from "react";
import styles from './page.style.module.css';
import Designs from "@/app/components/TemplateViews/designs/Designs";
import BrandKit from "@/app/components/TemplateViews/brandkit/BrandKit";
import GeneratePalette from "@/app/components/TemplateViews/palette/Palette";
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '@/app/components/TemplateViews/previews/page/MultipleEvents/HeroBanner'
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import ListAndGridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListAndGridView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import CaraouselTop from '@/app/components/TemplateViews/previews/section/CaraouselTop'
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'

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

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.navbar}>
        <div
          className={`${styles.navItem} ${activeNavItem === "Designs" ? styles.active : ""}`}
          onClick={() => handleNavItemClick("Designs")}
        >
          Designs
        </div>
        <div
          className={`${styles.navItem} ${activeNavItem === "BrandKit" ? styles.active : ""}`}
          onClick={() => handleNavItemClick("BrandKit")}
        >
          Brand Kit
        </div>
        <div
          className={`${styles.navItem} ${activeNavItem === "Palette" ? styles.active : ""}`}
          onClick={() => handleNavItemClick("Palette")}
        >
          Generate Palette
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.editWindow}>
          {activeNavItem === "Designs" && <Designs setPreview={setPreview} />}
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
          {activeNavItem === "Palette" && <GeneratePalette />}
        </div>
        <div className={styles.previewWindow}>
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
                                        preview === "lsvs" ? "Left Section Veritcal Scroll view" : ""}
          </div>
          <div className={styles.preview}>
            {preview === "stickytop" ? <StickyPreview type="top" /> :
              preview === "stickydown" ? <StickyPreview type="down" /> :
                preview === "sehb" ? <HeroBanner cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
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
                                          <ScrollView type='left' /> : <></>}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;
