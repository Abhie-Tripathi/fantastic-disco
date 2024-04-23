import React from 'react'
import CommonWidget from './CommonWidget'

interface PageWidgetProps {
  setWidgetId: React.Dispatch<React.SetStateAction<string>>;
}

const PageWidget = ({setWidgetId}:PageWidgetProps) => {
  return (
    <div><CommonWidget widgetType='Page' setId = {setWidgetId}/></div>
  )
}

export default PageWidget