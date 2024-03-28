import React from 'react'
import WidgetCard from './WidgetCard'
import More from '../../icons/more_horiz.svg'
import Styles from './widget.style.module.css'
import data from '../../widgetsData/data.json'
import Add from '../../icons/add.svg'

const Widget = () => {
  // console.log(data[0]);
  return (
    <div className={Styles.outerContainer}>
      <div className={Styles.containerOne}>
        <div className={Styles.c1left}>Widgets</div>
        <div className={Styles.c1right}>
            <div className={Styles.threeDots}><img src={More} alt="more"/></div>
            <div className={Styles.addBtn}>
                <div><img src={Add} alt="add"/></div>
                <div>Widget</div>
            </div>
        </div>
      </div>
      {data.map(item => (
      <div className={Styles.containerTwo}>
        
          <WidgetCard key={item.id} data={item} />
       
      </div>
       ))}
      {/* <div className={Styles.containerTwo}>
        <WidgetCard />
      </div> */}
    </div>
  )
}

export default Widget
