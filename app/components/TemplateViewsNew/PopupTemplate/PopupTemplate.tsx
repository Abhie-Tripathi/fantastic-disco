import React from 'react'
import styles from './pop.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import PopupViewImage1 from '/public/widgetimages/popupimages/popupviewportrait.png'
import PopupViewImage2 from '/public/widgetimages/popupimages/popupviewlandscape.png'

interface Props {
    setSelectedTemplate: (value: string) => void
}

const PopupTemplate = ({ setSelectedTemplate }: Props) => {
    const PopupTemplates =
        [{ key: "PUVP", name: "Pop-up Portrait", desc: "Use a Pop-Up Widget to capture attention and deliver important messages effectively.", tag: "Single Event", image: PopupViewImage1 },
        { key: "PUVL", name: "Pop-up Landscape", desc: "Use a Pop-Up Widget to capture attention and deliver important messages effectively.", tag: "Single Event", image: PopupViewImage2 },
        ]
    return (
        <div className={`${styles.body}`}>
            <div className={styles.templates}>
                {PopupTemplates.map((card, key) => (
                    <TemplateCard widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image={card.image} />
                ))}
            </div>
        </div>
    )
}

export default PopupTemplate