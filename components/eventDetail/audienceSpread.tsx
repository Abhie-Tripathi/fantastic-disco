"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as Flags from "country-flag-icons/react/3x2";
import { CircleSlash, Globe, ListIcon } from "lucide-react";
import Restriction from "../eventDetail/restriction";
import Text from "../new-ui/Text";
import { Event } from "@/types/events";
import { useEffect, useRef, useState } from "react";

interface Props {
  restrictedData: any;
  audienceSpread: NonNullable<Event["audience"]>["audienceSpread"] | undefined;
}

export const AudienceSpread = ({ restrictedData, audienceSpread }: Props) => {
  const ulRef = useRef<HTMLUListElement | null>(null);
  const [audienceSpreadView, setAudienceSpreadView] = useState("list");
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const isEnabled = restrictedData && restrictedData.isEnabled;

  useEffect(() => {
    const checkScrollbar = () => {
      if (ulRef.current) {
        setHasScrollbar(
          ulRef.current.scrollHeight > ulRef.current.clientHeight
        );
      }
    };
    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    return () => {
      window.removeEventListener("resize", checkScrollbar);
    };
  }, [audienceSpread]);
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
          {isEnabled
            ? audienceSpread &&
              Object.keys(audienceSpread).length > 0 && (
                <Tabs defaultValue={audienceSpreadView} className="w-44">
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
            : null}
        </div>
        {!isEnabled && <Restriction />}
        {isEnabled && (
          <ul
            ref={ulRef}
            className={`h-96 overflow-y-auto ${
              hasScrollbar ? "pr-2" : "pr-0"
            } scrollbar `}
          >
            {audienceSpread && Object.keys(audienceSpread).length > 0 ? (
              Object.entries(audienceSpread).map(([key, value], index) => {
                if (value.iso == "UK") value.iso = "GB";
                const Flag = Flags[value.iso as keyof typeof Flags];
                return (
                  <li
                    className={`flex items-center justify-between p-3 ${
                      (index + 1) % 2 !== 0
                        ? "bg-[#FAFAFA] dark:bg-[#171717] border border-[#F2F2F2] rounded-md dark:border-[#1A1A1A]"
                        : ""
                    }`}
                    key={key}
                  >
                    <div className="flex items-center gap-4">
                      <Flag className="w-8 h-8" />{" "}
                      <Text color="primary" variant="noMargin" size="large">
                        {value.name}
                      </Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-[#FEECF2] dark:bg-[#3A1726] border border-[#F9D7E2] dark:border-[#551B33] text-sm font-medium text-[#df2670] py-1 px-3 rounded-full">
                        {value.percentage}%
                      </span>
                    </div>
                  </li>
                );
              })
            ) : (
              <span className="text-[#666666] text-sm flex items-center gap-2">
                <CircleSlash width={15} height={15} />
                No data available
              </span>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
