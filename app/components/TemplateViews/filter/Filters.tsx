import React, { useState } from 'react'
import styles from './filters.style.module.css'
import WidgetBtns from "../../../components/widgetadd/WidgetBtns";
import StickyWidget from "../../../components/widgetadd/StickyWidget";
import SectionWidget from "../../../components/widgetadd/SectionWidget";
import Preview from "../../../components/widgetadd/Preview";
import PageWidget from "@/app/components/widgetadd/PageWidget";
import { useTheme } from "@/context";

const Filters = () => {
    const [type, setType] = useState<string>("Sticky");
    const [widgetId, setWidgetId] = useState<string>("");
    const { theme } = useTheme();
    return (
        <div className={styles.body}>
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
        </div>
    );
}

export default Filters