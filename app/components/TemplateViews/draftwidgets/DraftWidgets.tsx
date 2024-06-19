import React, { useState } from 'react'
import styles from './draftwidgets.style.module.css'
import WidgetCard from './WidgetCard'

interface Props {
  setYourWidgetModal: (value: boolean) => void
  draftWidgets: DraftWidget[];
}

interface DraftWidget {
  widgetType: string;
  preview: string;
}

const DraftWidgets = ({ setYourWidgetModal, draftWidgets }: Props) => {

  return (
    <div className={styles.body}>
      <div className={styles.heading_btnContainer}>
        <div className={styles.heading}>Saved Drafts</div>
        <div className={styles.closeBtn} onClick={() => (setYourWidgetModal(false))}>{`>>`}</div>
      </div>

      {draftWidgets.length === 0 && <div className={styles.emptyMessage}>
        No widgets added to Draft.
        <br/>Save a widget to draft to see here
      </div>}
      <div className={styles.widgets}>
        {draftWidgets.map((widget, key) => (
          <WidgetCard status='Events Not Added' statusIcon="yellow" widgetType={widget.widgetType} key={key} />
        ))}
      </div>

    </div>
  )
}

export default DraftWidgets