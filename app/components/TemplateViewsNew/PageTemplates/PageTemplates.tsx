import React, { useState } from 'react'
import styles from './pagetemplates.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import ListViewImage from '/public/widgetimages/pageimages/listview.png'
import GridViewImage from '/public/widgetimages/pageimages/gridview.png'
import CarouselGridImage from '/public/widgetimages/pageimages/CarouselGrid.png'
import CarouselListImage from '/public/widgetimages/pageimages/CarouselList.png'
import HeroGridViewImage from '/public/widgetimages/pageimages/HeroGridView.png'
import HeroListViewImage from '/public/widgetimages/pageimages/HeroListView.png'
import ListViewImageDark from '/public/widgetimages/pageimages/listviewdark.png'
import GridViewImageDark from '/public/widgetimages/pageimages/gridviewdark.png'
import CarouselGridImageDark from '/public/widgetimages/pageimages/CarouselGridDark.png'
import CarouselListImageDark from '/public/widgetimages/pageimages/CarouselListDark.png'
import HeroGridViewImageDark from '/public/widgetimages/pageimages/HeroGridViewDark.png'
import HeroListViewImageDark from '/public/widgetimages/pageimages/HeroListViewDark.png'
import { StaticImageData } from 'next/image'

interface Props {
    setSelectedTemplate: (value: string) => void
    selectedTemplate: string;
    setTempelateName: (value: string) => void
    setSelectedImage: (value: StaticImageData) => void
    activeBtn: string;
    setActiveBtn: (value: string) => void
}

const PageTemplates = ({ setSelectedTemplate, selectedTemplate, setTempelateName, setSelectedImage, activeBtn, setActiveBtn }: Props) => {

    const NonHighlightedTemplates =
        [
            { key: "GS", name: "Grid Style", desc: "Display Multiple Events as a Grid View for a clear and organized presentation.", tag: "Multiple Events", image1: GridViewImage, image2: GridViewImageDark },
            { key: "LS", name: "List Style", desc: "Present Multiple Events as a List View for a streamlined, easy-to-read schedule display.", tag: "Multiple Events", image1: ListViewImage, image2: ListViewImageDark }
        ]
    const HighlightedTemplates =
        [
            // { key: "HBL", name: "Hero Banner & List", desc: "Highlight one Event as a Hero Banner with a List of Events for comprehensive visibility.", tag: "Multiple Events", image1: HeroListViewImage, image2: HeroListViewImageDark },
            // { key: "HBG", name: "Hero Banner & Grids", desc: "Highlight one Event as a Hero Banner with a grid of Events for comprehensive visibility.", tag: "Multiple Events", image1: HeroGridViewImage, image2: HeroGridViewImageDark },
            { key: "CVL", name: "Carousel & List Style", desc: "Present Multiple Events as a List View for a streamlined, easy-to-read schedule display.", tag: "Multiple Events", image1: CarouselListImage, image2: CarouselListImageDark },
            { key: "CVG", name: "Carousel & Grid Style", desc: "Present Multiple Events as a Grid View for a streamlined, easy-to-read schedule display.", tag: "Multiple Events", image1: CarouselGridImage, image2: CarouselGridImageDark }
        ]
    return (
        <div className={styles.body}>
            <div className={styles.btnContainer}>
                <button className={`${styles.btn} ${activeBtn === "Highlighted" ? styles.activeBtn : ""}`} onClick={() => setActiveBtn("Highlighted")}>Highlighted Event Styles</button>
                <button className={`${styles.btn} ${activeBtn === "NonHighlighted" ? styles.activeBtn : ""}`} onClick={() => setActiveBtn("NonHighlighted")}>Non-Highlighted Event Styles</button>
            </div>
            <div className={styles.templates}>
                {activeBtn === "NonHighlighted" ? (
                    NonHighlightedTemplates.map((card, key) => (
                        <TemplateCard setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image1={card.image1} image2={card.image2} setTempelateName={setTempelateName} />
                    ))) : (
                    HighlightedTemplates.map((card, key) => (
                        <TemplateCard setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image1={card.image1} image2={card.image2} setTempelateName={setTempelateName} />
                    ))
                )
                }
            </div>
        </div>
    )
}

export default PageTemplates