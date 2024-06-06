import React, { useState } from 'react'
import styles from './filters.style.module.css'
import WidgetBtns from "../../../components/widgetadd/WidgetBtns";
import StickyWidget from "../../../components/widgetadd/StickyWidget";
import SectionWidget from "../../../components/widgetadd/SectionWidget";
import PageWidget from "@/app/components/widgetadd/PageWidget";
import { useTheme } from "@/context";

interface FilterProps{
    widgetSelected : string; // We are accepting this prop because we only want to show the form of the selected widget
}

const Filters = ({widgetSelected} : FilterProps) => {
    // const [type, setType] = useState<string>("Sticky");
    const [widgetId, setWidgetId] = useState<string>("");
    const { theme } = useTheme();
    return (
        <div className={styles.body}>
            <div className={`${styles.configurationForm} ${theme === 'light' && styles.configurationForm_light}`}>
                <WidgetBtns widgetSelected ={widgetSelected} />
                <div className={styles.dropdown_container}>
                    {widgetSelected === "Sticky" && <StickyWidget setWidgetId={setWidgetId} />}
                    {widgetSelected === "Section" && (
                        <SectionWidget setWidgetId={setWidgetId} />
                    )}
                    {widgetSelected === "Page" && <PageWidget setWidgetId={setWidgetId} />}
                </div>
            </div>
        </div>
    );
}

export default Filters