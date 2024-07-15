'use client'
import React, { useState } from 'react'
import styles from './page.style.module.css'
import PreviewWindow from '@/app/components/TemplateViewsNew/TemplatesPreview/PreviewWindow'
import EditScreen from '@/app/components/TemplateViewsNew/EditScreen/EditScreen'

const Page = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  return (
    
    <div className={styles.body}>
          <div className={styles.editContainer}>
              <EditScreen/>
          </div>
          <div className={styles.previewContainer}>
              <PreviewWindow isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen}/>
          </div>
    </div>
  )
}

export default Page