import React, { useEffect, useState } from 'react'
import styles from './dashboardwidgets.style.module.css'
import Errorpage from '@/app/components/TemplateViewsNew/Errorpage'
import WidgetCard from '@/app/components/TemplateViews/draftwidgets/WidgetCard'
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import Link from 'next/link';
import { useWidgetServices } from '@/services/geniservices/widgetService';
import { useRouter } from 'next/navigation';
type TemplateId = 'ST' | 'SB' | 'HB' | 'GS' | 'LS' | 'HBL' | 'HBG' | 'CVL' | 'CVG' | 'CV' | 'HS' | 'LSR' | 'RSR' | 'PUVP' | 'PUVL';
interface DraftWidgetsType {
  widgetType: string;
  templateId: string;
  widgetId: string;
  status: string;
  eventSize: number;
  widgetStatus: string;
}

interface Props {
  setRemoveCalled: (value: boolean) => void
  removeCalled: boolean;
}
const DashboardWidgets = ({ removeCalled, setRemoveCalled }: Props) => {
  const [selectedBtn, setSelectedBtn] = useState<string>("Widgets")
  const [allWidgets, setAllWidgets] = useState<DraftWidgetsType[]>([])
  const [draftWidgets, setDraftWidgets] = useState<DraftWidgetsType[]>([])
  const {getDraftWidget, getOnlyDraftWidget, getActiveWidget, getDeActiveWidget, error} = useWidgetServices();
  // const router = useRouter()
  const handleRoute = (e: any,widgetId:string ) => {
    e.stopPropagation()
    router.push(`/widget/edit/${widgetId}`);
}
  const fetchDraftWidgets = async () => {
    // const { data, error } = await myFetch(`${baseUrl}/widget?status=draft`);
    // if (data) {
    //   const filteredWidgets = data.data
    //     .map((widget: any) => ({
    //       ...widget,
    //       templateId: asciiToString(widget.templatePublicId),
    //       widgetType: widget.type,
    //       widgetId: widget.id,
    //       eventSize: widget.otherdata.event.length,
    //       widgetStatus: "Draft"
    //     }));
    //   setDraftWidgets(filteredWidgets);
    // }
    // if (error) {
    //   console.log(error);
    // }

    const data: any = await getDraftWidget()
    if (data) {
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
    // const { data: activeData, error: activeError } = await myFetch(`${baseUrl}/widget?status=active`);
    // const { data: deactivateData, error: deactivateError } = await myFetch(`${baseUrl}/widget?status=deactivate`);
    // console.log("deactivateData",deactivateData)
    // const activeWidgets = activeData ? activeData.data.map((widget: any) => ({
    //   ...widget,
    //   templateId: asciiToString(widget.templatePublicId),
    //   widgetType: widget.type,
    //   widgetId: widget.id,
    //   eventSize: widget.otherdata.event.length,
    //   widgetStatus: "Active"
    // })) : [];
    // const deactivateWidgets = deactivateData.data.length > 0 ? deactivateData.data.map((widget: any) => ({
    //   ...widget,
    //   templateId: asciiToString(widget.templatePublicId),
    //   widgetType: widget.type,
    //   widgetId: widget.id,
    //   eventSize: widget.otherdata.event.length,
    //   widgetStatus: "Inactive"
    // })) : [];
    // const combinedWidgets = [...activeWidgets, ...deactivateWidgets]
    // setAllWidgets(combinedWidgets);

    const activeData: any = await getActiveWidget();
    const deactivateData: any = await getDeActiveWidget();
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

  const router = useRouter()
  
  const handleNavigate = (type: string) => {
    if (type === "draft") {
      router.push('/widget/list?fromDashboard=true'); // Pass query parameter
    } else router.push('/widget/list'); // Pass query parameter

  };
 
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
              <div className={styles.widgetCard} key={key} onClick={(e) => handleRoute(e,card.widgetId)}>
                <WidgetCard
                  removeCalled={removeCalled}
                  setRemoveCalled={setRemoveCalled}
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
              {draftWidgets.slice(0, 2).map((card, key) => (
                <div className={styles.widgetCard} key={key}>
                  <WidgetCard
                    removeCalled={removeCalled}
                    setRemoveCalled={setRemoveCalled}
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
      {((selectedBtn === "Widgets" && allWidgets.length > 0) || (selectedBtn === "Drafts" && draftWidgets.length > 0)) && <button className={styles.allWidgetBtn} onClick={() => handleNavigate(selectedBtn === "Drafts" ? "draft" : "main")}>Show all widgets</button>}
    </div>
  )
}

export default DashboardWidgets