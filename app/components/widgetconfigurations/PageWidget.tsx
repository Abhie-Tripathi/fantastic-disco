import React from 'react'
import CommonWidget from './CommonWidget'

interface PageWidgetProps {
  setPageQuery: React.Dispatch<React.SetStateAction<string>>;
}

const PageWidget = ({setPageQuery}:PageWidgetProps) => {
  return (
    <div><CommonWidget widgetType='page' setPageQuery = {setPageQuery}/></div>
  )
}

export default PageWidget