import React, { useEffect, useState } from 'react'
import styles from './draftwidgets.style.module.css'
import WidgetCard from './WidgetCard'
import { StaticImageData } from 'next/image'
import EmptyCard from './EmptyCard'
import { baseUrl } from '@/constants'
import { myFetch } from '@/utils/myFetch'

interface Props {
  setYourWidgetModal: (value: boolean) => void
  setDraftWidgets: (value: DraftWidgetsType[]) => void
  draftWidgets: DraftWidgetsType[]
}
type TemplateId = 'ST' | 'SB' | 'HB' | 'GS' | 'LS' | 'HBL' | 'HBG' | 'CVL' | 'CVG' | 'CV' | 'HS' | 'LSR' | 'RSR' | 'PUVP' | 'PUVL';
interface DraftWidgetsType {
  widgetType: string;
  templateId: string;
  widgetId: string;
  status: string;
}

const DraftWidgets = ({ setYourWidgetModal, setDraftWidgets, draftWidgets }: Props) => {

  const [widgets, setWidgets] = useState<DraftWidgetsType[]>([]);

  const fetchWidgets = async () => {
    const {data, error} = await myFetch(`${baseUrl}/widget`);
    if(data){
      console.log(data)
    }
    if(error){
      console.log(error)
    }
    return data;
  };

  //Converting back the template id to characters
  const asciiToString = (ascii: number): string => {
    let convertedValue = ascii.toString()
    let str = '';
    for (let i = 0; i < convertedValue.length; i += 2) {
        const code = convertedValue.substring(i, i + 2);
        str += String.fromCharCode(parseInt(code, 10));
    }
    return str;
};


  useEffect(() => {
    const fetchAndSetWidgets = async () => {
      try {
        const data = await fetchWidgets();
        // Filter widgets with status "draft" and convert template IDs
        const filteredWidgets = data.data.filter((widget: any) => widget.status === "draft")
          .map((widget: any) => ({
            ...widget,
            templateId: asciiToString(widget.templatePublicId),
            widgetType : widget.type,
            widgetId :  widget.id
            
          }));
        setWidgets(filteredWidgets);
        setDraftWidgets(filteredWidgets);
      } catch (error) {
        console.error("Error fetching widgets:", error);
      }
    };

    fetchAndSetWidgets();
  }, [setDraftWidgets]);

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
        {widgets.length > 0 ? (
          widgets.map((card,key) => (
            <WidgetCard
              key={key}
              widgetId = {card.widgetId}
              templateId={card.templateId as TemplateId}
              widgetType={card.widgetType}
              widgetNumber={1}
            />
          ))
        ) : (
          <div className={styles.emptyCard}><EmptyCard /></div>
        )}
      </div>
    </div>
  )
}

export default DraftWidgets