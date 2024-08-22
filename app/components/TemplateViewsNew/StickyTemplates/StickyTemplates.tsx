import React from 'react'
import styles from './stickytemplates.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import StickyTopImage from '/public/widgetimages/stickyimages/stickytop.png'
import StickyBottomImage from '/public/widgetimages/stickyimages/stickybottom.png'
import StickyTopImageDark from '/public/widgetimages/stickyimages/stickytopdark.png'
import StickyBottomImageDark from '/public/widgetimages/stickyimages/stickybottomdark.png'
import { StaticImageData } from 'next/image'

interface Props{
    setSelectedTemplate : (value : string) => void
    selectedTemplate : string;
    setTempelateName : (value : string) => void
    setSelectedImage : (value : StaticImageData) => void
}

const StickyTemplates = ({setSelectedTemplate, selectedTemplate, setTempelateName, setSelectedImage} : Props) => {

    const StickyTemplates =
        [{ key: "ST", name: "Sticky Top", desc: "Implement a Sticky Top Widget to keep essential information always visible and accessible.", tag: "Single Event", image1: StickyTopImage,image2: StickyTopImageDark },
        // { key: "SB", name: "Sticky Bottom", desc: "Implement a Sticky Top Widget to keep essential information always visible and accessible.", tag: "Single Event", image1: StickyBottomImage, image2: StickyBottomImageDark },
        ]
    return (
        <div className={`${styles.body}`}>
            <div className={styles.templates}>
                {StickyTemplates.map((card, key) => (
                    <TemplateCard setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image1={card.image1} image2={card.image2} setTempelateName={setTempelateName}/>
                ))}
            </div>
        </div>
    )
}

export default StickyTemplates