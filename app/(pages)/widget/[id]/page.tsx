'use client'
import React, { useEffect, useState } from 'react'
import styles from './page.style.module.css'
import StickyWidget from '../../../components/widgetconfigure/StickyWidget'
import Preview from '../../../components/widgetadd/Preview'
import { ParsedUrlQuery } from 'querystring';
import CodeWindow from '@/app/components/widgetconfigure/CodeWindow'
import CodeIcon from '/public/code.svg'
import Image from 'next/image'
import PageWidget from '@/app/components/widgetconfigure/PageWidget'

interface Widget {
    id: string;
    name: string;
}

interface Props {
    params: ParsedUrlQuery;
}

const Page = ({ params }: Props) => {
    const [type, setType] = useState<string>("");
    const [previewState, setPreviewState] = useState<string>("Side Preview");
    const [widgetId, setWidgetIt] = useState<string>(params.id?.toString() || '')
    const [codeWindow, setCodeWindow] = useState<boolean>(false)

    const handlePreviewToggle = () => {
        if (previewState === "Side Preview") {
            setPreviewState("Full Preview")
        } else setPreviewState("Side Preview")
    }
    useEffect(() => {
        const widgetsStr = localStorage.getItem('widgets');
        if (widgetsStr) {
            const widgets: Widget[] = JSON.parse(widgetsStr);
            const widget = widgets.find(widget => widget.id === params.id);
            if (widget) {
                setType(widget.name);
            }
        }
    }, [params.id]);

    return (
        <div className={styles.body}>
            <div className={styles.container} >
                {previewState === "Side Preview" && <div className={styles.configurationForm}>
                    <div className={styles.dropdown_container}>
                        <div className={styles.code} onClick={() => setCodeWindow(!codeWindow)}>
                            <Image src={CodeIcon} alt='code' />Code
                        </div>
                        {!codeWindow && (
                            <>
                                {type === "Sticky" && <StickyWidget stickyId={widgetId} />}
                                {/* {type === "Section" && <SectionWidget setSectionId={widg} />} */}
                                {type === "Page" && <PageWidget pageId={widgetId} />}
                            </>
                        )}
                        {codeWindow && <CodeWindow widgetId={widgetId} type = {type} />}
                    </div>
                </div>}
                <div className={`${styles.previewSection} ${previewState === "Full Preview" ? styles.fullPreview : ""}`}>
                    <Preview type={type} toggle={handlePreviewToggle} widgetId={widgetId} />
                </div>
            </div>
        </div>
    )
}

export default Page