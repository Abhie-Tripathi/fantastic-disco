import React from 'react'
import styles from './pop.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import PopupViewImage1 from '/public/widgetimages/popupimages/popupviewportrait.png'
import PopupViewImage2 from '/public/widgetimages/popupimages/popupviewlandscape.png'
import PopupViewImage1Dark from '/public/widgetimages/popupimages/popupviewportraitdark.png'
import PopupViewImage2Dark from '/public/widgetimages/popupimages/popupviewlandscapedark.png'
import { StaticImageData } from 'next/image'

interface Props {
    setSelectedTemplate: (value: string) => void
    selectedTemplate: string;
    setTempelateName : (value : string) => void
    setSelectedImage : (value : StaticImageData) => void
}

const PopupTemplate = ({ setSelectedTemplate, selectedTemplate, setTempelateName, setSelectedImage }: Props) => {
    const PopupTemplates =
        [{ key: "PUVP", name: "Pop-up Portrait", desc: "Use a Pop-Up Widget to capture attention and deliver important messages effectively.", tag: "Multiple Events", image1: PopupViewImage1, image2: PopupViewImage1Dark  },
        { key: "PUVL", name: "Pop-up Landscape", desc: "Use a Pop-Up Widget to capture attention and deliver important messages effectively.", tag: "Multiple Events", image1: PopupViewImage2, image2: PopupViewImage2Dark },
        ]
    return (
        <div className={`${styles.body}`}>
            <div className={styles.templates}>
                {PopupTemplates.map((card, key) => (
                    <TemplateCard setSelectedImage={setSelectedImage} selectedTemplate={selectedTemplate} widgetStyle={card.name} key={key} templateKey={card.key} setSelectedTemplate={setSelectedTemplate} tag={card.tag} desc={card.desc} image1={card.image1} image2={card.image2} setTempelateName={setTempelateName} />
                ))}
            </div>
        </div>
    )
}

export default PopupTemplate