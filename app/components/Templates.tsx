import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/(internal)/internal/trackers/page.style.module.css"
import data from '@/components/templateData'
import Template from "/public/template.svg";
import Back from "/public/back.svg";
import { isEventeli } from "@/config";
import IntelScore from '@/components/intelScore';
const Templates =({isData, hideTemplates})=>{
    return(
        <div  style={{padding:"16px 14px",width:"100%", overflowY:"auto"}}>
        {!isData && <div className="flex items-center pb-6 !pl-14 text-lg text-[var(--secondary-text-color)] font-semibold">Explore trackers or create custom ones using advanced filters, enabling real-time monitoring of key events and informed decisions.</div>}
      {isData && 
          <button className="w-[50px] flex text-white font-bold py-2 px-4 rounded text-sm items-center justify-center"
      style={{ color: "var(--primary-color)" }} onClick={()=>hideTemplates(true)}>
        <Image src={Back} alt="close" height={22} width={22} />
          Back
        </button>
      }
      {isEventeli?
        <div className={`${styles.container}`}>
            {data.map((item, ind) => (
              <Link
                href={`/internal/trackers/create?type=${item?.url}`}
                key={ind}
              >
                <div className="w-full p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px]">
                  <div className="w-full flex items-center h-[45%] rounded-md bg-[var(--tabs-background-color)]">
                    <div className={styles.account}>
                      <Image src={item.img} alt="people" width={31} height={31} />
                    </div>
                    <div>
                      <Image src={Template} alt="template" />
                    </div>
                  </div>
                  <div className="w-full h-[60%] flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                    {item?.domain &&
                      <div
                    className="badge_primary"
                    style={{fontSize:"var(--font-size-label)", padding:"6px"}}
                  >
                    {item?.domain}
                  </div>
                    }
                    </div>
                    <div className="text-[16px] font-bold text-[var(--primary-color)]">
                      {item?.trackerName}
                    </div>
                    <div className="font-medium text-[var(--tertiary-text-color)]">
                      {item?.content}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            <div className={styles.innerContainerOne}>
              <Image src={Add} alt="add" />
              <Link
                href="/internal/trackers/create?type=T_CUSTOM"
                className={styles.createUrl}
              >
                <Button
                  // onClick={() => modalOpen()}
                  className="text-white"
                >
                  Create Custom
                </Button>
              </Link>
            </div>
          </div>:
          <div className={`flex flex-col gap-6 pl-6 pr-6`}>
            <div className="flex justify-between">
              <div className="pl-6">
                <div className="text-xl font-medium">Brand Brief Builder </div>
                <div className="text-sm" style={{color:"var(--tertiary-text-color)"}}>Use below templates to track & plan your event strategy.</div>
              </div>
              <div className="w-[248px] h-40 border border-[var(--border-color)]">
               <IntelScore/>
              </div>
            </div>
            <hr className="my-4 border-t border-gray-300"/>
            {data.map((item, index)=>(
              <div>
                <div className="flex">
                <div className="flex flex-col w-[30%] pr-6">
                <div className="text-2xl">
                {item.heading}
                </div>
                <div className="text-sm" style={{color:"var(--tertiary-text-color)"}}>
                {item.subHeading}
                </div>
                </div>
                <div className={`flex gap-2 w-[70%] p-5 ${item.heading==="Companies" ? 'bg-[#F3F1FB]' : item.heading==="People"? 'bg-[#EEEEFB]':'bg-[#FAF3FA]'}`} style={{ borderRadius: '0.5px' }}>
                  {
                    item.templates.map((template, index)=>(
                      <Link
                      href={`/internal/trackers/create?type=${template?.url}`}
                      key={index}
                    >
                      <div className="w-full p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px] bg-[var(--accent-foreground)]">
                        <div className="w-full flex items-center h-[45%] rounded-md bg-[var(--tabs-background-color)]">
                          <div className={styles.account}>
                            <Image src={template.img} alt="people" width={31} height={31} />
                          </div>
                          <div>
                            <Image src={Template} alt="template" />
                          </div>
                        </div>
                        <div className="w-full h-[60%] flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                          {template?.domain &&
                            <div
                          className="badge_primary"
                          style={{fontSize:"var(--font-size-label)", padding:"6px"}}
                        >
                          {template?.domain}
                        </div>
                          }
                          </div>
                          <div className="text-[16px] font-bold text-[var(--primary-color)]">
                            {template?.trackerName}
                          </div>
                          <div className="font-medium text-[var(--tertiary-text-color)]">
                            {template?.content}
                          </div>
                        </div>
                      </div>
                    </Link>
                    ))
                  }
                </div>
                </div>
              </div>
            ))}
          </div>
      }
          
        </div>
    )
}
export default Templates;