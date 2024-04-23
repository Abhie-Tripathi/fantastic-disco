import React from 'react'
import CommonWidget from './CommonWidget'

interface SectionWidgetProps {
    sectionId: string;
}

const SectionWidget = ({sectionId}:SectionWidgetProps) => {
  return (
    <div><CommonWidget widgetType='Section' widgetId={sectionId}/></div>
  )
}

export default SectionWidget