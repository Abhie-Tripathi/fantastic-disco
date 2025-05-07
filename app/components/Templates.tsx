import React, {useEffect, useState, useMemo, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/(internal)/internal/trackers/page.style.module.css"
import { TemplateItem, StandardTemplateGroup, TrackerTypeProp } from '@/types/trackers';
import data from '@/components/templateData'
import Template from "/public/template.svg";
import Back from "/public/back.svg";
import { isEventeli } from "@/config";
import IntelScore from '@/components/intelScore';
import Slider from '@/components/slider';
import { Building2, Users, Lightbulb, CheckCheck } from "lucide-react";
import { useTrackerServices } from "@/services/trackerServices";
import Add from "/public/add.svg";
import { Button } from "@/components/ui/button";
import FetchTemplateModal from "./internal/trackers/FetchTemplateModal";
import { fetchData } from "next-auth/client/_utils";
import FetchTemplateMinModal from "./internal/trackers/FetchTemplateMinModal";
import { useCompanyService } from "@/services/companyService";
import { suggestionGenerator } from "@/utils/openAI";
import { useTrackerContext } from "@/context/tracker";

interface TemplateProps{
  isData: boolean;
  hideTemplates: (val: boolean) => void;
}

const fetchAISuggestion = async (inputValue: string) => {
  const promptText = `List 6 domains including ${inputValue} (as the main entry) and 5 of its competitors. For each, provide their relevant industry categories and keywords based on the following list:

"Agriculture & Forestry, Animals & Pets, Apparel & Clothing, Arts & Crafts, Auto & Automotive, Baby, Kids & Maternity, Banking & Finance, Building & Construction, Business Services, Education & Training, Electric & Electronics, Entertainment & Media, Environment & Waste, Fashion & Beauty, Food & Beverages, Home & Office, Hospitality, Industrial Engineering, IT & Technology, Logistics & Transportation, Medical & Pharma, Miscellaneous, Packing & Packaging, Power & Energy, Science & Research, Security & Defense, Telecommunication, Travel & Tourism, Wellness, Health & Fitness"

Return the output in this format:

{
  "data": {
    "domain": "${inputValue}",
    "categories": ["Category 1", "Category 2"],
    "keywords": ["keyword1", "keyword2"]
  },
  "competitorData": [
    {
      "domain": "example1.com",
      "categories": ["Category A", "Category B"],
      "keywords": ["keywordA", "keywordB"]
    }
  ]
}`;

  try {
    const aiResponse: any = await suggestionGenerator(promptText);
    let content = aiResponse.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Remove markdown formatting (```json ... ```)
    content = content.replace(/```json|```/g, "").trim();

    const temp = JSON.parse(content);

    if (temp?.data && temp?.competitorData && Array.isArray(temp.competitorData)) {
      return [temp.data, ...temp.competitorData];
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
};

const Templates = React.memo(({ isData, hideTemplates }: TemplateProps) => {
  const {comp,setComp, keywordsTracker, setKeywordsTracker} = useTrackerContext();
  const {getTrackerCount}=useTrackerServices();
  const {getCompanyDetailById} = useCompanyService();
  const [countData,setCountData]=useState<TrackerTypeProp []>([]);
  const [showFetchedData, setShowFetchedData] = useState(false);
  const [inputValue,setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const {fetchCompanyData}=useTrackerServices();
  const [intelScoreData,setIntelScoreData] = useState([
    {
      name: "Prospect",
      trackerValue: 0,
      value:  0,
      fill:"#9B86D4"
    },
    {
      name: "People",
      value:  0,
      trackerValue: 0,
      fill:"#646BDC"
    },
    {
      name: "Purpose",
      trackerValue: 0,
      value:  0,
      fill:"#E99CD4"
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isEventeli) {
        const response = await getTrackerCount();
        if (!response) return;
  
        const counts = [0, 0, 0];
        const percentage = [0, 0, 0];
  
        (response?.count || [])?.forEach((item: TrackerTypeProp) => {
          if (item.type === "T_COMPETITOR" || item.type === "T_CUSTOMER_ICP") {
            counts[0]++;
            percentage[0] = 30;
          } else if (item.type === "T_SPEAKING_OPPORTUNITY" || item.type === "T_PEOPLE_FINDER") {
            counts[1]++;
            percentage[1] = 30;
          } else if (item.type === "T_PRODUCT_KEYWORDS") {
            counts[2]++;
            percentage[2] = 30;
          }
        });
  
        setIntelScoreData((prev) =>
          prev.map((item, index) => ({
            ...item,
            trackerValue: item.trackerValue + counts[index],
            value: percentage[index],
          }))
        );
  
        setCountData(response.count);
      }
    };
  
    fetchData();
  }, []);

  const result = useCallback((type:string) => {
    const finalResult = countData?.find((item) => item?.type === type);
    return finalResult?.count || 0;
  }, [countData]);

  const renderCount = useCallback((url:string) => {
    const count = result(url);
    return count > 0 ? (
      <div className={`badge_info text-[12px]`} style={{fontWeight:"400", fontSize: "var(--font-size-label)", padding: "6px" }}>{count} in Use</div>
    ) : null;
  }, [result]);

  const handleTemplateSelect = useCallback((template: any) => {
    console.log("Selected template:", template);
    setShowFetchedData(false);
  }, []);

  const fetchData = () => {
    setShowFetchedData(true);
    fetchCompany();
  }

  const fetchCompany = async () => {
    const response = await fetchCompanyData(inputValue, 0, 1);
    const aiSuggestion = await fetchAISuggestion(inputValue);
    const domains = aiSuggestion.map((item: any) => item.domain);
    setComp(domains);
    console.log(aiSuggestion);
    
    console.log(response.companies[0].id);
    const companyDetail = await getCompanyDetailById(response.companies[0].id);
    if(companyDetail){
      setIsLoading(false);
      const keywordValues = companyDetail.companyData.industries.asOrganizer.map((item: any) => item.name);
      setKeywordsTracker(prev => ({
        ...prev,
        keywords: keywordValues,
        name: "Top Product & Topic Trackers",
      }));
    }
  };

  const EventeliView = useMemo(() => {
    if (!isEventeli) return null;
    return (
      <div className={`${styles.container}`}>
        {(data as TemplateItem[]).map((item: any, ind: number) =>
          item.isEnabled ? (
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
                    {item?.domain && (
                      <div
                        className="badge_primary"
                        style={{
                          fontSize: "var(--font-size-label)",
                          padding: "6px",
                        }}
                      >
                        {item?.domain}
                      </div>
                    )}
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
          ) : (
            <div
              className="w-full p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px]"
              key={ind}
            >
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
                  {item?.domain && (
                    <div
                      className="badge_primary"
                      style={{
                        fontSize: "var(--font-size-label)",
                        padding: "6px",
                      }}
                    >
                      {item?.domain}
                    </div>
                  )}
                </div>
                <div className="text-[16px] font-bold text-[var(--primary-color)]">
                  {item?.trackerName}
                </div>
                <div className="font-medium text-[var(--tertiary-text-color)]">
                  {item?.content}
                </div>
              </div>
            </div>
          )
        )}
        <div className={styles.innerContainerOne}>
          <Image src={Add} alt="add" />
          <Link
            href="/internal/trackers/create?type=T_CUSTOM"
            className={styles.createUrl}
          >
            <Button className="text-white">Create Custom</Button>
          </Link>
        </div>
      </div>
    );
  }, [isEventeli, data]);

  const StandardView = useMemo(() => {
    if(isEventeli) return null;
    return (
      <div className={`flex flex-col gap-6 pl-6 pr-6`}>
        <div className="flex justify-between flex-col sm:flex-row gap-6 sm:gap-0">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-medium">Brand Brief Builder </div>
            <div className="text-sm" style={{color:"var(--tertiary-text-color)"}}>Use below templates to track & plan your event strategy.</div>
            <div className="flex gap-2 w-[29rem]">
              <div className="border-[var(--border-color)] rounded-[var(--border-radius-sm)] border flex p-1 w-full hover:border-[#D2D2F3] focus-within:border-[#D2D2F3] transition-all duration-200">
                <input
                  type="text"
                  placeholder="Enter Web URL"
                  className="border-none outline-none bg-transparent w-full"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <Button className="w-[100%] sm:w-[25%] bg-[var(--dashboard-brandkit-subtext)] text-white rounded-[var(--border-radius-sm)] flex items-center justify-center gap-2"
                onClick={() => fetchData()}
              >Fetch</Button>
            </div>
          </div>
          <div className="w-[100%] sm:w-[25%] h-40 border border-[var(--border-color)] p-1 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className={`badge_info text-xs`}>BRAND BRIEF STATUS</div>
              <IntelScore intelScore={intelScoreData} height="70px" width="70px"/>
            </div>
            <div className="w-[100%] flex gap-1">
              {intelScoreData.map((item, index) => (
                <div className="w-[33%] flex flex-col gap-1 bg-[var(--background-secondary-color)]" key={index}>
                  <div className="pl-2">+{item.value}%</div>
                  <div className="pl-2 text-xs" style={{color:`${item.fill}`}}>{item.name}</div>
                  <Slider key={index} width={item.value} color={item.fill}/>
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="my-4 border-t border-gray-300 mb-[0px] mt-[0px]"/>
        {(data as StandardTemplateGroup[]).map((item, index) => (
          <div key={index}>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-0">
              <div className="flex flex-col sm:w-[25%] sm:pr-6 pr-0 gap-2 w-[100%]">
                <div className="text-2xl flex gap-2 items-center justify-between">
                  <div className="flex gap-2 items-center">
                    {item.heading==="Prospect" && <Building2 />}
                    {item.heading==="People" && <Users />}
                    {item.heading==="Purpose" && <Lightbulb />}
                    {item.heading}
                  </div>
                  {(item.heading==="Prospect" && intelScoreData[0].value>0) &&
                    <IntelScore intelScore={intelScoreData} width="70px" height="70px" source="Prospect"/>
                  }
                  {(item.heading==="People" && intelScoreData[1].value>0) && 
                    <IntelScore intelScore={intelScoreData} width="70px" height="70px" source="People"/>
                  }
                  {(item.heading==="Purpose" && intelScoreData[2].value>0) &&
                    <IntelScore intelScore={intelScoreData} width="70px" height="70px" source="Purpose"/>
                  }
                </div>
                <div className="text-sm" style={{color:"var(--tertiary-text-color)"}}>
                  {item.subHeading}
                </div>
              </div>
              <div className={`justify-center grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:w-[75%] w-[100%] p-5 ${item.heading==="Companies" ? 'bg-[var(--company-background)]' : item.heading==="People"? 'bg-[var(--people-background)]':'bg-[var(--purpose-background)]'}`} style={{ borderRadius: '0.5px' }}>
                {item.templates.map((template:TemplateItem, index: number) => (
                  template.isEnabled ?
                  (<Link
                    href={`/internal/trackers/create?type=${template?.url}`}
                    key={index}
                  >
                    <div className="p-2 gap-2 flex items-center flex-col h-[300px] text-sm border border-[var(--border-color)] rounded-[12px] bg-[var(--primary-foreground)] justify-center relative">
                      <div className="w-full flex items-center min-h-[45%] rounded-md bg-[var(--tabs-background-color)]">
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
                          {renderCount(template?.url)}
                          {!template.isEnabled && <div className={`badge_info text-[12px] absolute right-4`} style={{fontWeight:"400", fontSize: "var(--font-size-label)", padding: "6px"}}>Coming Soon</div>}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-[16px] font-bold text-[var(--primary-color)]">
                            {template?.trackerName}
                          </div>
                        </div>
                        <div className="font-medium text-[var(--tertiary-text-color)]">
                          {template?.content}
                        </div>
                      </div>
                    </div>
                  </Link>) : (
                    <div className="p-2 gap-2 flex items-center flex-col h-[300px] text-sm border border-[var(--border-color)] rounded-[12px] bg-[var(--primary-foreground)] justify-center relative" key={index}>
                      <div className="w-full flex items-center min-h-[45%] rounded-md bg-[var(--tabs-background-color)]">
                        {renderCount(template?.url)}
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
                          {!template.isEnabled && <div className={`badge_info text-[12px] absolute right-4`} style={{fontWeight:"400", fontSize: "var(--font-size-label)", padding: "6px"}}>Coming Soon</div>}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-[16px] font-bold text-[var(--primary-color)]">
                            {template?.trackerName}
                          </div>
                        </div>
                        <div className="font-medium text-[var(--tertiary-text-color)]">
                          {template?.content}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="flex w-[100%]">
          <div className="flex w-[0%] sm:w-[25%]"></div>
          <div className="flex justify-center flex-col gap-2 sm:flex-row items-center rounded-lg w-[100%] sm:w-[75%]">
            <div>Or start from scratch</div>
            <Link href={`/internal/trackers/create?type=T_CUSTOM`}>
              <Button>Create Custom Tracker</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }, [data, intelScoreData, isEventeli, inputValue, renderCount]);

  return (
    <div style={{padding:"16px 14px",width:"100%", overflowY:"auto"}}>
      {(!isData && isEventeli) && <div className="flex items-center pb-6 !pl-14 text-lg text-[var(--secondary-text-color)] font-semibold">Explore trackers or create custom ones using advanced filters, enabling real-time monitoring of key events and informed decisions.</div>}
      {isData && 
        <button className="w-[50px] flex text-white font-bold py-2 px-4 rounded text-sm items-center justify-center ml-6"
          style={{ color: "var(--primary-color)" }} onClick={()=>hideTemplates(true)}>
          <Image src={Back} alt="close" height={22} width={22} />
          Back
        </button>
      }
      {isEventeli ? EventeliView : StandardView}

      <FetchTemplateModal
        competitors={comp}
        keywords={keywordsTracker}
        isLoading={isLoading}
        inputValue={inputValue}
        open={showFetchedData}
        onOpenChange={setShowFetchedData}
        onSelectTemplate={handleTemplateSelect}
      />
      {!showFetchedData && 
        <FetchTemplateMinModal 
          open={showFetchedData}
          onOpenChange={setShowFetchedData}
          onSelectTemplate={handleTemplateSelect}
        />
      }
    </div>
  );
});

Templates.displayName = "Templates";
export default Templates;