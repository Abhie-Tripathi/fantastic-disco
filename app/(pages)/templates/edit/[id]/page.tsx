'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import { ParsedUrlQuery } from 'querystring';
import StickyPreview from '@/app/components/TemplateViews/previews/sticky/StickyPreview'
import HeroBanner from '@/app/components/TemplateViews/previews/page/MultipleEvents/HeroBanner'
import GridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/GridView'
import ListView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListView'
import ListAndGridView from '@/app/components/TemplateViews/previews/page/MultipleEvents/ListAndGridView'
import HeroBannerAndViews from '@/app/components/TemplateViews/previews/page/SinglePromotedAndEvents/HeroBannerAndViews'
import CaraouselAndViews from '@/app/components/TemplateViews/previews/page/MultipleHighlightedEvents/CaraouselAndViews'
import CaraouselTop from '@/app/components/TemplateViews/previews/section/CaraouselTop'
import ScrollView from '@/app/components/TemplateViews/previews/section/ScrollView'
import EditSettings from '@/app/components/TemplateViews/edit/EditSettings';

interface Props {
  params: ParsedUrlQuery;
}

const Page = ({ params }: Props) => {

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
  return (
    <div className={styles.body}>
      <div className={styles.editSettings}>
        <EditSettings
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
          setBtnFontSize = {setBtnFontSize}
          setBgColor={setBgColor}
        />
      </div>
      <div className={styles.previewContainer}>
        <div>Preview</div>
        {params.id === "stickytop" ? <StickyPreview type="top" /> :
          params.id === "stickydown" ? <StickyPreview type="down" /> :
            params.id === "sehb" ? <HeroBanner cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}  /> :
              params.id === "megv" ? <GridView cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize} /> :
                params.id === "melv" ? <ListView cardRadius = {cardRadius} cardBgColor = {cardBgColor} eventNameColor = {eventNameColor} eventNameSize = {eventNameSize} dateFontSize ={dateFontSize} locationFontSize={locationFontSize} btnBgColor = {btnBgColor} btnFontColor={btnFontColor} btnBorderWidth={btnBorderWidth} btnBorderColor={btnBorderColor} btnRadius={btnRadius} btnFontSize={btnFontSize}/> :
                  params.id === "melgv" ? <ListAndGridView /> :
                    params.id === "phblv" ? <HeroBannerAndViews type='list' /> :
                      params.id === "phbgv" ? <HeroBannerAndViews type='grid' /> :
                        params.id === "phblgv" ? <HeroBannerAndViews type='listandgrid' /> :
                          params.id === "pcslv" ? <CaraouselAndViews type='list' /> :
                            params.id === "pcsgv" ? <CaraouselAndViews type='grid' /> :
                              params.id === "pcslgv" ? <CaraouselAndViews type='listandgrid' /> :
                                params.id === "tscv" ? <CaraouselTop /> :
                                  params.id === "tshs" ? <ScrollView type='top' /> :
                                    params.id === "lsvs" ? <ScrollView type='left' /> : <></>}
      </div>

    </div>
  )
}

export default Page