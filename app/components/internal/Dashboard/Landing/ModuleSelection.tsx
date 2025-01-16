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
import ModuleCardBig from './ModuleCardBig'

interface Props {
  value: string;
  theme: string | null
}

const ModuleSelection = ({ value, theme }: Props) => {

  const modules = [
    { heading: "Research & Track", subheading: "Quickly discover events that match your interests and needs.", button: "Research", image: theme === "dark" ? ResearchModuleDark : ResearchModule, imgHeight: 120, imgWidth: 90, top: 10 },
    { heading: "Smart Promote", subheading: "Promote your events through multiple touchpoints, attracting a wider audience ", button: "Promote", image: theme === "dark" ? PromoteModuleDark : PormoteModule, imgHeight: 110, imgWidth: 150, top: -20 },
    { heading: "Personalized Prospecting", subheading: "Say goodbye to generic outreach. Use cutting-edge AI to automate prospecting.", button: "Prospect", image: theme === "dark" ? ProspectModuleDark : ProspectModule, imgHeight: 111, imgWidth: 156, top: 10 },
  ]

  return (
    <div className={`max-w-[100%] max-h-[100%] flex items-center justify-center gap-7 flex-col h-screen bg-cover bg-center rounded-3xl max-[1010px]:h-full max-[1010px]:p-4 `}
    style={{
      backgroundImage: theme === "dark"
        ? `url(${ModuleSelectionImageDark.src})`
        : `url(${ModuleSelectionImage.src})`,
      backgroundSize: "cover", // Ensures full coverage
      backgroundRepeat: "no-repeat", // Avoids tiling
    }}
    >
      <div className={`flex items-center flex-col`}>
        <div className={`text-5xl font-[var(--font-weight-semibold)] text-[var(--primary-text-color)] text-center max-[620px]:text-3xl`}>Get Started with <span className='bg-gradient-to-r from-[#EE1CC082] via-[#7757DE] to-[#DD18FD40] bg-clip-text text-transparent'>Whr.ai</span></div>
        <div className='text-[var(--primary-text-color)] text-center max-[620px]:text-[14px]'>All-in-one solution to maximize ROI from your event strategy.</div>
      </div>
      {value === "admin" ?
        <>
          <div className="flex items-center justify-evenly w-[100%] max-[1010px]:hidden max-[620px]:flex max-[620px]:flex-col max-[620px]:gap-2">
            {modules.map((module, key) => (
              <ModuleCard image={module.image} key={key} imgHeight={module.imgHeight} imgWidth={module.imgWidth} heading={module.heading} subHeading={module.subheading} button={module.button} top={module.top} />
            ))}
          </div>
          <div className="hidden gap-2 flex-col items-center justify-evenly w-[100%] max-[1010px]:flex max-[620px]:hidden">
            {modules.map((module, key) => (
              <ModuleCardBig image={module.image} key={key} imgHeight={module.imgHeight} imgWidth={module.imgWidth} heading={module.heading} subHeading={module.subheading} button={module.button} top={module.top} />
            ))}
          </div>
        </>
        :
        <div className='w-[95%]'><Research theme={theme} /></div>}
      <div className='w-[90%] max-[620px]:hidden'><Tour /></div>

    </div>
  )
}

export default ModuleSelection