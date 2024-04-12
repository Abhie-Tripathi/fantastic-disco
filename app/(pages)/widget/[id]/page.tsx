'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import WidgetBtns from '../../../components/widgetadd/WidgetBtns'
import StickyWidget from '../../../components/widgetconfigure/StickyWidget'
import Preview from '../../../components/widgetadd/Preview'
import { ParsedUrlQuery } from 'querystring';
import CodeWindow from '@/app/components/widgetconfigure/CodeWindow'
import CodeIcon from '/public/code.svg'
import Image from 'next/image'

interface Props {
    params: ParsedUrlQuery;
}

const Page = ({ params }: Props) => {
    const [type, setType] = useState<string>("Sticky");
    const [previewState, setPreviewState] = useState<string>("Side Preview");
    const [stickyId, setStickyId] = useState<string>(params.id?.toString() || '');
    const [pageQuery, setPageQuery] = useState<string>("")
    const [sectionQuery, setSectionQuery] = useState<string>("")
    const [codeWindow, setCodeWindow] = useState<boolean>(false)

    const handlePreviewToggle = () => {
        if (previewState === "Side Preview") {
            setPreviewState("Full Preview")
        } else setPreviewState("Side Preview")
    }

    return (
        <div className={styles.body}>
            <div className={styles.container} >
                {previewState === "Side Preview" && <div className={styles.configurationForm}>
                    {/* <WidgetBtns
                        type={type}
                        setType={setType}
                    /> */}
                    <div className={styles.dropdown_container}>
                        <div className={styles.code} onClick={()=>setCodeWindow(!codeWindow)}>
                            <Image src={CodeIcon} alt='code' />Code
                        </div>
                        {!codeWindow && <StickyWidget stickyId={stickyId} />}
                        {codeWindow && <CodeWindow stickyId={stickyId} />}
                    </div>
                </div>}
                <div className={`${styles.previewSection} ${previewState === "Full Preview" ? styles.fullPreview : ""}`}>
                    <Preview type={type} toggle={handlePreviewToggle} stickyId={stickyId} pageQuery={pageQuery} />
                </div>
            </div>
        </div>
    )
}

export default Page