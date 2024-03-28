import React from 'react'
import WidgetCard from './WidgetCard'
import More from './img/widgets/more_horiz.svg'
import data from './widgetsData.json'
import Add from './img/widgets/add.svg'
import './Widgets.css'
const Widget = () => {
  return (
    <div className='outerContainer'>
      <div className='containerOne'>
        <div className='c1-left'>Widgets</div>
        <div className='c1-right'>
            <div className='threeDots'><img src={More} alt="more"/></div>
            <div className='addBtn'>
                <div><img src={Add} alt="add"/></div>
                <div>Widget</div>
            </div>
        </div>
      </div>
      <div className='containerTwo'>
        <WidgetCard data={data[0]}/>
      </div>

      <div className='containerTwo'>
        <WidgetCard/>
      </div>
    </div>
  )
}

export default Widget
