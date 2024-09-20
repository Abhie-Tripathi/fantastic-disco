import React, { useEffect, useState } from 'react'
import styles from './dashboardwidgets.style.module.css'
import Errorpage from '@/app/components/TemplateViewsNew/Errorpage'
import WidgetCard from '@/app/components/TemplateViews/draftwidgets/WidgetCard'
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import Link from 'next/link';

type TemplateId = 'ST' | 'SB' | 'HB' | 'GS' | 'LS' | 'HBL' | 'HBG' | 'CVL' | 'CVG' | 'CV' | 'HS' | 'LSR' | 'RSR' | 'PUVP' | 'PUVL';
interface DraftWidgetsType {
  widgetType: string;
  templateId: string;
  widgetId: string;
  status: string;
  eventSize: number;
  widgetStatus: string;
}

const DashboardWidgets = () => {
  const [selectedBtn, setSelectedBtn] = useState<string>("Widgets")
  const [allWidgets, setAllWidgets] = useState<DraftWidgetsType[]>([])
  const [draftWidgets, setDraftWidgets] = useState<DraftWidgetsType[]>([])

  const fetchDraftWidgets = async () => {
    const { data, error } = await myFetch(`${baseUrl}/widget?status=draft`);
    if (data) {
      console.log(data);
      const filteredWidgets = data.data
        .map((widget: any) => ({
          ...widget,
          templateId: asciiToString(widget.templatePublicId),
          widgetType: widget.type,
          widgetId: widget.id,
          eventSize: widget.otherdata.event.length,
          widgetStatus: "Draft"
        }));
      setDraftWidgets(filteredWidgets);
    }
    if (error) {
      console.log(error);
    }
  };
  const asciiToString = (ascii: number): string => {
    let convertedValue = ascii.toString();
    let str = '';
    for (let i = 0; i < convertedValue.length; i += 2) {
      const code = convertedValue.substring(i, i + 2);
      str += String.fromCharCode(parseInt(code, 10));
    }
    return str;
  };
  const fetchAllWidgets = async () => {
    const { data: activeData, error: activeError } = await myFetch(`${baseUrl}/widget?status=active`);
    const { data: deactivateData, error: deactivateError } = await myFetch(`${baseUrl}/widget?status=deactivate`);
    const activeWidgets = activeData ? activeData.data.map((widget: any) => ({
      ...widget,
      templateId: asciiToString(widget.templatePublicId),
      widgetType: widget.type,
      widgetId: widget.id,
      eventSize: widget.otherdata.event.length,
      widgetStatus: "Active"
    })) : [];
    const deactivateWidgets = deactivateData.data.length > 0 ? deactivateData.data.map((widget: any) => ({
      ...widget,
      templateId: asciiToString(widget.templatePublicId),
      widgetType: widget.type,
      widgetId: widget.id,
      eventSize: widget.otherdata.event.length,
      widgetStatus: "Inactive"
    })) : [];
    const combinedWidgets = [...activeWidgets, ...deactivateWidgets]
    setAllWidgets(combinedWidgets);

  }
  useEffect(() => {
    fetchDraftWidgets()
    fetchAllWidgets()
  }, [])
  return (
    <div className={styles.body}>
      <div className={styles.btnContainer}>
        <button className={`${styles.btn} ${selectedBtn === "Widgets" ? styles.selectedBtn : ""}`} onClick={() => setSelectedBtn("Widgets")}>
          <span>Widgets</span>
          <span className={`${styles.count} ${selectedBtn === "Widgets" ? styles.selectedCount : ""}`}>{allWidgets.length}</span>
        </button>
        <button className={`${styles.btn} ${selectedBtn === "Drafts" ? styles.selectedBtn : ""}`} onClick={() => setSelectedBtn("Drafts")}>
          <span>Drafts</span>
          <span className={`${styles.count} ${selectedBtn === "Drafts" ? styles.selectedCount : ""}`}>{draftWidgets.length}</span>
        </button>
      </div>
      <div className={styles.addWidget}><span>Want to create a new widget?</span><Link href={"/widget/add"}>Create a new widget</Link></div>
      {selectedBtn === "Widgets" ? <div className={styles.allWidgetContainer}>
        {allWidgets.length > 0 ?
          <div className={styles.widgetList}>
            {allWidgets.slice(0, 2).map((card, key) => (
              <div className={styles.widgetCard} key={key}>
                <WidgetCard
                  widgetStatus={card.widgetStatus}
                  key={key}
                  widgetId={card.widgetId}
                  templateId={card.templateId as TemplateId}
                  widgetType={card.widgetType}
                  widgetNumber={1}
                  fetchDraftWidgets={fetchDraftWidgets}
                  fetchedEventsSize={card.eventSize}
                  fetchAllWidgets={fetchAllWidgets}
                />
              </div>
            ))}
          </div> : <Errorpage size='short' type='list' />}
      </div> :
        <div className={styles.draftWidgetsContainer}>
          {draftWidgets.length > 0 ?
            <div className={styles.widgetList}>
              {draftWidgets.slice(0,2).map((card, key) => (
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
              ))}
            </div> : <Errorpage size='short' type='list' />}
        </div>}
        <Link href={"/widget/list"} className={styles.allWidgetBtn}>Show all widgets</Link>
    </div>
  )
}

export default DashboardWidgets