"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./trackedConfiguration.style.module.css";
import keyStyles from '@/app/components/trackers/advanceFilter/advanceFilter.style.module.css'
import BasicFilter from "@/app/components/trackers/basicFilter";
import LocationFilter from "@/app/components/trackers/locationFilter";
import Url from '/public/url.svg'
import EventStatusData from "@/public/data/eventType.json";
import Company from '/public/company_Icon.svg'
import Name from '/public/userName_Icon.svg'
import Insights from "@/app/components/trackers/insights";
import Intel from "@/app/components/trackers/intel";
import AdvanceFilter from "@/app/components/trackers/advanceFilter";
import Labels from "@/app/components/trackers/labels";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { myFetch } from "@/utils/myFetch";
import { baseUrl } from "@/context";
import Link from "next/link";
import { GAEvent } from "@/utils/GAEvent";
import { showToast } from '@/utils/showToast';
import EventType from "@/app/components/Search/Dropdowns/EventType";
import Loading from "@/app/components/UI/Loading";
import ToggleBtn from "@/app/components/UI/ToggleBtn";
import { useTrackerServices } from "@/services/trackerServices";
// import SideNav from "@/app/components/trackers/sideNav";
import { useTrackerContext } from "@/context/tracker";
import { Button } from "@/components/ui/button";
function CustomeTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill={fillColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.4668 4.5C4.4668 3.94188 4.57673 3.38923 4.79031 2.87359C5.00389 2.35796 5.31694 1.88945 5.71159 1.4948C6.10624 1.10015 6.57476 0.787094 7.09039 0.573512C7.60603 0.359929 8.15868 0.25 8.7168 0.25C9.27491 0.25 9.82757 0.359929 10.3432 0.573512C10.8588 0.787094 11.3274 1.10015 11.722 1.4948C12.1166 1.88945 12.4297 2.35796 12.6433 2.87359C12.8569 3.38923 12.9668 3.94188 12.9668 4.5C12.9668 5.62717 12.519 6.70817 11.722 7.5052C10.925 8.30223 9.84397 8.75 8.7168 8.75C7.58963 8.75 6.50862 8.30223 5.71159 7.5052C4.91456 6.70817 4.4668 5.62717 4.4668 4.5ZM8.7168 1.75C7.98745 1.75 7.28798 2.03973 6.77225 2.55546C6.25653 3.07118 5.9668 3.77065 5.9668 4.5C5.9668 5.22934 6.25653 5.92882 6.77225 6.44454C7.28798 6.96027 7.98745 7.25 8.7168 7.25C9.44614 7.25 10.1456 6.96027 10.6613 6.44454C11.1771 5.92882 11.4668 5.22934 11.4668 4.5C11.4668 3.77065 11.1771 3.07118 10.6613 2.55546C10.1456 2.03973 9.44614 1.75 8.7168 1.75ZM4.7168 11.75C4.12006 11.75 3.54776 11.9871 3.12581 12.409C2.70385 12.831 2.4668 13.4033 2.4668 14V15.188C2.4668 15.206 2.4798 15.222 2.4978 15.225C6.6168 15.897 10.8178 15.897 14.9358 15.225C14.9445 15.2236 14.9525 15.219 14.9582 15.2122C14.9639 15.2055 14.9669 15.1969 14.9668 15.188V14C14.9668 13.4033 14.7297 12.831 14.3078 12.409C13.8858 11.9871 13.3135 11.75 12.7168 11.75H12.3768C12.35 11.7498 12.3233 11.7538 12.2978 11.762L11.4328 12.045C9.66797 12.6212 7.76562 12.6212 6.0008 12.045L5.1348 11.762C5.10991 11.754 5.08393 11.75 5.0578 11.75H4.7168ZM0.966797 14C0.966797 13.0054 1.36189 12.0516 2.06515 11.3483C2.76841 10.6451 3.72223 10.25 4.7168 10.25H5.0568C5.2418 10.25 5.4258 10.28 5.6008 10.336L6.4668 10.619C7.92884 11.0962 9.50476 11.0962 10.9668 10.619L11.8328 10.336C12.0078 10.279 12.1918 10.25 12.3758 10.25H12.7168C13.7114 10.25 14.6652 10.6451 15.3684 11.3483C16.0717 12.0516 16.4668 13.0054 16.4668 14V15.188C16.4668 15.942 15.9208 16.584 15.1768 16.705C10.8984 17.4034 6.53515 17.4034 2.2568 16.705C1.89672 16.6464 1.56924 16.4616 1.33291 16.1837C1.09657 15.9057 0.966802 15.5528 0.966797 15.188V14Z"
        fill={fillColor}
      />
    </svg>
  );
}
interface CategoryData {
  attendedCategories?: string[];
  nonAttendedCategories?: string[];
  unscheduledCategories?: string[];
}
interface Tracker {
  name: string;
  filterValue: any;
}
interface Toggle{
  rating?:boolean;
  exhibit?:boolean;
  trust?:boolean;
  maturity?: boolean;
  brandedEvent?: boolean;
  eventSeries?: boolean;
  forecastedStatus?: boolean;
  impactScore?: boolean;
  inboundScore?: boolean;
  internationalScore?: boolean;
  eventRank?: boolean;
  audienceZone?: boolean;
  audienceSpread?: boolean;
}
interface EditData {
  tracker: Tracker;
}
const Page = () => {
  const pathName = usePathname().split('/');
  const {data, setIsNewCall, editTrue}=useTrackerContext();
  const router = useRouter();
  const {delTracker, getTrackerDetail, error, isLoading}=useTrackerServices();
  const [type,setType]=useState("Custom");
  const last = pathName[pathName.length - 2];
  const searchParams = useSearchParams()
  const typeVal = searchParams.get('type')
  // const [data, setData] = useState<any>([]);
  const [del, setDel] = useState(false);
  // const [loading,setLoading]=useState(true);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const result = await getTrackerDetail(last, "edit=true")
  //     if(error){
  //       console.error("Error fetching data:", error);
  //     }
  //     else{
  //       setData(result);
  //     }
  //   };

  //   fetchData();
  // }, []);
  useEffect(()=>{
    if(editTrue)
    setIsNewCall(true);
  },[editTrue])
  function formatDate(dateString:Date) {
    const date = new Date(dateString);
    
    // Get day
    const day = date.getDate();
    
    // Get month and convert it to short format
    const month = date.toLocaleString('default', { month: 'short' });
    
    // Get year
    const year = date.getFullYear();
    
    // Format the date
    const formattedDate = `${day} ${month}, ${year}`;
    
    return formattedDate;
}
  useEffect(()=>{
    if(typeVal === "T_COMPETITOR") setType("Competitor");
    else if(typeVal === "T_SPEAKING_OPPORTUNITY") setType("Speaking Opportunity")
    else if(typeVal === "T_PRODUCT_KEYWORDS") setType("Product and Topics")
    else if(typeVal === "T_PEOPLE_FINDER") setType("People Finder")
    else if(typeVal === "T_RECRUITMENT") setType("Recruitment")
    else if(typeVal === "T_CUSTOMER_ICP") setType("Customer ICP")
  },[])

  // useEffect(() => {
  //   const newArr: string[] = [
  //     ...(categoryData?.attendedCategories ?? []),
  //     ...(categoryData?.nonAttendedCategories ?? []),
  //     ...(categoryData?.unscheduledCategories ?? [])
  //   ];
  //   console.log(newArr);

  //   const filteredArr = newArr
  //     .filter((item: any) => data?.tracker?.filterValue?.eventCategory?.split(',').includes(item?.id))
  //     .map((item: any) => item.name);

  //   setArr(filteredArr);
  // }, [categoryData, data]);

  // useEffect(() => {
  //   console.log(arr);
  // }, [arr]);
  const deleteTracker = async () => {
    const result=await delTracker(`${pathName[pathName.length - 2]}`)
    if(result){
       showToast("success", "Tracker deleted successfully")
      GAEvent(
        "trackers",
        "Tracker Detail",
        "Delete",
        "Delete"
      );
      router.replace(`/internal/trackers`);
    }
  }
  const [locations, setLocations] = useState<any>();
  const closeShareModal = () => {
    setDel(false);
    document.body.style.height = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
  };
  useEffect(() => {
    const eventCountry = data?.tracker?.filterValue?.eventCountry?.map((countryObj: any) => Object.values(countryObj)[0]) || [];
    const eventCity = data?.tracker?.filterValue?.eventCity?.map((cityObj: any) => Object.values(cityObj)[0]) || [];
    const eventZone = data?.tracker?.filterValue?.eventRegion?.split(",") || [];
    setLocations([...eventCountry, ...eventCity, ...eventZone]);
  }, [data]);
const eventType=data?.tracker?.filterValue?.eventType?
data?.tracker?.filterValue?.eventType
  :[];
  const eventEntry=data?.tracker?.filterValue?.eventEntry ?
  data?.tracker?.filterValue?.eventEntry?.split(','):[];
  const eventSize=data?.tracker?.filterValue?.eventSize ?
  data?.tracker?.filterValue?.eventSize?.split(','):[];
const format=data?.tracker?.filterValue?.eventFormat?.info?.length !== 0 ? data?.tracker?.filterValue?.eventFormat?.split(','):[];
const endDateValue = data?.tracker?.filterValue?.endDate;
const startDate = endDateValue ? endDateValue.split(",")[0] : null;
const endDate = endDateValue ? endDateValue.split(",")[1] : null;
const eventStatus = data?.tracker?.filterValue?.eventStatus?.length >0 ? data?.tracker?.filterValue?.eventStatus?.split(','):[]
const userRating=
  data?.tracker?.filterValue?.eventRating?.length>0
    ? data?.tracker?.filterValue?.eventRating.split(",")
    : []
   const allKeywords=data?.tracker?.filterValue?.eventKeywords?.length !== 0 ? data?.tracker?.filterValue?.eventKeywords?.split('+') : [];
   let toggleOpend: Toggle={};
  if(data?.tracker?.filterValue?.userType)
  toggleOpend=JSON.parse(data?.tracker?.filterValue?.userType);
  const commonClasses={
    filter:`flex flex-col gap-[var(--spacing-sm)] p-3 border border-[var(--border-color)] rounded-[var(--border-radius-sm)]`,
    filterHeading:`text-[var(--primary-color)] font-medium`,
    data:`text-xs text-[var(--secondary-text-color)] p-1`,
    allValues: `flex gap-3`
  }
  
  return (
    <>
    {isLoading ? <Loading/> :
    <div className='flex w-[calc(100vw-134px)] flex-col gap-6 text-sm' >
      {/* <SideNav/> */}
    <div className="flex fixed z-[5] w-[calc(100vw-134px)] mt-[54px] items-center justify-between bg-[var(--heading-background-color)] p-3">
      <div className="flex items-center gap-2">
        <div>
          <CustomeTracker fillColor="#6750a4" />
        </div>
        <div className="flex flex-col">
          <div className="text-[var(--primary-color)] font-bold text-lg">{type} Tracker</div>
          <div className="text-sm text-[var(--secondary-text-color)]">
            Select from the available data filters to create a tracker
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className={styles.containerTopRightTwo} >
          <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)] w-[100px]" onClick={() => setDel(true)}>Delete</Button>
        </div>
        {/* {data?.tracker?.accessLevel!=="READ" && */}
        <div className={styles.containerTopRight}>
        <Link href={`/internal/trackers/${last}/editTracker?type=${typeVal}`}>
          <Button className="text-white w-[100px]"
            onClick={() =>
              GAEvent(
                "trackers",
                "Tracker Detail",
                "Edit",
                "Edit"
              )
            }
          >
            Edit
          </Button>
        </Link>
      </div>
        {/* } */}
        

      </div>
    </div>
    <div className="flex flex-col mt-[140px] gap-6">
      <div className='fixed top-0 w-[calc(100vw-134px)] bg-[var(--primary-foreground)] h-[224px]' style={{zIndex:"3"}}></div>
    <div className="px-[27px] py-[4px] border-[0.5px] border-[var(--border-color)] rounded-lg h-[55px] flex items-center font-medium">{data?.tracker?.name}</div>
    {data?.tracker && data.tracker.type === "T_PRODUCT_KEYWORDS" &&
      <>
        <div className={styles.innerContainer}>
          <div
            className="border rounded-[var(--border-radius-sm)]" 
            style={{ paddingLeft: "20px" }}
          >
            <div className={styles.advanceHead}>Product and Topics</div>
            <div className={styles.customContent}>
              {/* <div className={styles.urlDiv}>
                <Image src={Url} alt="url" className="icons" />
                URL
                </div> */}
               List all the events which belongs to given industry or associated with keywords.
            </div>
          </div>
          <div className={styles.innerContainerRight}>
          <div className={keyStyles.allCat1}>
                   {allKeywords?.map((item: string, id: number) => (
                       item?.charAt(0) !== '-' ? (
                           <div key={id} className={`${keyStyles.tooltipContainer} ${keyStyles.key}`}>{item.replaceAll("_"," ")}
                           <span className={keyStyles.tooltipText}>Included Keyword</span>
                           </div>
                       ) : (
                           <div key={id} className={`${keyStyles.tooltipContainer} ${keyStyles.keyNegative}`}>{item.replaceAll("_"," ").substring(1)}
                           <span className={keyStyles.tooltipText}>Excluded Keyword</span>
                           </div>
                       )
                   ))}
               </div>
          </div>
        </div>
        <div className={styles.line}></div>
      </>
    }
    {data?.tracker && data.tracker.type === "T_COMPETITOR" &&
      <>
        <div className={styles.innerContainer}>
          <div
            className={styles.innerContainerLeft}
            style={{ paddingLeft: "20px" }}
          >
            <div className={styles.advanceHead}>Competitor&apos;s Name / Website</div>
            <div className={styles.customContent}>
              {/* <div className={styles.urlDiv}>
                <Image src={Url} alt="url" className="icons" />
                URL
                </div> */}
               Track your competitor experts, influencers and where they might be participating in events
            </div>
          </div>
          <div className={styles.innerContainerRight}>
          <div className={styles.allInputBox}>
          {data?.tracker?.filterValue?.orgName?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  {/* <Image src={ <div className={styles.line}></div>Url} alt="url_icon"/> */}
                  <div key={ind} title={item} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
                {data?.tracker?.filterValue?.orgWebsite?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  {/* <Image src={Url} alt="url_icon"/> */}
                  <div key={ind} title={item} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
              </div>
          </div>
        </div>
        <div className={styles.line}></div>
      </>
    }
    {data?.tracker && data.tracker.type === "T_SPEAKING_OPPORTUNITY" &&
      <>
        <div className={styles.innerContainer}>
          <div
            className={styles.innerContainerLeft}
            style={{ paddingLeft: "20px" }}
          >
            <div className={styles.advanceHead}>Speaking Opportunity</div>
            <div className={styles.customContent}>
              {/* <div className={styles.urlDiv}>
                <Image src={Url} alt="url" className="icons" />
                URL
                </div> */}
               Team members and their details to keep track of the events with speaking opportunities.
            </div>
          </div>
          <div className={styles.innerContainerRight} style={{flexDirection:"row"}}>
          <div className={styles.speakerAllInputBox}>
          <div className={styles.singleUrl} style={{border:"0px", padding:"0"}}>
                  {/* <Image src={Name} alt="url_icon" className="icons" width={10}/> */}
                  <div className={styles.singleInputBox} style={{fontWeight:"var(--font-weight-semibold)"}}>Speaker&apos;s Name</div>
          </div>
                {data?.tracker?.filterValue?.speakerName?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  <Image src={Name} alt="url_icon" className="icons" width={10}/>
                  <div key={ind} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
          </div>
          <div className={styles.speakerAllInputBox}>
          <div className={styles.singleUrl} style={{border:"0px", padding:"0"}}>
                  {/* <Image src={Company} alt="url_icon" className="icons" width={10}/> */}
                  <div className={styles.singleInputBox} style={{fontWeight:"var(--font-weight-semibold)", padding:"0"}}>Company Name</div>
                  </div>
                {data?.tracker?.filterValue?.speakerOrg?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  <Image src={Company} alt="url_icon" className="icons" width={10}/>
                  <div key={ind} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
          </div>
          </div>
        </div>
        <div className={styles.line}></div>
      </>
    }
    {data?.tracker && data.tracker.type === "T_PEOPLE_FINDER" &&
      <>
        <div className={styles.innerContainer}>
          <div
            className={styles.innerContainerLeft}
            style={{ paddingLeft: "20px" }}
          >
            <div className={styles.advanceHead}>People Finder</div>
            <div className={styles.customContent}>
              Track experts, influencers and where they might be participating in various events
            </div>
          </div>
          <div className={styles.innerContainerRight} style={{flexDirection:"row"}}>
          <div className={styles.speakerAllInputBox}>
          <div className={styles.singleUrl} style={{border:"0px", padding:"0"}}>
                  {/* <Image src={Name} alt="url_icon" className="icons" width={10}/> */}
                  <div className={styles.singleInputBox} style={{fontWeight:"var(--font-weight-semibold)"}}>Name</div>
          </div>
                {data?.tracker?.filterValue?.userName?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  <Image src={Name} alt="url_icon" className="icons" width={10}/>
                  <div key={ind} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
          </div>
          <div className={styles.speakerAllInputBox}>
          <div className={styles.singleUrl} style={{border:"0px", padding:"0"}}>
                  {/* <Image src={Company} alt="url_icon" className="icons" width={10}/> */}
                  <div className={styles.singleInputBox} style={{fontWeight:"var(--font-weight-semibold)", padding:"0"}}>Company Name</div>
                  </div>
                {data?.tracker?.filterValue?.speakerOrg?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  <Image src={Company} alt="url_icon" className="icons" width={10}/>
                  <div key={ind} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
          </div>
          </div>
        </div>
        <div className={styles.line}></div>
      </>
    }
    {data?.tracker && data.tracker.type === "T_RECRUITMENT" &&
      <>
        <div className={styles.innerContainer}>
          <div
            className={styles.innerContainerLeft}
            style={{ paddingLeft: "20px" }}
          >
            <div className={styles.advanceHead}>Recruitment</div>
            <div className={styles.customContent}>
              Input designations and upload job descriptions to identify relevant events effortlessly
            </div>
          </div>
          <div className={styles.innerContainerRight}>
            <div className={styles.allInputBox}>
              {data?.tracker?.filterValue?.designation?.map((item: any, ind: number) => (
                <div className={styles.singleUrl} key={ind}>
                {/* <Image src={ <div className={styles.line}></div>Url} alt="url_icon"/> */}
                <div key={ind} title={item.name} className={styles.singleInputBox}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.line}></div>
      </>
    }
    {data?.tracker && data.tracker.type === "T_CUSTOMER_ICP" &&
      <>
        <div className={styles.innerContainer}>
          <div
            className={styles.innerContainerLeft}
            style={{ paddingLeft: "20px" }}
          >
            <div className={styles.advanceHead}>Company Name / Website</div>
            <div className={styles.customContent}>
              Input ideal customer profile details like company, location or websites to track their interests
            </div>
          </div>
          <div className={styles.innerContainerRight}>
          <div className={styles.allInputBox}>
          {data?.tracker?.filterValue?.orgName?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  {/* <Image src={ <div className={styles.line}></div>Url} alt="url_icon"/> */}
                  <div key={ind} title={item} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
                {data?.tracker?.filterValue?.orgWebsite?.split(',')?.map((item: string, ind: number) => (
                  <div className={styles.singleUrl} key={ind}>
                  {/* <Image src={Url} alt="url_icon"/> */}
                  <div key={ind} title={item} className={styles.singleInputBox}>{item}</div>
                  </div>
                ))}
              </div>
          </div>
        </div>
        <div className={styles.line}></div>
      </>
    }
    
    <div className={styles.innerContainer}>
      <div
        className="border rounded-[var(--border-radius-sm)]" 
        style={{ border: "1px solid var(--border-color)" }}
      >
        {data && (
          <BasicFilter
            category={
              data?.tracker?.filterValue?.eventCategory?.length > 0
                ? data?.tracker?.filterValue?.eventCategory
                : []
            }
          />
        )}
      </div>
      <div className={styles.innerContainerRight}>
      <div className={styles.formatFreq}>
      <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading}>Location</div>
                    <div className="flex flex-col">
                        {locations?.map((item: string, id: number) => (
                            <>
                                <span className="text-xs text-[var(--secondary-text-color)]">{item}</span>
                            </>
                        ))}
                    </div>
                </div>
      <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading}>Event Type</div>
                    <div className={commonClasses.allValues}>
                        {eventType?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={commonClasses.data}>{item}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>

      <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading}>Event Format</div>
                    <div className={commonClasses.allValues}>
                        {format?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={commonClasses.data}>{item.charAt(0).toUpperCase()}{item.substring(1)}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
                {/* <div className={styles.format}>
                    <div className={styles.formatHead}>Location</div>
                    <div className={styles.allCat}>
                        {locations?.map((item: string, id: number) => (
                            <>
                                    <span className={styles.item}>{item}</span>
                            </>
                        ))}
                    </div>
                </div> */}
      <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading}>Date</div>
                    <div className={commonClasses.allValues}>
                    <div className={commonClasses.data}>
                    {startDate?.length>0&&formatDate(startDate)}{"-"}{endDate?.length>0&&formatDate(endDate)}
                    </div>
                    </div>
                </div>
                <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading}>Event Status</div>
                    <div className={commonClasses.allValues}>
                        {eventStatus?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={commonClasses.data}>{item.charAt(0)}{item.substring(1).toLowerCase()}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
                <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading}>Event Entry</div>
                    <div className={commonClasses.allValues}>
                        {eventEntry?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={commonClasses.data}>{item.charAt(0)}{item.substring(1).toLowerCase()}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
                <div className={commonClasses.filter}>
                    <div className={commonClasses.filterHeading} style={{display:"flex",justifyContent:"space-between"}}>User Ratings
                    <div className={keyStyles.toggle_container}>
            {/* <span>
              <label className={keyStyles.switch}>
                <input
                  type="checkbox"
                  // onChange={() => {}}
                  // checked={}
                  defaultChecked
                  disabled
                />
                <span className={`${toggleOpend?.rating ? keyStyles.sliderBranded : keyStyles.slider}`}></span>
              </label>
            </span> */}
            <ToggleBtn isTrue={toggleOpend?.rating === true}/>
          </div>
                    </div>
                    <div className={commonClasses.allValues}>
                        {userRating?.map((item: string, id: number) => (
                            <>
                                <label style={{ display: "flex" }} >
                                    <input

                                        className={styles.text}
                                        type="checkbox"
                                        // onChange={() => onChange()}
                                        checked={true}
                                        disabled
                                    />
                                    <span className={styles.item}>{item.charAt(0)}{item.substring(1).toLowerCase()}</span>
                                </label>
                            </>
                        ))}
                    </div>
                </div>
        </div>
        {/* {data && (
          <LocationFilter
            start={
              data?.tracker?.filterValue?.eventAttendanceRange?.split(",")[0]
            }
            end={
              data?.tracker?.filterValue?.eventAttendanceRange?.split(",")[1]
            }
            startDate={data?.tracker?.filterValue?.endDate?.split(",")[0]}
            endDate={data?.tracker?.filterValue?.endDate?.split(",")[1]}
            locations={locations}
          />
        )} */}
        {/* {data && (
          <Labels
            labels={
              data?.tracker?.filterValue?.labels
                ? data?.tracker?.filterValue?.labels
                : []
            }
          />
        )} */}
      </div>
    </div>
    <div className={styles.line}></div>
    <div className={styles.innerContainer}>
      <div
        style={{ paddingLeft: "20px" }}
      >
        <div className={styles.advanceHead}>Advance Intel</div>
        <div className={styles.advanceContent}>
          Advanced and more detailed event filter criteria for precise and
          personalized event tracking.
        </div>
      </div>
      <div className={styles.innerContainerRight}>
        <AdvanceFilter keywords={data?.tracker?.filterValue?.eventKeywords?.length !== 0 ? data?.tracker?.filterValue?.eventKeywords?.split('+') : []} freq={data?.tracker?.filterValue?.eventFrequency?.length !== 0 ? data?.tracker?.filterValue?.eventFrequency?.split(',') : []} 
          isBranded={toggleOpend?.brandedEvent}
          eventEdition={data?.tracker?.filterValue?.editionRange}
          type={type}
          eventSeries={toggleOpend?.eventSeries}
          forecastedStatus={data?.tracker?.filterValue?.isforecasted}
          maturity={data?.tracker?.filterValue?.maturity}
        />
      </div>
    </div>
    <div className={styles.line}></div>
    <div className={styles.innerContainer}>
      <div
        style={{ paddingLeft: "20px" }}
      >
        <div className={styles.advanceHead}>Insights &#x26; Score</div>
        <div className={styles.advanceContent}>
          Refine your event tracking with precise filters tailored to your
          needs with accurate scores and insights on event data.
        </div>
      </div>
      <div className={styles.innerContainerRight}>
        <Insights
            exhibitScore={
              data?.tracker?.filterValue?.estimatedExhibitScore
                ? data?.tracker?.filterValue?.estimatedExhibitScore?.split(",")
                : []
            }
            isExhibitOpen={toggleOpend?.exhibit===true}
            internationalScore={data?.tracker?.filterValue?.internationalScore}
            isTrustOpen={toggleOpend?.trust===true}
            trustScore={data?.tracker?.filterValue?.trustScore}
           reputation={data?.tracker?.filterValue?.reputationScore}
            inboundScore={data?.tracker?.filterValue?.inboundScore}
            eventRank={data?.tracker?.filterValue?.eventRank?.length > 0 ? data?.tracker?.filterValue?.eventRank.split(',') : []}
            localRank={
              data?.tracker?.filterValue?.localRank?.length > 0 ? data?.tracker?.filterValue?.localRank.split(',') : []
            }
            start={
              data?.tracker?.filterValue?.eventAttendanceRange?.split(",")[0]
            }
            end={
              data?.tracker?.filterValue?.eventAttendanceRange?.split(",")[1]
            }
            eventSize={eventSize}
            eventImpactScore={data?.tracker?.filterValue?.eventImpactSocre}
            eventRankToggle={data?.tracker?.filterValue?.eventRanking}
        />
      </div>
    </div>
    <div className={styles.line}></div>
    <div className={styles.innerContainer} style={{paddingBottom:"24px"}}>
      <div
        style={{ paddingLeft: "20px" }}
      >
        <div className={styles.advanceHead}>Audience Intel</div>
        <div className={styles.advanceContent}>
          Track your events based on the audience intel and insights to gain
          more visibility and active participants
        </div>
      </div>
      <div className={styles.innerContainerRight}>
        <Intel
          type={type}
        //  trustScore={data?.tracker?.filterValue?.trustScore}
        //  reputation={data?.tracker?.filterValue?.reputationScore}
          inboundScore={data?.tracker?.filterValue?.inboundScore}
          // userRating={
          //   data?.tracker?.filterValue?.eventRating
          //     ? data?.tracker?.filterValue?.eventRating.split(",")
          //     : []
          // }
          exhibitScore={
            data?.tracker?.filterValue?.eventSize
              ? data?.tracker?.filterValue?.eventSize?.split(",")
              : []
          }
          audienceZone={toggleOpend?.audienceZone}
          audienceSpread={toggleOpend?.audienceSpread}
          audienceSpreadCount={data?.tracker?.filterValue?.audienceSpread?.split(',').length}
          audienceProfile={data?.tracker?.filterValue?.designation}
        />
      </div>
    </div>
    </div>
    {del &&
      (
        <div className={styles.shareModal} >
          <div className={`${styles.innerModal} text-base`}>
            <div className="font-medium text-[var(--primary-color)]">Delete Tracker</div>
            {/* <div className={styles.bar}></div> */}
            <div className={styles.linkCopy}>

              <div className={styles.inviteAccess}>

                All events tracked by tracker will be lost. Do you wish to delete tracker permanently?

              </div>
            </div>

            <div className={styles.buttons}>

              {/* <button className={styles.send} onClick={deleteTracker}>Delete</button> */}
              <Button className="text-white" onClick={deleteTracker}>Delete</Button>
              {/* <button className={styles.cancel} onClick={closeShareModal}>Cancel</button> */}
              <Button variant="outline" className="text-[var(--primary-color)] hover:text-[var(--primary-color)]" onClick={closeShareModal}>Cancel</Button>
            </div>
          </div>
        </div>


      )}

  </div>
    }
    </>
  );
};

export default Page;