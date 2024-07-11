import React, { useState, useEffect } from 'react'
import styles from './draftwidgets.style.module.css'
import WidgetCard from './WidgetCard'
import CarouselViewImage from '/public/widgetimages/sectionimages/carouselview.png'


interface Props {
  setYourWidgetModal: (value: boolean) => void
}

const DraftWidgets = ({ setYourWidgetModal }: Props) => {

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div>My Widgets</div>
        <button onClick={()=>setYourWidgetModal(false)}>Close</button>
      </div>
      <div className={styles.drafts}>
        <div>Drafts</div><span>4</span></div>
      <div className={styles.line}></div>
      <WidgetCard image={CarouselViewImage} widgetTemplate='Carousel Section' widgetType='Sticky' widgetNumber={1}/>
    </div>
  )
}

export default DraftWidgets