import React from 'react'
import CommonWidget from './CommonWidget'

interface SectionWidgetProps {
    sectionId: string;
}

const SectionWidget = ({sectionId}:SectionWidgetProps) => {
  return (
    <div><CommonWidget widgetType='Page' widgetId={sectionId}/></div>
  )
}

export default SectionWidget