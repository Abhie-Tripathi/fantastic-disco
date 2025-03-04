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
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle className="tracking-normal">Add Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>Choose Your Event Type</div>
            <div>
              Choose Your Mode of Participation
              <div className="flex gap-3">
                {participationOptions.map((option) => (
                  <div
                    key={option.value}
                    className="p-2 border rounded-sm flex gap-3 cursor-pointer border-[var(--border-color)]"
                    // onClick={() => handleSelection(option.value)}
                  >
                    <Image
                      src={option.icon}
                      alt={`${option.label} icon`}
                      height={20}
                      width={20}
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
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
