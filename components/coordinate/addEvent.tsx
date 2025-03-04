"use client";
import React, { useState } from "react";
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
import DateTimeContainer from "@/app/components/TemplateViewsNew/AddEventForm/Details/dateandtime/DateTimeContainer";
import { FormState } from "@/types/Formstate";

export default function AddEventModal() {
  const [isOpen, setIsOpen] = useState(false);

  const participationOptions = [
    { label: "Attendee", value: "Attendee", icon: AttendeeIcon },
    { label: "Speaker", value: "Speaker", icon: SpeakerIcon },
    { label: "Exhibitor", value: "Exhibitor", icon: ExhibitorIcon },
    { label: "Organiser", value: "Organiser", icon: OrganiserIcon },
  ];

  const saveEventHandler = () => {};

  const handleChange = () => {};
  const dateState: FormState = {
    descriptionModal: false,
    speakerModal: false,
    registerModal: false,
    eventName: "",
    cityName: "",
    participationType: "",
    description: "",
    textValue: "",
    speaker: [],
    registerMessage: "",
    registerBtnText: "",
    registerBtnColor: "",
    countryName: "",
    timeZone: "",
    timeZoneKey: 0,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    startTime: "12:00 A.M",
    endTime: "12:00 A.M",
    eventFormat: "",
    boothNumber: "",
    participationMessage: "",
    banner: undefined,
    venue: "",
    latitude: 0,
    longitude: 0,
    hashtags: [],
    query: "",
    isEventNameEmpty: false,
    isEventFormatEmpty: false,
    isEventDescriptionEmpty: false,
    isEventParticipationEmpty: false,
    isParticipationMessageEmpty: false,
    isTextValueMessageEmpty: false,
    errorMessage: "",
    parentData: "",
    capacity: 0,
    registration: false,
    approval: false,
    waitlisting: false,
    capacityModal: false,
    virtualLink: "",
    exhibitorModal: false,
    exhibitor: [],
    event_type: "",
    isEventTypeEmpty: false,
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>+ Add Event</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[825px]">
          <DialogHeader>
            <DialogTitle className="tracking-normal">Add Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between">
              <span className="text-[var(--secondary-text-color)]">
                Choose Your Event Type
              </span>
              <div className="flex gap-3">
                {["Tradeshow", "Conference", "Workshop"].map((type) => (
                  <label
                    key={type}
                    className="flex gap-2 items-center text-base"
                  >
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

            {/* Date & time */}
            <DateTimeContainer
              formTheme={""}
              handleChange={handleChange}
              formState={dateState}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#6E56CF] hover:bg-[#644fc0]"
              onClick={saveEventHandler}
              //   disabled={isLoading || !!error}
            >
              Save
              {/* {isLoading ? "Saving..." : "Save"} */}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
