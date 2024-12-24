import React from 'react'
import ModuleSelectionImage from '/public/internal/dashboard/ModuleSelection.png'
import Image from 'next/image'
import ModuleCard from './ModuleCard'
import ResearchModule from '/public/internal/dashboard/ResearchModule.png'
import PormoteModule from '/public/internal/dashboard/PormoteModule.png'
import ProspectModule from '/public/internal/dashboard/ProspectModule.png'
import styles from './moduleselection.style.module.css'

const ModuleSelection = () => {

  const modules = [
    { heading: "Research & Track", subheading: "Quickly discover events that match your interests and needs.", button: "Research", image: ResearchModule, imgHeight: 90, imgWidth: 63, bottom : 20 },
    { heading: "Smart Promote", subheading: "Promote your events through multiple touchpoints, attracting a wider audience ", button: "Promote", image: PormoteModule, imgHeight: 110, imgWidth: 150, bottom : -20 },
    { heading: "Personalized Prospecting", subheading: "Say goodbye to generic outreach. Use cutting-edge AI to automate prospecting.", button: "Coming Soon", image: ProspectModule, imgHeight: 111, imgWidth: 156, bottom : 20 },
  ]

  return (
    <div className={styles.body}>
      <Image className={styles.img} src={ModuleSelectionImage} alt='module'/>
      <div className={styles.modules}>
        {modules.map((module, key)=>(
          <ModuleCard image={module.image} key={key} imgHeight={module.imgHeight} imgWidth={module.imgWidth} heading={module.heading} subHeading={module.subheading} button={module.button} bottom={module.bottom}/>
        ))}
      </div>
    </div>
  )
}

export default ModuleSelection