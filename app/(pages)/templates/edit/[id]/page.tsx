'use client'
import React from 'react'
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

  return (
    <div className={styles.body}>
      <div className={styles.editSettings}>
        <EditSettings/>
      </div>
      <div className={styles.preview}>
        <div>Preview</div>
        {params.id === "stickytop" ? <StickyPreview type="top" /> :
          params.id === "stickydown" ? <StickyPreview type="down" /> :
          params.id === "sehb" ? <HeroBanner /> :
            params.id === "megv" ? <GridView /> :
            params.id === "melv" ? <ListView /> :
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