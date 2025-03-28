"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Event } from "@/types/events";
import { numberWithCommas } from "@/utils/formater";
import Restriction from "../eventDetail/restriction";

interface Props {
  audienceEstimateData: {
    estimatedAttendance:
      | NonNullable<Event["insights"]>["estimatedAttendance"]
      | undefined;
    estimatedExhibitors:
      | NonNullable<Event["insights"]>["estimatedExhibitors"]
      | undefined;
    estimatedVisitorRangeTag: string | undefined | null;
  };
  restrictedData: {
    estimatedVisitors: any;
    estimatedExhibitor: any;
  };
}

export const EventAudienceEstimates = ({
  audienceEstimateData,
  restrictedData,
}: Props) => {
  const { estimatedAttendance, estimatedExhibitors, estimatedVisitorRangeTag } =
    audienceEstimateData;
  const { estimatedVisitors, estimatedExhibitor } = restrictedData;

  const parseEstimatedExhibitor = (
    value: string | number | undefined | null
  ) => {
    if (value) {
      if (typeof value === "string" && value.includes("-")) {
        const [minExhibitorValue, maxExhibitorValue] = value
          .split("-")
          .map((v) => Number(v.trim()));
        return { minExhibitorValue, maxExhibitorValue };
      } else {
        return { minExhibitorValue: value, maxExhibitorValue: value };
      }
    }
  };

  const { minExhibitorValue, maxExhibitorValue } = parseEstimatedExhibitor(
    estimatedExhibitors
  ) || { minExhibitorValue: 0, maxExhibitorValue: 0 };

  const hasEstimatedExhibitor =
    estimatedExhibitor &&
    estimatedExhibitor.options.some(
      (option: { min: number; max: number | null; isEnabled: boolean }) =>
        option.isEnabled &&
        Number(minExhibitorValue) >= option.min &&
        (option.max === null || Number(maxExhibitorValue) <= option.max)
    );

  const [minValue, maxValue] = (estimatedAttendance &&
    estimatedAttendance
      .split("-")
      .map((v) => Number(v.trim().replace(/[+*/]/g, "")))) || [0, 0];

  const hasEstimatedVisitor =
    (estimatedVisitors &&
      (minValue || maxValue) &&
      estimatedVisitors.options.some(
        (option: { min: number; max: number | null; isEnabled: boolean }) =>
          option.min <= maxValue &&
          (option.max === null || option.max >= minValue) &&
          option.isEnabled
      )) ||
    true;

  const isEstimatedExhibitorEnabled =
    estimatedExhibitor && estimatedExhibitor.isEnabled && hasEstimatedExhibitor;
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="relative flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h1 className="text-[1rem] font-medium border-b pb-2 w-full cursor-pointer">
                Estimated Visitor
              </h1>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              alignOffset={-80}
              className="w-80 tooltip-content-styles"
            >
              <p className="text-[var(--secondary-text-color)] font-medium">
                Number of people who are predicted or estimated to attend an
                event.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className={`text-[#6750A4] font-semibold text-lg `}>
          {estimatedAttendance ? (
            hasEstimatedVisitor ? (
              <div className="flex gap-4 flex-row-reverse w-fit">
                {estimatedVisitorRangeTag && (
                  <span
                    className="text-primary 
                   bg-[var(--tabs-background-color)] flex items-center
                   justify-center h-7 font-semibold text-sm py-1 px-4 border
                   border-[#ebdcff] rounded-md w-fit text-center"
                  >
                    {estimatedVisitorRangeTag[0].toUpperCase() +
                      estimatedVisitorRangeTag.substring(1).toLowerCase()}
                  </span>
                )}
                <span>{numberWithCommas(estimatedAttendance)}</span>
              </div>
            ) : (
              <Restriction />
            )
          ) : (
            "--"
          )}
        </p>
      </div>
      <div className="relative flex flex-col bg-[#FAFAFA] dark:bg-transparent dark:border-[var(--border-color)] border border-[var(--neutral-light-color)] p-4 rounded-sm gap-4 w-full h-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h1 className="text-[1rem] font-medium border-b pb-2 w-full cursor-pointer">
                Estimated Exhibitor
              </h1>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              alignOffset={-80}
              className="w-80 tooltip-content-styles"
            >
              <p className="text-[var(--secondary-text-color)] font-medium">
                Projected number of exhibitors that will participate in an event
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <p className={`text-[#6750A4] font-semibold text-lg `}>
          {isEstimatedExhibitorEnabled ? (
            estimatedExhibitors ? (
              minExhibitorValue === maxExhibitorValue ? (
                maxExhibitorValue
              ) : (
                numberWithCommas(estimatedExhibitors)
              )
            ) : (
              "--"
            )
          ) : (
            <Restriction />
          )}
        </p>
      </div>
    </div>
  );
};
