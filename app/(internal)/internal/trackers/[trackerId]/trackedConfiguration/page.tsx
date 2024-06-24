"use client"
import React, { useEffect, useState } from 'react'
import styles from './trackedConfiguration.style.module.css'
import BasicFilter from '@/app/components/trackers/basicFilter'
import LocationFilter from '@/app/components/trackers/locationFilter';
import Insights from '@/app/components/trackers/insights';
import Intel from '@/app/components/trackers/intel';
import AdvanceFilter from '@/app/components/trackers/advanceFilter'
import Labels from '@/app/components/trackers/labels';
import { usePathname, useSearchParams } from 'next/navigation';
import { myFetch } from '@/utils/myFetch';
import { baseUrl } from '@/context';
import Link from 'next/link';
function CustomeTracker({ fillColor }: { fillColor: string }) {
  return (
    <svg width="17" height="18" viewBox="0 0 17 18" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.4668 4.5C4.4668 3.94188 4.57673 3.38923 4.79031 2.87359C5.00389 2.35796 5.31694 1.88945 5.71159 1.4948C6.10624 1.10015 6.57476 0.787094 7.09039 0.573512C7.60603 0.359929 8.15868 0.25 8.7168 0.25C9.27491 0.25 9.82757 0.359929 10.3432 0.573512C10.8588 0.787094 11.3274 1.10015 11.722 1.4948C12.1166 1.88945 12.4297 2.35796 12.6433 2.87359C12.8569 3.38923 12.9668 3.94188 12.9668 4.5C12.9668 5.62717 12.519 6.70817 11.722 7.5052C10.925 8.30223 9.84397 8.75 8.7168 8.75C7.58963 8.75 6.50862 8.30223 5.71159 7.5052C4.91456 6.70817 4.4668 5.62717 4.4668 4.5ZM8.7168 1.75C7.98745 1.75 7.28798 2.03973 6.77225 2.55546C6.25653 3.07118 5.9668 3.77065 5.9668 4.5C5.9668 5.22934 6.25653 5.92882 6.77225 6.44454C7.28798 6.96027 7.98745 7.25 8.7168 7.25C9.44614 7.25 10.1456 6.96027 10.6613 6.44454C11.1771 5.92882 11.4668 5.22934 11.4668 4.5C11.4668 3.77065 11.1771 3.07118 10.6613 2.55546C10.1456 2.03973 9.44614 1.75 8.7168 1.75ZM4.7168 11.75C4.12006 11.75 3.54776 11.9871 3.12581 12.409C2.70385 12.831 2.4668 13.4033 2.4668 14V15.188C2.4668 15.206 2.4798 15.222 2.4978 15.225C6.6168 15.897 10.8178 15.897 14.9358 15.225C14.9445 15.2236 14.9525 15.219 14.9582 15.2122C14.9639 15.2055 14.9669 15.1969 14.9668 15.188V14C14.9668 13.4033 14.7297 12.831 14.3078 12.409C13.8858 11.9871 13.3135 11.75 12.7168 11.75H12.3768C12.35 11.7498 12.3233 11.7538 12.2978 11.762L11.4328 12.045C9.66797 12.6212 7.76562 12.6212 6.0008 12.045L5.1348 11.762C5.10991 11.754 5.08393 11.75 5.0578 11.75H4.7168ZM0.966797 14C0.966797 13.0054 1.36189 12.0516 2.06515 11.3483C2.76841 10.6451 3.72223 10.25 4.7168 10.25H5.0568C5.2418 10.25 5.4258 10.28 5.6008 10.336L6.4668 10.619C7.92884 11.0962 9.50476 11.0962 10.9668 10.619L11.8328 10.336C12.0078 10.279 12.1918 10.25 12.3758 10.25H12.7168C13.7114 10.25 14.6652 10.6451 15.3684 11.3483C16.0717 12.0516 16.4668 13.0054 16.4668 14V15.188C16.4668 15.942 15.9208 16.584 15.1768 16.705C10.8984 17.4034 6.53515 17.4034 2.2568 16.705C1.89672 16.6464 1.56924 16.4616 1.33291 16.1837C1.09657 15.9057 0.966802 15.5528 0.966797 15.188V14Z" fill={fillColor} />
    </svg>
  )
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

interface EditData {
  tracker: Tracker;
}
const Page = () => {
  const pathName = usePathname().split('/');
  const last = pathName[pathName.length - 2];
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    const fetchData = async () => {
      const url = `${baseUrl}/tracker/${last}`;
      try {
        const { data, error } = await myFetch(url, {
          method: 'GET'
        });
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('Data fetched:', data);
          setData(data);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    fetchData();
  }, []);
  const [categoryData, setCatgeoryData] = useState<CategoryData>();
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await myFetch(`${baseUrl}/category/all`);
      if (error) {
        console.log(error);
        return;
      }

      if (data) {
        console.log(data);
        setCatgeoryData(data);
      }
    };
    fetchData();
  }, []);
  console.log(categoryData);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [arr, setArr] = useState<any>();

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
  const [locations, setLocations] = useState<any>();

useEffect(() => {
  const eventCountry = data?.tracker?.filterValue?.eventCountry || [];
  const eventCity = data?.tracker?.filterValue?.eventCity || [];
  setLocations([...eventCountry, ...eventCity]);
}, [data]);
    
  return (
    <div className={styles.container}>
      <div className={styles.containerTop}>
        <div className={styles.containerTopLeft}>
          <div><CustomeTracker fillColor='#6750a4' /></div>
          <div className={styles.trackerType}>
            <div className={styles.heading}>Custom Tracker</div>
            <div className={styles.content}>Select from the available data filters to create a custom tracker</div>
          </div>
        </div>
        <div className={styles.containerTopRight}>
          <Link href={`/internal/trackers/${last}/editTracker`}>
            <button>Edit Tracker</button>
          </Link>
        </div>
      </div>
      <div className={styles.containerTopTwo}>
        {data?.tracker?.name}
      </div>
      <div className={styles.innerContainer}>
        <div className={styles.innerContainerLeft} style={{ border: "1px solid #EBEBEB" }}>
          {data && <BasicFilter category={data?.tracker?.filterValue?.eventCategory?.length > 0 ? data?.tracker?.filterValue?.eventCategory : []} />}
        </div>
        <div className={styles.innerContainerRight}>
          {data && <LocationFilter start={data?.tracker?.filterValue?.eventAttendanceRange?.split(",")[0]} end={data?.tracker?.filterValue?.eventAttendanceRange?.split(",")[1]} startDate={data?.tracker?.filterValue?.endDate?.split(',')[0]} endDate={data?.tracker?.filterValue?.endDate?.split(',')[1]} locations={locations} />}
          {data && <Labels labels={data?.tracker?.filterValue?.labels ? data?.tracker?.filterValue?.labels : []} />}
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.innerContainer}>
        <div className={styles.innerContainerLeft} style={{ paddingLeft: "20px" }}>
          <div className={styles.advanceHead}>Advanced Details</div>
          <div className={styles.advanceContent}>Advanced and more detailed event filter criteria for precise and personalized event tracking.</div>
        </div>
        <div className={styles.innerContainerRight}>
          <AdvanceFilter format={data?.tracker?.filterValue?.eventFormat?.info?.length !== 0 ? data?.tracker?.filterValue?.eventFormat?.split(',') : []} keywords={data?.tracker?.filterValue?.eventKeywords?.length !== 0 ? data?.tracker?.filterValue?.eventKeywords?.split(',') : []} freq={data?.tracker?.filterValue?.eventFrequency?.length !== 0 ? data?.tracker?.filterValue?.eventFrequency?.split(',') : []} entry={data?.tracker?.filterValue?.eventEntry?.length !== 0 ? data?.tracker?.filterValue?.eventEntry?.split(',') : []} rank={data?.tracker?.filterValue?.eventRanking ? data?.tracker?.filterValue?.eventRanking.split(',') : []} />
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.innerContainer}>
        <div className={styles.innerContainerLeft} style={{ paddingLeft: "20px" }}>
          <div className={styles.advanceHead}>Insights and Scores</div>
          <div className={styles.advanceContent}>Refine your event tracking with precise filters tailored to your needs with accurate
            scores and insights on event data.</div>
        </div>
        <div className={styles.innerContainerRight}>
          <Insights isBranded={data?.tracker?.filterValue?.brandedEvent
          } trustScore={data?.tracker?.filterValue?.trustScore} reputation={data?.tracker?.filterValue?.reputationScore} maturity={data?.tracker?.filterValue?.maturity} rank={data?.tracker?.filterValue?.eventSeries} />
        </div>
      </div>
      <div className={styles.line}></div>
      <div className={styles.innerContainer}>
        <div className={styles.innerContainerLeft} style={{ paddingLeft: "20px" }}>
          <div className={styles.advanceHead}>Audience Intel</div>
          <div className={styles.advanceContent}>Track your events based on the audience intel and insights to gain more visibility and active participants</div>
        </div>
        <div className={styles.innerContainerRight}>
          <Intel internationalScore={data?.tracker?.filterValue?.internationalScore} inboundScore={data?.tracker?.filterValue?.inboundScore} userRating={data?.tracker?.filterValue?.
            eventRating ? data?.tracker?.filterValue?.
              eventRating.split(',') : []} exhibitScore={data?.tracker?.filterValue?.eventSize ? data?.tracker?.filterValue?.eventSize?.split(',') : []} />
        </div>
      </div>
    </div>
  )
}

export default Page
