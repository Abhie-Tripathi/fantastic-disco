import React from 'react'
import styles from './stickytemplates.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import StickyTopImage from '/public/widgetimages/stickyimages/stickytop.png'
import StickyBottomImage from '/public/widgetimages/stickyimages/stickybottom.png'

interface Props{
    setSelectedTemplate : (value : string) => void
}

const StickyTemplates = ({setSelectedTemplate} : Props) => {

    const StickyTemplates =
        [{ key: "ST", name: "Sticky Top", desc: "Implement a Sticky Top Widget to keep essential information always visible and accessible.", tag: "Single Event", image: StickyTopImage },
        { key: "SB", name: "Sticky Bottom", desc: "Implement a Sticky Top Widget to keep essential information always visible and accessible.", tag: "Single Event", image: StickyBottomImage },
        ]
    return (
        <div className={`${styles.body}`}>
            <div className={styles.templates}>
                {StickyTemplates.map((card, key) => (
                    <TemplateCard widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image={card.image} />
                ))}
            </div>
        </div>
    )
}

export default StickyTemplates