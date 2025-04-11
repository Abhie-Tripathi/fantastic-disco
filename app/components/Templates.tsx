import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/(internal)/internal/trackers/page.style.module.css"
import data from '@/components/templateData'
import Template from "/public/template.svg";
import Back from "/public/back.svg";
import { isEventeli } from "@/config";
import IntelScore from '@/components/intelScore';
import Slider from '@/components/slider';
import { Building2, Users, Lightbulb } from "lucide-react";
import { useTrackerServices } from "@/services/trackerServices";
const Templates =({isData, hideTemplates})=>{
  const {getTrackerCount}=useTrackerServices();
  const [countData,setCountData]=useState();
  const [intelScoreData,setIntelScoreData] = useState([
    {
      name: "People",
      value:  0,
      trackerValue: 0,
      // fill: type==="T_PEOPLE_FINDER"||type==="T_SPEAKER_OPPORTUINTY"?"#646BDC":(type==="T_PRODUCT_KEYWORDS")?"#E99CD4":"#9B86D4",
      fill:"#646BDC"
    },
    {
      name: "Purpose",
      trackerValue: 0,
      value:  0,
      fill:"#E99CD4"
    },
    {
      name: "Prospect",
      trackerValue: 0,
      value:  0,
      fill:"#9B86D4"
    }
  ]);
  useEffect(()=>{
    const fetchData=async()=>{
    if(!isEventeli){
      const response = await getTrackerCount();
      console.log(response.count);
      const counts = [0, 0, 0];
      const percentage= [0,0,0];
      response.count.forEach((item) => {
        if (item.type === "T_COMPETITOR" || item.type === "T_CUSTOMER_ICP") {
          counts[0]++;
          percentage[0]=30;
        } else if (item.type === "T_SPEAKING_OPPORTUNITY" || item.type === "T_PEOPLE_FINDER") {
          counts[1]++;
          percentage[1]=30;
        } else if (item.type === "T_PRODUCT_KEYWORDS") {
          counts[2]++;
          percentage[2]=30;
        }
      });
      
      setIntelScoreData((prev) =>
        prev.map((item, index) => ({
          ...item,
          trackerValue: item.trackerValue + counts[index],
          value: percentage[index],
        }))
      );
      
      setCountData(response);
    }
  }
    fetchData();
  },[])
  
//   const values = [
//     {
//       tag: "People",
//       value: "30"
//   },
//   {
//     tag: "People",
//       value: "30"
//   },
//   {
//     tag: "People",
//     value: "30"
//   }
// ];
console.log(intelScoreData);

    return(
        <div  style={{padding:"16px 14px",width:"100%", overflowY:"auto"}}>
        {/* {!isData && <div className="flex items-center pb-6 !pl-14 text-lg text-[var(--secondary-text-color)] font-semibold">Explore trackers or create custom ones using advanced filters, enabling real-time monitoring of key events and informed decisions.</div>} */}
      {isData && 
          <button className="w-[50px] flex text-white font-bold py-2 px-4 rounded text-sm items-center justify-center ml-6"
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
              <div>
                <div className="text-xl font-medium">Brand Brief Builder </div>
                <div className="text-sm" style={{color:"var(--tertiary-text-color)"}}>Use below templates to track & plan your event strategy.</div>
              </div>
              <div className="w-[248px] h-40 border border-[var(--border-color)] p-1">
              <div className="flex justify-between items-center">
              <div className={`badge_info text-xs`}>BRAND BRIEF STATUS</div>
               <IntelScore intelScore={intelScoreData} height="70px" width="70px"/>
               </div>
               <div className="w-[100%] flex gap-1">
                {intelScoreData.map((item, index) => (
                  <div className="w-[33%] flex flex-col gap-1 bg-[#FAFAFA]">
                  <div className="pl-2">{item.value}</div>
                  <div className="pl-2 text-xs" style={{color:`${item.fill}`}}>{item.name}</div>
                    <Slider key={index} width={item.value} color={item.fill}/>
                    </div>
                  ))}
                  
              </div>

              </div>
            </div>
            <hr className="my-4 border-t border-gray-300 mb-[0px] mt-[0px]"/>
            {data.map((item, index)=>(
              <div key={index}>
                <div className="flex">
                <div className="flex flex-col w-[25%] pr-6 gap-2">
                <div className="text-2xl flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                {item.heading==="Companies" &&
                <Building2 />
                }
                {item.heading==="People" && 
                  <Users />
                }
                {item.heading==="Purpose" && 
                  <Lightbulb />
                }
                {item.heading}
                </div>
                {(item.heading==="Companies" && intelScoreData[0].value>0) &&
                <IntelScore intelScore={[intelScoreData[0]]} width="70px" height="70px" source="individualScore"/>
                }
                {(item.heading==="People" && intelScoreData[1].value>0) && 
                  <IntelScore intelScore={[intelScoreData[1]]} width="70px" height="70px" source="individualScore"/>
                }
                {(item.heading==="Purpose" && intelScoreData[2].value>0) &&
                  <IntelScore intelScore={[intelScoreData[2]]} width="70px" height="70px" source="individualScore"/>
                }
                </div>
                <div className="text-sm" style={{color:"var(--tertiary-text-color)"}}>
                {item.subHeading}
                </div>
                </div>
                <div className={`justify-center flex gap-4 w-[75%] p-5 ${item.heading==="Companies" ? 'bg-[#F3F1FB]' : item.heading==="People"? 'bg-[#EEEEFB]':'bg-[#FAF3FA]'}`} style={{ borderRadius: '0.5px' }}>
                  {
                    item.templates.map((template, index)=>(
                      <Link
                      href={`/internal/trackers/create?type=${template?.url}`}
                      key={index}
                    >
                      <div className="w-[274px] p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px] bg-[var(--accent-foreground)] justify-center">
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