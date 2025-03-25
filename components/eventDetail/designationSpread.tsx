"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Event } from "@/types/events";
import { CircleSlash } from "lucide-react";
import Image from "next/image";
import Restriction from "../eventDetail/restriction";
import Text from "../new-ui/Text";
import Indicator from "/public/indicator.svg";

interface Props {
  restrictedData: any;
  designationSpread:
    | NonNullable<Event["audience"]>["designationSpread"]
    | undefined;
}

export const DesignationSpread = ({
  restrictedData,
  designationSpread,
}: Props) => {
  const getMaxCountObject = (
    designationSpread:
      | NonNullable<Event["audience"]>["designationSpread"]
      | undefined
      | null
  ) => {
    restrictedData;
    if (!designationSpread || designationSpread.length === 0) return null;

    return designationSpread.reduce((maxObj, currentObj) => {
      return Number(currentObj.count) > Number(maxObj.count)
        ? currentObj
        : maxObj;
    }, designationSpread[0]);
  };

  const isEnabled = restrictedData && restrictedData.isEnabled;

  const maxCountObject = getMaxCountObject(designationSpread);
  return (
    <div className="flex flex-1 w-auto h-full">
      <div className="relative flex flex-1 flex-col gap-6 border border-[#EBEBEB] dark:bg-transparent dark:border-[var(--border-color)] rounded-md p-4 h-auto w-full">
        <div className="flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="cursor-pointer font-medium text-[var(--primary-text-color)]">
                  Audience Profile
                </p>
              </TooltipTrigger>
              <TooltipContent className="w-72 tooltip-content-styles">
                <p className="text-[var(--secondary-text-color)] font-medium">
                  Specific roles (designations) and departments of auidence that
                  are going to attend the event
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {designationSpread && designationSpread.length > 0 ? (
          isEnabled ? (
            <>
              <div className="flex flex-col gap-4 bg-[#FAFAFA] dark:bg-[#171717] border border-[#EBEBEB] dark:border-[#2E2E2E] rounded-md p-3">
                <Text
                  color="primary"
                  fontWeight="medium"
                  variant="noMargin"
                  size="large"
                >
                  Most interested designation
                </Text>
                <div>
                  <p className="flex justify-between">
                    <Text
                      fontWeight="medium"
                      color="secondary"
                      className="flex items-center gap-2"
                    >
                      <Image
                        src={Indicator}
                        width={10}
                        height={10}
                        alt="Indicator"
                      />
                      {maxCountObject?.designation}
                    </Text>
                    <span className="text-[var(--primary-color)] font-medium">
                      {maxCountObject && maxCountObject.percentage.toFixed(2)}%
                    </span>
                  </p>
                </div>
              </div>
              <Text
                color="primary"
                fontWeight="medium"
                variant="noMargin"
                size="large"
              >
                Other designations
              </Text>
              <ul className="flex flex-col gap-4 h-64 overflow-y-auto pr-2">
                {designationSpread
                  .filter(
                    (designation) =>
                      designation.designation !== maxCountObject?.designation
                  )
                  .map((designation, index) => (
                    <li key={`designation-${designation.designation}-${index}`}>
                      <p className="flex justify-between">
                        <Text fontWeight="medium" color="secondary">
                          {designation.designation}
                        </Text>
                        <span className="text-[var(--primary-color)] font-medium">
                          {designation &&
                            designation.percentage &&
                            designation.percentage.toFixed(2)}
                          %
                        </span>
                      </p>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <Restriction />
          )
        ) : (
          <span className="text-[#666666] text-sm flex items-center gap-2">
            <CircleSlash width={15} height={15} />
            No data available
          </span>
        )}
      </div>
    </div>
  );
};
