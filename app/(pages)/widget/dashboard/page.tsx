import React from 'react'
import styles from './page.style.module.css'
import InputComponent from '@/app/components/TemplateViewsNew/WidgetDashboard/InputComponent'

const page = () => {
  return (
    <div className={styles.body}>
      <div className={styles.inputScreen}>
        <InputComponent />
      </div>
    </div>
  )
}

export default page