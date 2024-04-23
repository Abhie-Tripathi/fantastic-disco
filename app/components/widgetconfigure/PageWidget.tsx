import React from 'react'
import CommonWidget from './CommonWidget'

interface PageWidgetProps {
    pageId: string;
}

const PageWidget = ({pageId}:PageWidgetProps) => {
  return (
    <div><CommonWidget widgetType='Page' widgetId={pageId}/></div>
  )
}

export default PageWidget