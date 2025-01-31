"use client";
import React, { useState } from "react";
import { useTheme } from "@/context";
import { pocDetail } from "@/types/coordinateEventType";
import { Button } from "@/components/ui/button";
import Text from "@/components/new-ui/Text";
import { MailIcon, PhoneIcon } from "lucide-react";

interface Props {
  eventId: string;
  pocData: pocDetail[];
  unlockPoc: any;
}

function lastActiveDays(givenDateStr: string): number {
  const givenDate: Date = new Date(givenDateStr);

  const today: Date = new Date();

  if (givenDate > today) {
    return -1;
  }

  const timeDifference: number = today.getTime() - givenDate.getTime();

  const daysDifference: number = Math.floor(
    timeDifference / (1000 * 3600 * 24)
  );

  return daysDifference;
}

const PocExpanded = ({ eventId, pocData, unlockPoc }: Props) => {
  const { theme } = useTheme();

  return (
    // <div
    //   className={`border border-[var(--neutral-light-color)] p-4 rounded-md h-full`}
    // >
    <div
      className="flex flex-col items-start w-full h-full border rounded-[12px]  pb-4"
      style={{ border: "1px solid var(--border-color)" }}
    >
      <div className="text-[var(--primary-color)] font-bold px-5 py-2">
        Poc Detail
      </div>
      <div className="h-full overflow-y-auto w-full grid justify-center grid-cols-[repeat(auto-fill,_220px)] gap-4" >
        {pocData?.length > 0 &&
          pocData.map((poc) => (
            <div
              key={poc.id}
              className="card flex flex-col gap-3 h-[260px] w-full overflow-y-auto"
              style={{padding: '12px'}}
            >
              <div className="flex justify-center">
                <img
                  src={
                    poc?.profilePicture
                      ? poc?.profilePicture
                      : `https://img.10times.com/userimages/${
                          poc?.name && poc?.name.charAt(0).toLowerCase()
                        }.jpg`
                  }
                  alt="POC Logo"
                  className="rounded-lg shadow-md h-16 w-16"
                />
              </div>
              <div className="h-full flex gap-2 flex-col items-start">
                <div className="flex flex-col gap-2 flex-1 flex-wrap">
                  <Text className="min-h-5" fontWeight="medium" variant="noMargin">
                    {poc?.name}
                  </Text>
                  <p className="text-[#666666] text-[12px] min-h-5">
                    <span className="line-clamp-2 overflow-hidden" title={poc?.designation ? poc?.designation : ""} >{poc?.designation}</span>
                  </p>
                  {poc?.email && (
                    <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                      <MailIcon
                        width="12px"
                        height="12px"
                        className="self-start mt-1"
                      />
                      <span className="break-all">{poc?.email}</span>

                      {poc?.emailActive &&
                        (lastActiveDays(poc?.emailActive) >= 0 &&
                        lastActiveDays(poc?.emailActive) <= 180 ? (
                          <div
                            className="h-[8px] w-[8px] bg-[var(--success-text-color)] rounded-full cursor-pointer"
                            title="Active within last 6 months"
                          ></div>
                        ) : lastActiveDays(poc?.emailActive) >= 0 &&
                          lastActiveDays(poc?.emailActive) <= 270 ? (
                          <div
                            className="h-[8px] w-[8px] bg-[var(--warning-text-color)] rounded-full cursor-pointer"
                            title="Active within last 9 months"
                          ></div>
                        ) : (
                          <></>
                        ))}
                    </p>
                  )}
                  <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                    <PhoneIcon width="12px" height="12px" />
                    <span>{poc?.phoneNumber ? poc?.phoneNumber : "-"}</span>
                  </p>
                </div>
                {(poc?.email || poc?.phoneNumber) && (
                  <div className="flex justify-center w-full">
                    <Button
                      disabled={(poc?.state && (poc.state === 1 || poc?.state === 2) ) ? true : false}
                      onClick={() => unlockPoc(poc.id, "Expanded")}
                      variant={"outline"}
                      size={"sm"}
                    >
                      Show details
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PocExpanded;
