import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/(internal)/internal/trackers/page.style.module.css"
import data from '@/components/templateData'
import Template from "/public/template.svg";
import Back from "/public/back.svg";
import { isEventeli } from "@/config";
const Templates =({isData, hideTemplates})=>{
    return(
        <div  style={{padding:"24px 14px",width:"100%", overflowY:"auto"}}>
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
          <div>
            {data.map((item, index)=>(
              <div>
                <div>
                <div>
                {item.heading}
                {item.subHeading}
                </div>
                <div>
                  {
                    item.templates.map((template, index)=>(
                      <Link
                      href={`/internal/trackers/create?type=${template?.url}`}
                      key={index}
                    >
                      <div className="w-full p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px]">
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