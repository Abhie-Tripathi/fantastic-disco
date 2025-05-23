import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/(internal)/internal/trackers/page.style.module.css";
import {
  TemplateItem,
  StandardTemplateGroup,
  TrackerTypeProp,
} from "@/types/trackers";
import { GAEvent } from "@/utils/GAEvent";
import { useToast } from "@/hooks/use-toast";
import data from "@/components/templateData";
import Template from "/public/template.svg";
import Back from "/public/back.svg";
import { isEventeli } from "@/config";
import IntelScore from "@/components/intelScore";
import Slider from "@/components/slider";
import { Building2, Users, Lightbulb, CheckCheck } from "lucide-react";
import { useTrackerServices } from "@/services/trackerServices";
import Add from "/public/add.svg";
import { Button } from "@/components/ui/button";
import FetchTemplateModal from "./internal/trackers/FetchTemplateModal";
import { useCompanyService } from "@/services/companyService";
import { suggestionGenerator } from "@/utils/openAI";
import { useTrackerContext } from "@/context/tracker";
import { useFilterContext } from "@/context/filterContext";
import { companyData, competitorData, keywordData } from "@/types/trackers";
import JoyRideCustom from "@/app/components/internal/walkthrough/JoyRideCustom";
import { useWalkthrough } from "@/hooks/useWalkthrough";
import { useIsMobile } from "@/hooks/useMediaQuery";
interface TemplateProps {
  isData: boolean;
  hideTemplates: (val: boolean) => void;
}

const fetchAISuggestion = async (promptText: string) => {
  try {
    const aiResponse: any = await suggestionGenerator(promptText);
    let content = aiResponse.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    // Remove markdown formatting (```json ... ```)
    content = content.replace(/```json|```/g, "").trim();

    const temp = JSON.parse(content);

    console.log("AI Parsed Response:", temp);

    const res = temp?.data?.companyData || temp?.data?.competitorData;

    if (res) {
      return res;
    } else {
      throw new Error(
        "Invalid response structure: neither companyData nor competitorData found"
      );
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
  }
};

const Templates = React.memo(({ isData, hideTemplates }: TemplateProps) => {
  const {
    comp,
    setComp,
    keywordsTracker,
    setKeywordsTracker,
    peopleTracker,
    setPeopleTracker,
  } = useTrackerContext();
  const isMobile = useIsMobile();
  const {
    loadingState,
    setLoadingState,
    templateView,
    setTemplateView,
    showFetchedData,
    setShowFetchedData,
  } = useFilterContext();
  const { getTrackerCount } = useTrackerServices();
  const [countData, setCountData] = useState<TrackerTypeProp[]>([]);
  // const [showFetchedData, setShowFetchedData] = useState(false);
  const aiStatus = JSON.parse(
    localStorage.getItem("companySuggestion") || "{}"
  );
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState(
    aiStatus?.companyData?.domain || ""
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const stepsConfig = isEventeli
    ? [
        {
          key: "geoTemplate",
          id: "geoTemplate",
          content:
            "Select a location to explore events, view insights, and receive location-based alerts.",
        },
        {
          key: "custom",
          id: "customTracker",
          content:
            "Prefer to start fresh? Build your custom tracker from scratch and explore all advanced filters, intel, and insights scores here.",
        },
      ]
    : ([
        {
          key: "brandBriefRef",
          id: "brandBrief",
          content:
            "Enter your company website, and we'll generate a tailored list of competitors, key influencers, and top events to follow.",
        },
        {
          key: "prospectTrackerRef",
          id: isMobile ? "mobileProspectTracker" : "prospectTracker",
          content:
            "From networking to results – Capture, track, and convert prospects seamlessly",
        },
        {
          key: "peopleTrackerRef",
          id: isMobile ? "mobilePeopleTracker" : "peopleTracker",
          content:
            "Effortlessly track and stay updated on where your people are.",
        },
        {
          key: "purposeTrackerRef",
          id: isMobile ? "mobilePurposeTracker" : "purposeTracker",
          content:
            "Track your purpose, maximize impact and make every event count.",
        },
        {
          key: "customTrackerRef",
          id: "customTracker",
          content:
            "Prefer to start fresh? Build your custom tracker from scratch and explore all advanced filters, intel, and insights scores here.",
        },
      ] as const);

  const { steps, run, setRun } = useWalkthrough({
    stepsConfig,
    currentPath: `tracker?showTemplates=true`,
  });
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const initialAIStatus = {
    competitorData: { status: 0, data: [], domain: "", name: "" },
    companyData: { status: 0, data: [], name: "" },
    keywordData: { status: 0, data: [], name: "" },
  };
  const [intelScoreData, setIntelScoreData] = useState([
    {
      name: "Prospect",
      trackerValue: 0,
      value: 0,
      fill: "#9B86D4",
    },
    {
      name: "People",
      value: 0,
      trackerValue: 0,
      fill: "#646BDC",
    },
    {
      name: "Purpose",
      trackerValue: 0,
      value: 0,
      fill: "#E99CD4",
    },
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
          } else if (
            item.type === "T_SPEAKING_OPPORTUNITY" ||
            item.type === "T_PEOPLE_FINDER"
          ) {
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

  const result = useCallback(
    (type: string) => {
      const finalResult = countData?.find((item) => item?.type === type);
      return finalResult?.count || 0;
    },
    [countData]
  );
  const updateLocalStorage = (
    key: string,
    data: companyData | competitorData | keywordData
  ) => {
    const stored = localStorage.getItem("companySuggestion");
    const parsed = stored ? JSON.parse(stored) : {};
    const updated = {
      ...parsed,
      [key]: data,
    };

    localStorage.setItem("companySuggestion", JSON.stringify(updated));
  };
  const renderCount = useCallback(
    (url: string) => {
      const count = result(url);
      return count > 0 ? (
        <div
          className={`badge_info text-[12px]`}
          style={{
            fontWeight: "400",
            fontSize: "var(--font-size-label)",
            padding: "6px",
          }}
        >
          {count} in Use
        </div>
      ) : null;
    },
    [result]
  );

  const handleTemplateSelect = useCallback((template: any) => {
    // console.log("Selected template:", template);
    setShowFetchedData(false);
  }, []);

  const fetchData = () => {
    // console.log("templateView", templateView);
    if (!isValidURL(inputValue)) {
      toast({
        description: "Please enter valid url",
        variant: "destructive",
      });
      return;
    }
    if (templateView) setTemplateView(false);
    GAEvent("Brand Brief", "Tracker", "BrandBrief", `${inputValue} fetch`);
    //Load existing data or use initial state
    let currentData;
    try {
      const storedData = localStorage.getItem("companySuggestion");
      currentData = storedData
        ? JSON.parse(storedData)
        : { ...initialAIStatus };
    } catch (error) {
      console.error("Error loading stored data:", error);
      currentData = { ...initialAIStatus };
    }

    //Prepare updated status
    const updatedStatus = {
      competitorData:
        currentData.competitorData?.status === 1
          ? currentData.competitorData
          : { ...initialAIStatus.competitorData },

      companyData: {
        ...(currentData.companyData?.status === 1
          ? currentData.companyData
          : initialAIStatus.companyData),
        domain: inputValue, // Always update domain
      },

      keywordData:
        currentData.keywordData?.status === 1
          ? currentData.keywordData
          : { ...initialAIStatus.keywordData },
    };

    // Save and update UI
    localStorage.setItem("companySuggestion", JSON.stringify(updatedStatus));
    setShowFetchedData(true);
    if (inputValue.length === 0) {
      setShowFetchedData(false);
      return;
    }
    fetchCompany();
  };

  const fetchCompany = async () => {
    let fallbackCategories: string[] = [];
    let fallbackDomains: string[] = [];
    let allPOCs;
    try {
      //Always get AI suggestions first
      const prompt = `List 5 direct competitors of the domain ${inputValue}. Return only this JSON format:
{
"data":{
  "competitorData": [
    { "domain": "competitor1.com" },
    { "domain": "competitor2.com" },
    { "domain": "competitor3.com" },
    { "domain": "competitor4.com" },
    { "domain": "competitor5.com" }
  ]
}
}

Respond only with valid JSON. No explanation, no markdown, and no extra text.
`;
      // console.log(aiStatus?.competitorData?.status);

      if (!loadingState.isCompetitorsLoading) {
        const aiSuggestion = await fetchAISuggestion(prompt);
        if (!aiSuggestion || !Array.isArray(aiSuggestion)) {
          throw new Error("Invalid AI suggestion format");
        }
        // console.log("aiSuggestion",aiSuggestion);
        fallbackDomains = aiSuggestion.map((item: any) => item.domain);

        allPOCs = aiSuggestion.flatMap((company: any) =>
          (company?.poc || []).map((person: any) => ({
            name: person.name,
            companyName: person.companyName,
          }))
        );
        // console.log("fallbackDomains",fallbackDomains);
        setLoadingState((prev) => ({
          ...prev,
          isCompetitorsLoading: true,
        }));
        const competitorResponse = {
          status: 1,
          data: aiSuggestion,
          name: "Top Competitors",
        };
        updateLocalStorage("competitorData", competitorResponse);
        // setComp(prev => ({
        //     ...prev,
        //     competitors: [...prev.competitors, ...fallbackDomains],
        //     name: "Top Competitors Trackers",
        //   }));
      }

      // Step 2: Try internal API
      if (!loadingState.isKeywordsLoading) {
        let response;
        let fallbackCategories: string[] = [];

        try {
          // 1. First await with separate error handling
          await fetchKeywordData(inputValue);
        } catch (error) {
          console.error("Main error handler:", error);
          // if (!fallbackCategories.length) {
          //   await fetchAIFallback(inputValue);
          // }
        } finally {
          setLoadingState((prev) => ({ ...prev, isKeywordsLoading: true }));
          // Step 2: Call poc api
          if (!loadingState.isCompetitorsLoading) {
            const pocDetail = await getPocDetailByDomain(fallbackDomains);
          }
        }
      }
    } catch (error) {
      console.warn("Falling back to AI data due to error:", error);
    } finally {
      // console.log("fallbackDomains", fallbackDomains);
    }
  };
  const getPocDetailByDomain = async (domains: string[]) => {
    const prompt = `Find companies that are clients of ${domains}. For each company, identify publicly verifiable Points of Contact (POCs) who are associated with organizing or managing events. For each POC, include their full name, designation, and company name. Return the data in the following JSON format:
{
  "data": {
    "companyData": {
      "pocs": [
        {
          "name": "[POC Name]",
          "customerCompanyName": "[Client Company Name]",
          "designation": "[POC Designation]"
        }
      ]
    }
  }
}
Do not include the competitor platform names in the output. Only return publicly available data also exclude , from customerCompanyName) .`;
    const response = await fetchAISuggestion(prompt);
    // console.log("POC Response:", response);
    setLoadingState((prev) => ({
      ...prev,
      isPeopleLoading: true,
    }));
    const companyResponse = {
      status: 1,
      domain: aiStatus?.companyData?.domain || inputValue,
      data: response,
      name: "Top People Finder",
    };
    updateLocalStorage("companyData", companyResponse);
    // if (response?.companies?.length > 0) {
    //   const companyId = response.companies[0].id;
  };
  async function fetchKeywordData(domain: string) {
    const prompt = `For the domain ${domain}, identify the relevant keywords.
  
  Return only this JSON structure:
  
  {
    "data": {
      "companyData": {
        "keywords": [
        {"keyword": "keyword1"},
        {"keyword": "keyword2"},
        {"keyword": "keyword3"},
        ]
      }
    }
  }
  
  Respond only with valid JSON. No explanation or extra text.`;

    const aiSuggestion = await fetchAISuggestion(prompt);
    // console.log(aiSuggestion);
    // const updatedCategory = aiSuggestion.categories.map((item: any) => item.toLowerCase());
    const keywords = aiSuggestion.keywords;
    const keywordResponse = {
      status: 1,
      data: keywords,
      name: "Top Product & Topic",
    };

    updateLocalStorage("keywordData", keywordResponse);
  }

  function isValidURL(url: string): boolean {
    try {
      // Prepend http if missing for URL constructor to work properly
      const hasProtocol = /^(https?:)?\/\//i.test(url);
      const testUrl = hasProtocol ? url : `http://${url}`;
      const parsed = new URL(testUrl);

      // Basic checks
      if (!parsed.hostname) return false;

      // Optionally, check for valid TLD or IP format
      const hostname = parsed.hostname;
      const tldPattern = /^[a-z]{2,}$/i;
      const ipPattern =
        /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;

      const parts = hostname.split(".");
      const tld = parts[parts.length - 1];

      return (
        ipPattern.test(hostname) || // is IP
        (parts.length > 1 && tldPattern.test(tld)) // has valid domain and TLD
      );
    } catch (e) {
      return false;
    }
  }

  const EventeliView = useMemo(() => {
    if (!isEventeli) return null;
    return (
      <div className="flex gap-2 w-full justify-center items-center flex-col sm:flex-row">
        <div className="flex gap-2 flex-wrap justify-center" id="geoTemplate">
          {(data as TemplateItem[]).map((item: any, ind: number) =>
            item.isEnabled ? (
              <Link
                href={`/internal/trackers/create?type=${item?.url}`}
                key={ind}
              >
                <div className="w-[280px] sm:w-[250px] lg:w-[280px] p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px]">
                  <div className="w-full flex items-center h-[45%] rounded-md bg-[var(--tabs-background-color)]">
                    <div className={styles.account}>
                      <Image
                        src={item.img}
                        alt="people"
                        width={31}
                        height={31}
                      />
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
                className="w-[280px] sm:w-[250px] lg:w-[280px] p-2 gap-2 flex items-center flex-col h-[270px] text-sm border border-[var(--border-color)] rounded-[12px] bg-red"
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
          <div
            className={`${styles.innerContainerOne} mt-4 sm:mt-0`}
            style={{ width: "280px" }}
            id="customTracker"
          >
            <Image src={Add} alt="add" />
            <Link
              href="/internal/trackers/create?type=T_CUSTOM"
              className={styles.createUrl}
            >
              <Button className="text-white">Create Custom</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }, [isEventeli, data]);

  const StandardView = useMemo(() => {
    if (isEventeli) return null;
    return (
      <div className={`flex flex-col gap-6 pl-6 pr-6 h-[100%]`}>
        <div
          className="flex justify-between flex-col sm:flex-row gap-6 sm:gap-0"
          id="brandBrief"
        >
          <div className="flex flex-col gap-2">
            <div className="text-xl font-medium">Brand Brief Builder </div>
            <div
              className="text-sm"
              style={{ color: "var(--tertiary-text-color)" }}
            >
              Use below templates to track & plan your event strategy or paste
              your link below.
            </div>
            <div className="flex gap-2 w:[100%] sm:w-[29rem]">
              <div className="border-[var(--border-color)] rounded-[var(--border-radius-sm)] border flex p-1 w-[80%] sm:w-full hover:border-[var(--primary-color)] focus-within:border-[var(--primary-color)] transition-all duration-200 hover:shadow-[0_0_8px_2px_rgba(103,80,164,0.4)] focus-within:shadow-[0_0_8px_2px_rgba(103,80,164,0.4)]">
                <input
                  type="text"
                  // ref={inputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchData();
                    }
                  }}
                  placeholder="Enter Web URL"
                  className="border-none outline-none bg-transparent w-full"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <Button
                className={`w-[20%] sm:w-[20%] ${
                  inputValue.length > 0
                    ? "bg-[var(--primary-color)]"
                    : "bg-[var(--dashboard-brandkit-subtext)]"
                } text-white rounded-[var(--border-radius-sm)] flex items-center justify-center gap-2`}
                onClick={() => fetchData()}
              >
                Fetch
              </Button>
            </div>
          </div>
          <div className="w-[100%] sm:w-[25%] h-40 border border-[var(--border-color)] p-1 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className={`badge_info text-xs`}>BRAND BRIEF STATUS</div>
              <IntelScore
                intelScore={intelScoreData}
                height="70px"
                width="70px"
              />
            </div>
            <div className="w-[100%] flex gap-1">
              {intelScoreData.map((item, index) => (
                <div
                  className="w-[33%] flex flex-col gap-1 bg-[var(--background-secondary-color)]"
                  key={index}
                >
                  <div className="pl-2">+{item.value}%</div>
                  <div
                    className="pl-2 text-xs"
                    style={{ color: `${item.fill}` }}
                  >
                    {item.name}
                  </div>
                  <Slider key={index} width={item.value} color={item.fill} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <hr className="my-4 border-t border-gray-300 mb-[0px] mt-[0px]" />
        {(data as StandardTemplateGroup[]).map((item, index) => {
          const sectionId =
            item.heading === "Prospect"
              ? "prospectTracker"
              : item.heading === "People"
              ? "peopleTracker"
              : "purposeTracker";
          const mobileSectionId =
            item.heading === "Prospect"
              ? "mobileProspectTracker"
              : item.heading === "People"
              ? "mobilePeopleTracker"
              : "mobilePurposeTracker";
          return (
            <div key={index} id={sectionId}>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-0">
                <div className="flex flex-col sm:w-[25%] sm:pr-6 pr-0 gap-2 w-[100%]">
                  <div
                    className="text-2xl flex gap-2 items-center justify-between"
                    id={mobileSectionId}
                  >
                    <div className="flex gap-2 items-center">
                      {item.heading === "Prospect" && <Building2 />}
                      {item.heading === "People" && <Users />}
                      {item.heading === "Purpose" && <Lightbulb />}
                      {item.heading}
                    </div>
                    {item.heading === "Prospect" &&
                      intelScoreData[0].value > 0 && (
                        <IntelScore
                          intelScore={intelScoreData}
                          width="70px"
                          height="70px"
                          source="Prospect"
                        />
                      )}
                    {item.heading === "People" &&
                      intelScoreData[1].value > 0 && (
                        <IntelScore
                          intelScore={intelScoreData}
                          width="70px"
                          height="70px"
                          source="People"
                        />
                      )}
                    {item.heading === "Purpose" &&
                      intelScoreData[2].value > 0 && (
                        <IntelScore
                          intelScore={intelScoreData}
                          width="70px"
                          height="70px"
                          source="Purpose"
                        />
                      )}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "var(--tertiary-text-color)" }}
                  >
                    {item.subHeading}
                  </div>
                </div>
                <div
                  className={`justify-center grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:w-[75%] w-[100%] p-5 ${
                    item.heading === "Companies"
                      ? "bg-[var(--company-background)]"
                      : item.heading === "People"
                      ? "bg-[var(--people-background)]"
                      : "bg-[var(--purpose-background)]"
                  }`}
                  style={{ borderRadius: "0.5px" }}
                >
                  {item.templates.map((template: TemplateItem, index: number) =>
                    template.isEnabled ? (
                      <Link
                        href={`/internal/trackers/create?type=${template?.url}`}
                        key={index}
                      >
                        <div className="p-2 gap-2 flex items-center flex-col h-[300px] text-sm border border-[var(--border-color)] rounded-[12px] bg-[var(--primary-foreground)] justify-center relative">
                          <div className="w-full flex items-center min-h-[45%] rounded-md bg-[var(--tabs-background-color)]">
                            <div className={styles.account}>
                              <Image
                                src={template.img}
                                alt="people"
                                width={31}
                                height={31}
                              />
                            </div>
                            <div>
                              <Image src={Template} alt="template" />
                            </div>
                          </div>
                          <div className="w-full h-[60%] flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              {template?.domain && (
                                <div
                                  className="badge_primary"
                                  style={{
                                    fontSize: "var(--font-size-label)",
                                    padding: "6px",
                                  }}
                                >
                                  {template?.domain}
                                </div>
                              )}
                              {renderCount(template?.url)}
                              {!template.isEnabled && (
                                <div
                                  className={`badge_info text-[12px] absolute right-4`}
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "var(--font-size-label)",
                                    padding: "6px",
                                  }}
                                >
                                  Coming Soon
                                </div>
                              )}
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
                      </Link>
                    ) : (
                      <div
                        className="p-2 gap-2 flex items-center flex-col h-[300px] text-sm border border-[var(--border-color)] rounded-[12px] bg-[var(--primary-foreground)] justify-center relative"
                        key={index}
                      >
                        <div className="w-full flex items-center min-h-[45%] rounded-md bg-[var(--tabs-background-color)]">
                          {renderCount(template?.url)}
                          <div className={styles.account}>
                            <Image
                              src={template.img}
                              alt="people"
                              width={31}
                              height={31}
                            />
                          </div>
                          <div>
                            <Image src={Template} alt="template" />
                          </div>
                        </div>
                        <div className="w-full h-[60%] flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            {template?.domain && (
                              <div
                                className="badge_primary"
                                style={{
                                  fontSize: "var(--font-size-label)",
                                  padding: "6px",
                                }}
                              >
                                {template?.domain}
                              </div>
                            )}
                            {!template.isEnabled && (
                              <div
                                className={`badge_info text-[12px] absolute right-4`}
                                style={{
                                  fontWeight: "400",
                                  fontSize: "var(--font-size-label)",
                                  padding: "6px",
                                }}
                              >
                                Coming Soon
                              </div>
                            )}
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
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex w-[100%] pb-5">
          <div className="flex w-[0%] sm:w-[25%]"></div>
          <div className="flex justify-center flex-col gap-2 sm:flex-row items-center rounded-lg w-[100%] sm:w-[75%]">
            <div
              id="customTracker"
              className="flex justify-center items-center gap-2"
            >
              <div>Or start from scratch</div>
              <Link href={`/internal/trackers/create?type=T_CUSTOM`}>
                <Button>Create Custom Tracker</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }, [data, intelScoreData, isEventeli, inputValue, renderCount]);

  return (
    <div style={{ padding: "16px 14px", width: "100%", overflowY: "auto" }}>
      {steps?.length > 0 && (
        <JoyRideCustom
          steps={steps}
          run={run}
          onFinish={() => setRun(false)}
          pathName="tracker?showTemplates=true"
        />
      )}
      {!isData && isEventeli && (
        <div className="flex items-center pb-6 !pl-14 text-lg text-[var(--secondary-text-color)] font-semibold">
          Explore trackers or create custom ones using advanced filters,
          enabling real-time monitoring of key events and informed decisions.
        </div>
      )}
      {isData && (
        <button
          className="w-[50px] flex text-white font-bold py-2 px-4 rounded text-sm items-center justify-center ml-6"
          style={{ color: "var(--primary-color)" }}
          onClick={() => hideTemplates(true)}
        >
          <Image src={Back} alt="close" height={22} width={22} />
          Back
        </button>
      )}
      {isEventeli ? EventeliView : StandardView}
      {inputValue.length > 0 && (
        <FetchTemplateModal
          loadingState={loadingState}
          inputValue={inputValue}
          open={showFetchedData}
          onOpenChange={setShowFetchedData}
        />
      )}
    </div>
  );
});

Templates.displayName = "Templates";
export default Templates;
