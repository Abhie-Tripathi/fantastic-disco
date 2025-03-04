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

export default function AddEventModal() {
  const [isOpen, setIsOpen] = useState(false);

  const participationOptions = [
    { label: "Attendee", value: "Attendee", icon: AttendeeIcon },
    { label: "Speaker", value: "Speaker", icon: SpeakerIcon },
    { label: "Exhibitor", value: "Exhibitor", icon: ExhibitorIcon },
    { label: "Organiser", value: "Organiser", icon: OrganiserIcon },
  ];

  const saveEventHandler = () => {};

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
