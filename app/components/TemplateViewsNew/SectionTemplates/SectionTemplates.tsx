import React from 'react'
import styles from './sectiontemplates.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import CarouselViewImage from '/public/widgetimages/sectionimages/carouselview.png'
import HorizontalScrollImage from '/public/widgetimages/sectionimages/horizontalscroll.png'
import LeftScrollImage from '/public/widgetimages/sectionimages/leftscroll.png'
import RightScrollImage from '/public/widgetimages/sectionimages/rightscroll.png'
import HeroBannerImage from '/public/widgetimages/pageimages/herobanner.png'
import CarouselViewImageDark from '/public/widgetimages/sectionimages/carouselviewdark.png'
import HorizontalScrollImageDark from '/public/widgetimages/sectionimages/horizontalscrolldark.png'
import LeftScrollImageDark from '/public/widgetimages/sectionimages/leftscrolldark.png'
import RightScrollImageDark from '/public/widgetimages/sectionimages/rightscrolldark.png'
import HeroBannerImageDark from '/public/widgetimages/pageimages/herobannerdark.png'
import { StaticImageData } from 'next/image'


interface Props {
    setSelectedTemplate: (value: string) => void
    selectedTemplate: string;
    setTempelateName: (value: string) => void
    setSelectedImage: (value: StaticImageData) => void
}

const SectionTemplates = ({ setSelectedTemplate, selectedTemplate, setTempelateName, setSelectedImage }: Props) => {
    const SectionTemplates =
        [
            // { key: "HB", name: "Hero Banner", desc: "Hero Banner to captivate your audience with a stunning, prominent display", tag: "Single Event", image1: HeroBannerImage, image2: HeroBannerImageDark },
            { key: "CV", name: "Carousel Section", desc: "Feature the Top Section of your page in a Carousel View for a dynamic display.", tag: "Multiple Events", image1: CarouselViewImage, image2: CarouselViewImageDark },
            { key: "HS", name: "Horizontal Section", desc: "Display a Section of your page with a Horizontal Scroll for easy, interactive navigation.", tag: "Multiple Events", image1: HorizontalScrollImage, image2: HorizontalScrollImageDark },
            { key: "LSR", name: "Vertical Section", desc: "Present the Left Section of your page with a Vertical Scroll for smooth, intuitive browsing.", tag: "Multiple Events", image1: LeftScrollImage, image2: LeftScrollImageDark },
            // { key: "RSR", name: "Right Section", desc: "Present the Right Section of your page with a Vertical Scroll for smooth, intuitive browsing.", tag: "Multiple Events", image1: RightScrollImage, image2 : RightScrollImageDark }
        ]
    return (
        <div className={`${styles.body}`}>
            <div className={styles.templates}>
                {SectionTemplates.map((card, key) => (
                    <TemplateCard setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image1={card.image1} image2={card.image2} setTempelateName={setTempelateName} />))}
            </div>
        </div>
    )
}

export default SectionTemplates