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
// import { Checkbox } from "@/components/ui/checkbox";
import { useAuthContext } from "@/context";
import { useLocationService } from "@/services/locationService";
import { addEventPayloadType } from "@/types/Formstate";
import { InterestConfiguration } from "@/types/configuration";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parse, isValid } from 'date-fns';

interface Props {
  mappedHeaders: any;
  csvFileName: string;
  handleFileUpload: () => void;
  csvData: string[][];
  interestConfiguration: InterestConfiguration[];
  importState: "default" | "loading" | "fetched";
  handleImportState: (value: any) => void;
}

interface dataRow {
  data: string[];
  isValid: boolean;
  duplicateFetched: boolean;
  duplicateEvents: any;
  isEventAdded: boolean;
}

function isValidDateString(dateStr: string, format = 'yyyy-MM-dd') {
  const parsedDate = parse(dateStr, format, new Date());
  return isValid(parsedDate);
}

const BulkImport = ({
  mappedHeaders,
  csvFileName,
  handleFileUpload,
  csvData,
  interestConfiguration,
  importState = "default",
  handleImportState,
}: Props) => {
  // const [loadingState, setLoadingState] = useState<
  //   "default" | "loading" | "fetched"
  // >(importState);

  const [csvData2, setCsvData2] = useState<dataRow[]>([]);
  const coordinateService = useCoordinateService();
  const { user } = useAuthContext();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const allMatchTrue = mappedHeaders.every(
    (item: any) => item.isMatch === true
  );

  const [eventCount, setEventCount] = useState({
    added: 0,
    skipped: 0,
    duplicates: 0,
  });

  const [activeTab, setActiveTab] = useState("addedEvents");

  const { getDatabaseLocationAutocomplete } = useLocationService();

  const fetchLocation = async (data: string[]) => {
    const city = data[3].trim().toLocaleLowerCase();
    const country = data[4].trim().toLocaleLowerCase();
    const venue = data[5].trim().toLocaleLowerCase();

    const predictions = await getDatabaseLocationAutocomplete(
      venue !== "" ? venue : city,
      venue !== "" ? "VENUE" : "CITY"
    );
    if (predictions && predictions.formattedLocations.length > 0) {
      predictions.formattedLocations.map((locSuggestion: any) => {});
      const locSuggestion = predictions.formattedLocations[0];

      if (
        locSuggestion.locationType === "VENUE" &&
        locSuggestion.name.toLocaleLowerCase() === venue &&
        locSuggestion.city?.name.toLocaleLowerCase() === city &&
        locSuggestion.country?.name.toLocaleLowerCase() === country
      ) {
        return locSuggestion;
      }

      if (
        locSuggestion.locationType === "CITY" &&
        locSuggestion.name.toLocaleLowerCase() === city &&
        locSuggestion.country?.name.toLocaleLowerCase() === country
      ) {
        return locSuggestion;
      }
    }
  };

  const hadleFetch = async () => {
    handleImportState("loading");

    const updatedCsvData: dataRow[] = [];

    for (const row of csvData) {
      const temp: dataRow = {
        data: row,
        isValid: false,
        duplicateFetched: false,
        duplicateEvents: [],
        isEventAdded: false,
      };

      // Step 1: Validate the data
      const missingFields = row.filter(
        (item, ind) => mappedHeaders[ind].isMandatory && !item
      );

      const interestValue = interestConfiguration.find(
        (interest) => interest.label.toLowerCase() === row[6].toLowerCase()
      );

      if (!isValidDateString(row[1], 'yyyy-MM-dd')) {
        row[1] = "";
      }

      if (!isValidDateString(row[2], 'yyyy-MM-dd')) {
        row[2] = "";
      }      

      if (missingFields.length > 0 || interestValue === undefined || !isValidDateString(row[1], 'yyyy-MM-dd') || !isValidDateString(row[2], 'yyyy-MM-dd')) {
        updatedCsvData.push(temp);
        continue;
      }
      temp.isValid = true;

      // Step 2: Fetch location data
      const locationData = await fetchLocation(row);
      if (!locationData) {
        updatedCsvData.push(temp);
        continue;
      }

      // Step 3: Fetch Duplicate events
      const duplicateEventPayload = {
        name: row[0],
        latitude: Number(locationData?.latitude),
        longitude: Number(locationData?.longitude),
        locationIds: "",
        startDate: row[1],
        endDate: row[2],
        venueId: "",
      };
      if (locationData.locationType === "VENUE") {
        duplicateEventPayload.venueId = locationData.id;
        duplicateEventPayload.locationIds = locationData.city?.id ?? "";
      } else if (locationData.locationType === "CITY") {
        duplicateEventPayload.locationIds = locationData?.id;
      }

      const apiData2: any = await coordinateService.fetchDuplicateEvents(
        duplicateEventPayload
      );
      temp.duplicateFetched = true;

      if (apiData2.blocked.length > 0) {
        temp.duplicateEvents = apiData2.blocked;
      } else {
        // Step 4: Add event
        const eventData: addEventPayloadType = {
          start_date: row[1],
          end_date: row[2],
          start_time: "09:00",
          end_time: "18:00",
          location_city_id: "",
          location_city: "",
          location_country: locationData?.country?.name ?? "",
          location_country_id: locationData?.country?.id ?? "",
          location_country_iso_code: locationData?.country?.iso ?? "",
          location_state: locationData?.state?.name ?? "",
          location_state_id: locationData?.state?.id ?? "",
          latitude: Number(locationData.latitude),
          longitude: Number(locationData.longitude),
          participationType: interestValue.status,
          event_type: row[7],
          format: "offline",
        };

        if (locationData.locationType === "VENUE") {
          eventData.venue_id = locationData.id;
          eventData.venue_latitude = Number(locationData.latitude);
          eventData.venue_longitude = Number(locationData.longitude);
          eventData.venue_name = locationData.name;
          eventData.venue_address = locationData.displayName;
          eventData.location_city_id = locationData.city?.id ?? "";
          eventData.location_city = locationData.city?.name ?? "";
        } else if (locationData.locationType === "CITY") {
          eventData.location_city_id = locationData?.id;
          eventData.location_city = locationData?.name ?? "";
        }

        const addEventPayload = {
          name: row[0],
          interest: interestValue?.status,
          sourceModule: "COORDINATE",
          data: JSON.stringify(eventData),
        };

        try {
          const apiData: any = await coordinateService.addNewEvent(
            addEventPayload
          );

          if (apiData?.data) {
            temp.isEventAdded = true;
          }
        } catch (error) {
          console.error("Error adding event: ", error, addEventPayload);
        }
      }

      updatedCsvData.push(temp);
    }

    // Step 5: Update the state
    setCsvData2(updatedCsvData);

    const inValidItems = updatedCsvData.filter((item) => !item.isValid);
    const addedEventCount = updatedCsvData.filter((item) => item.isEventAdded);
    const duplicateEventsCount = updatedCsvData.filter(
      (item) => item.duplicateEvents.length > 0
    );

    setEventCount({
      skipped: inValidItems.length,
      added: addedEventCount.length,
      duplicates: duplicateEventsCount.length,
    });

    if (addedEventCount.length > 0) setActiveTab("addedEvents");
    else if (inValidItems.length > 0) setActiveTab("duplicateEvents");
    else if (duplicateEventsCount.length > 0) setActiveTab("skippedEvents");

    handleImportState("fetched");
  };

  // const handleToggleItem = (index: number) => {
  //   setSelectedItems((prevSelectedItems) => {
  //     if (prevSelectedItems.includes(index)) {
  //       return prevSelectedItems.filter((item) => item !== index);
  //     } else {
  //       return [...prevSelectedItems, index];
  //     }
  //   });
  // };

  // const handleToggleSelectAll = () => {
  //   if (selectedItems.length === csvData2.length) {
  //     setSelectedItems([]);
  //   } else {
  //     setSelectedItems(csvData2.map((_, index) => index));
  //   }
  // };

  return (
    <div className="px-3 flex flex-col gap-4">
      <div className={`flex items-center justify-between gap-2 bg-[var(--background-secondary-color)] px-4 py-5 border  rounded-sm text-sm ${allMatchTrue ? "border-[var(--border-color)]" : "border-[var(--danger-text-color)]"}`}>
        <span className="text-[var(--link-color)]">Uploaded file: </span>
        <span
          className="text-[#8F8F8F] italic font-bold line-clamp-1"
          title={csvFileName}
        >
          {" "}
          {csvFileName}
        </span>
        <Button size="sm" variant="link" onClick={handleFileUpload}>
          Replace File
          <RefreshCw height={16} />
        </Button>
        <Button
          size="sm"
          onClick={hadleFetch}
          disabled={!allMatchTrue || importState === "loading"}
        >
          {importState === "loading" ? "Fetching..." : "Fetch"}
        </Button>
      </div>

      {/* default state */}
      {importState === "default" ? (
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
          <div className="overflow-x-auto w-full">
            <SampleTable mappedHeaders={mappedHeaders} csvData={csvData} />
          </div>

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
      ) : importState === "loading" ? (
        <LoadingSkeleton />
      ) : importState === "fetched" ? (
        <>
          <div className="my-2">
            <div className="flex gap-1 mb-1">
              <Image src={fetchIcon} height={18} width={18} alt="loading" />
              <span className="font-medium text-base">
                All set! Your events have been successfully fetched
              </span>
            </div>
            {/* <div className="text-sm text-[var(--secondary-text-color)]">
              Here&apos;s What We Found for You! Choose from the events below
              and add them
            </div> */}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full pt-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="addedEvents"
                  disabled={eventCount.added == 0}
                >
                  Added Events
                  <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white ml-2">
                    {eventCount.added}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="duplicateEvents"
                  disabled={eventCount.duplicates == 0}
                >
                  Duplicate Events
                  <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white ml-2">
                    {eventCount.duplicates}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="skippedEvents"
                  disabled={eventCount.skipped == 0}
                >
                  Skipped Events
                  <span className="grid place-items-center text-xs w-5 h-5 bg-primary rounded-full text-white ml-2">
                    {eventCount.skipped}
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="addedEvents" className="py-1">
                {csvData2.map((item, index) => {
                  if (
                    item?.isValid &&
                    item.duplicateEvents.length === 0 &&
                    item.isEventAdded
                  ) {
                    const e_data = {
                      id: "",
                      name: item.data[0],
                      // logo: null,
                      startDate: item.data[1],
                      endDate: item.data[2],
                      city: item.data[3],
                      country: item.data[4],
                      venue: item.data[5],
                      eventType: item.data[7],
                      participationType: item.data[6],
                      isProductEvent: true,
                      isEventAdded: true,
                    };
                    return (
                      <div className="flex gap-3 items-baseline" key={index}>
                        {/* <Checkbox
                          checked={selectedItems.includes(index)}
                          onCheckedChange={() => handleToggleItem(index)}
                        /> */}
                        <EventCard {...e_data} />
                      </div>
                    );
                  }
                })}
              </TabsContent>

              <TabsContent value="duplicateEvents" className="py-1">
                {csvData2.map((item, index) => {
                  if (item?.isValid && item.duplicateEvents.length > 0) {
                    const e_data = {
                      name: item.data[0],
                      // logo: null,
                      startDate: item.data[1],
                      endDate: item.data[2],
                      city: item.data[3],
                      country: item.data[4],
                      venue: item.data[5],
                      eventType: item.data[7],
                    };
                    return (
                      <div className="flex gap-3 items-baseline" key={index}>
                        {/* <Checkbox
                          checked={selectedItems.includes(index)}
                          onCheckedChange={() => handleToggleItem(index)}
                        /> */}
                        <SimilarEventCard
                          eventData={e_data}
                          duplicateEvents={item.duplicateEvents}
                        />
                      </div>
                    );
                  }
                })}
              </TabsContent>

              <TabsContent value="skippedEvents" className="py-1">
                {csvData2.map((item, index) => {
                  if (!item?.isValid) {
                    const e_data = {
                      name: item.data[0],
                      // logo: null,
                      startDate: item.data[1],
                      endDate: item.data[2],
                      city: item.data[3],
                      country: item.data[4],
                      venue: item.data[5],
                      eventType: item.data[7],
                    };
                    return (
                      <div className="flex gap-3 items-baseline" key={index}>
                        {/* <Checkbox
                          checked={selectedItems.includes(index)}
                          onCheckedChange={() => handleToggleItem(index)}
                        /> */}
                        <SimilarEventCard
                          eventData={e_data}
                          duplicateEvents={item.duplicateEvents}
                        />
                      </div>
                    );
                  }
                })}
              </TabsContent>
            </Tabs>
          </div>
        </>
      ) : (
        <></>
      )}

      {/* <LoadingSkeleton /> */}
    </div>
  );
};

export default BulkImport;
