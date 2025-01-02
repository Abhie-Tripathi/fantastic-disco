import React from 'react'
import ModuleSelectionImage from '/public/internal/dashboard/LandingScreenBg.png'
import ModuleSelectionImageDark from '/public/internal/dashboard/LandingScreenBgDark.png'
import ModuleCard from './ModuleCard'
import ResearchModule from '/public/internal/dashboard/ResearchModule.png'
import PormoteModule from '/public/internal/dashboard/PormoteModule.png'
import ProspectModule from '/public/internal/dashboard/ProspectModule.png'
import ResearchModuleDark from '/public/internal/dashboard/ResearchModuleDark.png'
import PromoteModuleDark from '/public/internal/dashboard/PromoteModuleDark.png'
import ProspectModuleDark from '/public/internal/dashboard/ProspectModuleDark.png'
import Tour from './Tour'
import Research from '../Research/Research'

interface Props{
  value : string;
  theme : string | null
}

const ModuleSelection = ({value, theme}:Props) => {

  const modules = [
    { heading: "Research & Track", subheading: "Quickly discover events that match your interests and needs.", button: "Research", image:theme ==="dark" ? ResearchModuleDark : ResearchModule, imgHeight: 90, imgWidth: 63, top: 40 },
    { heading: "Smart Promote", subheading: "Promote your events through multiple touchpoints, attracting a wider audience ", button: "Promote", image: theme ==="dark" ? PromoteModuleDark :PormoteModule, imgHeight: 110, imgWidth: 150, top: -20 },
    { heading: "Personalized Prospecting", subheading: "Say goodbye to generic outreach. Use cutting-edge AI to automate prospecting.", button: "Coming Soon", image: theme ==="dark" ? ProspectModuleDark : ProspectModule, imgHeight: 111, imgWidth: 156, top: 10 },
  ]

  return (
    <div className={`max-w-[100%] max-h-[100%] flex items-center justify-center gap-7 flex-col h-screen bg-cover bg-center rounded-3xl`}
      style={{ backgroundImage: theme === "dark" ? `url(${ModuleSelectionImageDark.src})` :`url(${ModuleSelectionImage.src})` }}>
      <div className={`flex items-center flex-col`}>
        <div className={`text-5xl font-[var(--font-weight-semibold)] text-[var(--primary-text-color)]`}>Get Started with <span className='bg-gradient-to-r from-[#EE1CC082] via-[#7757DE] to-[#DD18FD40] bg-clip-text text-transparent'>Whr.ai</span></div>
        <div className='text-[var(--primary-text-color)]'>All-in-one solution to maximize ROI from your event strategy.</div>
      </div>
      {value === "admin" ? <div className="flex items-center justify-evenly w-[100%]">
        {modules.map((module, key) => (
          <ModuleCard image={module.image} key={key} imgHeight={module.imgHeight} imgWidth={module.imgWidth} heading={module.heading} subHeading={module.subheading} button={module.button} top={module.top} />
        ))}
      </div> : <div className='w-[95%]'><Research theme={theme}/></div>}
      <div className='w-[90%]'><Tour /></div>
      
    </div>
  )
}

export default ModuleSelection