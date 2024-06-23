import React, { useState } from 'react'
import styles from './pagetemplates.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import HeroBannerImage from '/public/widgetimages/pageimages/herobanner.png'
import ListViewImage from '/public/widgetimages/pageimages/listview.png'
import GridViewImage from '/public/widgetimages/pageimages/gridview.png'
import CarouselGridImage from '/public/widgetimages/pageimages/CarouselGrid.png'
import CarouselListImage from '/public/widgetimages/pageimages/CarouselList.png'
import HeroGridViewImage from '/public/widgetimages/pageimages/HeroGridView.png'
import HeroListViewImage from '/public/widgetimages/pageimages/HeroListView.png'

const PageTemplates = () => {

    const [activeBtn, setActiveBtn] = useState<string>("NonHighlighted")
    const NonHighlightedTemplates =
        [{ key: "HB", name: "Hero Banner", desc: "Hero Banner to captivate your audience with a stunning, prominent display", tag: "Single Event", image : HeroBannerImage },
        { key: "GS", name: "Grid Style", desc: "Display Multiple Events as a Grid View for a clear and organized presentation .", tag: "Multiple Events", image : GridViewImage },
        { key: "LS", name: "List Style", desc: "Present Multiple Events as a List View for a streamlined, easy-to-read schedule display.", tag: "Multiple Events", image : ListViewImage }
        ]
    const HighlightedTemplates =
        [{ key: "HBL", name: "Hero Banner & List", desc: "Highlight one Event as a Hero Banner with a List of Events for comprehensive visibility.", tag: "Multiple Events", image : HeroListViewImage },
        { key: "HBG", name: "Hero Banner & Grids", desc: "Highlight one Event as a Hero Banner with a grid of Events for comprehensive visibility.", tag: "Multiple Events", image : HeroGridViewImage },
        { key: "CVL", name: "Carousel & List Style", desc: "Present Multiple Events as a List View for a streamlined, easy-to-read schedule display.", tag: "Multiple Events",image : CarouselListImage },
        { key: "CVG", name: "Carousel & Grid Style", desc: "Present Multiple Events as a Grid View for a streamlined, easy-to-read schedule display.", tag: "Multiple Events", image : CarouselGridImage }
        ]
    return (
        <div className={`${styles.body}`}>
            <div className={styles.btnContainer}>
                <button className={`${styles.btn} ${activeBtn === "Highlighted" ? styles.activeBtn : ""}`} onClick={() => setActiveBtn("Highlighted")}>Highlighted Event Styles</button>
                <button className={`${styles.btn} ${activeBtn === "NonHighlighted" ? styles.activeBtn : ""}`} onClick={() => setActiveBtn("NonHighlighted")}>Non-Highlighted Event Styles</button>
            </div>
            <div className={styles.templates}>
                {activeBtn === "NonHighlighted" ? (
                    NonHighlightedTemplates.map((card, key) => (
                        <TemplateCard widgetStyle={card.name} key={key} tag={card.tag} desc={card.desc} image={card.image} />
                    ))) : (
                    HighlightedTemplates.map((card, key) => (
                        <TemplateCard widgetStyle={card.name} key={key} tag={card.tag} desc={card.desc} image={card.image}/>
                    ))
                )
                }
            </div>
        </div>
    )
}

export default PageTemplates