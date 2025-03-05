"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AttendeeIcon from "/public/widgetimages/attendeeIcon.svg";
import SpeakerIcon from "/public/widgetimages/speakerIcon.svg";
import ExhibitorIcon from "/public/widgetimages/exhibitorIcon.svg";
import OrganiserIcon from "/public/widgetimages/organiserIcon.svg";
import Image from "next/image";
// import DateTimeContainer from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/DateTimeContainer";
// import { FormState } from "@/types/Formstate";
import { Input } from "@/components/ui/input";
import { Share } from "geist-icons";
import { Checkbox } from "@/components/ui/checkbox";

const EventForm = () => {
  const participationOptions = [
    { label: "Attendee", value: "Attendee", icon: AttendeeIcon },
    { label: "Speaker", value: "Speaker", icon: SpeakerIcon },
    { label: "Exhibitor", value: "Exhibitor", icon: ExhibitorIcon },
    { label: "Organiser", value: "Organiser", icon: OrganiserIcon },
  ];

  return (
    <div className="grid gap-4 border rounded-lg p-4 px-6">
      <div className="flex justify-between">
        <span className="text-[var(--secondary-text-color)]">
          Choose Your Event Type
        </span>
        <div className="flex gap-3">
          {["Tradeshow", "Conference", "Workshop"].map((type) => (
            <label key={type} className="flex gap-2 items-center text-base">
              <input
                type="radio"
                name="eventType"
                value={type}
                // checked={selectedEventType === type}
                // onChange={handleOptionChange}
                // className={styles.radio}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
      <div>
        <span className="text-[var(--secondary-text-color)]">
          Choose Your Mode of Participation
        </span>
        <div className="flex gap-3 my-2">
          {participationOptions.map((option) => (
            <div
              key={option.value}
              className="p-2 border rounded-sm flex items-center gap-3 cursor-pointer border-[var(--border-color)]"
              // onClick={() => handleSelection(option.value)}
            >
              <Image
                src={option.icon}
                alt={`${option.label} icon`}
                height={30}
                width={30}
              />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <textarea
          className="outline-none resize-none text-4xl font-semibold w-full h-12"
          maxLength={80}
          placeholder="Event Name"
        />
      </div>
    </div>
  );
};

const EventList = () => {
  return (
    <div className="grid gap-3">
      <div className="font-medium text-base">Events Found</div>
      <div className="rounded-lg border shadow-sm p-3 flex justify-between items-center">
          Event Card
          <Button>Save</Button>
        </div>

      {/* <div className="w-full cursor-pointer text-[var(--primary-text-color)] bg-[var(--primary-foreground)] p-3 rounded shadow-sm border relative flex gap-3">
        {task.eventData.logoUrl && (
          <div className="w-14 h-14">
            <img
              src={task.eventData.logoUrl}
              alt={`logo`}
              className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
            />
          </div>
        )}
        <div className="flex flex-col gap-2 h-full">
          <div className={`text-lg font-medium`}>{name}</div>
          <div className={`text-[var(--tertiary-text-color)] text-sm`}>
            {eventCompany}
          </div>
          <div
            className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
          >
            <Calendar
              height={"14px"}
              width={"14px"}
              color="var(--secondary-text-color)"
            />
            <div>{formatEventDates(eventStartDate, eventEndDate)}</div>
          </div>
        </div>
      </div> */}

      <div className="rounded-lg border shadow-sm p-3 flex justify-between items-center">
        Event Card
        <Button>Save</Button>
      </div>
      <div className="flex gap-2 items-center text-base text-[var(--secondary-text-color)]">
        <Checkbox />
        These events are different create new event.
      </div>
      <Button className="w-fit">Create Event</Button>
    </div>
  );
};

export default function AddEventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState<boolean>(false);
  const [showEventList, setShowEventList] = useState<boolean>(false);

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
    }, 1000);
  };

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>+ Add Event</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

          {/* <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
