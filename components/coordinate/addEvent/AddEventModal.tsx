"use client";
import React, { useEffect, useRef, useState } from "react";
// import styles from "@/app/components/internal/trackers/Filters/templatetable.style.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "geist-icons";
import { Checkbox } from "@/components/ui/checkbox";
import eventData from "@/public/data/prospect/userEventData.json";
import { Event } from "@/types/events";
// import { formatEventDates } from "@/utils/dateFormat";
import { formattedDateRange } from "@/utils/date";
import { Radio } from "lucide-react";
// import CsvUpload from "./csvUpload";
import Papa from "papaparse";
import EventForm from "./EventForm";
import Modal from "./modal";
// import ColMapping from "./colMapping";
import { useCoordinateService } from "@/services/coordinateService";
import { useToast } from "@/hooks/use-toast";
// import CheckboxInput from "@/app/components/UI/CheckBoxInput";
// import LoadingSkeleton from "./LoadingSkeleton";
import UrlFetch from "./UrlFetch";
import BulkImport from "./BulkImport";
import SampleTable from "./SampleTable";

const EventListItem = ({ event }: { event: Event }) => {
  const address = event.basic.eventLocation ? (
    event.basic.eventLocation.venue?.name === "Online" ||
    event.basic.format === "online" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" /> Online
      </span>
    ) : event.basic.format === "hybrid" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" />
        <span>Hybrid&nbsp;-&nbsp;</span>
        {[
          event.basic.eventLocation.venue?.name || "TBA",
          event.basic.eventLocation.city?.name,
          event.basic.eventLocation.state?.name !==
          event.basic.eventLocation.city?.name
            ? event.basic.eventLocation.state?.name
            : null,
          event.basic.eventLocation.country?.name !==
          event.basic.eventLocation.city?.name
            ? event.basic.eventLocation.country?.name
            : null,
        ]
          .filter(Boolean)
          .join(", ")}
      </span>
    ) : (
      [
        event.basic.eventLocation.venue?.name,
        event.basic.eventLocation.city?.name,
        event.basic.eventLocation.state?.name !==
        event.basic.eventLocation.city?.name
          ? event.basic.eventLocation.state?.name
          : null,
        event.basic.eventLocation.country?.name !==
        event.basic.eventLocation.city?.name
          ? event.basic.eventLocation.country?.name
          : null,
      ]
        .filter(Boolean)
        .join(", ")
    )
  ) : (
    "Venue to be announced"
  );

  return (
    <div className="col-span-3 w-full cursor-pointer text-[var(--primary-text-color)] bg-[var(--primary-foreground)] p-3 rounded shadow-sm border relative flex gap-3">
      {event.basic.logoUrl && (
        <div className="w-14 h-14">
          <img
            src={event.basic.logoUrl}
            alt={`logo`}
            className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 h-full">
        <div className="text-base font-medium">{event.basic.name}</div>
        <div className={`text-[var(--tertiary-text-color)] text-sm`}>
          {event.basic.organizer?.name}
        </div>
        <p className="text-sm capitalize">{address}</p>
        <div
          className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
        >
          <Calendar
            height={"14px"}
            width={"14px"}
            color="var(--secondary-text-color)"
          />
          <div>
            {formattedDateRange(
              event.basic.startDateTime,
              event.basic.endDateTime
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventListItem2 = ({ event }: { event: Event }) => {
  const address = event.basic.eventLocation ? (
    event.basic.eventLocation.venue?.name === "Online" ||
    event.basic.format === "online" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" /> Online
      </span>
    ) : event.basic.format === "hybrid" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" />
        <span>Hybrid&nbsp;-&nbsp;</span>
        {[
          event.basic.eventLocation.venue?.name || "TBA",
          event.basic.eventLocation.city?.name,
          event.basic.eventLocation.state?.name !==
          event.basic.eventLocation.city?.name
            ? event.basic.eventLocation.state?.name
            : null,
          event.basic.eventLocation.country?.name !==
          event.basic.eventLocation.city?.name
            ? event.basic.eventLocation.country?.name
            : null,
        ]
          .filter(Boolean)
          .join(", ")}
      </span>
    ) : (
      [
        event.basic.eventLocation.venue?.name,
        event.basic.eventLocation.city?.name,
        event.basic.eventLocation.state?.name !==
        event.basic.eventLocation.city?.name
          ? event.basic.eventLocation.state?.name
          : null,
        event.basic.eventLocation.country?.name !==
        event.basic.eventLocation.city?.name
          ? event.basic.eventLocation.country?.name
          : null,
      ]
        .filter(Boolean)
        .join(", ")
    )
  ) : (
    "Venue to be announced"
  );

  return (
    <div className="col-span-3 w-full cursor-pointer text-[var(--primary-text-color)] bg-[var(--primary-foreground)] p-3 rounded shadow-sm border relative flex gap-3">
      {event.basic.logoUrl && (
        <div className="w-14 h-14">
          <img
            src={event.basic.logoUrl}
            alt={`logo`}
            className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
          />
        </div>
      )}
      <div className="flex flex-col gap-1 h-full">
        <div className="text-base font-medium">{event.basic.name}</div>
        <div className={`text-[var(--tertiary-text-color)] text-sm`}>
          {event.basic.organizer?.name}
        </div>
        <p className="text-sm capitalize">{address}</p>
        <div
          className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
        >
          <Calendar
            height={"14px"}
            width={"14px"}
            color="var(--secondary-text-color)"
          />
          <div>
            {formattedDateRange(
              event.basic.startDateTime,
              event.basic.endDateTime
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex items-center justify-center">
        <Button size="sm">Add </Button>
      </div> */}
    </div>
  );
};

const DuplicateEvent = () => {
  const [listExpanded, setListExpanded] = useState<boolean>(false);
  return (
    <div className="border rounded-sm h-fit">
      <div className="grid grid-cols-4 p-3 items-center">
        <div className="col-span-2 ">Canada Farm Show</div>
        <div className="col-span-1 text-sm">2 duplicate events found</div>
        <Button
          className="p-0"
          variant="link"
          size="sm"
          onClick={() => setListExpanded((prev) => !prev)}
        >
          See events
        </Button>
      </div>
      {listExpanded && (
        <div className="p-3 grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto">
          {eventData.events.slice(0, 2).map((item: any) => {
            return (
              <>
                <EventListItem event={item} />
                <div className="col-span-1 flex items-center justify-center">
                  <Button size="sm">Add </Button>
                </div>
              </>
            );
          })}
          <div className="col-span-4">
            <div>
              <Checkbox />
              These events are different create new event.
            </div>
            <Button size="sm">Create New </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const AddedEvent = ({ event }: { event: any }) => {
  // console.log('event', event);

  // const [listExpanded, setListExpanded] = useState<boolean>(false);

  // const event = {
  //   name: "The Travel and Vacation Show",
  //   logoUrl: "",
  //   organizer: "Player Expositions Inc",
  //   startDateTime: "2025-04-12",
  //   endDateTime: "2025-04-13",
  //   address: "Shaw Centre, Ottawa, Canada",
  // };
  return (
    <div className="grid grid-cols-4 items-center rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200">
      <div className="col-span-3 w-full  p-3  relative flex gap-3">
        {event.logoUrl && (
          <div className="w-14 h-14">
            <img
              src={event.logoUrl}
              alt={`logo`}
              className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
            />
          </div>
        )}
        <div className="flex flex-col gap-1 h-full">
          <div className="text-base font-medium">{event.name}</div>
          <div className={`text-[var(--tertiary-text-color)] text-sm`}>
            {event.organizer}
          </div>
          <p className="text-sm capitalize">{event.address}</p>
          <div
            className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
          >
            <Calendar
              height={"14px"}
              width={"14px"}
              color="var(--secondary-text-color)"
            />
            <div>
              {formattedDateRange(event.startDateTime, event.endDateTime)}
            </div>
          </div>
        </div>
      </div>
      <div className="text-primary col-span-1 flex items-center justify-center text-sm">
        Added
      </div>
    </div>
  );

  // return (
  //   <div className="col-span-3 w-full cursor-pointer text-[var(--primary-text-color)] bg-[var(--primary-foreground)] p-3 rounded shadow-sm border relative flex gap-3">
  //     {event.logoUrl && (
  //       <div className="w-14 h-14">
  //         <img
  //           src={event.logoUrl}
  //           alt={`logo`}
  //           className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
  //         />
  //       </div>
  //     )}
  //     <div className="flex flex-col gap-1 h-full">
  //       <div className="text-base font-medium">{event.name}</div>
  //       <div className={`text-[var(--tertiary-text-color)] text-sm`}>
  //         {event.organizer}
  //       </div>
  //       <p className="text-sm capitalize">{event.address}</p>
  //       <div
  //         className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
  //       >
  //         <Calendar
  //           height={"14px"}
  //           width={"14px"}
  //           color="var(--secondary-text-color)"
  //         />
  //         <div>
  //           {formattedDateRange(event.startDateTime, event.endDateTime)}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

const AddedEvent2 = ({ eventData }: { eventData: any }) => {
  // console.log('event', event);

  // const [listExpanded, setListExpanded] = useState<boolean>(false);

  const event = {
    name: eventData.name,
    logoUrl: eventData.logo,
    organizer: eventData.organizer.name,
    startDateTime: eventData.startDate,
    endDateTime: eventData.endDate,
    address: `${eventData.location.venueAddress}, ${eventData.location.state}, ${eventData.location.countryName}`,
  };
  return (
    <div className="grid grid-cols-4 items-center rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200">
      <div className="col-span-3 w-full  p-3  relative flex gap-3">
        {event.logoUrl && (
          <div className="w-14 h-14">
            <img
              src={event.logoUrl}
              alt={`logo`}
              className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
            />
          </div>
        )}
        <div className="flex flex-col gap-1 h-full">
          <div className="text-base font-medium">{event.name}</div>
          <div className={`text-[var(--tertiary-text-color)] text-sm`}>
            {event.organizer}
          </div>
          <p className="text-sm capitalize">{event.address}</p>
          <div
            className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
          >
            <Calendar
              height={"14px"}
              width={"14px"}
              color="var(--secondary-text-color)"
            />
            <div>
              {formattedDateRange(event.startDateTime, event.endDateTime)}
            </div>
          </div>
        </div>
      </div>
      <div className="text-primary col-span-1 flex items-end justify-center text-sm">
        <Button size="sm" className="w-fit">
          Add
        </Button>
      </div>
    </div>
  );
};

const DuplicateEventCard = ({ eventData }: { eventData: any }) => {
  const event = {
    name: eventData.name,
    logoUrl: eventData?.logo,
    organizer: eventData.companyName,
    startDateTime: eventData.startDate,
    endDateTime: eventData.endDate,
    address: `${eventData.venueName},${eventData.cityName},  ${eventData.state}, ${eventData.countryName}`,
  };
  return (
    <div className="grid grid-cols-4 items-center rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200">
      <div className="col-span-3 w-full  p-3  relative flex gap-3">
        {event?.logoUrl && (
          <div className="w-14 h-14">
            <img
              src={event?.logoUrl}
              alt={`logo`}
              className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
            />
          </div>
        )}
        <div className="flex flex-col gap-1 h-full">
          <div className="text-base font-medium">{event.name}</div>
          <div className={`text-[var(--tertiary-text-color)] text-sm`}>
            {event.organizer}
          </div>
          <p className="text-sm capitalize">{event.address}</p>
          <div
            className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
          >
            <Calendar
              height={"14px"}
              width={"14px"}
              color="var(--secondary-text-color)"
            />
            <div>
              {formattedDateRange(event.startDateTime, event.endDateTime)}
            </div>
          </div>
        </div>
      </div>
      <div className="text-primary col-span-1 flex items-end justify-center text-sm">
        <Button className="w-fit">Add</Button>
      </div>
    </div>
  );
};

export default function AddEventModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selectedView, setSelectedView] = useState<
    "home" | "addEventForm" | "bulkImport" | "urlFetch"
  >("home"); // home, loading, addEventForm, bulkImport, urlFetch
  const [eventFormState, setEventFormState] = useState<
    "default" | "similarEvents" | "editEvents" | "validating" | "fetching"
  >("default");

  const { toast } = useToast();

  const coordinateService = useCoordinateService();

  const [csvData, setCsvData] = useState<any[]>([]);

  const [csvFileName, setCsvFileName] = useState<string>("");

  const [error, setError] = useState<string>("");

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fileInputRef = React.createRef<HTMLInputElement>();

  const [websiteUrl, setWebsiteUrl] = useState<string>("");

  const [mappedHeaders, setMappedHeaders] = useState([
    {
      defaultName: "Name",
      fieldName: "",
      suggestions: ["name", "event name", "eventname"],
      isMatch: false,
    },
    {
      defaultName: "Start Date",
      fieldName: "",
      suggestions: ["start date", "start", "startdate", "startDate"],
      isMatch: false,
    },
    {
      defaultName: "End Date",
      fieldName: "",
      suggestions: ["end date", "end", "enddate", "endDate"],
      isMatch: false,
    },
    {
      defaultName: "Location",
      fieldName: "",
      suggestions: ["location", "venue", "address"],
      isMatch: false,
    },
    {
      defaultName: "Participation",
      fieldName: "",
      suggestions: [
        "participation",
        "participation type",
        "participationType",
        "mode",
      ],
      isMatch: false,
    },
    {
      defaultName: "Event Type",
      fieldName: "",
      suggestions: ["type", "event type", "eventType"],
      isMatch: false,
    },
  ]);

  const resetForm = () => {
    setIsFetching(false);
    setSelectedView("home");
    closeModal();
  };

  // Handle file change event
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange11");

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setCsvFileName(file.name);
    // resetForm();

    // Parse the CSV file using PapaParse
    Papa.parse(file, {
      complete: (result) => {
        // console.log("result.data", result.data);

        // const mappedData = result.data.map((item: any) => ({
        //   name: item['Name'], // Map to your column names
        //   age: item['Age'],
        //   email: item['Email'],
        // }));

        setCsvData(result.data);

        const colHeader = result.data[0] ? Object.keys(result.data[0]) : [];

        const tempHeader2 = mappedHeaders;
        tempHeader2.map((header, index) => {
          // tempHeader[item] = colHeader[index]
          header.fieldName = colHeader[index] ?? "";
          // header.isMatch = true;
          header.isMatch = header.suggestions.some(
            (item) =>
              header.fieldName.toLowerCase().includes(item.toLowerCase()) ||
              header.fieldName.toLowerCase() === item.toLowerCase()
          );
        });

        // console.log('tempHeader2', tempHeader2);

        setMappedHeaders(tempHeader2);
        setSelectedView("bulkImport");

        setError("");
        // setShowColMapping(true);
      },
      header: true, // assuming the first row contains headers
      skipEmptyLines: true, // skip empty lines
      error: (err) => {
        setError("Error parsing file");
        console.error(err);
      },
    });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input to clear the previous file
    }
    fileInputRef.current?.click();
  };

  // const handleMainModal = (action: string) => {
  //   if (action === "open")
  //     setIsModalOpen(true);
  //   else if (action === "close")
  //     setIsModalOpen(false);
  // }

  // useEffect(() => {
  //   resetForm();
  // }, [isModalOpen]);

  return (
    <div>
      <Button onClick={openModal}>+ Add Event</Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center h-10">
            <h2 className="text-base font-medium leading-6">Add Event</h2>
            <div>
              {(selectedView === "urlFetch" ||
                selectedView === "addEventForm" ||
                selectedView === "bulkImport") && (
                <span
                  className="cursor-pointer text-primary text-base mr-4"
                  onClick={() => setSelectedView("home")}
                >
                  Back
                </span>
              )}

              {(selectedView === "home" ||
                selectedView === "urlFetch" ||
                selectedView === "bulkImport") && (
                <Button
                  className="text-primary hover:text-primary"
                  variant="outline"
                  onClick={() => {
                    setSelectedView("addEventForm");
                    setEventFormState("default");
                  }}
                >
                  Add Manually
                </Button>
              )}

              {selectedView === "addEventForm" &&
                (eventFormState === "default" ? (
                  <Button onClick={() => setEventFormState("validating")}>
                    Save Event
                  </Button>
                ) : eventFormState === "similarEvents" ? (
                  <Button onClick={() => setEventFormState("default")}>
                    Edit Event
                  </Button>
                ) : (
                  <></>
                ))}
            </div>
          </div>

          {selectedView === "home" && (
            <>
              <div className="bg-[var(--background-secondary-color)] px-3 py-4 border border-[var(--border-color)] rounded-sm">
                <div className="text-[var(--link-color)] text-xs mb-3">
                  Enter the Event Website Link Or paste a link containing
                  multiple events to fetch them all
                </div>
                <div className="flex gap-4">
                  <Input
                    id="name"
                    className="rounded-sm bg-background focus-visible:border-none"
                    placeholder="Enter web URL"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    // aria-invalid={error ? "true" : "false"}
                    aria-describedby="name-error"
                  />
                  <Button
                    onClick={() => setSelectedView("urlFetch")}
                    disabled={isFetching || websiteUrl.trim() === ""}
                  >
                    {isFetching ? "Fetching..." : "Fetch"}
                  </Button>
                </div>
                <div className="text-center">
                  <div className="relative text-[#A1A2A2]">
                    <div className="border-b my-9"></div>
                    <span className="absolute text-[10px] -top-1.5 bg-[var(--background-secondary-color)] px-2 font-semibold">
                      OR
                    </span>
                  </div>
                  <div className="text-start text-[var(--link-color)] text-xs mb-3">
                    Upload a .PDF, .CSV, or .XLSX file following the sample
                    format to fetch your events effortlessly!
                  </div>
                  <div className="flex flex-col gap-2 justify-center items-center h-[140px] border border-dashed rounded-[18px] bg-primary-foreground border-[var(--border-color)] text-[#A1A2A2]">
                    <span className="text-xs">
                      Click to browse or drag and drop your files
                    </span>
                    <span className="text-[10px] font-semibold">OR</span>
                    <Button size="sm" onClick={handleButtonClick}>
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  className="text-primary hover:text-primary w-fit self-end"
                  variant="outline"
                  size="sm"
                >
                  Download Sample Format
                </Button>
              </div>

              <SampleTable mappedHeaders={mappedHeaders} isSampleTable={true} />
            </>
          )}

          <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === "addEventForm" ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === "addEventForm" && (
              <EventForm
                eventFormState={eventFormState}
                setEventFormState={setEventFormState}
                resetForm={resetForm}
              />
            )}
          </div>

          {/* <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === 'loading' ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === 'loading' && <LoadingSkeleton />}
          </div> */}

          <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === "urlFetch" ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === "urlFetch" && <UrlFetch url={websiteUrl} />}
          </div>

          <div
            className={`transition-opacity duration-500 ease-in-out overflow-y-auto ${
              selectedView === "bulkImport" ? "opacity-100" : "opacity-0"
            }`}
          >
            {selectedView === "bulkImport" && (
              <BulkImport
                mappedHeaders={mappedHeaders}
                csvFileName={csvFileName}
                handleFileUpload={handleButtonClick}
                csvData={csvData}
              />
            )}
          </div>
        </div>
      </Modal>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
