import React from "react";
import Image from "next/image";
import ZeroStateIcon from "/public/zero_state.svg";
import Link from "next/link";
import { isEventeli } from "@/config";
import { GAEvent } from "@/utils/GAEvent";

const ZeroState = ({
  title,
  text,
  errorStatusCode,
}: {
  title?: string;
  text?: string;
  errorStatusCode?: number;
}) => {

  const handleUpgradeClick = () => {
    GAEvent("", "Plan Upgrade", "Research", `${isEventeli ? "geo" : "gtm"} | pricing | web | research_upgrade_le`);
  }
  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <Image src={ZeroStateIcon} alt="zerostate" width={200} height={160} />
      <div className="w-[400px] text-[#666666] text-sm text-center">
        {title}
      </div>
      <div className="text-center w-[400px] text-[#666666] text-sm">
        {errorStatusCode && errorStatusCode === 429 ? (
          <div>
            You have reached the maximum limit to view data.{" "}
            <Link
              target="_blank"
              href={`https://whr.ai/pricing?utm_source=${
                isEventeli ? "geo" : "gtm"
              }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
              className="text-primary cursor-pointer font-medium"
              onClick={handleUpgradeClick}
            >
              Please Upgrade.
            </Link>
          </div>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default ZeroState;
