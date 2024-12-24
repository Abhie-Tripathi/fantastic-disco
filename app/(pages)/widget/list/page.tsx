"use client";
import React, { useState, useEffect } from "react";
import WidgetCard from "@/app/components/TemplateViews/draftwidgets/WidgetCard";
import styles from "./page.style.module.css";
import DraftWidgets from "@/app/components/TemplateViews/draftwidgets/DraftWidgets";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/constants";
import useOutsideClick from "@/hooks/useOutsideClick";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonSettingsState } from "@/types/buttoncustomizetypes";
import PreviewWindow from "@/app/components/TemplateViewsNew/TemplatesPreview/PreviewWindow";
import { AddedEventsType } from "@/types/addedeventtype";
import Errorpage from "@/app/components/TemplateViewsNew/Errorpage";
import { useWidgetServices } from "@/services/geniservices/widgetService";

type TemplateId =
  | "ST"
  | "SB"
  | "HB"
  | "GS"
  | "LS"
  | "HBL"
  | "HBG"
  | "CVL"
  | "CVG"
  | "CV"
  | "HS"
  | "LSR"
  | "RSR"
  | "PUVP"
  | "PUVL";
interface DraftWidgetsType {
  widgetType: string;
  templateId: string;
  widgetId: string;
  status: string;
  eventSize: number;
  widgetStatus: string;
}
const Widget = () => {
  const searchParams = useSearchParams();
  const [draftWidgetModal, setDraftWidgetModal] = useState<boolean>(false);
  const [draftWidgets, setDraftWidgets] = useState<DraftWidgetsType[]>([]);
  const [allWidgets, setAllWidgets] = useState<DraftWidgetsType[]>([]);
  const [cardBgColor, setCardBgColor] = useState<string>("#d4d4d4");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(20);
  const [fontSettings, setFontSettings] = useState({
    heading: {
      fontFamily: "arial",
      fontSize: 24,
      fontColor: "#000000",
      fontWeight: "bolder",
    },
    subheading: {
      fontFamily: "arial",
      fontSize: 12,
      fontColor: "#000000",
      fontWeight: "normal",
    },
    body: {
      fontFamily: "arial",
      fontSize: 12,
      fontColor: "#000000",
      fontWeight: "normal",
    },
  });
  const [buttonSettings, setButtonSettings] = useState<ButtonSettingsState>({
    primary: {
      buttonColor: "#0072F5",
      fontColor: "#000000",
      borderRadius: 4,
      borderColor: "#0072F5",
      buttonText: "Meet Us",
    },
    secondary: {
      fontColor: "#000000",
      borderRadius: 4,
      borderColor: "#6750a4",
      buttonText: "Meet Us",
    },
  });

  const [cardStyle, setCardStyle] = useState<string>("style1");
  const [selectedBtn, setSelectedBtn] = useState<"primary" | "secondary">(
    "primary"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>();
  const dropdownRef = useOutsideClick(() => setDraftWidgetModal(false));
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [fetchedAddedEvents, setfetchedAddedEvents] = useState<
    AddedEventsType[]
  >([]);
  const [selectedWidgetId, setWidgetId] = useState<string>("");
  const router = useRouter();
  const [isValid, setIsValid] = useState(true); // Track if the data is valid
  const [loading, setLoading] = useState(true); // Track loading state
  const [selectedKey, setSelectedKey] = useState<number>(0);
  const {getActiveWidget, getDraftWidget, getOnlyDraftWidget, getDeActiveWidget, getWidgetById, error} = useWidgetServices()
  useEffect(()=>{
    if (searchParams.get('fromDashboard') === 'true') {
      setDraftWidgetModal(true);
    }
  },[searchParams])

  const asciiToString = (ascii: number): string => {
    let convertedValue = ascii.toString();
    let str = "";
    for (let i = 0; i < convertedValue.length; i += 2) {
      const code = convertedValue.substring(i, i + 2);
      str += String.fromCharCode(parseInt(code, 10));
    }
    return str;
  };

  const fetchDraftWidgets = async () => {
    // const { data, error } = await myFetch(`${baseUrl}/widget?status=draft`);
    
    const data:any = await getOnlyDraftWidget();
    if (data) {
      console.log(data);
      const filteredWidgets = data?.data?.map((widget: any) => ({
        ...widget,
        templateId: asciiToString(widget.templatePublicId),
        widgetType: widget.type,
        widgetId: widget.id,
        eventSize: widget.otherdata.event.length,
        widgetStatus: "Draft",
      }));
      setDraftWidgets(filteredWidgets);
    }
    if (error) {
      console.log(error);
    }
  };

  // This function will fetch the widgets with status, ACTIVE and INACTIVE
  const fetchAllWidgets = async () => {
    // const { data: activeData, error: activeError } = await myFetch(
    //   `${baseUrl}/widget?status=active`
    // );
    // const { data: deactivateData, error: deactivateError } = await myFetch(
    //   `${baseUrl}/widget?status=deactivate`
    // );
    const activeData:any = await getActiveWidget();
    const deactivateData:any = await getDeActiveWidget();
    const activeWidgets = activeData
      ? activeData.data.map((widget: any) => ({
          ...widget,
          templateId: asciiToString(widget.templatePublicId),
          widgetType: widget.type,
          widgetId: widget.id,
          eventSize: widget.otherdata.event.length,
          widgetStatus: "Active",
        }))
      : [];
    const deactivateWidgets =
      deactivateData && deactivateData.data.length > 0
        ? deactivateData.data.map((widget: any) => ({
            ...widget,
            templateId: asciiToString(widget.templatePublicId),
            widgetType: widget.type,
            widgetId: widget.id,
            eventSize: widget.otherdata.event.length,
            widgetStatus: "Inactive",
          }))
        : [];
    const combinedWidgets = [...activeWidgets, ...deactivateWidgets];
    setSelectedKey(0);
    if (combinedWidgets.length === 0) {
      setIsValid(false);
    } else {
      setAllWidgets(combinedWidgets);
      setWidgetId(combinedWidgets[0].id);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchDraftWidgets();
    fetchAllWidgets();
  }, []);

  // Need to do this to display the data on the load of the page
  useEffect(() => {
    handleWidgetClick(selectedWidgetId);
  }, [selectedWidgetId]);

  const handleAddWidget = () => {
    router.push("/widget/add");
  };

  const handleWidgetClick = async (widgetId: string) => {
    const data:any = await getWidgetById(widgetId)
    if (!data) {
      console.log("data not found");
    } else {
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
  };
  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }
  // if (!isValid) {
  //   return <div className={styles.errorPage}><Errorpage type='list' /></div>; // Render the 404 component if the data is invalid
  // }
  const isMultipleCards = allWidgets.length > 1;
  return (
    <div className={styles.body}>
      <div className={styles.nav}>
        <div className={styles.navHeading}> All Widgets</div>
        <div className={styles.navBtns}>
          {/* <button onClick={handleAddWidget}>Create Widget</button> */}
          {allWidgets.length > 0 ? (
            <button onClick={handleAddWidget}>Create Widget</button>
          ) : (
            ""
          )}
          <button
            className={styles.draftBtn}
            onClick={() => setDraftWidgetModal(true)}
          >
            Draft Widgets<span>{draftWidgets.length}</span>
          </button>
        </div>
      </div>
      <div className={styles.line}></div>
      {!isValid ? (
        <>
          <div className={styles.errorPage}>
            <Errorpage type="list" />
          </div>
          ;
        </>
      ) : (
        <>
          <div className={styles.widgetsAndPreview}>
            <div className={`${styles.widgetsList} ${isFullScreen ? styles.hideWidgetList : ""} ${isMultipleCards ? styles.multiCardHeight : styles.singleCardHeight}`}>
              {allWidgets.map((card, key) => (
                <div
                  className={styles.widgetCard}
                  onClick={() => setSelectedKey(key)}
                  key={key}
                >
                  <WidgetCard
                    widgetStatus={card.widgetStatus}
                    key={key}
                    widgetId={card.widgetId}
                    templateId={card.templateId as TemplateId}
                    widgetType={card.widgetType}
                    widgetNumber={1}
                    fetchDraftWidgets={fetchDraftWidgets}
                    handleWidgetClick={handleWidgetClick}
                    fetchedEventsSize={card.eventSize}
                    fetchAllWidgets={fetchAllWidgets}
                    selected={selectedKey === key}
                  />
                </div>
              ))}
            </div>
            <div
              className={`${styles.preview} ${isFullScreen ? styles.fullPreview : ""}`}
            >
              <PreviewWindow
                fontSettings={fontSettings}
                buttonSettings={buttonSettings}
                cardBorderRadius={cardBorderRadius}
                cardBgColor={cardBgColor}
                selectedBtn={selectedBtn}
                selectedCard={cardStyle}
                selectedTemplate={selectedTemplate}
                isFullScreen={isFullScreen}
                setIsFullScreen={setIsFullScreen}
                smallCard={isFullScreen ? false : true}
                fetchedAddedEvents={fetchedAddedEvents}
                widgetId={selectedWidgetId}
              />
            </div>
          </div>
        </>
      )}
      <div
        className={`${styles.yourWidgetModal} ${
          draftWidgetModal ? styles.open : ""
        }`}
        ref={dropdownRef}
      >
        <DraftWidgets
          draftWidgets={draftWidgets}
          setDraftWidgets={setDraftWidgets}
          setYourWidgetModal={setDraftWidgetModal}
          fetchDraftWidgets={fetchDraftWidgets}
        />
      </div>
    </div>
  );
};

export default Widget;
