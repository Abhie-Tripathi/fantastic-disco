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

export default function AddEventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);
  const [showEventList, setShowEventList] = useState<boolean>(false);
  const [showDuplicateEventList, setShowDuplicateEventList] =
    useState<boolean>(false);

  const [showColMapping, setShowColMapping] = useState<boolean>(false);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const saveEventHandler = () => {};

  const handleChange = () => {};

  const resetForm = () => {
    setEventFormOpen(false);
    setShowEventList(false);
    setIsFetching(false);
  };

  const hadleFetch = () => {
    setIsFetching(true);
    setEventFormOpen(false);

    setTimeout(() => {
      setShowEventList(true);
      setIsFetching(false);
    }, 500);
  };

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [csvData, setCsvData] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = React.createRef<HTMLInputElement>();

  const scrollableDivRef = useRef<HTMLDivElement>(null);

  // Handle file change event
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Parse the CSV file using PapaParse
    Papa.parse(file, {
      complete: (result) => {
        console.log("result.data", result.data);

        setCsvData(result.data);
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

  const handleSave = () => {
    setShowDuplicateEventList(true);
    setTimeout(() => {
      if (scrollableDivRef.current) {
        scrollableDivRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 500);
  };

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
              setEventFormOpen(true);
              setShowEventList(false);
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
              {showColMapping && <ColMapping csvData={csvData.slice(0, 3)} setShowEventList={setShowEventList} />}
            </div>

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                eventFormOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              {eventFormOpen && <EventForm handleSave={handleSave} />}
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
                    {eventData.events.slice(0, 2).map((item: any) => {
                      return (
                          <EventListItem2 event={item} />
                          
                      );
                    })}
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
