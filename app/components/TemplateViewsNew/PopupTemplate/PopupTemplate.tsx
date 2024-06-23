import React, { useState } from 'react'
import styles from './pop.style.module.css'
import TemplateCard from '../TemplatesPreview/TemplateCard'
import PopupViewImage from '/public/widgetimages/popupimages/popupview.png'

const PopupTemplate = () => {
    return (
        <div className={`${styles.body}`}>
            <TemplateCard widgetStyle="Pop-up" tag="Single Event" desc="Use a Pop-Up Widget to capture attention and deliver important messages effectively" image={PopupViewImage} />
        </div>
    )
}

export default PopupTemplate