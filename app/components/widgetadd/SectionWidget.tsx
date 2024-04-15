import React from 'react'
import CommonWidget from './CommonWidget'

interface SectionWidgetProps {
  setWidgetId: React.Dispatch<React.SetStateAction<string>>;
}

const SectionWidget = ({setWidgetId} : SectionWidgetProps) => {
  return (
    <div><CommonWidget widgetType='Section' setId = {setWidgetId}/></div>
  )
}

export default SectionWidget