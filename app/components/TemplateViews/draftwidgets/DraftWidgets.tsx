import React from 'react'
import styles from './draftwidgets.style.module.css'
import WidgetCard from './WidgetCard'
import { StaticImageData } from 'next/image'

interface Props {
  setYourWidgetModal: (value: boolean) => void
  draftWidgets: DraftWidgetsType[]
}
interface DraftWidgetsType {
  widgetType: string;
  widgetTemplateName: string;
  selectedImage : StaticImageData
}


const DraftWidgets = ({ setYourWidgetModal, draftWidgets }: Props) => {

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div>My Widgets</div>
        <button onClick={() => setYourWidgetModal(false)}>Close</button>
      </div>
      <div className={styles.drafts}>
        <div>Drafts</div><span>{draftWidgets.length}</span></div>
      <div className={styles.line}></div>
      <div className={styles.widgets}>
        {draftWidgets && draftWidgets.map((card, key) => (
          <WidgetCard image={card.selectedImage} widgetTemplate={card.widgetTemplateName} widgetType={card.widgetType}
          key={key} widgetNumber={1} />
        ))}
      </div>
    </div>
  )
}

export default DraftWidgets