"use client"
import React, { useState, useEffect } from 'react'
import WidgetCard from '@/app/components/TemplateViews/draftwidgets/WidgetCard'
import More from '/public/more_horiz.svg'
import styles from './page.style.module.css'
import SkeletonWidget from '@/app/components/widgets/SkeletonWidget'
import { useTheme } from '@/context'
import DraftWidgets from "@/app/components/TemplateViews/draftwidgets/DraftWidgets";
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/constants';
import useOutsideClick from '@/hooks/useOutsideClick'
import { useRouter } from 'next/navigation'
import { ButtonSettingsState } from '@/types/buttoncustomizetypes'
import PreviewWindow from '@/app/components/TemplateViewsNew/TemplatesPreview/PreviewWindow'
import { AddedEventsType } from '@/types/addedeventtype'

type TemplateId = 'ST' | 'SB' | 'HB' | 'GS' | 'LS' | 'HBL' | 'HBG' | 'CVL' | 'CVG' | 'CV' | 'HS' | 'LSR' | 'RSR' | 'PUVP' | 'PUVL';
interface DraftWidgetsType {
  widgetType: string;
  templateId: string;
  widgetId: string;
  status: string;
}
const Widget = () => {
  const [draftWidgetModal, setDraftWidgetModal] = useState<boolean>(false)
  const [draftWidgets, setDraftWidgets] = useState<DraftWidgetsType[]>([])
  const [allWidgets, setAllWidgets] = useState<DraftWidgetsType[]>([])
  const [cardBgColor, setCardBgColor] = useState<string>("#d4d4d4");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(20);
  const [fontSettings, setFontSettings] = useState({
    heading: { fontFamily: "arial", fontSize: 24, fontColor: "#000000", fontWeight: "bolder" },
    subheading: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "normal" },
    body: { fontFamily: "arial", fontSize: 12, fontColor: "#000000", fontWeight: "normal" }
  });
  const [buttonSettings, setButtonSettings] = useState<ButtonSettingsState>({
    primary: { buttonColor: "#0072F5", fontColor: "#000000", borderRadius: 4, borderColor: "#0072F5", buttonText: "Meet Us" },
    secondary: { fontColor: "#000000", borderRadius: 4, borderColor: "#6750a4", buttonText: "Meet Us" }
  })

  const [cardStyle, setCardStyle] = useState<string>("style1")
  const [selectedBtn, setSelectedBtn] = useState<"primary" | "secondary">("primary");
  const [selectedTemplate, setSelectedTemplate] = useState<string>()
  const dropdownRef = useOutsideClick(() => setDraftWidgetModal(false))
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [fetchedAddedEvents, setfetchedAddedEvents] = useState<AddedEventsType[]>([])
  const [selectedWidgetId, setWidgetId] = useState<string>("")
  const router = useRouter()

  const asciiToString = (ascii: number): string => {
    let convertedValue = ascii.toString();
    let str = '';
    for (let i = 0; i < convertedValue.length; i += 2) {
      const code = convertedValue.substring(i, i + 2);
      str += String.fromCharCode(parseInt(code, 10));
    }
    return str;
  };

  const fetchDraftWidgets = async () => {
    const { data, error } = await myFetch(`${baseUrl}/widget?status=draft`);
    if (data) {
      console.log(data);
      const filteredWidgets = data.data
        .map((widget: any) => ({
          ...widget,
          templateId: asciiToString(widget.templatePublicId),
          widgetType: widget.type,
          widgetId: widget.id
        }));
      setDraftWidgets(filteredWidgets);
    }
    if (error) {
      console.log(error);
    }
  };

  // This function will fetch the widgets with status, ACTIVE and INACTIVE
  const fetchAllWidgets = async () => {
    const { data: activeData, error: activeError } = await myFetch(`${baseUrl}/widget?status=active`);
    const { data: deactivateData, error: deactivateError } = await myFetch(`${baseUrl}/widget?status=deactivate`);
    const activeWidgets = activeData ? activeData.data.map((widget: any) => ({
      ...widget,
      templateId: asciiToString(widget.templatePublicId),
      widgetType: widget.type,
      widgetId: widget.id
    })) : [];
    const deactivateWidgets = deactivateData.data.length > 0 ? deactivateData.data.map((widget: any) => ({
      ...widget,
      templateId: asciiToString(widget.templatePublicId),
      widgetType: widget.type,
      widgetId: widget.id
    })) : [];
    const combinedWidgets = [...activeWidgets, ...deactivateWidgets];
    setAllWidgets(combinedWidgets);

  }
  useEffect(() => {
    fetchDraftWidgets()
    fetchAllWidgets()
  }, [])

  const handleAddWidget = () => {
    router.push("/widget/add")
  }

  const handleWidgetClick = async (widgetId: string) => {
    const { data, error } = await myFetch(`${baseUrl}/widget/${widgetId}`);
    setWidgetId(widgetId)
    if (!data) {
      console.log("data not found")
    }
    else {
      setCardBgColor(data.customizationData.cardBgColor);
      setCardBorderRadius(data.customizationData.cardBorderRadius);
      setFontSettings(data.customizationData.fontSettings);
      setButtonSettings(data.customizationData.buttonSettings);
      setCardStyle(data.customizationData.selectedCard);
      setSelectedBtn(data.customizationData.selectedBtn);
      setSelectedTemplate(asciiToString(data.templatePublicId));
      const events = data.otherdata?.event;
      setfetchedAddedEvents(events);
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <div className={styles.navHeading}>All Widgets</div>
        <div className={styles.navBtns}>
          <button onClick={handleAddWidget}>Create Widget</button>
          <button onClick={() => setDraftWidgetModal(true)}>Draft Widgets</button>
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.widgetsAndPreview}>
        <div className={styles.widgetsList}>
          {allWidgets.map((card, key) => (
            <WidgetCard
              widgetStatus="Active"
              key={key}
              widgetId={card.widgetId}
              templateId={card.templateId as TemplateId}
              widgetType={card.widgetType}
              widgetNumber={1}
              fetchDraftWidgets={fetchDraftWidgets}
              handleWidgetClick={handleWidgetClick}
            />
          ))}
        </div>
        <div className={styles.preview}>
          <PreviewWindow fontSettings={fontSettings} buttonSettings={buttonSettings} cardBorderRadius={cardBorderRadius} cardBgColor={cardBgColor} selectedBtn={selectedBtn} selectedCard={cardStyle} selectedTemplate={selectedTemplate} isFullScreen={false} setIsFullScreen={setIsFullScreen} smallCard={false} fetchedAddedEvents={fetchedAddedEvents} widgetId={selectedWidgetId} />
        </div>
      </div>
      <div className={`${styles.yourWidgetModal} ${draftWidgetModal ? styles.open : ''}`} ref={dropdownRef}>
        <DraftWidgets draftWidgets={draftWidgets} setDraftWidgets={setDraftWidgets} setYourWidgetModal={setDraftWidgetModal} fetchDraftWidgets={fetchDraftWidgets} />
      </div>
    </div>
  )
}

export default Widget