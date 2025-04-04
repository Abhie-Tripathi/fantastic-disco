import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSkeleton from "./LoadingSkeleton";
import Image from "next/image";
import fetchIcon from "@/public/internal/fetch_icon.svg";
import EventCard from "./EventCard";
import SimilarEventCard from "./SimilarEventCard";
// import NullState from "@/app/components/trackers/nullState";
import NullImage from "@/public/addEventNullState.svg";
import NullState from "./NullState";
import { RefreshCw } from "lucide-react";
import SampleTable from "./SampleTable";
import { useEffect, useState } from "react";
import { useCoordinateService } from "@/services/coordinateService";
import { async } from "@firebase/util";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  mappedHeaders: any;
  csvFileName: string;
  handleFileUpload: () => void;
  csvData: any[];
}

const BulkImport = ({
  mappedHeaders,
  csvFileName,
  handleFileUpload,
  csvData,
}: Props) => {
  const [loadingState, setLoadingState] = useState<
    "default" | "loading" | "fetched"
  >("default");

  const [csvData2, setCsvData2] = useState(csvData);
  const coordinateService = useCoordinateService();

  const eventData = {
    id: "1",
    name: "Arab Health",
    logo: "https://login.10times.com/upload/event/11281/eventlogo-22-1552279989.jpg",
    organizer: "Informa Middle East & Africa",
    startDate: "2019-01-28",
    endDate: "2019-01-31",
    venue: "Dubai International Convention & Exhibition Centre",
    state: "Dubai",
    city: "Dubai",
    country: "UAE",
    eventType: "Tradeshow",
  };

  // const [allMatchTrue, setAllMatchTrue] = useState<boolean>(false)

  console.log('csvData2', csvData2);
  

  const allMatchTrue = mappedHeaders.every(
    (item: any) => item.isMatch === true
  );

  const hadleFetch = async() => {
    setLoadingState("loading");

    // csvData[0]
    const updatedCsvData = csvData2;

    csvData.map(async (item, index) => {
      const apiData: any = await coordinateService.fetchSimilarEvents(item);
      updatedCsvData[index].fetched = true;
      updatedCsvData[index].duplicateEvents = apiData.events.length > 0 ? apiData.events : [];
    })

    console.log('updatedCsvData', updatedCsvData);
    
    setCsvData2(updatedCsvData);

    // const apiData: any = await coordinateService.fetchSimilarEvents(csvData2[0]);

    // console.log('apiData', apiData);
    
    // if (apiData.count > 0) {
    //   setCsvData2(prevData => 
    //     prevData.map((item, index) => 
    //       index === 0 ? { ...item, fetched: true, duplicateEvents: apiData.events.length > 0 ? apiData.events : [] } : item
    //     )
    //   );
    // }

    setTimeout(() => {
      setLoadingState("fetched");
    }, 1000);
  };

  // useEffect(() => {
  //   // console.log('file changed');
    
  //   const temp = mappedHeaders.every(
  //     (item: any) => item.isMatch === true
  //   );
  //   console.log('file changed', temp);
  //   setAllMatchTrue(temp);
  // }, mappedHeaders);

  const handleSelectAll = () => {
    console.log('csvData2', csvData2);
    
  }

  return (
    <div className="px-3 flex flex-col gap-4">
      <div className="flex items-center gap-4 bg-[var(--background-secondary-color)] px-4 py-5 border border-[var(--border-color)] rounded-sm text-sm">
        <span className="text-[var(--link-color)]">Uploaded file: </span>
        <span className="text-[#8F8F8F] italic font-bold"> {csvFileName}</span>
        <Button size="sm" variant="link" onClick={handleFileUpload}>
          Replace File
          <RefreshCw height={16} />
        </Button>
        <Button
          size="sm"
          onClick={hadleFetch}
          disabled={!allMatchTrue || loadingState === "loading"}
        >
          {loadingState === "loading" ? "Fetching..." : "Fetch"}
        </Button>
      </div>

      {/* default state */}
      {loadingState === "default" ? (
        <>
          <div className="my-2">
            <div className="flex gap-1 mb-1">
              <Image src={fetchIcon} height={18} width={18} alt="loading" />
              <span className="font-medium text-base">Columns Detected!</span>
            </div>
            <div className="text-sm text-[var(--secondary-text-color)]">
              Check against the sample format and reorganise if needed to ensure
              everything matches correctly.
            </div>
          </div>

          {/* <div className="text-[#A8A8A8] text-sm">Sample Format</div>
          <SampleTable mappedHeaders={mappedHeaders} isSampleTable={true} /> */}

          <div className="text-[#A8A8A8] text-sm">Uploaded Data</div>
          <SampleTable mappedHeaders={mappedHeaders} />

          {allMatchTrue ? (
            <div className="text-sm text-[var(--link-color)] bg-[var(--info-background-color)] p-4 border border-[#CCE6FF] rounded-sm">
              <span className="font-semibold">
                All columns detected successfully !
              </span>{" "}
              You can now proceed to fetch events.
            </div>
          ) : (
            <div className="text-sm p-4 border rounded-sm border-[#FFDD8F] bg-[--warning-background-color]">
              <span className="text-[#A35200] font-semibold">
                Column header mismatched !
              </span>{" "}
              Please make necessary changes and re-upload the file to continue
              fetching events.
            </div>
          )}
        </>
      ) : loadingState === "loading" ? (
        <LoadingSkeleton />
      ) : loadingState === "fetched" ? (
        <>
          <div className="my-2">
            <div className="flex gap-1 mb-1">
              <Image src={fetchIcon} height={18} width={18} alt="loading" />
              <span className="font-medium text-base">
                All set! Your events have been successfully fetched
              </span>
            </div>
            <div className="text-sm text-[var(--secondary-text-color)]">
              Here's What We Found for You! Choose from the events below and add
              them
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center" >
                <Checkbox />
                Select Results
              </div>
              <Button size="sm" onClick={handleSelectAll} >Add Events</Button>
            </div>
          </div>

          {/* <EventCard {...eventData} />
          <EventCard {...eventData} />
          <SimilarEventCard eventData={eventData}  />
          <EventCard {...eventData} /> */}

          {csvData2.map(item=>{
            if (item?.fetched && item.duplicateEvents.length > 0) {
              const e_data = {
                name: item.name,
                // logo: null,
                startDate: item.startDateTime,
                endDate: item.endDateTime,
                venue: item.address,
                eventType: item.participation,
              }
              return <SimilarEventCard eventData={e_data} duplicateEvents={item.duplicateEvents} />
            } else if (item?.fetched && item.duplicateEvents.length === 0) {
              const e_data = {
                id: '',
                name: item.name,
                // logo: null,
                startDate: item.startDateTime,
                endDate: item.endDateTime,
                venue: item.address,
                eventType: item.type,
                participationType: item.participation,
              }
              return <EventCard {...e_data} />
            }
          })}
        </>
      ) : (
        <></>
      )}

      {/* loading state */}
      {/* <LoadingSkeleton /> */}

      {/* Fetched state */}

      {/* null state */}
    </div>
  );
};

export default BulkImport;
