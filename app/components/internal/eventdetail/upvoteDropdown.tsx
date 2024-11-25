"use client";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { Check } from "geist-icons";
import Image from "next/image";
import upArrowLight from "/public/internal/up_arrow_light.svg";
import upArrow from "/public/internal/up_arrow.svg";
import { useTheme } from "@/context";
import { useCoordinateService } from "@/services/coordinateService";

interface Prop {
  eventId: string;
  enquiryId: string;
  upvoteData: any;
  userCountPerInterest: any;
  voteStatus: any;
}

export default function UpvoteDropdown({
  eventId,
  enquiryId,
  upvoteData,
  userCountPerInterest,
  voteStatus,
}: Prop) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const [eventStatuses, setEventStatuses] = useState<any>([
    {
      id: "EXHIBITOR",
      label: "Exhibit",
      count: upvoteData?.[1]?.EXHIBITING,
      interestShown: userCountPerInterest?.EXHIBITOR > 0,
      voted: voteStatus["Exhibiting"],
      voteFor: "Exhibiting",
    },
    {
      id: "SPONSOR",
      label: "Sponsor",
      count: upvoteData?.[1]?.SPONSORING,
      interestShown: userCountPerInterest?.SPONSOR > 0,
      voted: voteStatus["Sponsoring"],
      voteFor: "Sponsoring",
    },
    {
      id: "SPEAKER",
      label: "Speak",
      count: upvoteData?.[1]?.SPEAKING,
      interestShown: userCountPerInterest?.SPEAKER > 0,
      voted: voteStatus["Speaking"],
      voteFor: "Speaking",
    },
    {
      id: "ATTENDEE",
      label: "Attend",
      count: upvoteData?.[1]?.ATTENDING,
      interestShown: userCountPerInterest?.ATTENDING > 0,
      voted: voteStatus["Attending"],
      voteFor: "Attending",
    },
  ]);

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const coordinateService = useCoordinateService();

  const handleMenuItemClick = async (id: string) => {

    const filteredItem = eventStatuses.filter((status: any) => status.id === id);

    let payloadData = {
      enquiryId: enquiryId,
      like: !filteredItem[0].voted ? 1 : 0,
      type: filteredItem[0].voteFor?.toUpperCase(),
    };
    try {      
      const apiData: any = await coordinateService.upVote(payloadData);
      setEventStatuses((prevEventStatuses: any) =>
      prevEventStatuses.map((event: any) =>
        event.id === id
          ? {
              ...event,
              count: event.voted ? event.count - 1 : event.count + 1,
              voted: !event.voted,
            }
          : event
      )
    );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <div onClick={handleClickEvent}>
      <Popover open={isOpen} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div
            className="text-[var(--primary-color)] bg-[var(--primary-light-color)] h-fit font-semibold text-sm py-1 px-4 border border-[var(--border-color)] rounded-sm w-fit cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <div className="flex gap-2 items-center">
              <Image src={upArrowLight} alt="up" width={16} height={16} />
              <span className="mr-2">Upvote</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180 transform" : ""
                }`}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2 space-y-2">
            {eventStatuses.map((status: any) => (
              <div
                key={status.id}
                className={`flex items-center justify-between gap-5 leading-6 p-1 cursor-pointer text-sm ${
                  status.voted ? "bg-[var(--accent-color)]" : ""
                }`}
                onClick={() => handleMenuItemClick(status.id)}
              >
                <div className="flex items-center gap-2">
                  {status.interestShown && (
                    <Check
                      height={"12px"}
                      width={"12px"}
                      color="var(--info-text-color)"
                    />
                  )}
                  <div>{status.label}</div>
                </div>

                <div className="flex gap-2">
                  <Image
                    src={theme === "light" ? upArrowLight : upArrow}
                    alt="up"
                    width={16}
                    height={16}
                    className="icons"
                  />
                  {status.count}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
