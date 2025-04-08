import { Button } from "@/components/ui/button";
import LoadingSkeleton from "./LoadingSkeleton";
import Image from "next/image";
import fetchIcon from "@/public/internal/fetch_icon.svg";
import EventCard from "./EventCard";
import SimilarEventCard from "./SimilarEventCard";
// import NullState from "@/app/components/trackers/nullState";
// import NullImage from "@/public/addEventNullState.svg";
// import NullState from "./NullState";
import { RefreshCw } from "lucide-react";
import SampleTable from "./SampleTable";
import { useState } from "react";
import { useCoordinateService } from "@/services/coordinateService";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/context";

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
  const { user } = useAuthContext();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const allMatchTrue = mappedHeaders.every(
    (item: any) => item.isMatch === true
  );

  const hadleFetch = async() => {
    setLoadingState("loading");

    const updatedCsvData = csvData2;

    csvData.map(async (item, index) => {
      const apiData: any = await coordinateService.fetchSimilarEvents(item);
      updatedCsvData[index].fetched = true;
      updatedCsvData[index].duplicateEvents = apiData.events.length > 0 ? apiData.events : [];
    })
    
    setCsvData2(updatedCsvData);

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

  const handleToggleItem = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(index)) {
        return prevSelectedItems.filter(item => item !== index);
      } else {
        return [...prevSelectedItems, index];
      }
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.length === csvData2.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(csvData2.map((_, index) => index));
    }
  };

  const handleAddEvents = async() => {

    const filteredItems = selectedItems.map(index => {
      const event_data = csvData2[index];
      delete event_data.duplicateEvents;
      delete event_data.fetched;
      return event_data;
    });

    const formData1 = {
      firstName: user?.firstname,
      lastName: user?.lastname,
      busEmail: user?.email,
      companyName: user?.accountId,
      jobTitle: user?.designation,
      phoneNumber: user?.phoneNumber,
      description: JSON.stringify(filteredItems),
    }
    
    const apiData: any = await coordinateService.addNewEvent(formData1);
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
                <Checkbox
                  checked={selectedItems.length === csvData2.length}
                  onCheckedChange={handleToggleSelectAll}
                />
                Select All
              </div>
              <Button size="sm" onClick={handleAddEvents} >Add Events</Button>
            </div>
          </div>

          {/* <EventCard {...eventData} />
          <EventCard {...eventData} />
          <SimilarEventCard eventData={eventData}  />
          <EventCard {...eventData} /> */}

          {csvData2.map((item, index)=>{
            if (item?.fetched && item.duplicateEvents.length > 0) {
              const e_data = {
                name: item.name,
                // logo: null,
                startDate: item.startDateTime,
                endDate: item.endDateTime,
                venue: item.address,
                eventType: item.participation,
              }
              return (
                <div className="flex gap-3 items-baseline" >
                  <Checkbox
                    checked={selectedItems.includes(index)}
                    onCheckedChange={() => handleToggleItem(index)}
                  />
                  <SimilarEventCard eventData={e_data} duplicateEvents={item.duplicateEvents} />
                </div>
              )
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
              return (
                <div className="flex gap-3 items-baseline" >
                  <Checkbox
                    checked={selectedItems.includes(index)}
                    onCheckedChange={() => handleToggleItem(index)}
                  />
                  <EventCard {...e_data} />
                </div>
              )
            }
          })}
        </>
      ) : (
        <></>
      )}

      {/* <LoadingSkeleton /> */}
    </div>
  );
};

export default BulkImport;
