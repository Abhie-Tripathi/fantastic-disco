"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.style.module.css";
import WidgetBtns from "../../../components/widgetadd/WidgetBtns";
import StickyWidget from "../../../components/widgetadd/StickyWidget";
import SectionWidget from "../../../components/widgetadd/SectionWidget";
import Preview from "../../../components/widgetadd/Preview";
import PageWidget from "@/app/components/widgetadd/PageWidget";
import { useTheme } from "@/context";

const Page = () => {
  const [type, setType] = useState<string>("Sticky");
  const [previewState, setPreviewState] = useState<string>("Side Preview");
  const [widgetId, setWidgetId] = useState<string>("");
  const { theme } = useTheme();

  const handlePreviewToggle = () => {
    if (previewState === "Side Preview") {
      setPreviewState("Full Preview");
    } else setPreviewState("Side Preview");
  };

  return (
    <div className={styles.body}>
      <div
        className={`${styles.container}`}
      >
        {previewState === "Side Preview" && (
          <div className={`${styles.configurationForm} ${theme === 'light' && styles.configurationForm_light}`}>
            <WidgetBtns type={type} setType={setType} />
            <div className={styles.dropdown_container}>
              {type === "Sticky" && <StickyWidget setWidgetId={setWidgetId} />}
              {type === "Section" && (
                <SectionWidget setWidgetId={setWidgetId} />
              )}
              {type === "Page" && <PageWidget setWidgetId={setWidgetId} />}
            </div>
          </div>
        )}
        <div
          className={`${styles.previewSection} ${
            previewState === "Full Preview" ? styles.fullPreview : ""
          }`}
        >
          <Preview
            type={type}
            toggle={handlePreviewToggle}
            widgetId={widgetId}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
