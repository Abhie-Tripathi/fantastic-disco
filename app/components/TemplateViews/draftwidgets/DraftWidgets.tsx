import React from 'react'
import styles from './draftwidgets.style.module.css'
import WidgetCard from './WidgetCard'
import EmptyCard from './EmptyCard'

interface Props {
  setYourWidgetModal: (value: boolean) => void
  setDraftWidgets: (value: DraftWidgetsType[]) => void
  draftWidgets: DraftWidgetsType[]
  fetchDraftWidgets: () => Promise<void>;
}
type TemplateId = 'ST' | 'SB' | 'HB' | 'GS' | 'LS' | 'HBL' | 'HBG' | 'CVL' | 'CVG' | 'CV' | 'HS' | 'LSR' | 'RSR' | 'PUVP' | 'PUVL';
interface DraftWidgetsType {
  widgetType: string;
  templateId: string;
  widgetId: string;
  status: string;
  eventSize: number;
  widgetStatus: string;
}

const DraftWidgets = ({ setYourWidgetModal, setDraftWidgets, draftWidgets, fetchDraftWidgets }: Props) => {

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <div>Draft Widgets</div>
        <button onClick={() => setYourWidgetModal(false)}>Close</button>
      </div>
      <div className={styles.drafts}>
        <div>Drafts</div><span>{draftWidgets.length}</span>
      </div>
      <div className={styles.line}></div>
      <div className={styles.widgets}>
        {draftWidgets.length > 0 ? (
          draftWidgets.map((card, key) => (
            <div className={styles.widgetCard} key={key}>
              <WidgetCard
                widgetStatus={card.widgetStatus}
                key={key}
                widgetId={card.widgetId}
                templateId={card.templateId as TemplateId}
                widgetType={card.widgetType}
                widgetNumber={1}
                fetchDraftWidgets={fetchDraftWidgets}
                fetchedEventsSize={0}
              />
            </div>
          ))
        ) : (
          <div className={styles.emptyCard}><EmptyCard /></div>
        )}
      </div>
    </div>
  )
}

export default DraftWidgets