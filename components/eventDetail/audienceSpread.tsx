"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Event } from "@/types/events";
import { useState } from "react";
import Restriction from "../eventDetail/restriction";
import {
  AudienceSpreadListView,
} from "./audienceSpreadView";

interface Props {
  restrictedData: any;
  audienceSpread: NonNullable<Event["audience"]>["audienceSpread"] | undefined;
}

export const AudienceSpread = ({ restrictedData, audienceSpread }: Props) => {
  const [audienceSpreadView, setAudienceSpreadView] = useState("globe");
  const isEnabled = restrictedData && restrictedData.isEnabled;

  return (
    <div className="relative flex flex-1 w-auto h-full">
      <div className="flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto w-full">
        <div className="flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="cursor-pointer font-medium text-[var(--primary-text-color)]">
                  Audience Spread
                </p>
              </TooltipTrigger>
              <TooltipContent
                align="start"
                alignOffset={-80}
                className="w-80 tooltip-content-styles"
              >
                <p className="text-[var(--secondary-text-color)] font-medium">
                  Indicates the geographical diversity of the audience, showing
                  which countries are represented at the event.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* {isEnabled
            ? audienceSpread &&
              Object.keys(audienceSpread).length > 0 && (
                <Tabs
                  defaultValue={audienceSpreadView}
                  onValueChange={setAudienceSpreadView}
                  className="w-44"
                >
                  <TabsList className="grid w-full grid-cols-2 h-10">
                    <TabsTrigger
                      value="globe"
                      className="flex gap-2 items-center h-full"
                    >
                      <Globe className="w-3 h-3" />
                      Globe
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="flex gap-2 items-center h-full"
                    >
                      <ListIcon className="w-3 h-3" />
                      <span>List</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              )
            : null} */}
        </div>
        {isEnabled ? (
          <AudienceSpreadListView audienceSpread={audienceSpread} />
        ) : (
          <Restriction />
        )}
      </div>
    </div>
  );
};
