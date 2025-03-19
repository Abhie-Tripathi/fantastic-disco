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
  const { estimatedAttendance, estimatedExhibitors } = audienceEstimateData;
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
    <div className="flex gap-6">
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
              numberWithCommas(estimatedAttendance)
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
