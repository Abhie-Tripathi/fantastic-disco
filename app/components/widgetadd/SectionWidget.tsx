import React from 'react'
import CommonWidget from './CommonWidget'

interface SectionWidgetProps {
  setSectionQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SectionWidget = ({setSectionQuery} : SectionWidgetProps) => {
  return (
    <div><CommonWidget setQuery={setSectionQuery} widgetType='section'/></div>
  )
}

export default SectionWidget