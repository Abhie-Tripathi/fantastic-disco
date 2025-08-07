import React from "react";
import Image from "next/image";
import ZeroStateIcon from "/public/zero_state.svg";
import Link from "next/link";
import { isEventeli } from "@/config";
import { GAEvent } from "@/utils/GAEvent";
import { useAuthContext } from "@/context";
import { MembershipPlan } from "@/data/membershipPlans";
import { usePathname } from "next/navigation";

const ZeroState = ({
  title,
  text,
  errorStatusCode,
}: {
  title?: string;
  text?: string;
  errorStatusCode?: number;
}) => {
  const { membershipData } = useAuthContext();
  const isPremium =
    !!membershipData && membershipData.membership != null && membershipData.membership > MembershipPlan.Freemium;
const pathname = usePathname();
  const handleUpgradeClick = () => {
    GAEvent(
      "",
      "Plan Upgrade",
      "Research",
      `${isEventeli ? "geo" : "gtm"} | pricing | web | research_upgrade_le`
    );
  };
  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <Image src={ZeroStateIcon} alt="zerostate" width={200} height={160} />
      <div className="w-[400px] text-[#666666] text-sm text-center">
        {title}
      </div>
      <div className="text-center w-[400px] text-[#666666] text-sm">
        {errorStatusCode == 400 ? pathname.split("/").includes("trackers") ? <div>
          There was an issue with your request.
          
        </div>:<div>
          There was an issue with your request.  <Link href="/internal/search/events" className="text-primary cursor-pointer font-medium">Click here </Link> to reset and try again. 
          
        </div> : errorStatusCode && errorStatusCode === 429 ? (
          isPremium ? (
            <div>
              You can continue with basic search or{" "}
              <Link
                target="_blank"
                href={`https://whr.ai/pricing?utm_source=${
                  isEventeli ? "geo" : "gtm"
                }&utm_campaign=pricing&utm_medium=web&utm_term=research_upgrade_le`}
                className="text-primary cursor-pointer font-medium"
                onClick={handleUpgradeClick}
              >
                Upgrade the plan
              </Link>{" "}
              to increase the advance searches
            </div>
          ) : (
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
          )
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default ZeroState;
