import React from 'react'
import styles from './sectiontemplates.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import CarouselViewImage from '/public/widgetimages/sectionimages/carouselview.png'
import HorizontalScrollImage from '/public/widgetimages/sectionimages/horizontalscroll.png'
import LeftScrollImage from '/public/widgetimages/sectionimages/leftscroll.png'
import RightScrollImage from '/public/widgetimages/sectionimages/rightscroll.png'

interface Props{
    setSelectedTemplate : (value : string) => void
}

const SectionTemplates = ({setSelectedTemplate} : Props) => {
    const SectionTemplates =
        [{ key: "CV", name: "Carousel Section", desc: "Feature the Top Section of your page in a Carousel View for a dynamic display.", tag: "Multiple Events", image: CarouselViewImage },
        { key: "HS", name: "Scroll section", desc: "Display a Section of your page with a Horizontal Scroll for easy, interactive navigation.", tag: "Multiple Events", image: HorizontalScrollImage },
        { key: "LScroll", name: "Left Section", desc: "Present the Left Section of your page with a Vertical Scroll for smooth, intuitive browsing.", tag: "Multiple Events", image: LeftScrollImage },
        { key: "RScroll", name: "Right Section", desc: "Present the Right Section of your page with a Vertical Scroll for smooth, intuitive browsing.", tag: "Multiple Events", image: RightScrollImage }
        ]
    return (
        <div className={`${styles.body}`}>
            <div className={styles.templates}>
                {SectionTemplates.map((card, key) => (
                    <TemplateCard widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image={card.image} />))}
            </div>
        </div>
    )
}

export default SectionTemplates