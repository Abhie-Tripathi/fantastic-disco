"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Share } from "geist-icons";
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
import ColMapping from "./colMapping";
import { useCoordinateService } from "@/services/coordinateService";
import { useToast } from "@/hooks/use-toast";

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
    address: `${eventData.location.venueAddress}, ${eventData.location.state}, ${eventData.location.countryName
    }` ,
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
        <Button size="sm" className="w-fit">Add</Button>
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
    address: `${eventData.venueName},${eventData.cityName},  ${eventData.state}, ${eventData.countryName
    }` ,
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
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);
  const [showEventList, setShowEventList] = useState<boolean>(false);

  const [eventSuggestion, setEventSuggestion] = useState<any>([]);
  const [showEventSuggestion, setShowEventSuggestion] = useState<boolean>(false);
  const [showDuplicateEventList, setShowDuplicateEventList] =
    useState<boolean>(false);
  const [duplicateEvents, setDuplicateEvents] = useState<any>([]);

  const [showColMapping, setShowColMapping] = useState<boolean>(false);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const coordinateService = useCoordinateService();

  const saveEventHandler = () => {};

  const handleChange = () => {};

  const resetForm = () => {
    setEventFormOpen(false);
    setShowEventList(false);
    setIsFetching(false);
    setShowEventSuggestion(false);
    setShowDuplicateEventList(false);
    setShowColMapping(false);
  };

  const hadleFetch = () => {
    resetForm();
    setIsFetching(true);
    // setEventFormOpen(false);

    setTimeout(async() => {
      const eventList = await coordinateService.fetchEvents();
      // console.log('eventList', eventList);
      setIsFetching(false);
        if (eventList.data.events.length > 0) {
          setShowEventSuggestion(true);
          setEventSuggestion(eventList.data.events);
        } else {
          setEventFormOpen(true);
          toast({
            title: "No event found, add details manually.",
            variant: "destructive",
          });
        }
      }, 500);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [csvData, setCsvData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = React.createRef<HTMLInputElement>();

  const scrollableDivRef = useRef<HTMLDivElement>(null);

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
      suggestions: ["participation", "participation type", "participationType", "mode"],
      isMatch: false,
    },
    {
      defaultName: "Event Type",
      fieldName: "",
      suggestions: ["type", "event type", "eventType"],
      isMatch: false,
    },
  ]);

  // Handle file change event
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    resetForm();

    // Parse the CSV file using PapaParse
    Papa.parse(file, {
      complete: (result) => {
        console.log("result.data", result.data);

        const mappedData = result.data.map((item: any) => ({
          name: item['Name'], // Map to your column names
          age: item['Age'],
          email: item['Email'],
        }));

        setCsvData(result.data);

        const colHeader = result.data[0] ? Object.keys(result.data[0]) : [];

        const tempHeader2 = mappedHeaders;
        tempHeader2.map((header, index)=>{
          // tempHeader[item] = colHeader[index]
          header.fieldName = colHeader[index];
          // header.isMatch = true;
          header.isMatch = header.suggestions.some(item => colHeader[index].toLowerCase().includes(item.toLowerCase()) || colHeader[index].toLowerCase() === item.toLowerCase());

        })
        setMappedHeaders(tempHeader2);
        

        setError("");
        setShowColMapping(true);
        // setShowEventList(true);
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
    fileInputRef.current?.click();
  };

  const handleSave = async() => {
    
    const apiData = await coordinateService.checkDuplicate();

    if (apiData.data.review.length > 0) {
      setShowDuplicateEventList(true);
      setDuplicateEvents(apiData.data.review);

      setTimeout(() => {
        if (scrollableDivRef.current) {
          scrollableDivRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 500);
    } else {
      toast({
        title: "Event Added Successfully",
        variant: "default",
      });
    }
  };

  useEffect(() => {    
    resetForm();
  }, [isModalOpen]);

  return (
    <div>
      <Button onClick={openModal}>+ Add Event</Button>
      {/* <Button onClick={() => setIsOpen(true)}>+ Add Event</Button> */}
      {/* <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[70%] min-h-[50%] flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle className="tracking-normal">Add Event</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 h-full">
            <div className="flex gap-4">
              <Input
                id="name"
                className=""
                placeholder="Enter Website"
                // value={trackerName}
                // onChange={handleNameChange}
                // aria-invalid={error ? "true" : "false"}
                aria-describedby="name-error"
              />
              <Button onClick={hadleFetch} disabled={isFetching}>
                {isFetching ? "Fetching..." : "Fetch Data"}
              </Button>
              <Button variant="outline">
                <Share height="14px" width="14px" className="mr-1" />
                Bulk Import
              </Button>
            </div>

            <Button
              variant="link"
              onClick={() => {
                setEventFormOpen(true);
                setShowEventList(false);
              }}
              className=""
            >
              or add details manually
            </Button>

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                eventFormOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {eventFormOpen && <EventForm />}
            </div>

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                showEventList ? "opacity-100" : "opacity-0"
              }`}
            >
              {showEventList && <EventList />}
            </div>
          </div>
        </DialogContent>
      </Dialog> */}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="flex flex-col gap-4 h-full">
          <div className="flex gap-4">
            <Input
              id="name"
              className=""
              placeholder="Enter Website"
              // value={trackerName}
              // onChange={handleNameChange}
              // aria-invalid={error ? "true" : "false"}
              aria-describedby="name-error"
            />
            <Button onClick={hadleFetch} disabled={isFetching}>
              {isFetching ? "Fetching..." : "Fetch Data"}
            </Button>
            <Button variant="outline" onClick={handleButtonClick}>
              <Share height="14px" width="14px" className="mr-1" />
              Bulk Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <Button
            variant="link"
            onClick={() => {
              // setEventFormOpen(!eventFormOpen);
              resetForm();
              setEventFormOpen(true);
              // setShowEventList(false);
              // setShowEventSuggestion(false);
            }}
            className=""
          >
            or add details manually
          </Button>

          <div className="flex flex-col gap-3 overflow-y-auto">

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                showColMapping ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* {eventFormOpen && <ColMapping />} */}
              {showColMapping && <ColMapping csvData={csvData.slice(0, 3)} setShowEventList={setShowEventList} mappedHeaders={mappedHeaders} setMappedHeaders={setMappedHeaders} />}
            </div>

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                eventFormOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {eventFormOpen && <EventForm handleSave={handleSave} />}
            </div>

            {/* Fetch events based on website */}
            <div
              className={`transition-opacity duration-500 ease-in-out ${
                showEventSuggestion ? "opacity-100" : "opacity-0"
              }`}
            >
              {showEventSuggestion && (
                <>
                  <div className="font-medium text-base mb-3">Events</div>
                  <div className="flex flex-col gap-3 pr-1">
                    {eventSuggestion.length > 0 &&
                      eventSuggestion.map((item: any, index: number) => (
                        <AddedEvent2 eventData={item} key={index} />
                      ))}
                  </div>
                </>
              )}
            </div>

            {/* Duplicate Event Container */}
            <div
              className={`transition-opacity duration-500 ease-in-out ${
                showDuplicateEventList ? "opacity-100" : "opacity-0"
              }`}
            >
              {showDuplicateEventList && (
                <>
                  <div
                    ref={scrollableDivRef}
                    className="font-medium text-base mb-3 text-destructive"
                  >
                    Following duplicate events found
                  </div>
                  <div className="flex flex-col gap-3 pr-1 h-[calc(100vh-210px)] overflow-y-auto">
                    {/* {eventData.events.slice(0, 2).map((item: any) => {
                      return (
                          <EventListItem2 event={item} />
                          
                      );
                    })} */}
                    {duplicateEvents.length > 0 &&
                      duplicateEvents.map((item: any, index: number) => (
                        <DuplicateEventCard eventData={item} key={index} />
                      ))
                    }
                  </div>
                </>
              )}
            </div>

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                showEventList ? "opacity-100" : "opacity-0"
              }`}
            >
              {showEventList && (
                <>
                  <div className="font-medium text-base mb-3">Events Data</div>
                  <div className="flex flex-col gap-3 pr-1 h-[calc(100vh-210px)] overflow-y-auto">
                    {/* <div className="font-medium text-base">Events Data</div> */}
                    <DuplicateEvent />
                    {/* <DuplicateEvent /> */}
                    {/* <AddedEvent />
                <AddedEvent /> */}
                    {csvData.length > 0 &&
                      csvData.map((item, index) => (
                        <AddedEvent event={item} key={index} />
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            className="bg-[#6E56CF] hover:bg-[#644fc0]"
            onClick={saveEventHandler}
            //   disabled={isLoading || !!error}
          >
            Save
          </Button>
        </div> */}
      </Modal>
    </div>
  );
}
